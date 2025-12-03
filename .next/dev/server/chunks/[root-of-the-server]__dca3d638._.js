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
"[project]/app/api/mpesa/stk/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
const SANDBOX_BASE = 'https://sandbox.safaricom.co.ke';
const LIVE_BASE = 'https://api.safaricom.co.ke';
function formatTimestamp(d = new Date()) {
    const pad = (n)=>String(n).padStart(2, '0');
    return d.getFullYear().toString() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
}
async function getOAuthToken(baseUrl, key, secret) {
    const basic = Buffer.from(`${key}:${secret}`).toString('base64');
    const res = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        method: 'GET',
        headers: {
            Authorization: `Basic ${basic}`
        }
    });
    if (!res.ok) throw new Error(`OAuth request failed: ${res.status}`);
    return res.json();
}
async function ensureMpesaTable() {
    await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS mpesa_donations (
      id SERIAL PRIMARY KEY,
      amount NUMERIC,
      phone TEXT,
      account_reference TEXT,
      transaction_desc TEXT,
      merchant_request_id TEXT,
      checkout_request_id TEXT,
      response_code TEXT,
      response_description TEXT,
      provider_response JSONB,
      mpesa_transaction_id TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )
  `);
}
async function POST(req) {
    try {
        const body = await req.json().catch(()=>({}));
        const { phone, amount, accountReference, transactionDesc } = body || {};
        if (!phone || !amount) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing phone or amount'
        }, {
            status: 400
        });
        const env = process.env.MPESA_ENV || 'sandbox';
        const baseUrl = env === 'production' ? LIVE_BASE : SANDBOX_BASE;
        const consumerKey = process.env.MPESA_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
        let shortcode = process.env.MPESA_SHORTCODE;
        let passkey = process.env.MPESA_PASSKEY;
        const callbackUrl = process.env.MPESA_CALLBACK_URL || `${baseUrl}/` // fallback
        ;
        if (!consumerKey || !consumerSecret) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'MPESA consumer credentials not configured'
        }, {
            status: 500
        });
        // For local sandbox testing, many Daraja sandboxes use shortcode 174379 with a known passkey.
        // If running in sandbox and the configured shortcode/passkey appears to be a real Paybill
        // (e.g. 247247) that the sandbox does not recognise, fall back to the common sandbox
        // credentials to allow testing. In production do not override.
        if (env === 'sandbox') {
            const sandboxShortcode = '174379';
            const sandboxPasskey = 'bfb279f9aa9bdbcf1xxxxxxxxxxxxxxxxxxxxxxxxxxxx' // replace with actual sandbox passkey if you have it
            ;
            if (!shortcode || !passkey || shortcode === '247247') {
                console.warn('Using sandbox shortcode/passkey fallback for STK testing');
                shortcode = sandboxShortcode;
                passkey = sandboxPasskey;
            }
        }
        if (!shortcode || !passkey) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'MPESA shortcode or passkey not configured (and no sandbox fallback available)'
        }, {
            status: 500
        });
        await ensureMpesaTable();
        // create pending record before calling provider
        const inserted = await prisma.$queryRawUnsafe(`INSERT INTO mpesa_donations (amount, phone, account_reference, transaction_desc, status, created_at, updated_at) VALUES ($1,$2,$3,$4,'pending',NOW(),NOW()) RETURNING id`, amount, phone, accountReference || null, transactionDesc || null);
        const localId = inserted?.[0]?.id || null;
        // 1) Get OAuth token
        const oauth = await getOAuthToken(baseUrl, consumerKey, consumerSecret);
        const accessToken = oauth?.access_token;
        if (!accessToken) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to retrieve access token'
        }, {
            status: 500
        });
        // 2) Build password and timestamp
        const timestamp = formatTimestamp();
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
        const stkBody = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phone,
            PartyB: shortcode,
            PhoneNumber: phone,
            CallBackURL: callbackUrl,
            AccountReference: accountReference || String(phone),
            TransactionDesc: transactionDesc || 'Donation'
        };
        const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stkBody)
        });
        const data = await stkRes.json().catch(()=>({}));
        // update local record with provider response identifiers
        try {
            await prisma.$executeRawUnsafe(`UPDATE mpesa_donations SET merchant_request_id=$1, checkout_request_id=$2, response_code=$3, response_description=$4, provider_response=$5::jsonb, updated_at=NOW() WHERE id=$6`, data?.MerchantRequestID || data?.merchantRequestID || null, data?.CheckoutRequestID || data?.checkoutRequestID || null, data?.ResponseCode || data?.responseCode || null, data?.ResponseDescription || data?.responseDescription || null, JSON.stringify(data || {}), localId);
        } catch (e) {
            console.warn('Failed to update mpesa_donations with provider response', e);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            localId,
            provider: data
        }, {
            status: stkRes.ok ? 200 : 502
        });
    } catch (e) {
        console.error('STK Push error', e?.message || e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e?.message || 'Server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dca3d638._.js.map