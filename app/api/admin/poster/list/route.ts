import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) return NextResponse.json({ files: [] })

    const files = fs.readdirSync(uploadsDir)
      .filter(f => !f.startsWith('.'))
      .map(f => {
        const stat = fs.statSync(path.join(uploadsDir, f))
        return { name: f, url: `/uploads/${f}`, size: stat.size, mtime: stat.mtime.getTime() }
      })
      .sort((a,b) => b.mtime - a.mtime)

    return NextResponse.json({ files })
  } catch (e) {
    console.error('Failed to list uploads', e)
    return NextResponse.json({ error: 'Failed to list uploads' }, { status: 500 })
  }
}
