# M-Pesa STK Push Testing Guide

## Fixed Issues

### 1. Invalid Passkey
**Problem**: The `.env` file contained an invalid passkey (`R7kN3uYpV9sQ2tL8wZx4Bv6Cj1Hm0FqR5Td8Gh2Jk6Lm9NpQ3Ss7UuVwXyZ0AbCd`) and the fallback in `stk/route.ts` had placeholder `xxx` characters.

**Solution**: Updated both locations to use the official Safaricom Daraja sandbox passkey:
```
bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
```

### 2. Hardcoded Paybill Fallback
**Location**: `app/donate/page.tsx` lines 89-90 and 103-104

The frontend shows paybill `247247` and account `377899` when STK Push fails. This is expected fallback behavior for manual payments.

## Sandbox Testing

### Valid Test Phone Numbers (Safaricom Sandbox)
According to Safaricom's documentation, use these test numbers:
- `254708374149`
- `254717123456`
- Any number starting with `2547` should work in sandbox

### How to Test

1. **Start ngrok** (if not running):
   ```bash
   ngrok http 3000
   ```
   Update `MPESA_CALLBACK_URL` in `.env` with the ngrok URL.

2. **Navigate to donation page**:
   ```
   http://localhost:3000/donate
   ```

3. **Fill the form**:
   - Amount: Any value (e.g., $50)
   - Name: Test Donor
   - Email: test@example.com
   - Phone: `254708374149` (or any valid Kenyan number)

4. **Click "Complete Donation"**

5. **Expected behavior**:
   - STK Push should send successfully
   - You'll see message: "STK Push sent. Please enter your M-Pesa PIN on your phone to complete the payment."
   - In sandbox, the transaction will auto-succeed after ~30 seconds
   - Callback will update the database record

### Monitoring

**Check terminal logs**:
```bash
# Look for these messages:
# - OAuth token retrieved successfully
# - STK Push initiated
# - Callback received
```

**Check database**:
```bash
psql postgresql://dev:devpass@localhost:55432/jwrc_db -c "SELECT * FROM mpesa_donations ORDER BY created_at DESC LIMIT 5;"
```

### Sandbox Credentials (Current)
- **Environment**: `sandbox`
- **Shortcode**: `174379`
- **Passkey**: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`
- **Consumer Key**: `xh1l8OMcsTIoCprVTuu5MaoRUXd3xpYswW5QLmcodqvdknOG`
- **Consumer Secret**: `MdFzgjrWJsBgF8w2OCVCZtDm6rPHEpS3AlYxICzDCb7o3DFMDuAqFJDUZAhmVxMG`

## Production Checklist

When ready to go live:

1. **Update `.env`**:
   ```
   MPESA_ENV=production
   MPESA_SHORTCODE=247247    # Your actual paybill
   MPESA_PASSKEY=<get from Daraja portal>
   ```

2. **Register production callback URL** in Daraja portal

3. **Test with real phone number** (NOT sandbox numbers)

4. **Monitor callback logs** to ensure payments are recorded

## Common Issues

### "STK Push failed to initiate"
- Check passkey is correct (64 characters, no spaces)
- Verify consumer key/secret are valid
- Ensure phone number format is `2547XXXXXXXX`
- Check ngrok is running (for callbacks)

### No callback received
- Verify `MPESA_CALLBACK_URL` is publicly accessible
- Check ngrok URL is up-to-date (ngrok URLs expire)
- Ensure callback route `/api/mpesa/callback` is deployed

### Database errors
- Run migrations: `pnpm prisma migrate deploy`
- Check Postgres is running: `psql $DATABASE_URL -c "SELECT 1"`

