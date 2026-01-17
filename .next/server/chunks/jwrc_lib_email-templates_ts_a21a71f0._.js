module.exports=[35284,e=>{"use strict";function t(e,t,o,r,i){let a=process.env.SITE_NAME||"Jesus Worship and Restoration Church",n=process.env.NEXT_PUBLIC_URL||"http://localhost:3000";return{subject:`Event Registration Confirmed: ${t}`,html:`
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
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${a}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">Thank You for Registering!</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${e},
              </p>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We're excited to confirm your registration for <strong>${t}</strong>.
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">Event Details</h3>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Event:</strong> ${t}</p>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Date & Time:</strong> ${o}</p>
                ${r?`<p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Location:</strong> ${r}</p>`:""}
                ${i?`<p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Reference Number:</strong> <code style="background-color: #e9ecef; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${i}</code></p>`:""}
              </div>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                We look forward to seeing you there! If you have any questions or need to make changes to your registration, please don't hesitate to contact us at <strong>0715377835</strong>.
              </p>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                "For where two or three gather in my name, there am I with them." - Matthew 18:20
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${n}/events" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">View All Events</a>
              </div>
              
              <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; border-top: 1px solid #eeeeee; padding-top: 20px;">
                Blessings,<br>
                <strong>The ${a} Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
        <p style="margin: 0;">This is an automated confirmation email. Please do not reply to this message.</p>
        <p style="margin: 5px 0 0 0;">\xa9 ${new Date().getFullYear()} ${a}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,text:`
Thank You for Registering!

Dear ${e},

We're excited to confirm your registration for ${t}.

Event Details:
- Event: ${t}
- Date & Time: ${o}
${r?`- Location: ${r}
`:""}${i?`- Reference Number: ${i}
`:""}

We look forward to seeing you there! If you have any questions or need to make changes to your registration, please don't hesitate to contact us at 0715377835.

"For where two or three gather in my name, there am I with them." - Matthew 18:20

View all events: ${n}/events

Blessings,
The ${a} Team

---
This is an automated confirmation email. Please do not reply to this message.
\xa9 ${new Date().getFullYear()} ${a}. All rights reserved.
    `.trim()}}function o(e,t,o,r,i,a){let n=process.env.SITE_NAME||"Jesus Worship and Restoration Church";return process.env.NEXT_PUBLIC_URL,{subject:`Your Event Ticket: ${t}`,html:`
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
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${n}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">🎟️ Your Event Ticket</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${e},
              </p>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Here is your digital ticket for <strong>${t}</strong>. Please present this QR code at the event entrance for check-in.
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">Event Details</h3>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Event:</strong> ${t}</p>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Date & Time:</strong> ${o}</p>
                ${r?`<p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Location:</strong> ${r}</p>`:""}
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Ticket Ref:</strong> <code style="background-color: #e9ecef; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${i}</code></p>
              </div>
              
              <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #ffffff; border: 2px dashed #667eea; border-radius: 8px;">
                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Your QR Code Ticket</h3>
                <img src="${a}" alt="Event Ticket QR Code" style="width: 250px; height: 250px; margin: 0 auto; display: block;" />
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
                <strong>The ${n} Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
        <p style="margin: 0;">This is your event ticket. Please save this email.</p>
        <p style="margin: 5px 0 0 0;">\xa9 ${new Date().getFullYear()} ${n}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,text:`
Your Event Ticket

Dear ${e},

Here is your digital ticket for ${t}. Please present this QR code at the event entrance for check-in.

Event Details:
- Event: ${t}
- Date & Time: ${o}
${r?`- Location: ${r}
`:""}
- Ticket Ref: ${i}

⚠️ IMPORTANT: Save this email or take a screenshot. You'll need the QR code to check in at the event.

We're looking forward to seeing you! If you have any questions, please contact us at 0715377835.

"For where two or three gather in my name, there am I with them." - Matthew 18:20

Blessings,
The ${n} Team

---
This is your event ticket. Please save this email.
\xa9 ${new Date().getFullYear()} ${n}. All rights reserved.
    `.trim()}}function r(e,t){let o=process.env.SITE_NAME||"Jesus Worship and Restoration Church",r=process.env.NEXT_PUBLIC_URL||"http://localhost:3000";return{subject:`Volunteer Application Received: ${t}`,html:`
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
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${o}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">Thank You for Your Interest in Volunteering!</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${e},
              </p>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We have received your volunteer application for <strong>${t}</strong>. We are truly grateful for your willingness to serve our church community.
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">Application Details</h3>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Position:</strong> ${t}</p>
                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Status:</strong> <span style="color: #ff9800;">Pending Review</span></p>
              </div>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Our team will review your application and get back to you soon. We appreciate your patience as we carefully consider each application. If you have any questions, please contact us at <strong>0715377835</strong>.
              </p>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms." - 1 Peter 4:10
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${r}/dashboard" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">View Your Dashboard</a>
              </div>
              
              <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; border-top: 1px solid #eeeeee; padding-top: 20px;">
                Blessings,<br>
                <strong>The ${o} Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
        <p style="margin: 0;">This is an automated confirmation email. Please do not reply to this message.</p>
        <p style="margin: 5px 0 0 0;">\xa9 ${new Date().getFullYear()} ${o}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,text:`
Thank You for Your Interest in Volunteering!

Dear ${e},

We have received your volunteer application for ${t}. We are truly grateful for your willingness to serve our church community.

Application Details:
- Position: ${t}
- Status: Pending Review

Our team will review your application and get back to you soon. We appreciate your patience as we carefully consider each application. If you have any questions, please contact us at 0715377835.

"Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms." - 1 Peter 4:10

View your dashboard: ${r}/dashboard

Blessings,
The ${o} Team

---
This is an automated confirmation email. Please do not reply to this message.
\xa9 ${new Date().getFullYear()} ${o}. All rights reserved.
    `.trim()}}function i(e,t){let o=process.env.SITE_NAME||"Jesus Worship and Restoration Church",r=process.env.NEXT_PUBLIC_URL||"http://localhost:3000",i={suggestion:"Suggestion",complaint:"Complaint",praise:"Praise",question:"Question"}[t]||"Feedback";return{subject:`Thank You for Your ${i}`,html:`
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
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${o}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">Thank You for Your ${i}!</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                ${e?`Dear ${e},`:"Hello,"}
              </p>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We have received your ${i.toLowerCase()}. Thank you for sharing your thoughts — we will review your message and follow up when necessary.
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">What Happens Next?</h3>
                <p style="color: #666666; font-size: 14px; margin: 5px 0; line-height: 1.6;">
                  Our team will carefully review your ${i.toLowerCase()} and respond as appropriate. We take all feedback seriously and use it to make our community stronger. If you have any questions, please contact us at <strong>0715377835</strong>.
                </p>
              </div>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." - Galatians 6:9
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${r}/dashboard" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">View Your Dashboard</a>
              </div>
              
              <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; border-top: 1px solid #eeeeee; padding-top: 20px;">
                Blessings,<br>
                <strong>The ${o} Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
        <p style="margin: 0;">This is an automated confirmation email. Please do not reply to this message.</p>
        <p style="margin: 5px 0 0 0;">\xa9 ${new Date().getFullYear()} ${o}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,text:`
Thank You for Your ${i}!

${e?`Dear ${e},`:"Hello,"}

We have received your ${i.toLowerCase()}. Thank you for sharing your thoughts — we will review your message and follow up when necessary.

What Happens Next?
Our team will carefully review your ${i.toLowerCase()} and respond as appropriate. We take all feedback seriously and use it to make our community stronger. If you have any questions, please contact us at 0715377835.

"Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." - Galatians 6:9

View your dashboard: ${r}/dashboard

Blessings,
The ${o} Team

---
This is an automated confirmation email. Please do not reply to this message.
\xa9 ${new Date().getFullYear()} ${o}. All rights reserved.
    `.trim()}}function a(e,t,o,r){let i=process.env.SITE_NAME||"Jesus Worship and Restoration Church";process.env.NEXT_PUBLIC_URL;let a=r?r[0].toUpperCase()+r.slice(1):"Feedback";return{subject:`Response to your ${a} from ${i}`,html:`${t.replace(/\n/g,"<br/>")}`,text:`${t}`.trim()}}function n(e,t){let o=process.env.SITE_NAME||"Jesus Worship and Restoration Church",r=process.env.NEXT_PUBLIC_URL||"http://localhost:3000";return{subject:`Verify Your Email Address - ${o}`,html:`
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
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${o}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">Welcome! Verify Your Email</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${e},
              </p>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for signing up for ${o}. To complete your registration and secure your account, please verify your email address using the code below.
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Your Verification Code</h3>
                <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                  Enter this code on the verification page:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                  <div style="background-color: #ffffff; border: 2px dashed #667eea; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 28px; font-weight: bold; color: #667eea; letter-spacing: 5px;">
                    ${t}
                  </div>
                </div>
                <p style="color: #999999; font-size: 13px; margin: 15px 0 0 0;">
                  This code will expire in 30 minutes.
                </p>
              </div>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                If you didn't create an account with us, please ignore this email. If you have any questions, please contact us at <strong>0715377835</strong> or reply to this email.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${r}/verify-email" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">Verify Email</a>
              </div>
              
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                "Trust in the Lord with all your heart." - Proverbs 3:5
              </p>
              
              <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; border-top: 1px solid #eeeeee; padding-top: 20px;">
                Blessings,<br>
                <strong>The ${o} Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
        <p style="margin: 0;">This is an automated verification email. Please do not reply to this message.</p>
        <p style="margin: 5px 0 0 0;">\xa9 ${new Date().getFullYear()} ${o}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,text:`
Welcome! Verify Your Email

Dear ${e},

Thank you for signing up for ${o}. To complete your registration and secure your account, please verify your email address using the code below.

Your Verification Code:
${t}

This code will expire in 30 minutes.

If you didn't create an account with us, please ignore this email. If you have any questions, please contact us at 0715377835 or reply to this email.

Verify your email: ${r}/verify-email

"Trust in the Lord with all your heart." - Proverbs 3:5

Blessings,
The ${o} Team

---
This is an automated verification email. Please do not reply to this message.
\xa9 ${new Date().getFullYear()} ${o}. All rights reserved.
    `.trim()}}e.s(["getEmailVerificationEmail",()=>n,"getEventSignupConfirmationEmail",()=>t,"getEventTicketEmail",()=>o,"getSuggestionConfirmationEmail",()=>i,"getSuggestionResponseEmail",()=>a,"getVolunteerConfirmationEmail",()=>r])}];

//# sourceMappingURL=jwrc_lib_email-templates_ts_a21a71f0._.js.map