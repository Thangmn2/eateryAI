import { loadChipotleBuilderData } from '../server/chipotle.js'
import { sendJson, withErrorHandling } from './_lib/http.js'

export default withErrorHandling(async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  const shouldRefresh =
    req.query.refresh === '1' || req.query.refresh === 'true'

  const builderData = await loadChipotleBuilderData({ refresh: shouldRefresh })

  return sendJson(res, 200, {
    ok: true,
    data: builderData.snapshot,
    firecrawl: builderData.firecrawl,
  })
})
