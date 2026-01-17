(()=>{var e={};e.id=8549,e.ids=[8549],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},79646:e=>{"use strict";e.exports=require("child_process")},55511:e=>{"use strict";e.exports=require("crypto")},14985:e=>{"use strict";e.exports=require("dns")},94735:e=>{"use strict";e.exports=require("events")},29021:e=>{"use strict";e.exports=require("fs")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},91645:e=>{"use strict";e.exports=require("net")},21820:e=>{"use strict";e.exports=require("os")},33873:e=>{"use strict";e.exports=require("path")},27910:e=>{"use strict";e.exports=require("stream")},34631:e=>{"use strict";e.exports=require("tls")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},22370:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>g,routeModule:()=>l,serverHooks:()=>m,workAsyncStorage:()=>h,workUnitAsyncStorage:()=>d});var s={};r.r(s),r.d(s,{POST:()=>c,dynamic:()=>p});var o=r(62137),i=r(63654),n=r(48093),a=r(63e3),u=r(83040);let p="force-dynamic";async function c(e){try{let t;let{email:r,name:s}=await e.json()||{};if(!r)return a.NextResponse.json({error:"Email is required"},{status:400});if(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS)t=u.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT)||587,secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});else{let e=await u.createTestAccount();t=u.createTransport({host:"smtp.ethereal.email",port:587,secure:!1,auth:{user:e.user,pass:e.pass}})}let o=s||"Member",i=await t.sendMail({from:process.env.SMTP_FROM||'"Church Community" <noreply@church.org>',to:r,subject:"Welcome to Our Church Community! \uD83D\uDE4F",html:`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to Our Community!</h1>
          </div>
          <div class="content">
            <h2>Hello ${o}! 👋</h2>
            <p>Thank you for registering with our church community. We're thrilled to have you join us!</p>
            
            <p>Your account has been successfully created. You can now:</p>
            <ul>
              <li>View upcoming events and register to attend</li>
              <li>Read our latest sermons and announcements</li>
              <li>Make donations to support our mission</li>
              <li>Sign up to volunteer for various activities</li>
              <li>Participate in our community programs</li>
            </ul>

            <p>We're here to support you on your spiritual journey and help you connect with our community.</p>
            
            <div style="background: #fff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; font-style: italic;">
              <p style="margin: 0; color: #555; font-size: 15px;">
                "Yet a time is coming and has now come when the true worshipers will worship the Father in the Spirit and in truth, for they are the kind of worshipers the Father seeks."
              </p>
              <p style="margin: 10px 0 0 0; color: #667eea; font-weight: bold; text-align: right;">
                - John 4:23
              </p>
            </div>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/dashboard" class="button">
                Go to Dashboard
              </a>
            </center>

            <p>If you have any questions or need assistance, please don't hesitate to reach out to us.</p>
            
            <p>Blessings,<br>
            <strong>The Church Community Team</strong></p>
          </div>
          <div class="footer">
            <p>This email was sent because you registered an account with us.</p>
          </div>
        </body>
        </html>
      `,text:`
        Welcome to Our Church Community!
        
        Hello ${o}!
        
        Thank you for registering with our church community. We're thrilled to have you join us!
        
        Your account has been successfully created. You can now:
        - View upcoming events and register to attend
        - Read our latest sermons and announcements
        - Make donations to support our mission
        - Sign up to volunteer for various activities
        - Participate in our community programs
        
        We're here to support you on your spiritual journey and help you connect with our community.
        
        "Yet a time is coming and has now come when the true worshipers will worship the Father in the Spirit and in truth, for they are the kind of worshipers the Father seeks." - John 4:23
        
        Visit your dashboard: ${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/dashboard
        
        If you have any questions or need assistance, please don't hesitate to reach out to us.
        
        Blessings,
        The Church Community Team
      `});return process.env.SMTP_HOST||console.log("Preview URL: %s",u.getTestMessageUrl(i)),a.NextResponse.json({success:!0,messageId:i.messageId,previewUrl:u.getTestMessageUrl(i)||void 0})}catch(e){return console.error("Email sending error:",e),a.NextResponse.json({error:"Failed to send email"},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/auth/send-welcome-email/route",pathname:"/api/auth/send-welcome-email",filename:"route",bundlePath:"app/api/auth/send-welcome-email/route"},resolvedPagePath:"/home/lod/Downloads/jwrc/app/api/auth/send-welcome-email/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:h,workUnitAsyncStorage:d,serverHooks:m}=l;function g(){return(0,n.patchFetch)({workAsyncStorage:h,workUnitAsyncStorage:d})}},62290:()=>{},51674:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[5089,9862,3040],()=>r(22370));module.exports=s})();