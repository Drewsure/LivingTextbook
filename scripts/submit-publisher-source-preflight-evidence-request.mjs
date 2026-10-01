import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const MAX_REQUEST_BYTES = 2 * 1024 * 1024;
const options = parseArguments(process.argv.slice(2));
if (options.help) {
  printUsage();
  process.exit(0);
}
if (!options.request) fail("Missing --request.");

const token = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN?.trim();
if (!token) fail("LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN is required. No request was sent.");
const requestPath = resolve(options.request);
const requestStat = await stat(requestPath).catch(() => null);
if (!requestStat?.isFile()) fail(`Evidence request does not exist: ${requestPath}`);
if (requestStat.size > MAX_REQUEST_BYTES) fail("Evidence request exceeds the 2 MiB operator limit.");

let body;
try {
  body = JSON.parse(await readFile(requestPath, "utf8"));
} catch {
  fail("Evidence request JSON could not be parsed. No request was sent.");
}
validateRequest(body);

const baseUrl = readBaseUrl(options.baseUrl);
const endpoint = new URL("/api/teacher/uploads/source-preflight-evidence", baseUrl);
let response;
try {
  response = await fetch(endpoint, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ tenantId: body.tenantId, quarantineId: body.quarantineId, packageId: body.packageId, report: body.report }),
  });
} catch {
  fail(`The source-preflight evidence endpoint could not be reached at ${endpoint.origin}.`);
}

let payload;
try {
  payload = await response.json();
} catch {
  fail(`The source-preflight evidence endpoint returned a non-JSON response (${response.status}).`);
}
const result = {
  httpStatus: response.status,
  status: typeof payload?.status === "string" ? payload.status : "unknown",
  idempotent: payload?.idempotent === true,
  tenantId: body.tenantId,
  quarantineId: body.quarantineId,
  packageId: body.packageId,
  evidenceId: typeof payload?.record?.evidenceId === "string" ? payload.record.evidenceId : null,
  errors: Array.isArray(payload?.errors) ? payload.errors.filter((item) => typeof item === "string") : [],
  protectedActions: { packageAssemblyAllowed: false, packagePromotionAllowed: false, qrPrintAllowed: false, hostedPersistenceActivationAllowed: false, studentFacingUseAllowed: false },
};
console.log(JSON.stringify(result, null, 2));
if (result.status !== "recorded-review-only") process.exitCode = 2;

function validateRequest(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("Evidence request must be a JSON object.");
  if (!isSafeIdentity(value.tenantId) || !isSafeIdentity(value.quarantineId) || !isSafeIdentity(value.packageId)) fail("Evidence request tenant, quarantine, and package identities are unsafe or missing.");
  if (!value.quarantineId.startsWith("q-")) fail("Evidence request quarantine identity must use the q-<uuid> shape.");
  if (value.requestMode !== "review-only-source-preflight-evidence" || value.rawFilesIncluded !== false || value.uploadPerformed !== false) fail("Only the review-only metadata request shape is accepted. No raw files are sent.");
  if (value.packageAssemblyAllowed !== false || value.packagePromotionAllowed !== false || value.qrPrintAllowed !== false || value.hostedPersistenceActivationAllowed !== false || value.studentFacingUseAllowed !== false) fail("Protected actions must remain false.");
  if (!value.report || typeof value.report !== "object" || Array.isArray(value.report)) fail("Evidence request must contain a complete preflight report.");
}

function parseArguments(args) {
  const result = { request: "", baseUrl: "", help: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--request") result.request = args[++index] ?? "";
    else if (arg === "--base-url") result.baseUrl = args[++index] ?? "";
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

function readBaseUrl(value) {
  const candidate = value || process.env.LIVING_TEXTBOOOK_PUBLISHER_EVIDENCE_BASE_URL || "http://127.0.0.1:3000";
  let parsed;
  try { parsed = new URL(candidate); } catch { fail("The base URL must be an absolute http(s) URL."); }
  if (!parsed || !["http:", "https:"].includes(parsed.protocol)) fail("The base URL must use http or https.");
  return parsed.href.endsWith("/") ? parsed.href : `${parsed.href}/`;
}

function isSafeIdentity(value) { return typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(value); }
function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }
function printUsage() {
  console.log("Usage: node scripts/submit-publisher-source-preflight-evidence-request.mjs --request <request.json> [--base-url <http(s)://host:port>]\n\nSubmits only a tenant-bound, review-only source preflight report. Requires LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN. It never uploads raw publisher files, assembles, promotes, prints QR codes, activates persistence, or enables students.");
}
