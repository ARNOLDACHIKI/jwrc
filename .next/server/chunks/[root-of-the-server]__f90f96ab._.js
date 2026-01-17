module.exports=[70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},88947,(e,t,r)=>{t.exports=e.x("stream",()=>require("stream"))},22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},6461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},17640,e=>{"use strict";var t=e.i(61944),r=e.i(67168),a=e.i(54557),o=e.i(27507),n=e.i(57713),s=e.i(45926),i=e.i(77673),l=e.i(13479),u=e.i(84380),d=e.i(67986),p=e.i(95353),c=e.i(71179),h=e.i(57811),m=e.i(3400),x=e.i(80489),g=e.i(33750),v=e.i(93695);e.i(99110);var f=e.i(74517),y=e.i(16153),w=e.i(25343);async function R(e){try{let t,{email:r,name:a}=await e.json()||{};if(!r)return y.NextResponse.json({error:"Email is required"},{status:400});if(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS)t=w.default.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT)||587,secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});else{let e=await w.default.createTestAccount();t=w.default.createTransport({host:"smtp.ethereal.email",port:587,secure:!1,auth:{user:e.user,pass:e.pass}})}let o=a||"Member",n=await t.sendMail({from:process.env.SMTP_FROM||'"Church Community" <noreply@church.org>',to:r,subject:"Welcome to Our Church Community! 🙏",html:`
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
      `});return process.env.SMTP_HOST||console.log("Preview URL: %s",w.default.getTestMessageUrl(n)),y.NextResponse.json({success:!0,messageId:n.messageId,previewUrl:w.default.getTestMessageUrl(n)||void 0})}catch(e){return console.error("Email sending error:",e),y.NextResponse.json({error:"Failed to send email"},{status:500})}}e.s(["POST",()=>R,"dynamic",0,"force-dynamic"],35520);var b=e.i(35520);let T=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/auth/send-welcome-email/route",pathname:"/api/auth/send-welcome-email",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/jwrc/app/api/auth/send-welcome-email/route.ts",nextConfigOutput:"",userland:b}),{workAsyncStorage:C,workUnitAsyncStorage:E,serverHooks:S}=T;function P(){return(0,a.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:E})}async function k(e,t,a){T.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/auth/send-welcome-email/route";y=y.replace(/\/index$/,"")||"/";let w=await T.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,params:b,nextConfig:C,parsedUrl:E,isDraftMode:S,prerenderManifest:P,routerServerContext:k,isOnDemandRevalidate:_,revalidateOnlyGenerated:A,resolvedPathname:M,clientReferenceManifest:O,serverActionsManifest:q}=w,N=(0,l.normalizeAppPath)(y),j=!!(P.dynamicRoutes[N]||P.routes[M]),U=async()=>((null==k?void 0:k.render404)?await k.render404(e,t,E,!1):t.end("This page could not be found"),null);if(j&&!S){let e=!!P.routes[M],t=P.dynamicRoutes[N];if(t&&!1===t.fallback&&!e){if(C.experimental.adapterPath)return await U();throw new v.NoFallbackError}}let H=null;!j||T.isDev||S||(H="/index"===(H=M)?"/":H);let I=!0===T.isDev||!j,D=j&&!I;q&&O&&(0,s.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:O,serverActionsManifest:q,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:q})});let F=e.method||"GET",$=(0,n.getTracer)(),L=$.getActiveScopeSpan(),B={params:b,prerenderManifest:P,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:I,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:C.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>T.onRequestError(e,t,a,k)},sharedContext:{buildId:R}},W=new u.NodeNextRequest(e),K=new u.NodeNextResponse(t),Y=d.NextRequestAdapter.fromNodeNextRequest(W,(0,d.signalFromNodeResponse)(t));try{let s=async e=>T.handle(Y,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=$.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${F} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${F} ${y}`)}),i=!!(0,o.getRequestMeta)(e,"minimalMode"),l=async o=>{var n,l;let u=async({previousCacheEntry:r})=>{try{if(!i&&_&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await s(o);e.fetchMetrics=B.renderOpts.fetchMetrics;let l=B.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let u=B.renderOpts.collectedTags;if(!j)return await (0,h.sendResponse)(W,K,n,B.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(n.headers);u&&(t[g.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,a=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:_})},k),t}},d=await T.handleResponse({req:e,nextConfig:C,cacheKey:H,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:P,isRoutePPREnabled:!1,isOnDemandRevalidate:_,revalidateOnlyGenerated:A,responseGenerator:u,waitUntil:a.waitUntil,isMinimalMode:i});if(!j)return null;if((null==d||null==(n=d.value)?void 0:n.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",_?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,m.fromNodeOutgoingHttpHeaders)(d.value.headers);return i&&j||p.delete(g.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,x.getCacheControlHeader)(d.cacheControl)),await (0,h.sendResponse)(W,K,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};L?await l(L):await $.withPropagatedContext(e.headers,()=>$.trace(p.BaseServerSpan.handleRequest,{spanName:`${F} ${y}`,kind:n.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},l))}catch(t){if(t instanceof v.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:N,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:_})}),j)throw t;return await (0,h.sendResponse)(W,K,new Response(null,{status:500})),null}}e.s(["handler",()=>k,"patchFetch",()=>P,"routeModule",()=>T,"serverHooks",()=>S,"workAsyncStorage",()=>C,"workUnitAsyncStorage",()=>E],17640)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__f90f96ab._.js.map