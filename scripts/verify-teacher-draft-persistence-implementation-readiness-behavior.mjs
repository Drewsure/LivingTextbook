import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-draft-implementation-readiness-"));
const tsc = join(root, "node_modules", "typescript", "bin", "tsc");

try {
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--resolveJsonModule",
    "--esModuleInterop",
    "--skipLibCheck",
    "--rootDir", join(root, "packages", "content-model", "src"),
    "--outDir", output,
    "packages/content-model/src/teacherDraftPersistenceImplementationReadiness.ts",
    "packages/content-model/src/persistenceAdapter.ts",
  ], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const model = require(join(output, "teacherDraftPersistenceImplementationReadiness.js"));
  const adapter = require(join(output, "persistenceAdapter.js"));
  const valid = {
    readinessId: "draft-readiness",
    tenantId: "sample-publisher",
    draftId: "draft-1",
    sourcePackageId: "package-1",
    acceptanceReadinessId: "acceptance-1",
    providerSelectionPreflightId: "preflight-1",
    storageSelectionPreflightId: "preflight-1",
    storageSelectionGateId: "gate-1",
    storageSelectionStatus: "blocked",
    storageSelectionAllowed: false,
    adapterPlanId: "adapter-1",
    reviewDecisionReadinessId: "review-1",
    mode: "review-only",
    status: "blocked",
    providerSelected: false,
    implementationAllowed: false,
    migrationAllowed: false,
    writesAllowed: false,
    uploadsAllowed: false,
    assignmentAllowed: false,
    routeMutationAllowed: false,
    testExecutionAllowed: false,
    providerNeutral: true,
    requiredWorkOrderRecords: ["Tenant-scoped adapter boundary"],
    acceptanceTests: [],
    requiredEvidence: ["Policy evidence"],
    blockedActions: [
      "No provider selection", "No implementation work", "No migration", "No persistence writes",
      "No media uploads", "No test execution against live infrastructure", "No route mutation",
      "No student assignment or package promotion",
    ],
    blockers: ["Policy review remains open."],
    nextSteps: ["Complete policy review."],
  };

  const shapeErrors = model.validateTeacherDraftPersistenceImplementationReadiness(valid);
  assert(shapeErrors.some((error) => error.includes("acceptance test")), "fixture intentionally demonstrates required acceptance-test shape");

  const validWithTest = {
    ...valid,
    acceptanceTests: [{
      testId: "tenant-isolation", label: "Tenant isolation", purpose: "Reject cross-tenant access.",
      passCriteria: ["Mismatch is rejected."], status: "not-run", evidenceRequired: "Negative test matrix.",
    }, ...requiredTestsExceptTenantIsolation()],
  };
  assert(model.validateTeacherDraftPersistenceImplementationReadiness(validWithTest).length === 0, "valid draft implementation readiness");

  const enabled = { ...validWithTest, storageSelectionAllowed: true };
  assertIncludes(model.validateTeacherDraftPersistenceImplementationReadiness(enabled), "must remain disallowed", "storage enablement rejection");

  const sourceErrors = model.validateTeacherDraftPersistenceImplementationReadinessSources(
    validWithTest,
    { readinessId: "acceptance-1", tenantId: "sample-publisher", draftId: "draft-1", sourcePackageId: "package-1", mode: "review-only", status: "blocked" },
    { preflightId: "preflight-1", evidenceStorageGateId: "gate-1", tenantId: "sample-publisher", packageId: "package-1", status: "blocked", selectionAllowed: false, providerSelected: false, writesAllowed: false, activationAllowed: false },
    { planId: "adapter-1", mode: "hosted-managed" },
    { readinessId: "review-1", tenantId: "sample-publisher", packageId: "package-1", storageSelectionPreflightId: "preflight-1", storageSelectionGateId: "gate-1", storageSelectionStatus: "blocked", storageSelectionAllowed: false, providerSelectionAllowed: false, implementationAllowed: false, writesAllowed: false, activationAllowed: false },
  );
  assert(sourceErrors.length === 0, `valid source binding: ${sourceErrors.join(" | ")}`);

  const drifted = { ...validWithTest, storageSelectionGateId: "wrong-gate" };
  const driftErrors = model.validateTeacherDraftPersistenceImplementationReadinessSources(
    drifted,
    { readinessId: "acceptance-1", tenantId: "sample-publisher", draftId: "draft-1", sourcePackageId: "package-1", mode: "review-only", status: "blocked" },
    { preflightId: "preflight-1", evidenceStorageGateId: "gate-1", tenantId: "sample-publisher", packageId: "package-1", status: "blocked", selectionAllowed: false, providerSelected: false, writesAllowed: false, activationAllowed: false },
    { planId: "adapter-1", mode: "hosted-managed" },
    { readinessId: "review-1", tenantId: "sample-publisher", packageId: "package-1", storageSelectionPreflightId: "preflight-1", storageSelectionGateId: "gate-1", storageSelectionStatus: "blocked", storageSelectionAllowed: false, providerSelectionAllowed: false, implementationAllowed: false, writesAllowed: false, activationAllowed: false },
  );
  assertIncludes(driftErrors, "storage selection gate id", "storage gate drift rejection");

  const writeIntent = {
    intentId: "draft-readiness-write",
    category: "teacher-draft-persistence-implementation-readiness",
    label: "Draft readiness write",
    readiness: "requires-policy",
    targetStore: ["hosted-database"],
    deploymentChannels: ["hosted-web"],
    requiredBeforePilot: false,
    containsStudentData: false,
    requiresSchoolPolicy: true,
    canRunOffline: false,
    allowsExport: true,
    rejectsRawAudio: true,
    rejectsTranscripts: true,
    preservesTenantBoundary: true,
    tenantBoundaryKey: "tenant_id",
    preservesPersistenceImplementationReadiness: true,
    requiresPersistenceAcceptanceTestPlan: true,
    storageSelectionPreflightId: "preflight-1",
    storageSelectionGateId: "gate-1",
    storageSelectionStatus: "blocked",
    storageSelectionAllowed: false,
    blocksPersistenceProviderSelection: true,
    blocksPersistenceImplementation: true,
    blocksPersistenceMigration: true,
    blocksPersistenceWrites: true,
    blocksPersistenceUploads: true,
    blocksPersistenceRouteMutation: true,
    blocksPersistenceAssignmentPromotion: true,
    note: "Provider-neutral readiness write remains review-only.",
  };
  assert(adapter.validatePersistenceAdapterPlan({
    planId: "draft-readiness-plan",
    label: "Draft readiness plan",
    mode: "hosted-managed",
    recommendedForFirstPilot: false,
    costPosture: "controlled",
    deploymentChannels: ["hosted-web"],
    writeIntents: [writeIntent],
    handoffSteps: ["Review packet"],
  }).length === 0, "valid blocked storage identity write intent");
  assertIncludes(adapter.validatePersistenceAdapterPlan({
    planId: "draft-readiness-plan",
    label: "Draft readiness plan",
    mode: "hosted-managed",
    recommendedForFirstPilot: false,
    costPosture: "controlled",
    deploymentChannels: ["hosted-web"],
    writeIntents: [{ ...writeIntent, storageSelectionAllowed: true }],
    handoffSteps: ["Review packet"],
  }), "storage selection must remain disallowed", "write-intent storage enablement rejection");

  console.log("PASS teacher draft persistence implementation readiness and adapter write intents reject storage enablement and identity drift while accepting reconciled blocked evidence.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function requiredTestsExceptTenantIsolation() {
  return [
    "draft-lineage-identity", "owner-policy-binding", "idempotent-save", "raw-audio-transcript-exclusion",
    "retention-export-deletion", "hosted-local-parity", "rollback-recovery", "assignment-promotion-guard",
  ].map((testId) => ({
    testId, label: testId, purpose: "Review the contract.", passCriteria: ["Evidence is recorded."], status: "not-run", evidenceRequired: "Review packet.",
  }));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludes(errors, expected, label) {
  if (!errors.some((error) => error.includes(expected))) throw new Error(`${label} did not include ${expected}: ${errors.join(" | ")}`);
}
