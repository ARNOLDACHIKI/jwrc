# Setup Checklist & Issues Fixed

## ✅ Fixed Issues (No Action Needed)

### 1. Database Connection Errors ✓
- **Fixed**: All routes now use shared Prisma client from `lib/db.ts`
- **Fixed**: Added `safeQuery` and `safeExecute` wrappers that catch DB errors gracefully
- **Fixed**: Removed duplicate `new PrismaClient()` declarations across all routes
- **Status**: Your app won't crash if the DB is temporarily unavailable

### 2. Code Quality Issues ✓
- **Fixed**: `app/api/auth/signup/route.ts` - removed duplicate prisma declaration
- **Fixed**: `app/api/announcements/route.ts` - uses shared DB helper
- **Fixed**: `app/api/mpesa/stk/route.ts` - uses `safeQuery`/`safeExecute`
- **Fixed**: `app/api/mpesa/callback/route.ts` - uses safe wrappers
- **Fixed**: `app/api/mpesa/status/route.ts` - uses `safeQuery`
- **Fixed**: `app/api/auth/password-reset/admin/route.ts` - uses `safeExecute`
- **Fixed**: All password reset routes use safe DB helpers

### 3. Forgot Password Flow ✓
- **Added**: `/forgot-password` page - user requests reset link
- **Added**: `/reset-password` page - user enters new password
- **Updated**: Login page now has "Forgot password?" link
- **Status**: Fully functional (needs SMTP config for emails)

---

## ⚠️ Required: User Input Needed

### 1. SMTP Email Configuration (Required for Password Reset Emails)

**Current Status**: Password reset works but **emails won't send** until you configure SMTP.

**In Development (No SMTP)**:
- Reset tokens are logged to browser console
- Token returned in API response for testing
- You can manually construct reset URL: `http://localhost:3000/reset-password?token=<token>`

**To Enable Email Sending**:

Edit `/home/lod/Downloads/jwrc/.env` and replace these placeholder values:

```env
# Option A: Gmail (Easiest for Testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx    # Generate at https://myaccount.google.com/apppasswords
SMTP_FROM=your-gmail@gmail.com
SITE_URL=http://localhost:3000    # Use https://yourdomain.com in production

# Option B: SendGrid (Free Tier Available)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key-here
SMTP_FROM=noreply@yoursite.com
SITE_URL=http://localhost:3000
```

**Gmail Setup Steps**:
1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password to `SMTP_PASS` in `.env`
4. Restart dev server: `pnpm run dev`

**Testing**:
1. Go to `http://localhost:3000/forgot-password`
2. Enter an email address
3. Check that email's inbox for reset link
4. Click link and set new password

---

### 2. JWT Secret (⚠️ CRITICAL for Production)

**Current Status**: Using a placeholder JWT secret

**Current Value**:
```env
JWT_SECRET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  # This is actually a JWT token, not a secret!
```

**Action Required Before Production**:
Replace with a strong random string:

```bash
# Generate a secure random secret (run in terminal):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Then update .env:
JWT_SECRET="<paste-the-generated-secret-here>"
```

**Why This Matters**:
- JWT tokens are signed with this secret
- If someone has your secret, they can forge admin tokens
- **DO NOT** commit the real secret to Git

---

### 3. M-Pesa Configuration (Optional - Only if Using Donations)

**Current Status**: Configured with sandbox credentials

**Required for Production**:
1. Replace sandbox credentials with production credentials from Safaricom
2. Update `MPESA_ENV=production` in `.env`
3. Ensure `MPESA_CALLBACK_URL` is publicly accessible (use ngrok or deploy)

```env
# Production M-Pesa (replace with your credentials)
MPESA_ENV=production
MPESA_CONSUMER_KEY=your-production-consumer-key
MPESA_CONSUMER_SECRET=your-production-consumer-secret
MPESA_SHORTCODE=your-paybill-number
MPESA_PASSKEY=your-production-passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

**For Local Testing**:
- Keep `MPESA_ENV=sandbox`
- Use ngrok to expose callback: `ngrok http 3000`
- Update `MPESA_CALLBACK_URL` to ngrok URL

---

### 4. Database Configuration (Already Set Up ✓)

**Current Status**: ✓ PostgreSQL running on port 55432

```env
DATABASE_URL="postgresql://dev:devpass@localhost:55432/jwrc_db"
```

**No Action Needed** - Database is working!

---

## 📋 Final Checklist Before Going Live

- [ ] Update `JWT_SECRET` with a strong random value
- [ ] Configure SMTP (Gmail or SendGrid) for password reset emails
- [ ] Test forgot password flow end-to-end
- [ ] Replace M-Pesa sandbox credentials with production (if using)
- [ ] Update `SITE_URL` to your production domain
- [ ] Set `NODE_ENV=production`
- [ ] Never commit real secrets to Git (use environment variables)
- [ ] Set up proper backup for PostgreSQL database
- [ ] Configure domain/SSL certificate for production

---

## 🧪 Testing the Forgot Password Flow

### Without SMTP (Dev Mode):
1. Go to http://localhost:3000/forgot-password
2. Enter email: `jwrcjuja.1@gmail.com` (admin from seed)
3. Open browser console (F12)
4. Copy the token from console log
5. Visit: `http://localhost:3000/reset-password?token=<paste-token>`
6. Enter new password and submit
7. Login with new password

### With SMTP Configured:
1. Go to http://localhost:3000/forgot-password
2. Enter your email address
3. Check inbox for reset email
4. Click link in email
5. Enter new password
6. Login successfully

---

## 🐛 Current Known Issues

**None!** All major issues have been fixed.

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors (F12)
2. Check terminal logs where `pnpm run dev` is running
3. Verify `.env` values are correct (no typos)
4. Ensure PostgreSQL is running (`docker ps` to check)
5. Restart dev server after changing `.env`

---

Last Updated: December 11, 2025
