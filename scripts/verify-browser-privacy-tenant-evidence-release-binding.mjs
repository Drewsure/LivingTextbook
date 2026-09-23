import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-evidence-release-binding-"));
const bindingSource = readFileSync(join(root, "packages", "content-model", "src", "browserPrivacyTenantEvidenceReleaseBinding.ts"), "utf8");
writeFileSync(join(output, "browserPrivacyTenantEvidenceReleaseBinding.js"), transpile(bindingSource), "utf8");

try {
  const model = require(join(output, "browserPrivacyTenantEvidenceReleaseBinding.js"));
  const readiness = { readinessId: "readiness-a", tenantId: "tenant-a", packageId: "package-a", status: "blocked", nextAction: "Close release gates." };
  const pendingPilot = { version: 1, bindingId: "pilot-binding-a", packetId: "packet-a", adjudicationId: "awaiting-composite-evidence-adjudication", pilotDecisionId: "pilot-a", tenantId: "tenant-a", packageId: "package-a", status: "awaiting-evidence", mode: "review-only", pilotLaunchAllowed: false, studentDataCollectionAllowed: false, reportExportAllowed: false, packagePromotionAllowed: false, blockedReasons: ["Evidence is not recorded."], nextGate: ["Record composite evidence."] };
  const pending = model.createBrowserPrivacyTenantEvidenceReleaseBinding(readiness, pendingPilot);
  assert(model.validateBrowserPrivacyTenantEvidenceReleaseBinding(pending, readiness, pendingPilot).length === 0, "pending release binding must validate");
  const acceptedPilot = { ...pendingPilot, bindingId: "pilot-binding-b", packetId: "packet-b", adjudicationId: "adjudication-b", status: "accepted-for-pilot-review", blockedReasons: ["Release gates remain blocked."], nextGate: ["Continue release review."] };
  const accepted = model.createBrowserPrivacyTenantEvidenceReleaseBinding(readiness, acceptedPilot);
  assert(accepted.status === "accepted-for-release-review", "accepted pilot binding must advance to release review only");
  assert(model.validateBrowserPrivacyTenantEvidenceReleaseBinding(accepted, readiness, acceptedPilot).length === 0, "accepted release binding must validate");
  assert(accepted.productionApprovalAllowed === false && accepted.studentProductionLaunchAllowed === false && accepted.packagePromotionAllowed === false, "release binding must remain activation-blocked");
  const wrongPackage = { ...acceptedPilot, packageId: "package-b" };
  assert(model.validateBrowserPrivacyTenantEvidenceReleaseBinding(accepted, readiness, wrongPackage).some((error) => error.includes("package identity")), "package drift must be rejected");
  console.log("PASS composite evidence release binding preserves pilot lineage and keeps production approval blocked.");
} finally { rmSync(output, { recursive: true, force: true }); }

function transpile(source) { return ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText; }
function assert(condition, message) { if (!condition) throw new Error(message); }
