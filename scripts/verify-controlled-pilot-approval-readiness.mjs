import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-controlled-pilot-approval-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "controlledPilotApprovalReadiness.ts"), "utf8");
writeFileSync(join(output, "controlledPilotApprovalReadiness.js"), transpile(source), "utf8");

try {
  const model = require(join(output, "controlledPilotApprovalReadiness.js"));
  const readiness = {
    readinessId: "readiness-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    releaseControlEvidence: { status: "blocked", blockingGateCount: 1, openApprovalCount: 1 },
  };
  const pendingBinding = { bindingId: "release-binding-a", tenantId: "tenant-a", packageId: "package-a", status: "awaiting-composite-evidence" };
  const blockedDecision = { decisionId: "pilot-a", tenantId: "tenant-a", packageId: "package-a", status: "demo-ready-pilot-blocked" };
  const blocked = model.createControlledPilotApprovalReadiness({
    readiness,
    releaseBinding: pendingBinding,
    pilotDecision: blockedDecision,
    reviewerGate: { gateId: "reviewer-a", tenantId: "tenant-a", identityReady: false, signaturePolicyReady: false, approvalCaptureReady: false, blockedActions: ["No approve button"] },
  });
  assert(blocked.status === "blocked-by-composite-evidence", "pending evidence must block approval readiness first");
  assert(model.validateControlledPilotApprovalReadiness(blocked).length === 0, "blocked approval readiness must validate");
  assert(blocked.approvalCaptureAllowed === false && blocked.releaseMutationAllowed === false && blocked.studentLaunchAllowed === false, "approval readiness must remain side-effect blocked");

  const ready = model.createControlledPilotApprovalReadiness({
    readiness: { ...readiness, releaseControlEvidence: { status: "pilot-ready", blockingGateCount: 0, openApprovalCount: 0 } },
    releaseBinding: { ...pendingBinding, status: "accepted-for-release-review" },
    pilotDecision: { ...blockedDecision, status: "pilot-ready" },
    reviewerGate: { gateId: "reviewer-a", tenantId: "tenant-a", identityReady: true, signaturePolicyReady: true, approvalCaptureReady: true, blockedActions: [] },
  });
  assert(ready.status === "ready-for-human-review", "cleared gates must become eligible for human review");
  assert(model.validateControlledPilotApprovalReadiness(ready).length === 0, "ready-for-human-review readiness must validate");

  const wrongScope = model.createControlledPilotApprovalReadiness({
    readiness: { ...readiness, releaseControlEvidence: { status: "pilot-ready", blockingGateCount: 0, openApprovalCount: 0 } },
    releaseBinding: { ...pendingBinding, tenantId: "tenant-b", status: "accepted-for-release-review" },
    pilotDecision: { ...blockedDecision, status: "pilot-ready" },
    reviewerGate: { gateId: "reviewer-a", tenantId: "tenant-a", identityReady: true, signaturePolicyReady: true, approvalCaptureReady: true, blockedActions: [] },
  });
  assert(wrongScope.blockingReasons.some((reason) => reason.includes("scope")), "scope drift must become an explicit blocker");
  assert(wrongScope.status === "blocked-by-release-control", "scope drift must remain outside human-review eligibility");
  console.log("PASS controlled pilot approval readiness distinguishes evidence, release-control, reviewer, and human-review states without enabling approval.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function transpile(source) {
  return ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
