import { sendJson, withErrorHandling } from './_lib/http.js'

const OCR_POLL_INTERVAL_MS = Number.parseInt(process.env.OCR_POLL_INTERVAL_MS || '1500', 10)
const OCR_MAX_ATTEMPTS = Number.parseInt(process.env.OCR_MAX_ATTEMPTS || '12', 10)

export default withErrorHandling(async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  const body = getJsonBody(req)
  const imageDataUrl = body?.imageDataUrl

  if (typeof imageDataUrl !== 'string' || imageDataUrl.length === 0) {
    return sendJson(res, 400, { error: 'Missing imageDataUrl in request body.' })
  }

  const { endpoint, key } = getAzureConfig()
  const { buffer, mimeType } = decodeDataUrl(imageDataUrl)
  const operationLocation = await submitReadRequest({ endpoint, key, buffer, mimeType })
  const readResult = await pollReadResult({ operationLocation, key })
  const pages = extractPages(readResult)
  const text = pages.join('\n\n').trim()

  return sendJson(res, 200, {
    text,
    pageCount: pages.length,
    lineCount: pages.reduce(
      (count, page) => count + page.split('\n').filter(Boolean).length,
      0
    ),
  })
})

function getJsonBody(req) {
  if (typeof req.body === 'string') {
    return JSON.parse(req.body)
  }

  return req.body || {}
}

function getAzureConfig() {
  const endpoint = process.env.AZURE_VISION_ENDPOINT?.trim()
  const key = process.env.AZURE_VISION_KEY?.trim()

  if (!endpoint || !key) {
    const error = new Error(
      'Azure Vision is not configured. Set AZURE_VISION_ENDPOINT and AZURE_VISION_KEY in the environment.'
    )
    error.statusCode = 500
    throw error
  }

  return {
    endpoint: endpoint.replace(/\/+$/u, ''),
    key,
  }
}

function decodeDataUrl(imageDataUrl) {
  const match = /^data:(?<mime>[^;]+);base64,(?<data>.+)$/u.exec(imageDataUrl)

  if (!match?.groups?.mime || !match.groups.data) {
    const error = new Error('Expected a base64 image data URL.')
    error.statusCode = 400
    throw error
  }

  const buffer = Buffer.from(match.groups.data, 'base64')
  if (buffer.length === 0) {
    const error = new Error('The uploaded image is empty.')
    error.statusCode = 400
    throw error
  }

  return {
    mimeType: match.groups.mime,
    buffer,
  }
}

async function submitReadRequest({ endpoint, key, buffer, mimeType }) {
  const response = await fetch(`${endpoint}/vision/v3.2/read/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': mimeType,
      'Ocp-Apim-Subscription-Key': key,
    },
    body: buffer,
  })

  if (!response.ok) {
    throw await buildAzureError(response, 'Azure rejected the OCR request.')
  }

  const operationLocation = response.headers.get('operation-location')
  if (!operationLocation) {
    const error = new Error('Azure did not return an operation-location header for the OCR request.')
    error.statusCode = 502
    throw error
  }

  return operationLocation
}

async function pollReadResult({ operationLocation, key }) {
  for (let attempt = 0; attempt < OCR_MAX_ATTEMPTS; attempt += 1) {
    const response = await fetch(operationLocation, {
      headers: {
        'Ocp-Apim-Subscription-Key': key,
      },
    })

    if (!response.ok) {
      throw await buildAzureError(response, 'Azure returned an error while polling OCR results.')
    }

    const payload = await response.json()

    if (payload.status === 'succeeded') {
      return payload
    }

    if (payload.status === 'failed') {
      const error = new Error('Azure OCR failed to read this image.')
      error.statusCode = 422
      throw error
    }

    await delay(OCR_POLL_INTERVAL_MS)
  }

  const error = new Error('Azure OCR timed out before the scan completed.')
  error.statusCode = 504
  throw error
}

function extractPages(readResult) {
  return (readResult?.analyzeResult?.readResults || [])
    .map(page =>
      (page.lines || [])
        .map(line => line.text?.trim())
        .filter(Boolean)
        .join('\n')
        .trim()
    )
    .filter(Boolean)
}

async function buildAzureError(response, fallbackMessage) {
  let message = fallbackMessage

  try {
    const rawText = await response.text()
    const payload = rawText ? JSON.parse(rawText) : null
    const azureMessage = payload?.error?.message || payload?.message
    if (azureMessage) {
      message = azureMessage
    } else if (rawText) {
      message = rawText
    }
  } catch {
    // Keep the fallback message when Azure returns an unreadable payload.
  }

  const error = new Error(message)
  error.statusCode = response.status
  return error
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
