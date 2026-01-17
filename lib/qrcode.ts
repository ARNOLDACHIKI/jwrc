import QRCode from 'qrcode'

/**
 * Generate QR code data URL for event ticket
 */
export async function generateTicketQRCode(data: {
  eventId: string
  signupId: string
  ref: string
  name: string
  email: string
}): Promise<string> {
  const ticketData = JSON.stringify({
    type: 'event-ticket',
    eventId: data.eventId,
    signupId: data.signupId,
    ref: data.ref,
    name: data.name,
    email: data.email,
    timestamp: new Date().toISOString()
  })

  // Generate QR code as data URL
  const qrCodeDataURL = await QRCode.toDataURL(ticketData, {
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
 * Verify and parse QR code ticket data
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
  error?: string
} {
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
