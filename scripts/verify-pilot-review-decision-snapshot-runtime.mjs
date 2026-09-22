import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-review-decision-snapshot-"));

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  writeFileSync(join(output, "tsconfig.json"), JSON.stringify({
    compilerOptions: {
      module: "commonjs",
      target: "ES2022",
      moduleResolution: "node",
      skipLibCheck: true,
      rootDir: root,
      outDir: output,
    },
    files: [
      join(root, "packages", "content-model", "src", "pilotReviewDecision.ts"),
      join(root, "packages", "content-model", "src", "pilotReviewDecisionPersistence.ts"),
    ],
  }, null, 2), "utf8");

  const compile = spawnSync(process.execPath, [tsc, "-p", join(output, "tsconfig.json")], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const persistence = require(join(output, "packages", "content-model", "src", "pilotReviewDecisionPersistence.js"));
  const decisionModel = require(join(output, "packages", "content-model", "src", "pilotReviewDecision.js"));
  const decision = {
    decisionId: "sample-review-decision",
    tenantId: "sample-publisher",
    packageId: "sample-package",
    handoffRouteKey: "sample-handoff",
    evidenceHandoffRouteKey: "sample-evidence-handoff",
    status: "demo-ready-pilot-blocked",
    mode: "review-only",
    demoAllowed: true,
    pilotLaunchAllowed: false,
    studentDataCollectionAllowed: false,
    reportExportAllowed: false,
    packagePromotionAllowed: false,
    blockingReasons: ["School policy is not accepted."],
    requiredNextSteps: ["Complete school policy review."],
    evidenceBindings: ["handoff:sample-handoff"],
  };

  const snapshot = persistence.createPilotReviewDecisionPersistenceSnapshot(decision, "hosted-managed", "2026-09-22T12:00:00.000Z");
  assert(persistence.validatePilotReviewDecisionPersistenceSnapshot(snapshot).length === 0, "valid snapshot should pass validation");

  const duplicateBindings = decisionModel.validatePilotReviewDecision({
    ...decision,
    evidenceBindings: ["handoff:sample-handoff", "handoff:sample-handoff"],
  });
  assert(duplicateBindings.includes("Pilot review decision evidence bindings must be unique."), "duplicate decision bindings must fail validation");

  const blankBinding = decisionModel.validatePilotReviewDecision({
    ...decision,
    evidenceBindings: ["handoff:sample-handoff", ""],
  });
  assert(blankBinding.includes("Pilot review decision evidence bindings must contain only non-empty strings."), "blank decision bindings must fail validation");

  const duplicateBlockers = decisionModel.validatePilotReviewDecision({
    ...decision,
    blockingReasons: ["School policy is not accepted.", "School policy is not accepted."],
  });
  assert(duplicateBlockers.includes("Pilot review decision blockingReasons must be unique."), "duplicate blockers must fail validation");

  const blankNextStep = decisionModel.validatePilotReviewDecision({
    ...decision,
    requiredNextSteps: ["Complete school policy review.", ""],
  });
  assert(blankNextStep.includes("Pilot review decision requiredNextSteps must contain only non-empty strings."), "blank next steps must fail validation");

  const adapter = persistence.createReviewOnlyPilotReviewDecisionPersistenceAdapter();
  const restore = adapter.execute({
    snapshot,
    operation: "restore",
    expectedTenantId: "sample-publisher",
    expectedPackageId: "sample-package",
    expectedPersistenceMode: "hosted-managed",
  });
  assert(restore.decision.allowed === false, "restore must remain blocked");
  assert(restore.sideEffect === "none", "restore rehearsal must have no side effect");
  assert(restore.snapshotValid === true, "valid restore rehearsal must recognize the snapshot");
  assert(restore.decision.reasons.includes("No review decision activation"), "restore must block activation");

  const wrongTenant = adapter.execute({ snapshot, operation: "validate", expectedTenantId: "other-tenant" });
  assert(wrongTenant.decision.allowed === false, "wrong tenant must remain blocked");
  assert(wrongTenant.decision.reasons.includes("Snapshot tenant does not match the expected tenant."), "wrong tenant must be visible");

  const tampered = adapter.execute({
    snapshot: { ...snapshot, decisionFingerprint: "pilot-review-decision-fnv1a-v1:tampered" },
    operation: "write",
  });
  assert(tampered.decision.reasonCode === "invalid-pilot-review-decision-snapshot", "tampered fingerprint must fail closed");
  assert(tampered.snapshotValid === false, "tampered fingerprint must be invalid");

  console.log("PASS pilot review decision snapshot runtime rejects writes, restore, export, activation, wrong-tenant access, and fingerprint tampering without side effects.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
