import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  printUsage();
  process.exit(0);
}

for (const [label, value] of Object.entries({ root: options.root, output: options.output, tenant: options.tenant, quarantine: options.quarantine })) {
  if (!value) fail(`Missing --${label.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}.`);
}
if (!isSafeIdentity(options.tenant) || !isSafeIdentity(options.quarantine)) fail("--tenant and --quarantine must use safe bounded identities.");
if (!options.quarantine.startsWith("q-")) fail("--quarantine must use the q-<uuid> quarantine identity shape.");

const root = resolve(options.root);
const outputPath = resolve(options.output);
if (!outputPath.toLowerCase().endsWith(".json")) fail("--output must point to a JSON file.");
try {
  await access(join(root, "publisher-source-manifest.json"));
} catch {
  fail(`Publisher source manifest was not found at ${join(root, "publisher-source-manifest.json")}.`);
}

const temporaryDirectory = await mkdtemp(join(tmpdir(), "living-textbook-source-evidence-request-"));
const reportPath = join(temporaryDirectory, "publisher-source-preflight.json");
try {
  const preflight = spawnSync(
    process.execPath,
    ["--experimental-strip-types", fileURLToPath(new URL("./publisher-source-preflight.mjs", import.meta.url))],
    { encoding: "utf8", env: { ...process.env, LIVING_TEXTBOOOK_PUBLISHER_SOURCE_DIRECTORY: root, LIVING_TEXTBOOOK_PUBLISHER_PREFLIGHT_OUTPUT: reportPath } },
  );
  if (preflight.status !== 0) fail(`Source preflight did not pass. No evidence request was written.\n${preflight.stdout}${preflight.stderr}`);

  const report = JSON.parse(await readFile(reportPath, "utf8"));
  if (report.inventoryStatus !== "complete" || report.packageAssemblyAllowed !== false || report.studentFacingUseAllowed !== false) fail("Only a complete, review-only, student-blocked source preflight can become an evidence request.");
  if (report.tenantId !== options.tenant) fail("The source manifest tenant does not match --tenant.");
  if (!isSafeIdentity(report.packageId)) fail("The source manifest package identity is not safe for an evidence request.");

  const request = {
    tenantId: options.tenant,
    quarantineId: options.quarantine,
    packageId: report.packageId,
    report,
    requestMode: "review-only-source-preflight-evidence",
    rawFilesIncluded: false,
    uploadPerformed: false,
    packageAssemblyAllowed: false,
    packagePromotionAllowed: false,
    qrPrintAllowed: false,
    hostedPersistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
  };
  try {
    await writeFile(outputPath, `${JSON.stringify(request, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  } catch {
    fail(`Could not create ${outputPath}. The command never overwrites an existing evidence request.`);
  }
  console.log(JSON.stringify({
    status: "evidence-request-created",
    requestPath: outputPath,
    tenantId: request.tenantId,
    quarantineId: request.quarantineId,
    packageId: request.packageId,
    reportId: report.reportId,
    sourceChecksumSha256: report.files.find((file) => file.kind === "textbook-source" && file.status === "verified")?.checksumSha256 ?? null,
    rawFilesIncluded: false,
    nextStep: "POST this JSON as the report body to /api/teacher/uploads/source-preflight-evidence with tenantId and quarantineId.",
  }, null, 2));
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

function parseArguments(args) {
  const result = { root: "", output: "", tenant: "", quarantine: "", help: false };
  const flags = new Map([["--root", "root"], ["--output", "output"], ["--tenant", "tenant"], ["--quarantine", "quarantine"]]);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (flags.has(arg)) result[flags.get(arg)] = args[++index] ?? "";
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

function isSafeIdentity(value) { return typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(value); }
function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }
function printUsage() {
  console.log("Usage: node scripts/create-publisher-source-preflight-evidence-request.mjs --root <completed-source-folder> --output <request.json> --tenant <tenant-id> --quarantine <q-uuid>\n\nRuns the canonical source preflight and writes one create-once, metadata-only request. It never copies or uploads publisher files, assembles a package, prints QR codes, activates persistence, or enables students.");
}
