import { getMongoDb } from '../_lib/mongo.js'
import { parseNonNegativeInt, parsePositiveInt, sendJson, withErrorHandling } from '../_lib/http.js'

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
      category: 1,
      category_description: 1,
      items: 1,
    })
    .skip(skip)
    .limit(limit)
    .toArray()

  return sendJson(res, 200, {
    items: docs,
    limit,
    skip,
    returned: docs.length,
  })
})
