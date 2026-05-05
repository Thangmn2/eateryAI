import { getMongoDb } from './_lib/mongo.js'
import { parsePositiveInt, sendJson, withErrorHandling } from './_lib/http.js'
import { mapRestaurantDocument } from './_lib/restaurants.js'

const DEFAULT_PROXIMITY_LAT_SPAN = 2

function distanceSq(a, b) {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  return dx * dx + dy * dy
}

function isWithinBounds(restaurant, bounds) {
  if (!bounds) return true

  const withinLatitude = restaurant.latitude >= bounds.south && restaurant.latitude <= bounds.north
  if (!withinLatitude) return false

  if (bounds.west <= bounds.east) {
    return restaurant.longitude >= bounds.west && restaurant.longitude <= bounds.east
  }

  return restaurant.longitude >= bounds.west || restaurant.longitude <= bounds.east
}

function normalizeLongitude(longitude) {
  if (!Number.isFinite(longitude)) return longitude

  let nextValue = longitude
  while (nextValue > 180) nextValue -= 360
  while (nextValue < -180) nextValue += 360
  return nextValue
}

function createLongitudeRange(field, west, east) {
  if (!Number.isFinite(west) || !Number.isFinite(east)) {
    return null
  }

  if (west <= east) {
    return { [field]: { $gte: west, $lte: east } }
  }

  return {
    $or: [
      { [field]: { $gte: west } },
      { [field]: { $lte: east } },
    ],
  }
}

function createBoundsQuery(bounds) {
  if (!bounds) return null

  const coordinatePaths = [
    ['location.coordinates.0', 'location.coordinates.1'],
    ['_id.coords.0', '_id.coords.1'],
    ['longitude_coordinates', 'latitude_coordinates'],
  ]

  return {
    $or: coordinatePaths.map(([longitudePath, latitudePath]) => {
      const longitudeClause = createLongitudeRange(longitudePath, bounds.west, bounds.east)
      if (!longitudeClause) {
        return {
          [latitudePath]: { $gte: bounds.south, $lte: bounds.north },
        }
      }

      return {
        $and: [
          { [latitudePath]: { $gte: bounds.south, $lte: bounds.north } },
          longitudeClause,
        ],
      }
    }),
  }
}

function createProximityBounds(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  const latitudeSpan = DEFAULT_PROXIMITY_LAT_SPAN
  const cosine = Math.max(0.2, Math.cos((latitude * Math.PI) / 180))
  const longitudeSpan = DEFAULT_PROXIMITY_LAT_SPAN / cosine

  return {
    north: Math.min(90, latitude + latitudeSpan),
    south: Math.max(-90, latitude - latitudeSpan),
    east: normalizeLongitude(longitude + longitudeSpan),
    west: normalizeLongitude(longitude - longitudeSpan),
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function createSearchQuery(query) {
  const normalizedQuery = String(query || '').trim()
  if (!normalizedQuery) return null

  const regex = new RegExp(escapeRegex(normalizedQuery), 'i')

  return {
    $or: [
      { restaurant: regex },
      { '_id.restaurant_name': regex },
      { address: regex },
      { '_id.address': regex },
      { city: regex },
      { state: regex },
      { cuisine_tags: regex },
      { attribute_tags: regex },
      { 'menu_items.name': regex },
      { 'menu_items.desc': regex },
      { 'menu_items.items.name': regex },
      { 'menu_items.items.description': regex },
    ],
  }
}

export default withErrorHandling(async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  const limit = parsePositiveInt(req.query.limit, 50, 100)
  const north = Number.parseFloat(req.query.north)
  const south = Number.parseFloat(req.query.south)
  const east = Number.parseFloat(req.query.east)
  const west = Number.parseFloat(req.query.west)
  const query = String(req.query.query || '').trim()
  const userLatitude = Number.parseFloat(req.query.user_latitude)
  const userLongitude = Number.parseFloat(req.query.user_longitude)
  const hasUserLocation = Number.isFinite(userLatitude) && Number.isFinite(userLongitude)
  const viewportBounds = [north, south, east, west].every(Number.isFinite)
    ? { north, south, east, west }
    : null
  const effectiveBounds = viewportBounds || createProximityBounds(userLatitude, userLongitude)
  const boundsQuery = createBoundsQuery(effectiveBounds)
  const searchQuery = createSearchQuery(query)
  const mongoQuery = searchQuery && boundsQuery
    ? { $and: [boundsQuery, searchQuery] }
    : searchQuery || boundsQuery || {}

  const db = await getMongoDb()
  const docs = await db.collection('menu_items').find(mongoQuery, {
    projection: {
      _id: 1,
      restaurant: 1,
      address: 1,
      city: 1,
      state: 1,
      logo_img: 1,
      phone_number: 1,
      restaurant_hours: 1,
      cuisine_tags: 1,
      attribute_tags: 1,
      latitude_coordinates: 1,
      longitude_coordinates: 1,
      restaurant_url: 1,
      location: 1,
    },
  }).toArray()

  const payload = docs
    .map(mapRestaurantDocument)
    .filter(doc => doc.restaurant_name && Number.isFinite(doc.latitude) && Number.isFinite(doc.longitude))
    .filter(doc => isWithinBounds(doc, effectiveBounds))
    .sort((a, b) => {
      if (hasUserLocation) {
        return distanceSq(
          [a.latitude, a.longitude],
          [userLatitude, userLongitude]
        ) - distanceSq(
          [b.latitude, b.longitude],
          [userLatitude, userLongitude]
        )
      }

      return a.restaurant_name.localeCompare(b.restaurant_name)
    })
    .slice(0, limit)

  return sendJson(res, 200, payload)
})
