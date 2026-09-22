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

  const badChecksum = structuredClone(valid);
  badChecksum.packageEvidence.sourceAssemblyChecksum = "sha256:not-a-checksum";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(badChecksum), "checksum must use", "checksum rejection");

  const badCounts = structuredClone(valid);
  badCounts.packageEvidence.unresolvedLaneCount = 1;
  badCounts.packageEvidence.unresolvedLaneIds = [];
  assertIncludes(model.validateWhiteLabelReleaseReadiness(badCounts), "unresolved lane count must match", "lane count rejection");

  const activation = structuredClone(valid);
  activation.packageEvidence.studentFacingActivationAllowed = true;
  assertIncludes(model.validateWhiteLabelReleaseReadiness(activation), "student activation must remain false", "student activation rejection");

  const promotion = structuredClone(valid);
  promotion.packageEvidence.promotionAllowed = true;
  assertIncludes(model.validateWhiteLabelReleaseReadiness(promotion), "promotion must remain false", "promotion rejection");

  const falseReady = structuredClone(valid);
  falseReady.status = "pilot-ready";
  assertIncludes(model.validateWhiteLabelReleaseReadiness(falseReady), "status must match phases", "status derivation rejection");

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
    packageEvidence: {
      reconciliationId: "package-readiness-behavior",
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
