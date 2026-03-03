import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const children = [
  spawn(npmCommand, ['run', 'dev:server'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
  }),
  spawn(npmCommand, ['run', 'dev:client'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
  }),
]

let shuttingDown = false

for (const child of children) {
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

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
