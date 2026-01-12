export function getEventSignupConfirmationEmail(name: string, eventTitle: string, eventDate: string, eventLocation?: string, ref?: string) {
  const siteName = process.env.SITE_NAME || 'Jesus Worship and Restoration Church'
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  
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
  }
}

export function getVolunteerConfirmationEmail(name: string, roleTitle: string) {
  const siteName = process.env.SITE_NAME || 'Jesus Worship and Restoration Church'
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  
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
  }
}

export function getSuggestionConfirmationEmail(name: string, type: string) {
  const siteName = process.env.SITE_NAME || 'Jesus Worship and Restoration Church'
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  
  const typeLabels: Record<string, string> = {
    suggestion: 'Suggestion',
    complaint: 'Complaint',
    praise: 'Praise',
    question: 'Question'
  }
  
  const typeLabel = typeLabels[type] || 'Feedback'
  
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
  }
}

export function getSuggestionResponseEmail(name: string, response: string, responderName: string, type?: string) {
  const siteName = process.env.SITE_NAME || 'Jesus Worship and Restoration Church'
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const typeLabel = type ? (type[0].toUpperCase() + type.slice(1)) : 'Feedback'

  return {
    subject: `Response to your ${typeLabel} from ${siteName}`,
    // Send only the raw admin response as the email body (HTML/text).
    // The caller already provides the response text; we avoid wrapping it in a full template per user request.
    html: `${response.replace(/\n/g, '<br/>')}`,
    text: `${response}`.trim()
  }
}

