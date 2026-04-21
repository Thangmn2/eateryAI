import { getMongoDb } from './_lib/mongo.js'
import { sendJson, withErrorHandling } from './_lib/http.js'
import { mapRestaurantDocument } from './_lib/restaurants.js'

export default withErrorHandling(async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  const db = await getMongoDb()
  const docs = await db.collection('menu_items').find({}, {
    projection: {
      _id: 1,
      restaurant: 1,
      address: 1,
      city: 1,
      state: 1,
      logo_img: 1,
      phone_number: 1,
      restaurant_hours: 1,
      latitude_coordinates: 1,
      longitude_coordinates: 1,
      restaurant_url: 1,
      location: 1,
    },
  }).toArray()

  const payload = docs
    .map(mapRestaurantDocument)
    .filter(doc => doc.restaurant_name && Number.isFinite(doc.latitude) && Number.isFinite(doc.longitude))
    .sort((a, b) => a.restaurant_name.localeCompare(b.restaurant_name))

  return sendJson(res, 200, payload)
})
