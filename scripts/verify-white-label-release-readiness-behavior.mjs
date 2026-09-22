import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-white-label-release-behavior-"));
const tsc = join(root, "node_modules", "typescript", "bin", "tsc");

try {
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--skipLibCheck",
    "--rootDir", join(root, "packages", "content-model", "src"),
    "--outDir", output,
    "packages/content-model/src/whiteLabelReleaseReadiness.ts",
  ], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const model = require(join(output, "whiteLabelReleaseReadiness.js"));
  const valid = buildValidReadiness(model);
  assertEmpty(model.validateWhiteLabelReleaseReadiness(valid), "valid readiness");

  const wrongPackage = structuredClone(valid);
  wrongPackage.packageEvidence.packageId = "other-tenant-package";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(wrongPackage), "must match the readiness package", "package mismatch rejection");

  const wrongPackageTenant = structuredClone(valid);
  wrongPackageTenant.packageEvidence.tenantId = "other-tenant";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(wrongPackageTenant), "package evidence must match the readiness tenant", "package tenant mismatch rejection");

  const qualityMismatch = structuredClone(valid);
  qualityMismatch.qualityEvidence[0].verified = false;
  assertIncludes(model.validateWhiteLabelReleaseReadiness(qualityMismatch), "must match its quality check", "quality evidence mismatch rejection");

  const qualityMissing = structuredClone(valid);
  qualityMissing.qualityEvidence.pop();
  assertIncludes(model.validateWhiteLabelReleaseReadiness(qualityMissing), "exactly seven quality evidence records", "quality evidence count rejection");

  const controlPackageMismatch = structuredClone(valid);
  controlPackageMismatch.releaseControlEvidence.packageId = "other-package";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(controlPackageMismatch), "control evidence must match the readiness package", "release-control package mismatch rejection");

  const controlTenantMismatch = structuredClone(valid);
  controlTenantMismatch.releaseControlEvidence.tenantId = "other-tenant";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(controlTenantMismatch), "control evidence must match the readiness tenant", "release-control tenant mismatch rejection");

  const controlFalseReady = structuredClone(valid);
  controlFalseReady.releaseControlEvidence.status = "pilot-ready";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(controlFalseReady), "cannot contain open gates or approvals", "release-control false-ready rejection");

  const badChecksum = structuredClone(valid);
  badChecksum.packageEvidence.sourceAssemblyChecksum = "sha256:not-a-checksum";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(badChecksum), "checksum must use", "checksum rejection");

  const badCounts = structuredClone(valid);
  badCounts.packageEvidence.unresolvedLaneCount = 1;
  badCounts.packageEvidence.unresolvedLaneIds = [];
  assertIncludes(model.validateWhiteLabelReleaseReadiness(badCounts), "unresolved lane count must match", "lane count rejection");

  const routeDrift = structuredClone(valid);
  routeDrift.routeEvidence.activeRouteCount = 88;
  assertIncludes(model.validateWhiteLabelReleaseReadiness(routeDrift), "route evidence counts must reconcile", "route count rejection");

  const routeTenantMismatch = structuredClone(valid);
  routeTenantMismatch.routeEvidence.tenantId = "other-tenant";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(routeTenantMismatch), "route evidence must match the readiness tenant", "route tenant mismatch rejection");

  const routePackageMismatch = structuredClone(valid);
  routePackageMismatch.routeEvidence.packageId = "other-package";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(routePackageMismatch), "route evidence must match the readiness package", "route package mismatch rejection");

  const routeActivation = structuredClone(valid);
  routeActivation.routeEvidence.deploymentStatus = "ready";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(routeActivation), "deployment status must remain review-only", "route deployment status rejection");

  const laneDrift = structuredClone(valid);
  laneDrift.packageEvidence.readyPreviewLaneCount = 0;
  assertIncludes(model.validateWhiteLabelReleaseReadiness(laneDrift), "lane counts must reconcile", "lane total drift rejection");

  const activation = structuredClone(valid);
  activation.packageEvidence.studentFacingActivationAllowed = true;
  assertIncludes(model.validateWhiteLabelReleaseReadiness(activation), "student activation must remain false", "student activation rejection");

  const pilotTenant = structuredClone(valid);
  pilotTenant.pilotEvidence.tenantId = "other-tenant";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(pilotTenant), "pilot evidence must match the readiness tenant", "pilot tenant rejection");

  const pilotCount = structuredClone(valid);
  pilotCount.pilotEvidence.blockingReasonCount = 0;
  assertIncludes(model.validateWhiteLabelReleaseReadiness(pilotCount), "pilot evidence blocker count must match", "pilot blocker count rejection");

  const promotion = structuredClone(valid);
  promotion.packageEvidence.promotionAllowed = true;
  assertIncludes(model.validateWhiteLabelReleaseReadiness(promotion), "promotion must remain false", "promotion rejection");

  const falseReady = structuredClone(valid);
  falseReady.status = "pilot-ready";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(falseReady), "status must match phases", "status derivation rejection");

  const qualityFalseReady = structuredClone(valid);
  qualityFalseReady.status = "pilot-ready";
  qualityFalseReady.phases = qualityFalseReady.phases.map((phase) => ({ ...phase, status: "ready", blockers: [] }));
  qualityFalseReady.qualityChecks.browser = false;
  assertIncludes(model.validateWhiteLabelReleaseReadiness(qualityFalseReady), "requires every quality check", "pilot-ready quality rejection");

  const unresolvedReady = structuredClone(valid);
  unresolvedReady.status = "pilot-ready";
  unresolvedReady.phases = unresolvedReady.phases.map((phase) => ({ ...phase, status: "ready", blockers: [] }));
  assertIncludes(model.validateWhiteLabelReleaseReadiness(unresolvedReady), "cannot be pilot-ready while package evidence has unresolved lanes", "unresolved package false-ready rejection");

  console.log("PASS white-label release readiness behavior accepts valid package evidence and rejects package mismatch, checksum tampering, lane-count drift, activation, promotion, and false-ready states.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function buildValidReadiness(model) {
  return {
    readinessId: "behavior-readiness",
    tenantId: "sample-publisher",
    packageId: "sample-publisher-package",
    label: "Behavior sample",
    status: "blocked",
    phases: model.WHITE_LABEL_RELEASE_REQUIRED_PHASE_IDS.map((phaseId, index) => ({
      phaseId,
      label: phaseId,
      status: index === 0 ? "blocked" : index === 1 ? "review-only" : "ready",
      evidenceRecords: [`evidence-${phaseId}`],
      blockers: index < 2 ? [`blocker-${phaseId}`] : [],
      nextAction: `Review ${phaseId}`,
    })),
    qualityChecks: {
      typecheck: true,
      productionBuild: true,
      activeRoutes: true,
      runtime: true,
      browser: true,
      privacy: true,
      tenantIsolation: true,
    },
    qualityEvidence: [
      ["typecheck", "Web typecheck", "typecheck:web"],
      ["productionBuild", "Production build", "web-production-build"],
      ["activeRoutes", "Active route sweep", "active-route-verification"],
      ["runtime", "Runtime composition", "verify:foundation-composition"],
      ["browser", "Browser rehearsal", "browser-rehearsal-evidence"],
      ["privacy", "Privacy boundary", "privacy-boundary-verification"],
      ["tenantIsolation", "Tenant isolation", "tenant-isolation-verification"],
    ].map(([checkId, label, sourceRecord]) => ({
      checkId,
      label,
      verified: true,
      sourceRecord,
      observedAt: "2026-09-22T00:00:00.000Z",
      notes: "Evidence observed in the review-only foundation gate.",
    })),
    packageEvidence: {
      reconciliationId: "package-readiness-behavior",
      tenantId: "sample-publisher",
      packageId: "sample-publisher-package",
      sourceAssemblyChecksum: "sha256:" + "1".repeat(64),
      status: "blocked",
      totalLaneCount: 3,
      readyPreviewLaneCount: 1,
      unresolvedLaneCount: 2,
      unresolvedLaneIds: ["verifier-evidence", "publish-gate"],
      promotionAllowed: false,
      studentFacingActivationAllowed: false,
    },
    pilotEvidence: {
      decisionId: "sample-publisher-review-decision",
      tenantId: "sample-publisher",
      packageId: "sample-publisher-package",
      handoffRouteKey: "sample-publisher-first-handoff",
      evidenceHandoffRouteKey: "sample-publisher-evidence-handoff",
      status: "demo-ready-pilot-blocked",
      blockingReasons: ["School policy is not accepted."],
      blockingReasonCount: 1,
      evidenceBindings: ["pilot-handoff:sample-publisher-first-handoff"],
      pilotLaunchAllowed: false,
      studentDataCollectionAllowed: false,
      reportExportAllowed: false,
    },
    releaseControlEvidence: {
      releaseGateId: "sample-publish-gate",
      approvalLedgerId: "sample-approval-ledger",
      tenantId: "sample-publisher",
      releaseCandidate: "2026.1 pilot candidate",
      packageId: "sample-publisher-package",
      status: "blocked",
      blockingGateCount: 2,
      requiredApprovalCount: 3,
      openApprovalCount: 2,
      sourceRecords: ["package-publish-gate:sample-publish-gate", "approval-ledger:sample-approval-ledger"],
      promotionAllowed: false,
      studentFacingActivationAllowed: false,
    },
    routeEvidence: {
      tenantId: "sample-publisher",
      packageId: "sample-publisher-package",
      activeRouteCount: 89,
      expectedActiveRouteCount: 89,
      routeMatrixSource: "sample-active-route-matrix",
      activeRouteVerifierSource: "scripts/verify-active-routes.mjs",
      deploymentGuideId: "deployment-decision-guide-v2026-09-03",
      deploymentStatus: "review-only",
      sourceRecords: [
        "active-route-matrix:sample-active-route-matrix",
        "active-route-verifier:scripts/verify-active-routes.mjs",
        "deployment-decision-guide:deployment-decision-guide-v2026-09-03",
      ],
    },
    productionApprovalAllowed: false,
    studentProductionLaunchAllowed: false,
    blockedActions: [...model.WHITE_LABEL_RELEASE_BLOCKED_ACTIONS],
    nextAction: "Review blockers",
    note: "Behavior sample remains review-only.",
  };
}

function assertEmpty(errors, label) {
  if (errors.length > 0) throw new Error(`${label} unexpectedly failed: ${errors.join(" | ")}`);
}

function assertIncludes(errors, expected, label) {
  if (!errors.some((error) => error.includes(expected))) throw new Error(`${label} did not include ${expected}: ${errors.join(" | ")}`);
}
