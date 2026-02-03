import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export const runtime = 'nodejs'

// Server-side settings for uploads
const MAX_BYTES = 5 * 1024 * 1024 // 5MB
const MAX_WIDTH = 2000
const MAX_HEIGHT = 800

export async function POST(req: Request) {
  try {
    // dynamically import sharp to avoid failing module load when native deps aren't available
    let sharpLib: any = null
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      sharpLib = (await import('sharp')).default || (await import('sharp'))
    } catch (impErr) {
      console.warn('sharp not available; uploads will skip server-side processing', impErr)
      sharpLib = null
    }
    const body = await req.json()
    const { dataUrl, filename } = body || {}
    if (!dataUrl || !filename) {
      return NextResponse.json({ error: 'Missing dataUrl or filename' }, { status: 400 })
    }

    // validate dataUrl
    const matches = dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/)
    if (!matches) return NextResponse.json({ error: 'Invalid data URL' }, { status: 400 })

    const mime = matches[1]
    const base64 = matches[2]
    const buffer = Buffer.from(base64, 'base64')

    // Validate size
    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: `File too large (max ${MAX_BYTES} bytes)` }, { status: 413 })
    }

    // derive extension: prefer original filename ext, else mime subtype
    const origExt = path.extname(filename).toLowerCase()
    const mimeExt = mime.split('/')[1]
    const ext = origExt || (mimeExt ? `.${mimeExt.replace(/[^a-z0-9]/gi, '')}` : '.jpg')

    // sanitize base name and add timestamp + random suffix to avoid overwrites
    const baseName = path.basename(filename, origExt).replace(/[^a-zA-Z0-9_-]/g, '-')
    const unique = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
    const safeName = `${unique}-${baseName}${ext}`

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const outPath = path.join(uploadsDir, safeName)

    // Resize/validate using sharp if available; otherwise write raw buffer
    if (sharpLib) {
      try {
        const image = sharpLib(buffer)
        const metadata = await image.metadata()
        if ((metadata.width && metadata.width > MAX_WIDTH) || (metadata.height && metadata.height > MAX_HEIGHT)) {
          await image.resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside' }).toFile(outPath)
        } else {
          await image.toFile(outPath)
        }
      } catch (procErr) {
        console.error('Image processing failed with sharp', procErr)
        fs.writeFileSync(outPath, buffer)
      }
    } else {
      // sharp not available, persist raw buffer
      fs.writeFileSync(outPath, buffer)
    }

    // create a medium thumbnail as well
    try {
      if (sharpLib) {
        const thumbName = `${unique}-thumb-${baseName}.jpg`
        const thumbPath = path.join(uploadsDir, thumbName)
        await sharpLib(outPath).resize(800, 300, { fit: 'inside' }).jpeg({ quality: 80 }).toFile(thumbPath)
      }
    } catch (thumbErr) {
      console.error('Thumbnail generation failed', thumbErr)
    }

    const urlPath = `/uploads/${safeName}`
    return NextResponse.json({ ok: true, url: urlPath })
  } catch (e) {
    console.error('Upload failed', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
