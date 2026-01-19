module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/jwrc/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/e3baf__pnpm_c7e738b0._.js",
  "chunks/[root-of-the-server]__b05b5a3a._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/jwrc/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];