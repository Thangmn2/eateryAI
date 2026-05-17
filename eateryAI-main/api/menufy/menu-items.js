import { getMongoDb } from '../_lib/mongo.js'
import { parseNonNegativeInt, parsePositiveInt, sendJson, withErrorHandling } from '../_lib/http.js'
import { mapRestaurantDocument } from '../_lib/restaurants.js'

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

function mapMenuSections(doc) {
  if (Array.isArray(doc?.menu_items) && doc.menu_items.length > 0) {
    return doc.menu_items
      .filter(section => section?.name && Array.isArray(section.items))
      .map(section => ({
        _id: doc._id,
        restaurant: doc.restaurant || doc?._id?.restaurant_name || '',
        category: section.name,
        category_description: section.desc || '',
        items: section.items.map(item => ({
          ...item,
          restaurant: doc.restaurant || doc?._id?.restaurant_name || '',
          category: section.name,
          address: doc.address || doc?._id?.address || '',
          menu_url: doc.restaurant_url || '',
        })),
      }))
  }

  if (doc?.category && Array.isArray(doc.items)) {
    return [{
      _id: doc._id,
      restaurant: doc.restaurant || doc?._id?.restaurant_name || '',
      category: doc.category,
      category_description: doc.category_description || '',
      items: doc.items.map(item => ({
        ...item,
        restaurant: doc.restaurant || doc?._id?.restaurant_name || '',
        category: doc.category,
        address: doc.address || doc?._id?.address || '',
        menu_url: doc.restaurant_url || '',
      })),
    }]
  }

  return []
}

export default withErrorHandling(async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  const restaurant = req.query.restaurant?.trim()
  const limit = parsePositiveInt(req.query.limit, 10, 50)
  const skip = parseNonNegativeInt(req.query.skip, 0)
  const query = String(req.query.query || '').trim()
  const userLatitude = Number.parseFloat(req.query.user_latitude)
  const userLongitude = Number.parseFloat(req.query.user_longitude)
  const hasUserLocation = Number.isFinite(userLatitude) && Number.isFinite(userLongitude)
  const effectiveBounds = createProximityBounds(userLatitude, userLongitude)
  const boundsQuery = createBoundsQuery(effectiveBounds)
  const searchQuery = createSearchQuery(query)
  const nearbyQuery = searchQuery && boundsQuery
    ? { $and: [boundsQuery, searchQuery] }
    : searchQuery || boundsQuery || {}

  const db = await getMongoDb()
  const docs = await db.collection('menu_items')
    .find(restaurant ? {
      $or: [
        { restaurant },
        { '_id.restaurant_name': restaurant },
      ],
    } : nearbyQuery)
    .project({
      _id: 1,
      restaurant: 1,
      restaurant_url: 1,
      address: 1,
      city: 1,
      state: 1,
      cuisine_tags: 1,
      attribute_tags: 1,
      latitude_coordinates: 1,
      longitude_coordinates: 1,
      logo_img: 1,
      location: 1,
      menu_items: 1,
      category: 1,
      category_description: 1,
      items: 1,
    })
    .toArray()

  const selectedDocs = restaurant
    ? docs
    : docs
      .map(doc => ({
        doc,
        restaurant: mapRestaurantDocument(doc),
      }))
      .filter(entry => entry.restaurant.restaurant_name)
      .filter(entry => Number.isFinite(entry.restaurant.latitude) && Number.isFinite(entry.restaurant.longitude))
      .filter(entry => isWithinBounds(entry.restaurant, effectiveBounds))
      .sort((a, b) => {
        if (hasUserLocation) {
          return distanceSq(
            [a.restaurant.latitude, a.restaurant.longitude],
            [userLatitude, userLongitude]
          ) - distanceSq(
            [b.restaurant.latitude, b.restaurant.longitude],
            [userLatitude, userLongitude]
          )
        }

        return a.restaurant.restaurant_name.localeCompare(b.restaurant.restaurant_name)
      })
      .slice(skip, skip + limit)
      .map(entry => entry.doc)

  const items = selectedDocs.flatMap(mapMenuSections)
  const hasMore = restaurant ? false : docs.length > skip + limit

  return sendJson(res, 200, {
    items,
    limit,
    skip,
    returned: items.length,
    returnedRestaurants: selectedDocs.length,
    hasMore,
  })
})
