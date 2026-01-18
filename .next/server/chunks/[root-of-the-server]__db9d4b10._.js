module.exports=[70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},88947,(e,t,r)=>{t.exports=e.x("stream",()=>require("stream"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},6461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},7925,e=>{"use strict";var t=e.i(51004),r=e.i(32070),a=e.i(839),o=e.i(11444),n=e.i(29214),s=e.i(40457),i=e.i(89575),l=e.i(55350),u=e.i(52117),d=e.i(93183),p=e.i(81124),c=e.i(24294),h=e.i(68345),m=e.i(1742),x=e.i(49174),g=e.i(93695);e.i(50821);var v=e.i(31158),y=e.i(40295),f=e.i(25343);async function w(e){try{let t,{email:r,name:a}=await e.json()||{};if(!r)return y.NextResponse.json({error:"Email is required"},{status:400});if(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS)t=f.default.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT)||587,secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});else{let e=await f.default.createTestAccount();t=f.default.createTransport({host:"smtp.ethereal.email",port:587,secure:!1,auth:{user:e.user,pass:e.pass}})}let o=a||"Member",n=await t.sendMail({from:process.env.SMTP_FROM||'"Church Community" <noreply@church.org>',to:r,subject:"Welcome to Our Church Community! 🙏",html:`
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
      `});return process.env.SMTP_HOST||console.log("Preview URL: %s",f.default.getTestMessageUrl(n)),y.NextResponse.json({success:!0,messageId:n.messageId,previewUrl:f.default.getTestMessageUrl(n)||void 0})}catch(e){return console.error("Email sending error:",e),y.NextResponse.json({error:"Failed to send email"},{status:500})}}e.s(["POST",()=>w,"dynamic",0,"force-dynamic"],35520);var R=e.i(35520);let b=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/auth/send-welcome-email/route",pathname:"/api/auth/send-welcome-email",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/jwrc/app/api/auth/send-welcome-email/route.ts",nextConfigOutput:"",userland:R}),{workAsyncStorage:T,workUnitAsyncStorage:C,serverHooks:E}=b;function S(){return(0,a.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:C})}async function P(e,t,a){b.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/auth/send-welcome-email/route";y=y.replace(/\/index$/,"")||"/";let f=await b.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!f)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:w,params:R,nextConfig:T,parsedUrl:C,isDraftMode:E,prerenderManifest:S,routerServerContext:P,isOnDemandRevalidate:k,revalidateOnlyGenerated:_,resolvedPathname:A,clientReferenceManifest:O,serverActionsManifest:q}=f,M=(0,i.normalizeAppPath)(y),N=!!(S.dynamicRoutes[M]||S.routes[A]),j=async()=>((null==P?void 0:P.render404)?await P.render404(e,t,C,!1):t.end("This page could not be found"),null);if(N&&!E){let e=!!S.routes[A],t=S.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(T.experimental.adapterPath)return await j();throw new g.NoFallbackError}}let U=null;!N||b.isDev||E||(U="/index"===(U=A)?"/":U);let H=!0===b.isDev||!N,I=N&&!H;q&&O&&(0,s.setManifestsSingleton)({page:y,clientReferenceManifest:O,serverActionsManifest:q});let D=e.method||"GET",F=(0,n.getTracer)(),$=F.getActiveScopeSpan(),L={params:R,prerenderManifest:S,renderOpts:{experimental:{authInterrupts:!!T.experimental.authInterrupts},cacheComponents:!!T.cacheComponents,supportsDynamicResponse:H,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:T.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,o)=>b.onRequestError(e,t,a,o,P)},sharedContext:{buildId:w}},B=new l.NodeNextRequest(e),W=new l.NodeNextResponse(t),K=u.NextRequestAdapter.fromNodeNextRequest(B,(0,u.signalFromNodeResponse)(t));try{let s=async e=>b.handle(K,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${D} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${D} ${y}`)}),i=!!(0,o.getRequestMeta)(e,"minimalMode"),l=async o=>{var n,l;let u=async({previousCacheEntry:r})=>{try{if(!i&&k&&_&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await s(o);e.fetchMetrics=L.renderOpts.fetchMetrics;let l=L.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let u=L.renderOpts.collectedTags;if(!N)return await (0,c.sendResponse)(B,W,n,L.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(n.headers);u&&(t[x.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=x.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,a=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=x.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:I,isOnDemandRevalidate:k})},!1,P),t}},d=await b.handleResponse({req:e,nextConfig:T,cacheKey:U,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:k,revalidateOnlyGenerated:_,responseGenerator:u,waitUntil:a.waitUntil,isMinimalMode:i});if(!N)return null;if((null==d||null==(n=d.value)?void 0:n.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",k?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let g=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return i&&N||g.delete(x.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||g.get("Cache-Control")||g.set("Cache-Control",(0,m.getCacheControlHeader)(d.cacheControl)),await (0,c.sendResponse)(B,W,new Response(d.value.body,{headers:g,status:d.value.status||200})),null};$?await l($):await F.withPropagatedContext(e.headers,()=>F.trace(d.BaseServerSpan.handleRequest,{spanName:`${D} ${y}`,kind:n.SpanKind.SERVER,attributes:{"http.method":D,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:I,isOnDemandRevalidate:k})},!1,P),N)throw t;return await (0,c.sendResponse)(B,W,new Response(null,{status:500})),null}}e.s(["handler",()=>P,"patchFetch",()=>S,"routeModule",()=>b,"serverHooks",()=>E,"workAsyncStorage",()=>T,"workUnitAsyncStorage",()=>C],7925)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__db9d4b10._.js.map