#!/usr/bin/env node
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

// Load .env simple parser
function loadEnv(file) {
  const env = {}
  try {
    const s = fs.readFileSync(file, 'utf8')
    s.split(/\n/).forEach(line => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
      if (!m) return
      let v = m[2]
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1,-1)
      env[m[1]] = v
    })
  } catch (e) {}
  return env
}

const env = loadEnv(path.resolve(process.cwd(), '.env'))
const secret = process.env.JWT_SECRET || env.JWT_SECRET || 'dev-secret'
const email = process.env.ADMIN_EMAIL || env.ADMIN_EMAIL || 'admin@jwrc.org'
const userId = process.env.USER_ID || '00000000-0000-0000-0000-000000000000'

const token = jwt.sign({ userId, role: 'admin', email }, secret, { expiresIn: '7d' })
console.log(token)
