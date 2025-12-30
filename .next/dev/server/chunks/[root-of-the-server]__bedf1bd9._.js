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
"[project]/app/api/donations/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
async function ensureTable() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeExecute"])(`
    CREATE TABLE IF NOT EXISTS donations (
      id SERIAL PRIMARY KEY,
      amount NUMERIC,
      currency TEXT,
      kes_amount INTEGER,
      method TEXT,
      donor_name TEXT,
      donor_email TEXT,
      note TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )
  `);
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
        const { amount, currency, kesAmount, method, donor } = body || {};
        if (!amount || !method) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing amount or method'
        }, {
            status: 400
        });
        await ensureTable();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeExecute"])(`INSERT INTO donations (amount, currency, kes_amount, method, donor_name, donor_email, note, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())`, amount, currency || 'USD', kesAmount || null, method, donor?.name || null, donor?.email || null, body?.note || null);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
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
async function GET() {
    try {
        await ensureTable();
        await ensureMpesaTable();
        const manual = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeQuery"])(`SELECT id, amount, currency, kes_amount, method, donor_name, donor_email, note, created_at
       FROM donations
       ORDER BY created_at DESC
       LIMIT 200`);
        const mpesa = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeQuery"])(`SELECT id, amount, phone, account_reference, transaction_desc, merchant_request_id, checkout_request_id,
              response_code, response_description, provider_response, mpesa_transaction_id, status,
              created_at, updated_at
       FROM mpesa_donations
       ORDER BY created_at DESC
       LIMIT 200`);
        const normalizeAmount = (val)=>{
            const n = Number(val);
            return Number.isFinite(n) ? n : 0;
        };
        const rows = [
            ...manual.map((d)=>({
                    id: `manual-${d.id}`,
                    type: 'manual',
                    amount: normalizeAmount(d.amount || d.kes_amount),
                    currency: d.currency || 'KES',
                    method: d.method || 'mpesa',
                    donorName: d.donor_name || 'Anonymous',
                    donorEmail: d.donor_email || null,
                    note: d.note || null,
                    status: 'recorded',
                    createdAt: d.created_at
                })),
            ...mpesa.map((d)=>({
                    id: `mpesa-${d.id}`,
                    type: 'mpesa',
                    amount: normalizeAmount(d.amount),
                    currency: 'KES',
                    method: 'mpesa',
                    phone: d.phone,
                    accountReference: d.account_reference,
                    checkoutRequestId: d.checkout_request_id,
                    merchantRequestId: d.merchant_request_id,
                    mpesaReceipt: d.mpesa_transaction_id,
                    providerResponse: d.provider_response,
                    status: d.status || 'pending',
                    createdAt: d.created_at,
                    updatedAt: d.updated_at,
                    description: d.transaction_desc,
                    responseCode: d.response_code,
                    responseDescription: d.response_description
                }))
        ].sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            donations: rows
        });
    } catch (e) {
        console.error('donations GET error', e?.message || e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bedf1bd9._.js.map