module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[project]/lib/email-templates.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEventSignupConfirmationEmail",
    ()=>getEventSignupConfirmationEmail,
    "getSuggestionConfirmationEmail",
    ()=>getSuggestionConfirmationEmail,
    "getVolunteerConfirmationEmail",
    ()=>getVolunteerConfirmationEmail
]);
function getEventSignupConfirmationEmail(name, eventTitle, eventDate, eventLocation, ref) {
    const siteName = process.env.SITE_NAME || 'Jesus Worship and Restoration Church';
    const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    return {
        subject: `Event Registration Confirmed: ${eventTitle}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Registration Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${siteName}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">Thank You for Registering!</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${name},
              </p>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We're excited to confirm your registration for <strong>${eventTitle}</strong>.
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">Event Details</h3>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Event:</strong> ${eventTitle}</p>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Date & Time:</strong> ${eventDate}</p>
                ${eventLocation ? `<p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Location:</strong> ${eventLocation}</p>` : ''}
                ${ref ? `<p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Reference Number:</strong> <code style="background-color: #e9ecef; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${ref}</code></p>` : ''}
              </div>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                We look forward to seeing you there! If you have any questions or need to make changes to your registration, please don't hesitate to contact us at <strong>0715377835</strong>.
              </p>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                "For where two or three gather in my name, there am I with them." - Matthew 18:20
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${siteUrl}/events" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">View All Events</a>
              </div>
              
              <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; border-top: 1px solid #eeeeee; padding-top: 20px;">
                Blessings,<br>
                <strong>The ${siteName} Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
        <p style="margin: 0;">This is an automated confirmation email. Please do not reply to this message.</p>
        <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
        text: `
Thank You for Registering!

Dear ${name},

We're excited to confirm your registration for ${eventTitle}.

Event Details:
- Event: ${eventTitle}
- Date & Time: ${eventDate}
${eventLocation ? `- Location: ${eventLocation}\n` : ''}${ref ? `- Reference Number: ${ref}\n` : ''}

We look forward to seeing you there! If you have any questions or need to make changes to your registration, please don't hesitate to contact us at 0715377835.

"For where two or three gather in my name, there am I with them." - Matthew 18:20

View all events: ${siteUrl}/events

Blessings,
The ${siteName} Team

---
This is an automated confirmation email. Please do not reply to this message.
© ${new Date().getFullYear()} ${siteName}. All rights reserved.
    `.trim()
    };
}
function getVolunteerConfirmationEmail(name, roleTitle) {
    const siteName = process.env.SITE_NAME || 'Jesus Worship and Restoration Church';
    const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    return {
        subject: `Volunteer Application Received: ${roleTitle}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Volunteer Application Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${siteName}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">Thank You for Your Interest in Volunteering!</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${name},
              </p>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We have received your volunteer application for <strong>${roleTitle}</strong>. We are truly grateful for your willingness to serve our church community.
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">Application Details</h3>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Position:</strong> ${roleTitle}</p>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Status:</strong> <span style="color: #ff9800;">Pending Review</span></p>
              </div>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Our team will review your application and get back to you soon. We appreciate your patience as we carefully consider each application. If you have any questions, please contact us at <strong>0715377835</strong>.
              </p>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms." - 1 Peter 4:10
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${siteUrl}/dashboard" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">View Your Dashboard</a>
              </div>
              
              <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; border-top: 1px solid #eeeeee; padding-top: 20px;">
                Blessings,<br>
                <strong>The ${siteName} Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
        <p style="margin: 0;">This is an automated confirmation email. Please do not reply to this message.</p>
        <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
        text: `
Thank You for Your Interest in Volunteering!

Dear ${name},

We have received your volunteer application for ${roleTitle}. We are truly grateful for your willingness to serve our church community.

Application Details:
- Position: ${roleTitle}
- Status: Pending Review

Our team will review your application and get back to you soon. We appreciate your patience as we carefully consider each application. If you have any questions, please contact us at 0715377835.

"Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms." - 1 Peter 4:10

View your dashboard: ${siteUrl}/dashboard

Blessings,
The ${siteName} Team

---
This is an automated confirmation email. Please do not reply to this message.
© ${new Date().getFullYear()} ${siteName}. All rights reserved.
    `.trim()
    };
}
function getSuggestionConfirmationEmail(name, type) {
    const siteName = process.env.SITE_NAME || 'Jesus Worship and Restoration Church';
    const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const typeLabels = {
        suggestion: 'Suggestion',
        complaint: 'Complaint',
        praise: 'Praise',
        question: 'Question'
    };
    const typeLabel = typeLabels[type] || 'Feedback';
    return {
        subject: `Thank You for Your ${typeLabel}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feedback Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${siteName}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">Thank You for Your ${typeLabel}!</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                ${name ? `Dear ${name},` : 'Hello,'}
              </p>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We have received your ${typeLabel.toLowerCase()} and truly appreciate you taking the time to share your thoughts with us. Your feedback is invaluable in helping us improve and better serve our church community.
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">What Happens Next?</h3>
                <p style="color: #666666; font-size: 14px; margin: 5px 0; line-height: 1.6;">
                  Our team will carefully review your ${typeLabel.toLowerCase()} and respond as appropriate. We take all feedback seriously and use it to make our community stronger. If you have any questions, please contact us at <strong>0715377835</strong>.
                </p>
              </div>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." - Galatians 6:9
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${siteUrl}/dashboard" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">View Your Dashboard</a>
              </div>
              
              <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; border-top: 1px solid #eeeeee; padding-top: 20px;">
                Blessings,<br>
                <strong>The ${siteName} Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
        <p style="margin: 0;">This is an automated confirmation email. Please do not reply to this message.</p>
        <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
        text: `
Thank You for Your ${typeLabel}!

${name ? `Dear ${name},` : 'Hello,'}

We have received your ${typeLabel.toLowerCase()} and truly appreciate you taking the time to share your thoughts with us. Your feedback is invaluable in helping us improve and better serve our church community.

What Happens Next?
Our team will carefully review your ${typeLabel.toLowerCase()} and respond as appropriate. We take all feedback seriously and use it to make our community stronger. If you have any questions, please contact us at 0715377835.

"Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." - Galatians 6:9

View your dashboard: ${siteUrl}/dashboard

Blessings,
The ${siteName} Team

---
This is an automated confirmation email. Please do not reply to this message.
© ${new Date().getFullYear()} ${siteName}. All rights reserved.
    `.trim()
    };
}
}),
"[project]/app/api/volunteers/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2d$templates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/email-templates.ts [app-route] (ecmascript)");
;
;
;
;
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
async function ensureTable() {
    await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS volunteer_applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      role_id TEXT,
      role_title TEXT,
      status TEXT DEFAULT 'pending',
      admin_message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      responded_at TIMESTAMP WITH TIME ZONE
    )
  `);
    await prisma.$executeRawUnsafe(`ALTER TABLE volunteer_applications ADD COLUMN IF NOT EXISTS admin_message TEXT`);
}
function getTokenFromHeaders(req) {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.split(';').map((c)=>c.trim()).find((c)=>c.startsWith('token='));
    if (!match) return null;
    return match.split('=')[1];
}
async function POST(req) {
    // public: submit volunteer application
    try {
        const body = await req.json();
        const { name, email, phone, roleId, roleTitle } = body || {};
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!email) errors.email = 'Email is required';
        if (!roleId && !roleTitle) errors.role = 'Role is required';
        if (Object.keys(errors).length) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            errors
        }, {
            status: 400
        });
        await ensureTable();
        const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
        await prisma.$executeRawUnsafe(`INSERT INTO volunteer_applications (id, name, email, phone, role_id, role_title, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,'pending',NOW())`, id, String(name), String(email), phone ? String(phone) : null, roleId ? String(roleId) : null, roleTitle ? String(roleTitle) : null);
        // Send professional confirmation email
        try {
            if (process.env.SMTP_HOST && process.env.SMTP_USER) {
                try {
                    const nodemailer = await __turbopack_context__.A("[project]/node_modules/.pnpm/nodemailer@7.0.11/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript, async loader)");
                    const transporter = nodemailer.createTransport({
                        host: process.env.SMTP_HOST,
                        port: Number(process.env.SMTP_PORT || 587),
                        secure: process.env.SMTP_SECURE === 'true',
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS
                        }
                    });
                    const emailContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2d$templates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getVolunteerConfirmationEmail"])(String(name), roleTitle ? String(roleTitle) : roleId ? String(roleId) : 'Volunteer Position');
                    await transporter.sendMail({
                        from: process.env.SMTP_FROM || process.env.SMTP_USER,
                        to: String(email),
                        subject: emailContent.subject,
                        html: emailContent.html,
                        text: emailContent.text
                    });
                } catch (e) {
                    console.warn('Failed to send confirmation email', e);
                }
            }
        } catch (e) {
            console.warn('Email send skipped', e);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            application: {
                id,
                name,
                email,
                phone,
                roleId,
                roleTitle,
                status: 'pending'
            }
        }, {
            status: 201
        });
    } catch (e) {
        console.error(e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Server error'
        }, {
            status: 500
        });
    }
}
async function GET(req) {
    try {
        const url = new URL(req.url);
        const forEmail = url.searchParams.get('email');
        const summary = url.searchParams.get('summary');
        // if email provided return applications for that email (public for user dashboard)
        await ensureTable();
        if (summary === 'roles') {
            const rows = await prisma.$queryRawUnsafe(`SELECT role_id as "roleId", role_title as "roleTitle", status, COUNT(*)::int as count FROM volunteer_applications GROUP BY role_id, role_title, status`);
            const aggregated = {};
            for (const row of rows){
                const key = `${row.roleId ?? ''}|${row.roleTitle ?? ''}`;
                if (!aggregated[key]) {
                    aggregated[key] = {
                        roleId: row.roleId || null,
                        roleTitle: row.roleTitle || null,
                        total: 0,
                        approved: 0,
                        pending: 0,
                        rejected: 0
                    };
                }
                const bucket = aggregated[key];
                const count = typeof row.count === 'number' ? row.count : Number(row.count || 0);
                bucket.total += count;
                if (row.status === 'approved') bucket.approved += count;
                else if (row.status === 'pending') bucket.pending += count;
                else if (row.status === 'rejected') bucket.rejected += count;
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                roles: Object.values(aggregated)
            });
        }
        if (forEmail) {
            const rows = await prisma.$queryRawUnsafe(`SELECT id, name, email, phone, role_id as "roleId", role_title as "roleTitle", status, admin_message as "adminMessage", created_at as "createdAt", responded_at as "respondedAt" FROM volunteer_applications WHERE lower(email) = lower($1) ORDER BY created_at DESC`, forEmail);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                applications: rows
            });
        }
        // admin-only: list all
        const token = getTokenFromHeaders(req);
        const secret = process.env.JWT_SECRET || 'dev-secret';
        if (!token) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        let payload = null;
        try {
            payload = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, secret);
        } catch (e) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        if (payload.role !== 'admin') return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Forbidden'
        }, {
            status: 403
        });
        const rows = await prisma.$queryRawUnsafe(`SELECT id, name, email, phone, role_id as "roleId", role_title as "roleTitle", status, admin_message as "adminMessage", created_at as "createdAt", responded_at as "respondedAt" FROM volunteer_applications ORDER BY created_at DESC`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            applications: rows
        });
    } catch (e) {
        console.error(e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Server error'
        }, {
            status: 500
        });
    }
}
async function PATCH(req) {
    // admin respond (approve/reject)
    try {
        const token = getTokenFromHeaders(req);
        const secret = process.env.JWT_SECRET || 'dev-secret';
        if (!token) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        let payload = null;
        try {
            payload = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, secret);
        } catch (e) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        if (payload.role !== 'admin') return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Forbidden'
        }, {
            status: 403
        });
        const body = await req.json();
        const { id, action, message } = body || {};
        if (!id || !action) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing id or action'
        }, {
            status: 400
        });
        if (![
            'approve',
            'reject'
        ].includes(action)) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid action'
        }, {
            status: 400
        });
        await ensureTable();
        const appRow = await prisma.$queryRawUnsafe(`SELECT email FROM volunteer_applications WHERE id = $1`, id);
        const applicationEmail = appRow && appRow[0] ? appRow[0].email : null;
        const status = action === 'approve' ? 'approved' : 'rejected';
        await prisma.$executeRawUnsafe(`UPDATE volunteer_applications SET status = $1, admin_message = $2, responded_at = NOW() WHERE id = $3`, status, message ? String(message) : null, id);
        // Keep user record aligned with volunteer decision
        if (applicationEmail) {
            try {
                await prisma.user.updateMany({
                    where: {
                        email: {
                            equals: String(applicationEmail),
                            mode: 'insensitive'
                        }
                    },
                    data: {
                        isVolunteer: status === 'approved'
                    }
                });
            } catch (e) {
                console.warn('Failed to sync volunteer flag to user', e);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch (e) {
        console.error(e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e06941cd._.js.map