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
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma,
    "safeExecute",
    ()=>safeExecute,
    "safeQuery",
    ()=>safeQuery
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const prisma = globalForPrisma.__prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.__prisma = prisma;
async function safeExecute(sql, ...params) {
    try {
        return await prisma.$executeRawUnsafe(sql, ...params);
    } catch (err) {
        console.warn('DB execute failed:', err?.message || err);
        return null;
    }
}
async function safeQuery(sql, ...params) {
    try {
        const rows = await prisma.$queryRawUnsafe(sql, ...params);
        return Array.isArray(rows) ? rows : rows ? [
            rows
        ] : [];
    } catch (err) {
        console.warn('DB query failed:', err?.message || err);
        return [];
    }
}
;
}),
"[project]/app/api/mpesa/stk/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
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
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeExecute"])(`
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
        // Normalize and validate phone number
        let normalizedPhone = String(phone).replace(/\D/g, '') // Remove non-digits
        ;
        // Handle different formats: 0712345678, 712345678, 254712345678, +254712345678
        if (normalizedPhone.startsWith('0')) {
            normalizedPhone = '254' + normalizedPhone.substring(1);
        } else if (normalizedPhone.startsWith('7') || normalizedPhone.startsWith('1')) {
            normalizedPhone = '254' + normalizedPhone;
        }
        // Validate format: Must be 254XXXXXXXXX (12 digits)
        if (!/^254\d{9}$/.test(normalizedPhone)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid phone number format. Use 254XXXXXXXXX (e.g., 254712345678)'
            }, {
                status: 400
            });
        }
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
            const sandboxPasskey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
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
        const inserted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeQuery"])(`INSERT INTO mpesa_donations (amount, phone, account_reference, transaction_desc, status, created_at, updated_at) VALUES ($1,$2,$3,$4,'pending',NOW(),NOW()) RETURNING id`, amount, normalizedPhone, accountReference || null, transactionDesc || null);
        const localId = inserted?.[0]?.id || null;
        // 1) Get OAuth token
        let oauth;
        try {
            oauth = await getOAuthToken(baseUrl, consumerKey, consumerSecret);
        } catch (oauthErr) {
            console.error('OAuth token fetch failed:', oauthErr?.message || oauthErr);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to get OAuth token from M-Pesa',
                details: oauthErr?.message
            }, {
                status: 502
            });
        }
        const accessToken = oauth?.access_token;
        if (!accessToken) {
            console.error('OAuth response missing access_token:', oauth);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to retrieve access token',
                oauth
            }, {
                status: 500
            });
        }
        // 2) Build password and timestamp
        const timestamp = formatTimestamp();
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
        const stkBody = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: normalizedPhone,
            PartyB: shortcode,
            PhoneNumber: normalizedPhone,
            CallBackURL: callbackUrl,
            AccountReference: accountReference || String(normalizedPhone),
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
        if (!stkRes.ok) {
            console.error('STK Push API failed:', {
                status: stkRes.status,
                statusText: stkRes.statusText,
                response: data
            });
        }
        // update local record with provider response identifiers
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeExecute"])(`UPDATE mpesa_donations SET merchant_request_id=$1, checkout_request_id=$2, response_code=$3, response_description=$4, provider_response=$5::jsonb, updated_at=NOW() WHERE id=$6`, data?.MerchantRequestID || data?.merchantRequestID || null, data?.CheckoutRequestID || data?.checkoutRequestID || null, data?.ResponseCode || data?.responseCode || null, data?.ResponseDescription || data?.responseDescription || null, JSON.stringify(data || {}), localId);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__812bfcc5._.js.map