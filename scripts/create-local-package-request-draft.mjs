import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  printUsage();
  process.exit(0);
}

for (const [label, value] of Object.entries({
  output: options.output,
  tenant: options.tenant,
  package: options.package,
  version: options.version,
  quarantine: options.quarantine,
  reviewPacket: options.reviewPacket,
  bundleReviewId: options.bundleReviewId,
  operator: options.operator,
})) {
  if (!value) fail(`Missing --${label.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}.`);
}

for (const [label, value] of Object.entries({
  tenant: options.tenant,
  package: options.package,
  version: options.version,
  quarantine: options.quarantine,
  reviewPacket: options.reviewPacket,
  bundleReviewId: options.bundleReviewId,
  operator: options.operator,
})) {
  if (!isSafeIdentity(value)) fail(`--${label} contains unsafe path or identity characters.`);
}

const outputPath = resolve(options.output);
if (!outputPath.toLowerCase().endsWith(".json")) fail("--output must point to a JSON file.");

const draft = {
  tenantId: options.tenant,
  packageId: options.package,
  version: options.version,
  quarantineId: options.quarantine,
  reviewPacketId: options.reviewPacket,
  bundleManifestReviewId: options.bundleReviewId,
  operatorId: options.operator,
  writtenAt: options.writtenAt || new Date().toISOString(),
};

await mkdir(dirname(outputPath), { recursive: true });
try {
  await writeFile(outputPath, `${JSON.stringify(draft, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
} catch {
  fail(`Could not create ${outputPath}. The command never overwrites an existing request file.`);
}

console.log(JSON.stringify({
  status: "draft-created",
  requestPath: outputPath,
  tenantId: draft.tenantId,
  packageId: draft.packageId,
  version: draft.version,
  quarantineId: draft.quarantineId,
  reviewPacketId: draft.reviewPacketId,
  bundleManifestReviewId: draft.bundleManifestReviewId,
  operatorId: draft.operatorId,
  writtenAt: draft.writtenAt,
  nextCommand: `node scripts/run-local-package-operator.mjs --request "${outputPath}" --preflight`,
}, null, 2));

function parseArguments(args) {
  const result = {
    output: "",
    tenant: "",
    package: "",
    version: "",
    quarantine: "",
    reviewPacket: "",
    bundleReviewId: "",
    operator: "",
    writtenAt: "",
    help: false,
  };
  const flags = new Map([
    ["--output", "output"],
    ["--tenant", "tenant"],
    ["--package", "package"],
    ["--version", "version"],
    ["--quarantine", "quarantine"],
    ["--review-packet", "reviewPacket"],
    ["--bundle-review-id", "bundleReviewId"],
    ["--operator", "operator"],
    ["--written-at", "writtenAt"],
  ]);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (flags.has(arg)) result[flags.get(arg)] = args[++index] ?? "";
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

function isSafeIdentity(value) {
  return typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(value);
}

function fail(message) {
  console.error(`ERROR ${message}`);
  process.exit(2);
}

function printUsage() {
  console.log("Usage: node scripts/create-local-package-request-draft.mjs --output <request.json> --tenant <tenant-id> --package <package-id> --version <version> --quarantine <quarantine-id> --review-packet <review-packet-id> --bundle-review-id <review-record-id> --operator <operator-id> [--written-at <ISO timestamp>]");
  return;
  console.log(`Usage:\n  node scripts/create-local-package-request-draft.mjs \\\n+    --output <request.json> \\\n+    --tenant <tenant-id> \\\n+    --package <package-id> \\\n+    --version <version> \\\n+    --quarantine <quarantine-id> \\\n+    --review-packet <review-packet-id> \\\n+    --bundle-review-id <review-record-id> \\\n+    --operator <operator-id>\n\nOptional:\n  --written-at <ISO timestamp>\n\nThe command writes a durable-records draft only. It does not call the server or assemble a package.\n`.replaceAll("\\n+", "\\n"));
}
