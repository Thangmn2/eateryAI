export function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload)
}

export function withErrorHandling(handler) {
  return async function wrappedHandler(req, res) {
    try {
      await handler(req, res)
    } catch (error) {
      sendJson(res, error.statusCode || 500, {
        error: error.message || 'Unexpected server error.',
      })
    }
  }
}

export function parsePositiveInt(value, fallback, max = Number.POSITIVE_INFINITY) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return Math.min(parsed, max)
}

export function parseNonNegativeInt(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback
  }

  return parsed
}
