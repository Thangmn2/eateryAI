import http from 'node:http'
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MongoClient } from 'mongodb'
import { loadChipotleBuilderData } from './chipotle.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const shouldServeStatic = process.argv.includes('--serve-static')
const protectedEnvKeys = new Set(Object.keys(process.env))

loadEnvFile(path.join(rootDir, '.env'))
loadEnvFile(path.join(rootDir, '.env.local'))

const PORT = Number.parseInt(process.env.PORT || '8787', 10)
const OCR_POLL_INTERVAL_MS = Number.parseInt(process.env.OCR_POLL_INTERVAL_MS || '1500', 10)
const OCR_MAX_ATTEMPTS = Number.parseInt(process.env.OCR_MAX_ATTEMPTS || '12', 10)
const REQUEST_BODY_LIMIT_BYTES = 12 * 1024 * 1024

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`)

    if (req.method === 'GET' && url.pathname === '/api/health') {
      return sendJson(res, 200, {
        ok: true,
        configured: Boolean(process.env.AZURE_VISION_ENDPOINT && process.env.AZURE_VISION_KEY),
        mongoConfigured: Boolean(process.env.MONGODB_URI && process.env.MONGODB_DB),
      })
    }

    if (req.method === 'GET' && url.pathname === '/api/restaurants') {
      const db = await getMongoDb()
      const docs = await db.collection('rest_info').find({}, {
        projection: {
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
          website: 1,
        },
      }).toArray()

      const payload = docs.map(doc => ({
        restaurant_name: doc.restaurant || '',
        restaurant_url: doc.restaurant_url || doc.website || '',
        address: doc.address || '',
        city: doc.city || '',
        state: doc.state || '',
        latitude: Number(doc.latitude_coordinates),
        longitude: Number(doc.longitude_coordinates),
        logo_url: doc.logo_img || '',
        phone: doc.phone_number || '',
        hours: doc.restaurant_hours || '',
      }))

      return sendJson(res, 200, payload)
    }

    if (req.method === 'GET' && url.pathname === '/api/menufy/menu-items') {
      const db = await getMongoDb()
      const restaurant = url.searchParams.get('restaurant')?.trim()
      const limitParam = url.searchParams.get('limit')
      const skipParam = url.searchParams.get('skip')
      const limit = limitParam ? Number.parseInt(limitParam, 10) : 200
      const skip = skipParam ? Number.parseInt(skipParam, 10) : 0
      const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 500) : 200
      const safeSkip = Number.isFinite(skip) && skip > 0 ? skip : 0

      const cursor = db.collection('menu_items')
        .find(restaurant ? { restaurant } : {})
        .skip(safeSkip)
        .limit(safeLimit)

      const docs = await cursor.toArray()
      return sendJson(res, 200, {
        items: docs,
        limit: safeLimit,
        skip: safeSkip,
        returned: docs.length,
      })
    }

    if (req.method === 'POST' && url.pathname === '/api/scan-menu') {
      const body = await readJsonBody(req)
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
    }

    if (req.method === 'GET' && url.pathname === '/api/chipotle-builder') {
      const shouldRefresh =
        url.searchParams.get('refresh') === '1' || url.searchParams.get('refresh') === 'true'
      const builderData = await loadChipotleBuilderData({ refresh: shouldRefresh })

      return sendJson(res, 200, {
        ok: true,
        data: builderData.snapshot,
        firecrawl: builderData.firecrawl,
      })
    }

    if (shouldServeStatic && req.method === 'GET') {
      return serveStaticAsset(url.pathname, res)
    }

    sendJson(res, 404, { error: 'Not found.' })
  } catch (error) {
    sendJson(res, error.statusCode || 500, {
      error: error.message || 'Unexpected server error.',
    })
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`OCR proxy listening on http://127.0.0.1:${PORT}`)
})

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8')

    for (const line of content.split(/\r?\n/u)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) continue

      const key = trimmed.slice(0, separatorIndex).trim()
      const rawValue = trimmed.slice(separatorIndex + 1).trim()
      const value = stripQuotes(rawValue)

      if (!protectedEnvKeys.has(key)) {
        process.env[key] = value
      }
    }
  } catch {
    // Missing env files are expected in a fresh clone.
  }
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function getAzureConfig() {
  const endpoint = process.env.AZURE_VISION_ENDPOINT?.trim()
  const key = process.env.AZURE_VISION_KEY?.trim()

  if (!endpoint || !key) {
    const error = new Error(
      'Azure Vision is not configured. Set AZURE_VISION_ENDPOINT and AZURE_VISION_KEY in .env.local.'
    )
    error.statusCode = 500
    throw error
  }

  return {
    endpoint: endpoint.replace(/\/+$/u, ''),
    key,
  }
}

let mongoClient
let mongoDb

async function getMongoDb() {
  const uri = process.env.MONGODB_URI?.trim()
  const dbName = process.env.MONGODB_DB?.trim()

  if (!uri || !dbName) {
    const error = new Error(
      'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB in .env.local.'
    )
    error.statusCode = 500
    throw error
  }

  if (mongoDb) {
    return mongoDb
  }

  mongoClient = new MongoClient(uri, {
    maxPoolSize: 10,
  })
  await mongoClient.connect()
  mongoDb = mongoClient.db(dbName)
  return mongoDb
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

async function serveStaticAsset(requestPath, res) {
  const safePath = requestPath === '/' ? '/index.html' : requestPath
  const candidatePath = path.resolve(distDir, `.${safePath}`)

  if (!candidatePath.startsWith(distDir)) {
    return sendJson(res, 403, { error: 'Forbidden.' })
  }

  try {
    const file = await readFile(candidatePath)
    const extension = path.extname(candidatePath).toLowerCase()
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
    })
    res.end(file)
    return
  } catch {
    if (path.extname(safePath)) {
      return sendJson(res, 404, { error: 'Not found.' })
    }
  }

  const indexFile = await readFile(path.join(distDir, 'index.html'))
  res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] })
  res.end(indexFile)
}

async function readJsonBody(req) {
  const chunks = []
  let totalBytes = 0

  for await (const chunk of req) {
    totalBytes += chunk.length

    if (totalBytes > REQUEST_BODY_LIMIT_BYTES) {
      const error = new Error('Request body is too large.')
      error.statusCode = 413
      throw error
    }

    chunks.push(chunk)
  }

  if (chunks.length === 0) {
    return {}
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    const error = new Error('Request body must be valid JSON.')
    error.statusCode = 400
    throw error
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(payload))
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
