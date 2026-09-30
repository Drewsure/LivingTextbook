import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const MAX_REQUEST_BYTES = 2 * 1024 * 1024;
const PREFLIGHT_PATH = "/api/teacher/delivery/local-package/preflight";
const ASSEMBLY_PATH = "/api/teacher/delivery/local-package";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  printUsage();
  process.exit(0);
}

if (!options.requestPath) fail("A request JSON path is required. Use --request <path>.");
if (options.mode === "assemble" && process.env.LIVING_TEXTBOOOK_OPERATOR_LOCAL_PACKAGE_WRITE_CONFIRMATION !== "ASSEMBLE_LOCAL_PACKAGE") {
  fail("Assembly requires LIVING_TEXTBOOOK_OPERATOR_LOCAL_PACKAGE_WRITE_CONFIRMATION=ASSEMBLE_LOCAL_PACKAGE. No request was sent.");
}

const token = process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN?.trim();
if (!token) fail("LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN is required. No request was sent.");

const requestPath = resolve(options.requestPath);
const requestStat = await stat(requestPath).catch(() => null);
if (!requestStat?.isFile()) fail(`Request JSON file does not exist: ${requestPath}`);
if (requestStat.size > MAX_REQUEST_BYTES) fail("Request JSON exceeds the 2 MiB operator limit.");

let body;
try {
  body = JSON.parse(await readFile(requestPath, "utf8"));
} catch {
  fail("Request JSON could not be parsed.");
}

const baseUrl = readBaseUrl(options.baseUrl);
const endpoint = new URL(options.mode === "assemble" ? ASSEMBLY_PATH : PREFLIGHT_PATH, baseUrl);
let response;
try {
  response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });
} catch {
  fail(`The local package operator endpoint could not be reached at ${endpoint.origin}.`);
}

let payload;
try {
  payload = await response.json();
} catch {
  fail(`The local package operator endpoint returned a non-JSON response (${response.status}).`);
}

const result = {
  mode: options.mode,
  httpStatus: response.status,
  status: readString(payload?.status) || "unknown",
  executionReady: payload?.executionReady === true,
  packageAssemblyAllowed: payload?.packageAssemblyAllowed === true,
  performedWrite: payload?.performedWrite === true,
  idempotent: payload?.idempotent === true,
  relativeDirectory: readString(payload?.relativeDirectory) || null,
  sourceFileCount: Number.isSafeInteger(payload?.sourceFileCount) ? payload.sourceFileCount : null,
  errors: Array.isArray(payload?.errors) ? payload.errors.filter((item) => typeof item === "string") : [],
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (options.mode === "preflight" && result.status !== "ready-for-assembly") process.exitCode = 2;
if (options.mode === "assemble" && !["accepted"].includes(result.status)) process.exitCode = 2;

function parseArguments(args) {
  const result = { mode: "preflight", requestPath: "", baseUrl: "", help: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--assemble") result.mode = "assemble";
    else if (arg === "--preflight") result.mode = "preflight";
    else if (arg === "--request") result.requestPath = args[++index] ?? "";
    else if (arg === "--base-url") result.baseUrl = args[++index] ?? "";
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

function readBaseUrl(value) {
  const candidate = value || process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_OPERATOR_BASE_URL || "http://127.0.0.1:3000";
  let parsed;
  try { parsed = new URL(candidate); } catch { fail("The operator base URL must be an absolute http(s) URL."); }
  if (!parsed || !["http:", "https:"].includes(parsed.protocol)) fail("The operator base URL must use http or https.");
  return parsed.href.endsWith("/") ? parsed.href : `${parsed.href}/`;
}

function readString(value) { return typeof value === "string" ? value : ""; }

function fail(message) {
  console.error(`ERROR ${message}`);
  process.exit(2);
}

function printUsage() {
  console.log(`Usage:\n  node scripts/run-local-package-operator.mjs --request <request.json> [--preflight]\n  node scripts/run-local-package-operator.mjs --request <request.json> --assemble\n\nDefaults to read-only preflight. Assembly additionally requires:\n  LIVING_TEXTBOOOK_OPERATOR_LOCAL_PACKAGE_WRITE_CONFIRMATION=ASSEMBLE_LOCAL_PACKAGE\n  LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN=<tenant-scoped operator token>\n\nOptional:\n  --base-url <http(s)://host:port>\n`);
}
