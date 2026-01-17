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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/jwrc/lib/email-templates.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEmailVerificationEmail",
    ()=>getEmailVerificationEmail,
    "getEventSignupConfirmationEmail",
    ()=>getEventSignupConfirmationEmail,
    "getEventTicketEmail",
    ()=>getEventTicketEmail,
    "getSuggestionConfirmationEmail",
    ()=>getSuggestionConfirmationEmail,
    "getSuggestionResponseEmail",
    ()=>getSuggestionResponseEmail,
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
function getEventTicketEmail(name, eventTitle, eventDate, eventLocation, ref, qrCodeDataURL) {
    const siteName = process.env.SITE_NAME || 'Jesus Worship and Restoration Church';
    const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    return {
        subject: `Your Event Ticket: ${eventTitle}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Event Ticket</title>
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
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">🎟️ Your Event Ticket</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${name},
              </p>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Here is your digital ticket for <strong>${eventTitle}</strong>. Please present this QR code at the event entrance for check-in.
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">Event Details</h3>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Event:</strong> ${eventTitle}</p>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Date & Time:</strong> ${eventDate}</p>
                ${eventLocation ? `<p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Location:</strong> ${eventLocation}</p>` : ''}
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Ticket Ref:</strong> <code style="background-color: #e9ecef; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${ref}</code></p>
              </div>
              
              <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #ffffff; border: 2px dashed #667eea; border-radius: 8px;">
                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Your QR Code Ticket</h3>
                <img src="${qrCodeDataURL}" alt="Event Ticket QR Code" style="width: 250px; height: 250px; margin: 0 auto; display: block;" />
                <p style="color: #999999; font-size: 13px; margin: 15px 0 0 0;">
                  Present this QR code at the event entrance
                </p>
              </div>
              
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>⚠️ Important:</strong> Please save this email or take a screenshot of the QR code. You'll need it to check in at the event.
                </p>
              </div>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                We're looking forward to seeing you! If you have any questions, please contact us at <strong>0715377835</strong>.
              </p>
              
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                "For where two or three gather in my name, there am I with them." - Matthew 18:20
              </p>
              
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
        <p style="margin: 0;">This is your event ticket. Please save this email.</p>
        <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
        text: `
Your Event Ticket

Dear ${name},

Here is your digital ticket for ${eventTitle}. Please present this QR code at the event entrance for check-in.

Event Details:
- Event: ${eventTitle}
- Date & Time: ${eventDate}
${eventLocation ? `- Location: ${eventLocation}\n` : ''}
- Ticket Ref: ${ref}

⚠️ IMPORTANT: Save this email or take a screenshot. You'll need the QR code to check in at the event.

We're looking forward to seeing you! If you have any questions, please contact us at 0715377835.

"For where two or three gather in my name, there am I with them." - Matthew 18:20

Blessings,
The ${siteName} Team

---
This is your event ticket. Please save this email.
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
                We have received your ${typeLabel.toLowerCase()}. Thank you for sharing your thoughts — we will review your message and follow up when necessary.
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

We have received your ${typeLabel.toLowerCase()}. Thank you for sharing your thoughts — we will review your message and follow up when necessary.

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
function getSuggestionResponseEmail(name, response, responderName, type) {
    const siteName = process.env.SITE_NAME || 'Jesus Worship and Restoration Church';
    const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const typeLabel = type ? type[0].toUpperCase() + type.slice(1) : 'Feedback';
    return {
        subject: `Response to your ${typeLabel} from ${siteName}`,
        // Send only the raw admin response as the email body (HTML/text).
        // The caller already provides the response text; we avoid wrapping it in a full template per user request.
        html: `${response.replace(/\n/g, '<br/>')}`,
        text: `${response}`.trim()
    };
}
function getEmailVerificationEmail(name, verificationCode) {
    const siteName = process.env.SITE_NAME || 'Jesus Worship and Restoration Church';
    const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const codeExpiryMinutes = 30;
    return {
        subject: `Verify Your Email Address - ${siteName}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
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
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">Welcome! Verify Your Email</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${name},
              </p>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for signing up for ${siteName}. To complete your registration and secure your account, please verify your email address using the code below.
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Your Verification Code</h3>
                <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                  Enter this code on the verification page:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                  <div style="background-color: #ffffff; border: 2px dashed #667eea; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 28px; font-weight: bold; color: #667eea; letter-spacing: 5px;">
                    ${verificationCode}
                  </div>
                </div>
                <p style="color: #999999; font-size: 13px; margin: 15px 0 0 0;">
                  This code will expire in ${codeExpiryMinutes} minutes.
                </p>
              </div>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                If you didn't create an account with us, please ignore this email. If you have any questions, please contact us at <strong>0715377835</strong> or reply to this email.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${siteUrl}/verify-email" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">Verify Email</a>
              </div>
              
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                "Trust in the Lord with all your heart." - Proverbs 3:5
              </p>
              
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
        <p style="margin: 0;">This is an automated verification email. Please do not reply to this message.</p>
        <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
        text: `
Welcome! Verify Your Email

Dear ${name},

Thank you for signing up for ${siteName}. To complete your registration and secure your account, please verify your email address using the code below.

Your Verification Code:
${verificationCode}

This code will expire in ${codeExpiryMinutes} minutes.

If you didn't create an account with us, please ignore this email. If you have any questions, please contact us at 0715377835 or reply to this email.

Verify your email: ${siteUrl}/verify-email

"Trust in the Lord with all your heart." - Proverbs 3:5

Blessings,
The ${siteName} Team

---
This is an automated verification email. Please do not reply to this message.
© ${new Date().getFullYear()} ${siteName}. All rights reserved.
    `.trim()
    };
}
}),
"[project]/jwrc/app/api/events/signups/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jwrc/node_modules/.pnpm/next@16.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jwrc/node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$lib$2f$email$2d$templates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jwrc/lib/email-templates.ts [app-route] (ecmascript)");
;
;
;
;
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
function getTokenFromHeaders(req) {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.split(";").map((c)=>c.trim()).find((c)=>c.startsWith("token="));
    if (!match) return null;
    return match.split("=")[1];
}
async function ensureTable() {
    // create a simple signups table if it doesn't exist
    await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS event_signups (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      ref TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )
  `);
    // ensure ref column exists (if table pre-existed without it)
    await prisma.$executeRawUnsafe(`ALTER TABLE event_signups ADD COLUMN IF NOT EXISTS ref TEXT`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS event_signups_ref_idx ON event_signups(ref)`);
}
async function POST(req) {
    try {
        const body = await req.json();
        const { eventId, name, email, phone } = body || {};
        const errors = {};
        if (!eventId) errors.eventId = 'Event id is required';
        if (!name || String(name).trim().length === 0) errors.name = 'Name is required';
        if (!email || String(email).trim().length === 0) errors.email = 'Email is required';
        if (Object.keys(errors).length > 0) return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            errors
        }, {
            status: 400
        });
        // ensure event exists
        const ev = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        });
        if (!ev) return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Event not found'
        }, {
            status: 404
        });
        await ensureTable();
        await ensureTable();
        // dedupe: prevent same email signing up multiple times for same event
        const exists = await prisma.$queryRawUnsafe(`SELECT id FROM event_signups WHERE event_id = $1 AND lower(email) = lower($2) LIMIT 1`, eventId, String(email));
        if (exists && exists.length > 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Already signed up'
            }, {
                status: 409
            });
        }
        // generate a short human-friendly ref
        function genRef() {
            return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        }
        let ref = genRef();
        // ensure unique ref
        for(let i = 0; i < 5; i++){
            const r = await prisma.$queryRawUnsafe(`SELECT id FROM event_signups WHERE ref = $1 LIMIT 1`, ref);
            if (!Array.isArray(r) || r.length === 0) break;
            ref = genRef();
        }
        const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
        await prisma.$executeRawUnsafe(`INSERT INTO event_signups (id, event_id, ref, name, email, phone, created_at) VALUES ($1,$2,$3,$4,$5,$6,NOW())`, id, eventId, ref, String(name), String(email), phone ? String(phone) : null);
        // Send professional confirmation email
        try {
            if (process.env.SMTP_HOST && process.env.SMTP_USER) {
                try {
                    const nodemailer = await __turbopack_context__.A("[project]/jwrc/node_modules/.pnpm/nodemailer@7.0.11/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript, async loader)");
                    const transporter = nodemailer.createTransport({
                        host: process.env.SMTP_HOST,
                        port: Number(process.env.SMTP_PORT || 587),
                        secure: process.env.SMTP_SECURE === 'true',
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS
                        }
                    });
                    const formatDate = (date)=>{
                        return date.toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    };
                    const emailContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$lib$2f$email$2d$templates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEventSignupConfirmationEmail"])(name, ev.title, formatDate(new Date(ev.startsAt)), ev.location || undefined, ref || undefined);
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            signup: {
                id,
                ref,
                eventId,
                name,
                email,
                phone
            }
        }, {
            status: 201
        });
    } catch (err) {
        console.error(err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Server error'
        }, {
            status: 500
        });
    }
}
async function DELETE(req) {
    try {
        // admin-only
        const token = getTokenFromHeaders(req);
        const secret = process.env.JWT_SECRET || 'dev-secret';
        if (!token) return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        let payload = null;
        try {
            payload = __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, secret);
        } catch (e) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        if (payload.role !== 'admin') return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Forbidden'
        }, {
            status: 403
        });
        const body = await req.json();
        const { id } = body || {};
        if (!id) return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing id'
        }, {
            status: 400
        });
        await ensureTable();
        try {
            await prisma.$executeRawUnsafe(`DELETE FROM event_signups WHERE id = $1`, id);
            return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true
            });
        } catch (e) {
            console.error(e);
            return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to delete'
            }, {
                status: 500
            });
        }
    } catch (err) {
        console.error(err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Server error'
        }, {
            status: 500
        });
    }
}
async function GET(req) {
    try {
        // admin-only: requires token cookie
        const token = getTokenFromHeaders(req);
        const secret = process.env.JWT_SECRET || 'dev-secret';
        if (!token) return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        let payload = null;
        try {
            payload = __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, secret);
        } catch (e) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        if (payload.role !== 'admin') return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Forbidden'
        }, {
            status: 403
        });
        const url = new URL(req.url);
        const eventId = url.searchParams.get('eventId');
        if (!eventId) return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing eventId'
        }, {
            status: 400
        });
        await ensureTable();
        const rows = await prisma.$queryRawUnsafe(`SELECT id, ref, event_id as eventId, name, email, phone, created_at as "createdAt" FROM event_signups WHERE event_id = $1 ORDER BY created_at DESC`, eventId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            signups: rows
        });
    } catch (err) {
        console.error(err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$jwrc$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1cc2b985._.js.map