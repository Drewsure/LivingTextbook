export type TeacherDraftPersistenceImplementationReadinessStatus = "blocked" | "ready-review";

export type TeacherDraftPersistenceAcceptanceTestStatus = "not-run" | "review-only";

export interface TeacherDraftPersistenceAcceptanceTest {
  testId: string;
  label: string;
  purpose: string;
  passCriteria: string[];
  status: TeacherDraftPersistenceAcceptanceTestStatus;
  evidenceRequired: string;
}

export interface TeacherDraftPersistenceImplementationReadiness {
  readinessId: string;
  tenantId: string;
  draftId: string;
  sourcePackageId: string;
  acceptanceReadinessId: string;
  providerSelectionPreflightId: string;
  adapterPlanId: string;
  reviewDecisionReadinessId: string;
  mode: "review-only";
  status: TeacherDraftPersistenceImplementationReadinessStatus;
  providerSelected: false;
  implementationAllowed: false;
  migrationAllowed: false;
  writesAllowed: false;
  uploadsAllowed: false;
  assignmentAllowed: false;
  routeMutationAllowed: false;
  testExecutionAllowed: false;
  providerNeutral: true;
  requiredWorkOrderRecords: string[];
  acceptanceTests: TeacherDraftPersistenceAcceptanceTest[];
  requiredEvidence: string[];
  blockedActions: string[];
  blockers: string[];
  nextSteps: string[];
}

const REQUIRED_TEST_IDS = [
  "tenant-isolation",
  "draft-lineage-identity",
  "owner-policy-binding",
  "idempotent-save",
  "raw-audio-transcript-exclusion",
  "retention-export-deletion",
  "hosted-local-parity",
  "rollback-recovery",
  "assignment-promotion-guard",
] as const;

const REQUIRED_BLOCKED_ACTIONS = [
  "No provider selection",
  "No implementation work",
  "No migration",
  "No persistence writes",
  "No media uploads",
  "No test execution against live infrastructure",
  "No route mutation",
  "No student assignment or package promotion",
] as const;

export function validateTeacherDraftPersistenceImplementationReadiness(
  readiness: TeacherDraftPersistenceImplementationReadiness,
): string[] {
  const errors: string[] = [];
  for (const [field, value] of [
    ["readinessId", readiness.readinessId],
    ["tenantId", readiness.tenantId],
    ["draftId", readiness.draftId],
    ["sourcePackageId", readiness.sourcePackageId],
    ["acceptanceReadinessId", readiness.acceptanceReadinessId],
    ["providerSelectionPreflightId", readiness.providerSelectionPreflightId],
    ["adapterPlanId", readiness.adapterPlanId],
    ["reviewDecisionReadinessId", readiness.reviewDecisionReadinessId],
  ] as const) {
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`Teacher draft persistence implementation readiness ${field} is required.`);
    }
  }

  if (readiness.mode !== "review-only") errors.push("Teacher draft persistence implementation readiness must remain review-only.");
  if (readiness.status !== "blocked" && readiness.status !== "ready-review") errors.push("Teacher draft persistence implementation readiness has an unsupported status.");
  if (readiness.providerNeutral !== true) errors.push("Teacher draft persistence implementation readiness must remain provider-neutral.");

  for (const [field, value] of [
    ["providerSelected", readiness.providerSelected],
    ["implementationAllowed", readiness.implementationAllowed],
    ["migrationAllowed", readiness.migrationAllowed],
    ["writesAllowed", readiness.writesAllowed],
    ["uploadsAllowed", readiness.uploadsAllowed],
    ["assignmentAllowed", readiness.assignmentAllowed],
    ["routeMutationAllowed", readiness.routeMutationAllowed],
    ["testExecutionAllowed", readiness.testExecutionAllowed],
  ] as const) {
    if (value !== false) errors.push(`Teacher draft persistence implementation readiness ${field} must remain false.`);
  }

  for (const [field, values] of [
    ["requiredWorkOrderRecords", readiness.requiredWorkOrderRecords],
    ["requiredEvidence", readiness.requiredEvidence],
    ["blockedActions", readiness.blockedActions],
    ["blockers", readiness.blockers],
    ["nextSteps", readiness.nextSteps],
  ] as const) {
    if (!Array.isArray(values) || values.length === 0 || values.some((value) => typeof value !== "string" || !value.trim())) {
      errors.push(`Teacher draft persistence implementation readiness ${field} must contain non-blank strings.`);
    }
  }

  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!readiness.blockedActions.includes(action)) errors.push(`Teacher draft persistence implementation readiness must block: ${action}.`);
  }

  const testIds = new Set<string>();
  if (!Array.isArray(readiness.acceptanceTests) || readiness.acceptanceTests.length === 0) {
    errors.push("Teacher draft persistence implementation readiness must define acceptance tests.");
  } else {
    for (const test of readiness.acceptanceTests) {
      if (!test || typeof test !== "object") {
        errors.push("Teacher draft persistence acceptance tests must contain objects.");
        continue;
      }
      if (testIds.has(test.testId)) errors.push(`Teacher draft persistence acceptance test is duplicated: ${test.testId}.`);
      testIds.add(test.testId);
      for (const [field, value] of [["testId", test.testId], ["label", test.label], ["purpose", test.purpose], ["evidenceRequired", test.evidenceRequired]] as const) {
        if (typeof value !== "string" || !value.trim()) errors.push(`Teacher draft persistence acceptance test ${field} must be non-blank.`);
      }
      if (test.status !== "not-run" && test.status !== "review-only") errors.push(`Teacher draft persistence acceptance test ${test.testId || "unknown"} has an unsupported status.`);
      if (!Array.isArray(test.passCriteria) || test.passCriteria.length === 0 || test.passCriteria.some((value) => typeof value !== "string" || !value.trim())) {
        errors.push(`Teacher draft persistence acceptance test ${test.testId || "unknown"} must list pass criteria.`);
      }
    }
  }
  for (const testId of REQUIRED_TEST_IDS) if (!testIds.has(testId)) errors.push(`Teacher draft persistence acceptance test is missing: ${testId}.`);
  if (readiness.status === "blocked" && readiness.blockers.length === 0) errors.push("Blocked teacher draft persistence implementation readiness must state a blocker.");
  return [...new Set(errors)];
}

export function validateTeacherDraftPersistenceImplementationReadinessSources(
  readiness: unknown,
  acceptanceReadiness: unknown,
  providerSelectionPreflight: unknown,
  adapterPlan: unknown,
  reviewDecisionReadiness: unknown,
): string[] {
  const errors: string[] = [];
  if (!isRecord(readiness)) return ["Teacher draft persistence implementation readiness source binding requires readiness."];
  for (const [value, label] of [[acceptanceReadiness, "acceptance readiness"], [providerSelectionPreflight, "provider selection preflight"], [adapterPlan, "adapter plan"], [reviewDecisionReadiness, "review decision readiness"]] as const) {
    if (!isRecord(value)) return [`Teacher draft persistence implementation readiness requires a ${label}.`];
  }
  const acceptance = acceptanceReadiness as Record<string, unknown>;
  const provider = providerSelectionPreflight as Record<string, unknown>;
  const adapter = adapterPlan as Record<string, unknown>;
  const review = reviewDecisionReadiness as Record<string, unknown>;

  for (const [left, right, message] of [
    [readiness.acceptanceReadinessId, acceptance.readinessId, "Readiness must match acceptance readiness id."],
    [readiness.providerSelectionPreflightId, provider.preflightId, "Readiness must match provider selection preflight id."],
    [readiness.adapterPlanId, adapter.planId, "Readiness must match adapter plan id."],
    [readiness.reviewDecisionReadinessId, review.readinessId, "Readiness must match review decision readiness id."],
    [readiness.tenantId, acceptance.tenantId, "Implementation readiness tenant must match acceptance readiness."],
    [readiness.draftId, acceptance.draftId, "Implementation readiness draft must match acceptance readiness."],
    [readiness.sourcePackageId, acceptance.sourcePackageId, "Implementation readiness package must match acceptance readiness."],
    [readiness.tenantId, provider.tenantId, "Implementation readiness tenant must match provider selection preflight."],
    [readiness.sourcePackageId, provider.packageId, "Implementation readiness package must match provider selection preflight."],
    [readiness.tenantId, review.tenantId, "Implementation readiness tenant must match review decision readiness."],
    [readiness.sourcePackageId, review.packageId, "Implementation readiness package must match review decision readiness."],
  ] as const) {
    if (!isNonBlankString(left) || !isNonBlankString(right) || left !== right) errors.push(message);
  }

  if (acceptance.mode !== "review-only" || acceptance.status !== "blocked") errors.push("Acceptance readiness source must remain blocked and review-only.");
  if (provider.providerSelected !== false || provider.writesAllowed !== false || provider.activationAllowed !== false) errors.push("Provider selection source must remain unselected with writes and activation blocked.");
  if (review.providerSelectionAllowed !== false || review.implementationAllowed !== false || review.writesAllowed !== false || review.activationAllowed !== false) errors.push("Review decision readiness source must remain blocked.");
  if (adapter.mode !== "hosted-managed" && adapter.mode !== "local-companion" && adapter.mode !== "hybrid") errors.push("Adapter plan must identify a supported deployment mode.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
function isNonBlankString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
