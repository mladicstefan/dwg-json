module.exports = {

"[project]/.next-internal/server/app/api/models/[urn]/metadata/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/config.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "APS_BUCKET": (()=>APS_BUCKET),
    "APS_CLIENT": (()=>APS_CLIENT),
    "PORT": (()=>PORT)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/config.js [app-route] (ecmascript)");
;
const { APS_CLIENT_ID, APS_CLIENT_SECRET, APS_BUCKET: rawBucket, NEXT_PUBLIC_PORT } = process.env;
if (!APS_CLIENT_ID || !APS_CLIENT_SECRET) {
    console.error('MISSING APS CREDENTIALS');
    process.exit(1);
}
const PORT = NEXT_PUBLIC_PORT || '3000';
const APS_BUCKET = rawBucket || `${APS_CLIENT_ID.toLowerCase()}-projects`;
const APS_CLIENT = {
    id: APS_CLIENT_ID,
    secret: APS_CLIENT_SECRET
};
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/assert [external] (assert, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}}),
"[externals]/tty [external] (tty, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[project]/services/auth.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getInternalToken": (()=>getInternalToken),
    "getViewerToken": (()=>getViewerToken)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/config.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$authentication$2f$dist$2f$esm$2f$custom$2d$code$2f$authenticationClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aps_sdk/authentication/dist/esm/custom-code/authenticationClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$authentication$2f$dist$2f$esm$2f$model$2f$scopes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aps_sdk/authentication/dist/esm/model/scopes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/config.ts [app-route] (ecmascript)");
;
;
;
const authClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$authentication$2f$dist$2f$esm$2f$custom$2d$code$2f$authenticationClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AuthenticationClient"]();
async function getViewerToken() {
    const creds = await authClient.getTwoLeggedToken(__TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APS_CLIENT"].id, __TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APS_CLIENT"].secret, [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$authentication$2f$dist$2f$esm$2f$model$2f$scopes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Scopes"].ViewablesRead
    ]);
    return creds.access_token;
}
async function getInternalToken() {
    const creds = await authClient.getTwoLeggedToken(__TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APS_CLIENT"].id, __TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APS_CLIENT"].secret, [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$authentication$2f$dist$2f$esm$2f$model$2f$scopes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Scopes"].DataRead,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$authentication$2f$dist$2f$esm$2f$model$2f$scopes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Scopes"].DataWrite,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$authentication$2f$dist$2f$esm$2f$model$2f$scopes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Scopes"].DataCreate,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$authentication$2f$dist$2f$esm$2f$model$2f$scopes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Scopes"].BucketRead,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$authentication$2f$dist$2f$esm$2f$model$2f$scopes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Scopes"].BucketCreate
    ]);
    return creds.access_token;
}
}}),
"[project]/services/aps.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ensureBucketExists": (()=>ensureBucketExists),
    "getAllProperties": (()=>getAllProperties),
    "getManifest": (()=>getManifest),
    "getObjectTree": (()=>getObjectTree),
    "listModelViews": (()=>listModelViews),
    "listObjects": (()=>listObjects),
    "queryProperties": (()=>queryProperties),
    "translateObject": (()=>translateObject),
    "uploadObject": (()=>uploadObject),
    "urnify": (()=>urnify)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/config.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$model$2d$derivative$2f$dist$2f$esm$2f$custom$2d$code$2f$modelDerivativeClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aps_sdk/model-derivative/dist/esm/custom-code/modelDerivativeClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$oss$2f$dist$2f$esm$2f$custom$2d$code$2f$ossClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aps_sdk/oss/dist/esm/custom-code/ossClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$oss$2f$dist$2f$esm$2f$model$2f$region$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aps_sdk/oss/dist/esm/model/region.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$oss$2f$dist$2f$esm$2f$model$2f$policyKey$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aps_sdk/oss/dist/esm/model/policyKey.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/auth.ts [app-route] (ecmascript)");
;
;
;
;
;
const BASE_URL = 'https://developer.api.autodesk.com';
const derivativeClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$model$2d$derivative$2f$dist$2f$esm$2f$custom$2d$code$2f$modelDerivativeClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModelDerivativeClient"]();
const ossClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$oss$2f$dist$2f$esm$2f$custom$2d$code$2f$ossClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OssClient"]();
async function ensureBucketExists(bucketKey) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInternalToken"])();
    try {
        await ossClient.getBucketDetails(bucketKey, {
            accessToken: token
        });
    } catch (err) {
        if (err.axiosError?.response?.status === 404) {
            await ossClient.createBucket(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$oss$2f$dist$2f$esm$2f$model$2f$region$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Region"].Us, {
                bucketKey,
                policyKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aps_sdk$2f$oss$2f$dist$2f$esm$2f$model$2f$policyKey$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PolicyKey"].Temporary
            }, {
                accessToken: token
            });
        } else {
            throw err;
        }
    }
}
async function listObjects() {
    await ensureBucketExists(__TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APS_BUCKET"]);
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInternalToken"])();
    let resp = await ossClient.getObjects(__TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APS_BUCKET"], {
        limit: 64,
        accessToken: token
    });
    let items = resp.items;
    while(resp.next){
        const startAt = new URL(resp.next).searchParams.get("startAt");
        resp = await ossClient.getObjects(__TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APS_BUCKET"], {
            limit: 64,
            accessToken: token
        });
        items = items.concat(resp.items);
    }
    return items;
}
async function uploadObject(objectName, filePath) {
    await ensureBucketExists(__TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APS_BUCKET"]);
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInternalToken"])();
    return await ossClient.uploadObject(__TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APS_BUCKET"], objectName, filePath, {
        accessToken: token
    });
}
async function getManifest(urn) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInternalToken"])();
    try {
        return await derivativeClient.getManifest(urn, {
            accessToken: token
        });
    } catch (err) {
        if (err.axiosError?.response?.status === 404) return null;
        throw err;
    }
}
function urnify(id) {
    return Buffer.from(id).toString('base64').replace(/=/g, '');
}
async function translateObject(urn, rootFilename) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInternalToken"])();
    const body = {
        input: {
            urn
        }
    };
    if (rootFilename) body.input.rootFilename = rootFilename;
    body.output = {
        formats: [
            {
                type: 'svf2',
                views: [
                    '2d',
                    '3d'
                ]
            }
        ]
    };
    const res = await fetch(`${BASE_URL}/modelderivative/v2/designdata/job`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        throw new Error(`translateObject failed: ${res.statusText}`);
    }
}
async function listModelViews(urn) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInternalToken"])();
    const res = await fetch(`${BASE_URL}/modelderivative/v2/designdata/${urn}/metadata`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) {
        throw new Error(`listModelViews failed: ${res.statusText}`);
    }
    const { data } = await res.json();
    return data.metadata;
}
async function getObjectTree(urn, modelGuid, objectId) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInternalToken"])();
    let url = `${BASE_URL}/modelderivative/v2/designdata/${urn}/metadata/${modelGuid}`;
    if (objectId != null) url += `?${objectId}`;
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) {
        throw new Error(`getObjectTree failed: ${res.statusText}`);
    }
    return res.json();
}
async function getAllProperties(urn, modelGuid) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInternalToken"])();
    const res = await fetch(`${BASE_URL}/modelderivative/v2/designdata/${urn}/metadata/${modelGuid}/properties`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) {
        throw new Error(`getAllProperties failed: ${res.statusText}`);
    }
    return res.json();
}
async function queryProperties(urn, modelGuid, objectIds, propCategories) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInternalToken"])();
    const body = {
        objectIds,
        propFilter: {
            categories: propCategories
        }
    };
    const res = await fetch(`${BASE_URL}/modelderivative/v2/designdata/${urn}/metadata/${modelGuid}/properties:query`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        throw new Error(`queryProperties failed: ${res.statusText}`);
    }
    return res.json();
}
}}),
"[project]/app/api/models/[urn]/metadata/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$aps$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/aps.ts [app-route] (ecmascript)");
;
;
async function GET(_req, context) {
    const { urn } = await context.params;
    try {
        const manifest = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$aps$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getManifest"])(urn);
        console.log('📝 Full Manifest:', JSON.stringify(manifest, null, 2));
        if (manifest.progress !== 'complete' || manifest.status !== 'success') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: manifest.progress || manifest.status
            }, {
                status: 202
            });
        }
        const views = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$aps$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listModelViews"])(urn);
        console.log('🗂️ Model Views:', JSON.stringify(views, null, 2));
        const results = {};
        for (const { guid, name, role } of views){
            let tree;
            do {
                tree = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$aps$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getObjectTree"])(urn, guid);
            }while (!tree.data || !Array.isArray(tree.data.objects))
            console.log(`🌲 Object Tree [${guid} - ${role}/${name}]:`, JSON.stringify(tree.data.objects, null, 2));
            let props;
            do {
                props = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$aps$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllProperties"])(urn, guid);
            }while (!props.data || !Array.isArray(props.data.collection))
            console.log(`📋 Properties [${guid} - ${role}/${name}]:`, JSON.stringify(props.data.collection, null, 2));
            results[guid] = {
                viewName: name,
                viewRole: role,
                objects: tree.data.objects,
                properties: props.data.collection
            };
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            manifest,
            views,
            results
        });
    } catch (error) {
        console.error('❌ Error extracting metadata for URN', urn, error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__93119523._.js.map