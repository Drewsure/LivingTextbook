import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-evidence-packet-derivation-"));
const observationSource = readFileSync(join(root, "packages", "content-model", "src", "browserRehearsalObservation.ts"), "utf8");
const packetSource = readFileSync(join(root, "packages", "content-model", "src", "browserPrivacyTenantEvidencePacket.ts"), "utf8");
  writeFileSync(join(output, "browserRehearsalObservation.js"), transpile(observationSource), "utf8");
writeFileSync(join(output, "browserPrivacyTenantEvidencePacket.cjs"), transpile(packetSource), "utf8");

try {
  const { createBrowserPrivacyTenantEvidencePacketFromObservation, validateBrowserPrivacyTenantEvidencePacket } = require(join(output, "browserPrivacyTenantEvidencePacket.cjs"));
  const observation = {
    version: 1,
    observationId: "observation-derivation-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    launchCode: "launch-a",
    unitKey: "tenant-a:curriculum-a:L1:U1",
    studentSessionId: "launch-a:student-a",
    mode: "human-observed",
    reviewerRole: "teacher",
    reviewerRef: "teacher-session:launch-a",
    observedAt: "2026-09-24T00:00:00.000Z",
    routePaths: ["/teacher/sessions/launch-a", "/memory/launch-a"],
    checkIds: ["route-continuity", "student-to-teacher-handoff", "teacher-session-summary"],
    status: "review-only",
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
  };
  const packet = createBrowserPrivacyTenantEvidencePacketFromObservation(observation, {
    verificationRunId: "run-derivation-a",
    verificationRevision: "legacy-source-import:derivation-test",
  });
  assert(validateBrowserPrivacyTenantEvidencePacket(packet).length === 0, "derived packet must pass validation");
  assert(packet.lanes.find((lane) => lane.laneId === "browser")?.status === "passed", "browser lane must advance from exact observation checks");
  assert(packet.lanes.find((lane) => lane.laneId === "privacy")?.status === "pending", "privacy lane must remain pending");
  assert(packet.lanes.find((lane) => lane.laneId === "tenant-isolation")?.status === "pending", "tenant lane must remain pending");
  console.log("PASS observed browser evidence derives only the browser lane and keeps privacy/tenant lanes pending.");
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
