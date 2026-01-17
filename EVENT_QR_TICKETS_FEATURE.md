# Event QR Code Ticket System

## Overview

This feature enables admins to send digital QR code tickets to event registrants via email. Attendees can present these QR codes at the event for quick check-in verification.

## Features

### 1. **QR Code Ticket Generation**
- Automatically generates unique QR codes for each event registration
- QR codes contain encrypted ticket data (event ID, signup ID, reference number, attendee info)
- QR codes are embedded as images in professional HTML emails

### 2. **Admin Ticket Management** (`/admin/events`)
- View all events and their registrations
- See statistics: Total registrations, tickets sent, pending, checked-in
- Send individual tickets to specific attendees
- Bulk send tickets to all pending attendees
- Track ticket delivery status

### 3. **QR Code Scanner** (`/admin/scan-ticket`)
- Camera-based QR code scanner using HTML5
- Real-time ticket verification
- One-tap check-in functionality
- Shows attendee details and event information
- Prevents duplicate check-ins

### 4. **Email Notifications**
- Professional HTML email templates
- Includes QR code image embedded inline
- Event details (title, date, location, reference number)
- Clear instructions for attendees
- Mobile-friendly design

## Database Schema Changes

### EventSignup Model Updates
```prisma
model EventSignup {
  id          String    @id @default(uuid())
  eventId     String
  ref         String?   @unique
  name        String
  email       String
  phone       String?
  ticketSent  Boolean   @default(false)  // NEW
  checkedIn   Boolean   @default(false)  // NEW
  checkedInAt DateTime?                  // NEW
  createdAt   DateTime  @default(now())
}
```

## API Endpoints

### 1. **Send Ticket** - `POST /api/events/send-ticket`
**Purpose:** Send QR code ticket to a specific attendee

**Authentication:** Admin only

**Request Body:**
```json
{
  "signupId": "uuid-of-signup"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Ticket sent successfully",
  "email": "attendee@example.com"
}
```

**Workflow:**
1. Validates admin authentication
2. Fetches signup and event details from database
3. Generates QR code with ticket data
4. Sends email with embedded QR code
5. Marks `ticketSent` as `true` in database

---

### 2. **Verify Ticket** - `POST /api/events/verify-ticket`
**Purpose:** Verify a scanned QR code ticket

**Authentication:** Admin or Leader

**Request Body:**
```json
{
  "qrData": "{\"type\":\"event-ticket\",\"eventId\":\"...\",\"signupId\":\"...\",\"ref\":\"...\"}"
}
```

**Response:**
```json
{
  "valid": true,
  "alreadyCheckedIn": false,
  "signup": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "ref": "ABC123",
    "checkedIn": false
  },
  "event": {
    "id": "uuid",
    "title": "Sunday Service",
    "startsAt": "2026-01-20T10:00:00Z",
    "location": "Main Sanctuary"
  }
}
```

**Workflow:**
1. Parses QR code data
2. Validates ticket authenticity
3. Checks against database records
4. Returns attendee and event information
5. Indicates if already checked in

---

### 3. **Check In** - `PATCH /api/events/verify-ticket`
**Purpose:** Mark attendee as checked in

**Authentication:** Admin or Leader

**Request Body:**
```json
{
  "signupId": "uuid-of-signup"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Checked in successfully",
  "signup": {
    "id": "uuid",
    "checkedIn": true,
    "checkedInAt": "2026-01-20T09:45:00Z"
  }
}
```

**Workflow:**
1. Updates `checkedIn` to `true`
2. Records `checkedInAt` timestamp
3. Returns updated signup details

## User Workflows

### Admin: Sending Tickets

1. Navigate to `/admin/events`
2. Select event from dropdown
3. View list of registered attendees
4. Options:
   - **Send Individual Ticket:** Click "Send Ticket" button next to attendee
   - **Bulk Send:** Click "Send All Pending Tickets" button
5. System sends email with QR code to each recipient
6. Status updates to "Ticket Sent" ✓

### Admin/Leader: Checking In Attendees

1. Navigate to `/admin/scan-ticket`
2. Click "Start Scanner" to activate camera
3. Point camera at attendee's QR code
4. System verifies ticket and shows attendee details
5. Click "Check In" button
6. Attendee is marked as checked in with timestamp
7. Click "Scan Next" to continue

### Attendee: Receiving and Using Ticket

1. Register for event online
2. Receive confirmation email
3. Admin sends QR code ticket (separate email)
4. Open email on mobile device
5. Present QR code at event entrance
6. Staff scans code for instant verification
7. Attendee is checked in

## Email Template Structure

### Ticket Email (`getEventTicketEmail`)
- **Subject:** "Your Event Ticket: [Event Title]"
- **Content:**
  - Welcome message
  - Event details (title, date, location)
  - **Large QR code image** (250x250px)
  - Ticket reference number
  - Important notice to save email
  - Scripture verse
  - Contact information

**Email Features:**
- QR code embedded as data URL (no external images)
- Responsive design for mobile and desktop
- Print-friendly layout
- Dark mode compatible

## QR Code Data Structure

Each QR code contains JSON data:
```json
{
  "type": "event-ticket",
  "eventId": "uuid-of-event",
  "signupId": "uuid-of-signup",
  "ref": "ABC123",
  "name": "John Doe",
  "email": "john@example.com",
  "timestamp": "2026-01-17T12:00:00Z"
}
```

**Security Features:**
- Unique signup ID tied to specific registration
- Reference number validation
- Timestamp for audit trail
- Event ID prevents ticket reuse across events

## Files Created/Modified

### New Files
- `lib/qrcode.ts` - QR code generation and validation utilities
- `app/api/events/send-ticket/route.ts` - Ticket sending endpoint
- `app/api/events/verify-ticket/route.ts` - Verification and check-in endpoint
- `app/admin/events/page.tsx` - Admin ticket management UI
- `app/admin/scan-ticket/page.tsx` - QR code scanner UI
- `prisma/migrations/20260117_add_event_ticket_fields/migration.sql` - Database migration

### Modified Files
- `lib/email-templates.ts` - Added `getEventTicketEmail()` function
- `prisma/schema.prisma` - Updated EventSignup model with new fields

## Dependencies

### New Packages
- `qrcode` - QR code generation library
- `@types/qrcode` - TypeScript types for qrcode
- `html5-qrcode` - Browser-based QR code scanner

### Existing Packages
- `nodemailer` - Email sending (already installed)
- `@prisma/client` - Database access (already installed)

## Environment Variables

Uses existing email configuration:
- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP server port (default: 587)
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_FROM` - Sender email address
- `SMTP_SECURE` - Use TLS (true/false)

## Testing Guide

### 1. Test Ticket Generation
```bash
# Register for an event
POST /api/events/signups
{
  "eventId": "event-uuid",
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+254712345678"
}

# Send ticket (as admin)
POST /api/events/send-ticket
{
  "signupId": "signup-uuid"
}

# Check email inbox for QR code ticket
```

### 2. Test QR Scanner
1. Open `/admin/scan-ticket` in browser
2. Allow camera permissions
3. Display QR code from email on another device
4. Scan QR code
5. Verify attendee details appear
6. Click "Check In"
7. Verify status changes to "Already Checked In"

### 3. Test Bulk Send
1. Register multiple users for an event
2. Go to `/admin/events`
3. Select the event
4. Click "Send All Pending Tickets"
5. Verify all attendees receive emails

## Troubleshooting

### Email Not Sending
- Check SMTP credentials in `.env`
- Verify email server allows connections
- Check console logs for detailed errors
- Test with Ethereal (development mode)

### QR Code Not Scanning
- Ensure adequate lighting
- Use back camera (better quality)
- Allow camera permissions in browser
- Try different device/browser

### Check-In Not Working
- Verify admin/leader authentication
- Check database connection
- Ensure migration has been run
- Clear browser cache and retry

## Future Enhancements

1. **SMS Tickets** - Send QR codes via SMS as backup
2. **Offline Scanner** - Support check-in without internet
3. **Analytics Dashboard** - Track attendance patterns
4. **Ticket Expiration** - Automatically invalidate old tickets
5. **Multi-Event Tickets** - One QR code for multiple events
6. **Guest Lists** - Pre-approved attendee lists
7. **Capacity Limits** - Stop registration when event is full
8. **Waitlist Management** - Automatic ticket sends when slots open
9. **Export Attendees** - Download CSV of checked-in attendees
10. **Real-time Dashboard** - Live attendance counter during events

## Security Considerations

- ✅ QR codes tied to specific signups (can't be forged)
- ✅ Admin/Leader authentication required for scanning
- ✅ Duplicate check-in prevention
- ✅ Timestamped audit trail
- ⚠️ QR data is not encrypted (consider adding encryption in production)
- ⚠️ Email delivery is not guaranteed (consider SMS backup)

## Support

For issues or questions:
- Check browser console for errors
- Review server logs for API errors
- Contact: jwrcjuja.1@gmail.com
- Phone: 0715377835
