import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-evidence-adjudication-"));
const observationSource = readFileSync(join(root, "packages", "content-model", "src", "browserRehearsalObservation.ts"), "utf8");
const packetSource = readFileSync(join(root, "packages", "content-model", "src", "browserPrivacyTenantEvidencePacket.ts"), "utf8");
const adjudicationSource = readFileSync(join(root, "packages", "content-model", "src", "browserPrivacyTenantEvidenceAdjudication.ts"), "utf8");
writeFileSync(join(output, "browserRehearsalObservation.js"), transpile(observationSource), "utf8");
writeFileSync(join(output, "browserPrivacyTenantEvidencePacket.js"), transpile(packetSource), "utf8");
writeFileSync(join(output, "browserPrivacyTenantEvidenceAdjudication.js"), transpile(adjudicationSource), "utf8");

try {
  const packetModel = require(join(output, "browserPrivacyTenantEvidencePacket.js"));
  const adjudicationModel = require(join(output, "browserPrivacyTenantEvidenceAdjudication.js"));
  const observation = {
    version: 1,
    observationId: "observation-adjudication-a",
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
    checkIds: ["route-continuity", "student-to-teacher-handoff"],
    status: "review-only",
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
  };
  let packet = packetModel.createBrowserPrivacyTenantEvidencePacketFromObservation(observation, { verificationRunId: "run-adjudication-a", verificationRevision: "test-a" });
  packet = packetModel.recordBrowserPrivacyTenantNegativeLane(packet, "privacy", { reviewerRef: "teacher-session:launch-a", captureId: "capture-privacy-a", observedAt: "2026-09-24T00:01:00.000Z", notes: "Privacy negative checks observed." });
  const blocked = adjudicationModel.createBrowserPrivacyTenantEvidenceAdjudication(packet, { reviewerRole: "teacher", reviewerRef: "teacher-session:launch-a", decision: "blocked", reviewerNote: "Tenant lane still needs an explicit check." });
  assert(adjudicationModel.validateBrowserPrivacyTenantEvidenceAdjudication(blocked, packet).length === 0, "blocked adjudication must validate with incomplete packet");
  const early = adjudicationModel.createBrowserPrivacyTenantEvidenceAdjudication(packet, { reviewerRole: "teacher", reviewerRef: "teacher-session:launch-a", decision: "accepted-for-next-gate", reviewerNote: "Attempted early acceptance." });
  assert(adjudicationModel.validateBrowserPrivacyTenantEvidenceAdjudication(early, packet).some((error) => error.includes("pending or failed lanes")), "early acceptance must be rejected");
  packet = packetModel.recordBrowserPrivacyTenantNegativeLane(packet, "tenant-isolation", { reviewerRef: "teacher-session:launch-a", captureId: "capture-tenant-a", observedAt: "2026-09-24T00:02:00.000Z", notes: "Tenant negative checks observed." });
  const accepted = adjudicationModel.createBrowserPrivacyTenantEvidenceAdjudication(packet, { reviewerRole: "teacher", reviewerRef: "teacher-session:launch-a", decision: "accepted-for-next-gate", reviewerNote: "All three evidence lanes were observed in this scope." });
  assert(adjudicationModel.validateBrowserPrivacyTenantEvidenceAdjudication(accepted, packet).length === 0, "complete packet acceptance must validate");
  assert(accepted.releasePromotionAllowed === false && accepted.studentProductionLaunchAllowed === false, "adjudication must remain blocked from release and launch");
  console.log("PASS evidence adjudication requires all lanes for acceptance and remains review-only.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function transpile(source) { return ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText; }
function assert(condition, message) { if (!condition) throw new Error(message); }
