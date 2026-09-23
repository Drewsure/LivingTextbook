import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-browser-pilot-binding-"));
const model = readFileSync(join(root, "packages", "content-model", "src", "browserRehearsalObservationPilotBinding.ts"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "pilot", "BrowserObservationPilotBindingPanel.tsx"), "utf8");
writeFileSync(join(output, "browserRehearsalObservationPilotBinding.js"), transpile(model), "utf8");

try {
  const { createBrowserRehearsalObservationPilotBinding, validateBrowserRehearsalObservationPilotBinding } = await import(pathToFile(join(output, "browserRehearsalObservationPilotBinding.js")));
  const handoff = {
    version: 1,
    handoffId: "browser-observation-handoff:observation-a",
    handoffKind: "browser-observation-review",
    sourceObservationId: "observation-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    launchCode: "launch-a",
    unitKey: "tenant-a:curriculum-a:L1:U1",
    studentSessionId: "launch-a:student-a",
    routePaths: ["/memory/launch-a"],
    checkIds: ["memory-match"],
    status: "review-only",
    reviewDestination: "adult-evidence-review",
    exportAllowed: false,
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
    blockedActions: ["No evidence export"],
    nextGate: ["Adult reviewer adjudication"],
  };
  const pilotDecision = {
    decisionId: "package-a-review-decision",
    tenantId: "tenant-a",
    packageId: "package-a",
    handoffRouteKey: "pilot-handoff-a",
    evidenceHandoffRouteKey: "evidence-handoff-a",
    status: "demo-ready-pilot-blocked",
    mode: "review-only",
    demoAllowed: true,
    pilotLaunchAllowed: false,
    studentDataCollectionAllowed: false,
    reportExportAllowed: false,
    packagePromotionAllowed: false,
    blockingReasons: ["School policy remains open."],
    requiredNextSteps: ["Complete school policy review."],
    evidenceBindings: ["evidence-handoff-a"],
  };
  const pending = createBrowserRehearsalObservationPilotBinding(handoff, pilotDecision);
  assert(validateBrowserRehearsalObservationPilotBinding(pending, handoff, pilotDecision).length === 0, "pending binding must pass");
  const adjudication = {
    version: 1,
    adjudicationId: "adjudication-a",
    handoffId: handoff.handoffId,
    sourceObservationId: handoff.sourceObservationId,
    tenantId: handoff.tenantId,
    packageId: handoff.packageId,
    launchCode: handoff.launchCode,
    unitKey: handoff.unitKey,
    studentSessionId: handoff.studentSessionId,
    reviewerRole: "teacher",
    reviewerRef: "teacher-a",
    adjudicatedAt: "2026-09-24T00:00:00.000Z",
    decision: "accepted-for-next-gate",
    reviewerNote: "Observed the route.",
    status: "review-only",
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
    hostedPersistenceWriteAllowed: false,
    blockedActions: ["No release approval", "No release promotion", "No student production launch", "No hosted persistence write", "No evidence export", "No QR route mutation"],
    nextGate: ["Release-control and school-policy review"],
  };
  const accepted = createBrowserRehearsalObservationPilotBinding(handoff, pilotDecision, adjudication);
  assert(accepted.status === "accepted-for-pilot-review", "accepted adjudication must be visible as pilot review evidence");
  assert(validateBrowserRehearsalObservationPilotBinding(accepted, handoff, pilotDecision, adjudication).length === 0, "accepted binding must pass");
  assert(validateBrowserRehearsalObservationPilotBinding({ ...accepted, pilotLaunchAllowed: true }, handoff, pilotDecision, adjudication).some((error) => error.includes("pilotLaunchAllowed must remain false")), "pilot launch drift must be rejected");
  assert(validateBrowserRehearsalObservationPilotBinding({ ...accepted, packageId: "package-b" }, handoff, pilotDecision, adjudication).some((error) => error.includes("package identity")), "package drift must be rejected");
  assert(panel.includes("Observation-to-pilot decision binding") && panel.includes("Pilot launch") && panel.includes("Blocked"), "pilot panel must expose the bounded binding");
  console.log("PASS browser observation pilot binding preserves adjudication lineage, pilot blockers, tenant/package identity, and blocked rollout permissions.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function transpile(source) {
  return ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
}

function pathToFile(path) {
  return `file:///${path.replaceAll("\\", "/")}`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
