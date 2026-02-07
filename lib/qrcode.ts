import QRCode from 'qrcode'

/**
 * Generate QR code data URL for event ticket
 * The QR code now contains a URL to the ticket details page
 * @deprecated Use generateTicketQRCodeBuffer for email attachments instead
 */
export async function generateTicketQRCode(data: {
  eventId: string
  signupId: string
  ref: string
  name: string
  email: string
  baseUrl?: string
}): Promise<string> {
  // Use the baseUrl or construct ticket URL with reference
  const ticketUrl = data.baseUrl 
    ? `${data.baseUrl}/tickets/${data.ref}`
    : `/tickets/${data.ref}`

  // Generate QR code as data URL
  const qrCodeDataURL = await QRCode.toDataURL(ticketUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  })

  return qrCodeDataURL
}

/**
 * Generate QR code as Buffer for email attachments
 * Returns a Buffer that can be attached to emails instead of using data URLs
 */
export async function generateTicketQRCodeBuffer(data: {
  eventId: string
  signupId: string
  ref: string
  name: string
  email: string
  baseUrl?: string
}): Promise<Buffer> {
  // Use the baseUrl or construct ticket URL with reference
  const ticketUrl = data.baseUrl 
    ? `${data.baseUrl}/tickets/${data.ref}`
    : `/tickets/${data.ref}`

  // Generate QR code as Buffer
  const qrCodeBuffer = await QRCode.toBuffer(ticketUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  })

  return qrCodeBuffer
}

/**
 * Verify and parse QR code ticket data
 * Now handles both URL format and legacy JSON format
 */
export function parseTicketQRCode(qrData: string): {
  valid: boolean
  data?: {
    type: string
    eventId: string
    signupId: string
    ref: string
    name: string
    email: string
    timestamp: string
  }
  ref?: string
  error?: string
} {
  // Check if it's a URL format (new format)
  if (qrData.includes('/tickets/')) {
    try {
      const url = new URL(qrData)
      const pathParts = url.pathname.split('/')
      const ref = pathParts[pathParts.length - 1]
      
      if (ref) {
        return { valid: true, ref }
      }
    } catch (e) {
      // Try extracting reference from relative path
      const match = qrData.match(/\/tickets\/([^/?#]+)/)
      if (match && match[1]) {
        return { valid: true, ref: match[1] }
      }
    }
  }

  // Legacy JSON format support
  try {
    const parsed = JSON.parse(qrData)
    
    if (parsed.type !== 'event-ticket') {
      return { valid: false, error: 'Invalid ticket type' }
    }

    if (!parsed.eventId || !parsed.signupId || !parsed.ref) {
      return { valid: false, error: 'Missing required ticket data' }
    }

    return { valid: true, data: parsed }
  } catch (error) {
    return { valid: false, error: 'Invalid QR code data' }
  }
}

