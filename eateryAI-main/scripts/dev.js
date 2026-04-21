import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

loadEnvFile(path.join(rootDir, '.env'))
loadEnvFile(path.join(rootDir, '.env.local'))

const serverPort = Number.parseInt(process.env.PORT || '8787', 10)
const children = []
let shuttingDown = false

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8')

    for (const line of content.split(/\r?\n/u)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) continue

      const key = trimmed.slice(0, separatorIndex).trim()
      const value = trimmed.slice(separatorIndex + 1).trim()

      if (!(key in process.env)) {
        process.env[key] = value
      }
    }
  } catch {
    // Missing env files are fine in local dev.
  }
}

function isPortInUse(port) {
  return new Promise(resolve => {
    const socket = net.createConnection({ host: '127.0.0.1', port })

    socket.once('connect', () => {
      socket.end()
      resolve(true)
    })

    socket.once('error', () => {
      resolve(false)
    })
  })
}

function startChild(scriptName) {
  const child = spawn(npmCommand, ['run', scriptName], {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
  })

  children.push(child)
  child.on('exit', code => {
    if (shuttingDown) return
    if (code === 0) return

    shuttingDown = true
    for (const processChild of children) {
      if (!processChild.killed) {
        processChild.kill('SIGTERM')
      }
    }

    process.exit(code || 1)
  })
}

function shutdown(signal) {
  if (shuttingDown) return
  shuttingDown = true

  for (const child of children) {
    if (!child.killed) {
      child.kill(signal)
    }
  }

  process.exit(0)
}

if (await isPortInUse(serverPort)) {
  console.log(`Backend already running on http://127.0.0.1:${serverPort}; reusing it.`)
} else {
  startChild('dev:server')
}

startChild('dev:client')

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
