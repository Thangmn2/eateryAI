import { getMongoDb } from '../_lib/mongo.js'
import { sendJson, withErrorHandling } from '../_lib/http.js'
import { mapRestaurantDocument } from '../_lib/restaurants.js'

export default withErrorHandling(async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  const names = []
  const rawNameParam = req.query.name

  if (Array.isArray(rawNameParam)) {
    rawNameParam.forEach(value => {
      const trimmed = String(value || '').trim()
      if (trimmed) names.push(trimmed)
    })
  } else if (typeof rawNameParam === 'string') {
    const trimmed = rawNameParam.trim()
    if (trimmed) names.push(trimmed)
  }

  if (names.length === 0) {
    return sendJson(res, 200, { restaurants: [] })
  }

  const uniqueNames = [...new Set(names)].slice(0, 100)
  const db = await getMongoDb()
  const docs = await db.collection('menu_items')
    .find({
      $or: [
        { restaurant: { $in: uniqueNames } },
        { '_id.restaurant_name': { $in: uniqueNames } },
      ],
    })
    .project({
      _id: 1,
      restaurant: 1,
      city: 1,
      state: 1,
      cuisine_tags: 1,
      attribute_tags: 1,
      restaurant_rating: 1,
      restaurant_review_count: 1,
      restaurant_description: 1,
      header_img: 1,
      logo_img: 1,
    })
    .toArray()

  const restaurants = docs.map(doc => {
    const mapped = mapRestaurantDocument(doc)
    return {
      restaurant_name: mapped.restaurant_name,
      city: mapped.city,
      state: mapped.state,
      cuisine_tags: mapped.cuisine_tags,
      attribute_tags: mapped.attribute_tags,
      rating: doc.restaurant_rating || '',
      review_count: doc.restaurant_review_count || '',
      description: doc.restaurant_description || '',
      header_img: doc.header_img || '',
      logo_url: doc.logo_img || '',
    }
  })

  return sendJson(res, 200, { restaurants })
})
