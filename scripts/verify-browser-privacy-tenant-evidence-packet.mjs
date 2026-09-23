import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-evidence-packet-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "browserPrivacyTenantEvidencePacket.ts"), "utf8");
writeFileSync(join(output, "packet.cjs"), transpile(source), "utf8");

try {
  const packet = require(join(output, "packet.cjs"));
  const valid = packet.createPendingBrowserPrivacyTenantEvidencePacket({
    packetId: "packet-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    launchCode: "launch-a",
    unitKey: "tenant-a:curriculum-a:L1:U1",
    studentSessionId: "launch-a:student-a",
    observationId: "observation-a",
    verificationRunId: "run-a",
    verificationRevision: "legacy-source-import:test",
    verificationReferenceAt: "2026-09-23T00:00:00.000Z",
  });
  assert(packet.validateBrowserPrivacyTenantEvidencePacket(valid).length === 0, "valid pending packet must pass");
  assert(packet.validateBrowserPrivacyTenantEvidencePacket({ ...valid, hostedWriteAllowed: true }).some((error) => error.includes("hostedWriteAllowed must remain false")), "hosted writes must stay blocked");
  assert(packet.validateBrowserPrivacyTenantEvidencePacket({ ...valid, unitKey: "tenant-b:curriculum-a:L1:U1" }).some((error) => error.includes("tenant-scoped")), "tenant drift must be rejected");
  assert(packet.validateBrowserPrivacyTenantEvidencePacket({ ...valid, lanes: valid.lanes.filter((lane) => lane.laneId !== "privacy") }).some((error) => error.includes("exactly three evidence lanes")), "missing lane must be rejected");
  const passedPending = { ...valid, lanes: valid.lanes.map((lane) => lane.laneId === "browser" ? { ...lane, status: "passed" } : lane) };
  assert(packet.validateBrowserPrivacyTenantEvidencePacket(passedPending).some((error) => error.includes("cannot be passed with a pending source record")), "pending evidence cannot be marked passed");
  console.log("PASS browser/privacy/tenant evidence packet validates scope, lane semantics, and blocked side effects.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function transpile(source) {
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
