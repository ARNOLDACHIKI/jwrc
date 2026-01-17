/**
 * Utility functions for email verification code generation and management
 */

/**
 * Generates a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Calculates the expiration time for a verification code (30 minutes from now)
 */
export function getVerificationCodeExpiration(): Date {
  const expirationTime = new Date()
  expirationTime.setMinutes(expirationTime.getMinutes() + 30)
  return expirationTime
}

/**
 * Checks if a verification code has expired
 */
export function isVerificationCodeExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true
  return new Date() > expiresAt
}

/**
 * Validates a verification code
 */
export function validateVerificationCode(
  providedCode: string,
  storedCode: string | null,
  expiresAt: Date | null
): { valid: boolean; message: string } {
  if (!storedCode) {
    return { valid: false, message: 'No verification code found' }
  }

  if (isVerificationCodeExpired(expiresAt)) {
    return { valid: false, message: 'Verification code has expired' }
  }

  if (providedCode !== storedCode) {
    return { valid: false, message: 'Invalid verification code' }
  }

  return { valid: true, message: 'Verification successful' }
}
