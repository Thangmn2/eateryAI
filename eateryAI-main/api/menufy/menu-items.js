import { getMongoDb } from '../_lib/mongo.js'
import { parseNonNegativeInt, parsePositiveInt, sendJson, withErrorHandling } from '../_lib/http.js'

function mapMenuSections(doc) {
  if (Array.isArray(doc?.menu_items) && doc.menu_items.length > 0) {
    return doc.menu_items
      .filter(section => section?.name && Array.isArray(section.items))
      .map(section => ({
        _id: doc._id,
        restaurant: doc.restaurant || doc?._id?.restaurant_name || '',
        category: section.name,
        category_description: section.desc || '',
        items: section.items,
      }))
  }

  if (doc?.category && Array.isArray(doc.items)) {
    return [{
      _id: doc._id,
      restaurant: doc.restaurant || doc?._id?.restaurant_name || '',
      category: doc.category,
      category_description: doc.category_description || '',
      items: doc.items,
    }]
  }

  return []
}

export default withErrorHandling(async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  const restaurant = req.query.restaurant?.trim()
  const limit = parsePositiveInt(req.query.limit, 200, 500)
  const skip = parseNonNegativeInt(req.query.skip, 0)

  const db = await getMongoDb()
  const docs = await db.collection('menu_items')
    .find(restaurant ? { restaurant } : {})
    .project({
      _id: 1,
      restaurant: 1,
      menu_items: 1,
      category: 1,
      category_description: 1,
      items: 1,
    })
    .skip(skip)
    .limit(limit)
    .toArray()

  const items = docs.flatMap(mapMenuSections)

  return sendJson(res, 200, {
    items,
    limit,
    skip,
    returned: items.length,
    hasMore: docs.length === limit,
  })
})
