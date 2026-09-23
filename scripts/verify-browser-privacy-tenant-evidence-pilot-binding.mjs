import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-evidence-pilot-binding-"));
const packetSource = readFileSync(join(root, "packages", "content-model", "src", "browserPrivacyTenantEvidencePacket.ts"), "utf8");
const adjudicationSource = readFileSync(join(root, "packages", "content-model", "src", "browserPrivacyTenantEvidenceAdjudication.ts"), "utf8");
const pilotSource = readFileSync(join(root, "packages", "content-model", "src", "pilotReviewDecision.ts"), "utf8");
const bindingSource = readFileSync(join(root, "packages", "content-model", "src", "browserPrivacyTenantEvidencePilotBinding.ts"), "utf8");
writeFileSync(join(output, "browserPrivacyTenantEvidencePacket.js"), transpile(packetSource), "utf8");
writeFileSync(join(output, "browserPrivacyTenantEvidenceAdjudication.js"), transpile(adjudicationSource), "utf8");
writeFileSync(join(output, "pilotReviewDecision.js"), transpile(pilotSource), "utf8");
writeFileSync(join(output, "browserPrivacyTenantEvidencePilotBinding.js"), transpile(bindingSource), "utf8");

try {
  const packetModel = require(join(output, "browserPrivacyTenantEvidencePacket.js"));
  const adjudicationModel = require(join(output, "browserPrivacyTenantEvidenceAdjudication.js"));
  const bindingModel = require(join(output, "browserPrivacyTenantEvidencePilotBinding.js"));
  const pilotDecision = { version: 1, decisionId: "pilot-decision-a", tenantId: "tenant-a", packageId: "package-a", status: "review-only", decision: "blocked", blockingReasons: ["Release gates remain incomplete."], nextGate: ["Complete pilot gates"] };
  const observation = { version: 1, observationId: "observation-binding-a", tenantId: "tenant-a", packageId: "package-a", launchCode: "launch-a", unitKey: "tenant-a:curriculum-a:L1:U1", studentSessionId: "launch-a:student-a", mode: "human-observed", reviewerRole: "teacher", reviewerRef: "teacher-session:launch-a", observedAt: "2026-09-24T00:00:00.000Z", routePaths: ["/teacher/sessions/launch-a"], checkIds: ["route-continuity", "student-to-teacher-handoff"], status: "review-only", releasePromotionAllowed: false, studentProductionLaunchAllowed: false };
  let packet = packetModel.createBrowserPrivacyTenantEvidencePacketFromObservation(observation, { verificationRunId: "run-binding-a", verificationRevision: "test-a" });
  const pending = bindingModel.createBrowserPrivacyTenantEvidencePilotBinding(packet, pilotDecision);
  assert(bindingModel.validateBrowserPrivacyTenantEvidencePilotBinding(pending, pilotDecision, packet).length === 0, "pending binding must validate");
  packet = packetModel.recordBrowserPrivacyTenantNegativeLane(packet, "privacy", { reviewerRef: "teacher-session:launch-a", captureId: "privacy-a", observedAt: "2026-09-24T00:01:00.000Z", notes: "Privacy check observed." });
  packet = packetModel.recordBrowserPrivacyTenantNegativeLane(packet, "tenant-isolation", { reviewerRef: "teacher-session:launch-a", captureId: "tenant-a", observedAt: "2026-09-24T00:02:00.000Z", notes: "Tenant check observed." });
  const adjudication = adjudicationModel.createBrowserPrivacyTenantEvidenceAdjudication(packet, { reviewerRole: "teacher", reviewerRef: "teacher-session:launch-a", decision: "accepted-for-next-gate", reviewerNote: "All three lanes were observed." });
  const accepted = bindingModel.createBrowserPrivacyTenantEvidencePilotBinding(packet, pilotDecision, adjudication);
  assert(accepted.status === "accepted-for-pilot-review", "accepted adjudication must advance only to pilot review");
  assert(bindingModel.validateBrowserPrivacyTenantEvidencePilotBinding(accepted, pilotDecision, packet, adjudication).length === 0, "accepted binding must validate");
  assert(accepted.pilotLaunchAllowed === false && accepted.packagePromotionAllowed === false, "binding must remain launch and promotion blocked");
  const wrongTenant = { ...pilotDecision, tenantId: "tenant-b" };
  assert(bindingModel.validateBrowserPrivacyTenantEvidencePilotBinding(accepted, wrongTenant, packet, adjudication).some((error) => error.includes("tenant identity")), "wrong tenant must be rejected");
  console.log("PASS composite evidence pilot binding preserves adjudication lineage and keeps pilot launch blocked.");
} finally { rmSync(output, { recursive: true, force: true }); }

function transpile(source) { return ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText; }
function assert(condition, message) { if (!condition) throw new Error(message); }
