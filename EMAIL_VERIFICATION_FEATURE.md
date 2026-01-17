# Email Verification Feature

This document describes the email verification feature that has been implemented to enhance account security during user registration.

## Overview

When users sign up for a church account, they now receive a verification code via email. They must verify their email address before fully accessing the platform. This adds an extra layer of security to prevent spam registrations and ensures users have valid email addresses.

## Components

### 1. Database Schema Changes
**File:** `prisma/schema.prisma`

The User model has been updated with three new fields:
- `emailVerified` (Boolean): Tracks whether the user's email has been verified
- `verificationCode` (String?): Stores the verification code sent to the user
- `verificationCodeExpiresAt` (DateTime?): Stores when the verification code expires (30 minutes after generation)

### 2. Verification Utilities
**File:** `lib/verification.ts`

Utility functions for managing verification codes:
- `generateVerificationCode()`: Generates a random 6-digit code
- `getVerificationCodeExpiration()`: Returns the expiration time (30 minutes from now)
- `isVerificationCodeExpired()`: Checks if a code has expired
- `validateVerificationCode()`: Validates a provided code against stored code and expiration time

### 3. Email Template
**File:** `lib/email-templates.ts`

New function `getEmailVerificationEmail()` that creates a professional HTML email template containing:
- Welcome message
- Clear display of the 6-digit verification code
- Expiration time (30 minutes)
- Instructions for verification
- Professional styling consistent with other church emails

### 4. API Endpoints

#### Signup Endpoint
**File:** `app/api/auth/signup/route.ts`

Updated to:
- Generate a verification code when user signs up
- Store the code and expiration time in the database
- Send the verification code email
- Still send the welcome email (can be updated later to only send after verification)

#### Verification Email Endpoint
**File:** `app/api/auth/send-verification-email/route.ts`

New endpoint that:
- Accepts email, name, and verification code
- Uses nodemailer to send the verification email
- Supports both production SMTP and development (Ethereal) email accounts

#### Email Verification Endpoint
**File:** `app/api/auth/verify-email/route.ts`

New endpoint that:
- Accepts POST requests with email and verification code
- Validates the code against stored code and expiration
- Marks email as verified if code is valid
- Generates and returns a JWT token
- Also supports GET requests with query parameters for email verification links

### 5. UI Components

#### Verification Page
**File:** `app/verify-email/page.tsx`

A user-friendly page with two steps:
1. **Email Input Step**: User enters their email address
2. **Code Input Step**: User enters the 6-digit verification code
   - Displays the email they're verifying
   - Shows a large input field for the code
   - Only enables submit button when 6 digits are entered
   - Shows success message and redirects to dashboard on successful verification
   - Displays helpful error messages for expired or invalid codes

### 6. Updated Signup Page
**File:** `app/signup/page.tsx`

Changed to redirect to the email verification page after successful signup instead of directly to the dashboard.

## User Flow

1. User fills out signup form with name, email, password, and phone
2. User clicks "Create Account"
3. Backend:
   - Creates user account with verification code
   - Sets verification code to expire in 30 minutes
   - Sends verification code via email
   - Sends welcome email
4. User is redirected to `/verify-email?email={email}`
5. User enters their email and gets the verification code from their inbox
6. User enters the 6-digit code
7. Backend validates the code:
   - Checks if code matches
   - Checks if code hasn't expired
   - Marks email as verified
   - Clears the verification code from database
8. User is logged in and redirected to dashboard
9. User can now fully access the platform

## Environment Variables

The feature uses existing email configuration:
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `SMTP_FROM`: "From" address for emails
- `SMTP_SECURE`: Whether to use secure connection
- `SITE_NAME`: Used in email templates
- `NEXT_PUBLIC_URL`: Used for email links

## Database Migration

Run the migration to add the new fields:
```bash
npm run prisma:migrate
# or
pnpm prisma migrate deploy
```

## Testing

### In Development
The feature works in development with either:
1. **Real SMTP credentials** (set in .env)
2. **Ethereal test account** (auto-created if no SMTP configured)
   - Check console logs for test email preview URLs

### Manual Testing Steps
1. Sign up with a test email address
2. Check your email inbox for the verification code
3. Go to `/verify-email` or use the redirect link
4. Enter your email and the code
5. Verify successful redirect to dashboard
6. Check that `emailVerified` is true in database

### Test Invalid Codes
- Wrong code: Should show "Invalid verification code"
- Expired code: Wait >30 minutes and try to verify (or manually update in DB)
- Missing code: Should show "No verification code found"

## API Response Examples

### Successful Verification
```json
{
  "ok": true,
  "message": "Email verified successfully",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "User Name",
    "emailVerified": true
  },
  "token": "jwt-token-here"
}
```

### Verification Failed
```json
{
  "error": "Invalid verification code"
}
```

## Future Enhancements

1. **Resend Code**: Add ability to resend verification code if expired
2. **Email Change**: Allow users to change email and re-verify in settings
3. **Verified Badge**: Show badge/indicator for verified users
4. **Admin Override**: Allow admins to manually verify users
5. **Custom Verification Messages**: Different messages for different user types
6. **Rate Limiting**: Limit verification attempts to prevent brute force
7. **SMS Fallback**: Add SMS verification as alternative
8. **Two-Factor Authentication**: Build upon this for 2FA implementation

## Troubleshooting

### Email Not Received
- Check SMTP configuration in .env
- Check email spam/junk folder
- Check console logs for email service errors
- In development, check Ethereal preview URL from console

### Code Not Working
- Ensure code hasn't expired (30 minute window)
- Ensure user exists in database
- Check that verification code matches exactly
- Note: Codes are case-insensitive in the input field

### Database Issues
- Ensure migration has been run: `prisma migrate deploy`
- Check that new columns exist in User table: `SELECT emailVerified, verificationCode, verificationCodeExpiresAt FROM "User" LIMIT 1;`

## Security Considerations

- Verification codes are 6-digit random numbers (1 million possibilities)
- Codes expire after 30 minutes
- Codes are stored in plaintext in database (consider hashing in future)
- Email address is sent in request body (use HTTPS in production)
- JWT tokens are generated after successful verification
