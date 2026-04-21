import { sendJson, withErrorHandling } from './_lib/http.js'

export default withErrorHandling(async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  return sendJson(res, 200, {
    ok: true,
    configured: Boolean(process.env.AZURE_VISION_ENDPOINT && process.env.AZURE_VISION_KEY),
    mongoConfigured: Boolean(process.env.MONGODB_URI && process.env.MONGODB_DB),
  })
})
