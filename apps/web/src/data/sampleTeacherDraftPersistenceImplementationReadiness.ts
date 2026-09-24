import {
  validateTeacherDraftPersistenceImplementationReadiness,
  validateTeacherDraftPersistenceImplementationReadinessSources,
  type TeacherDraftPersistenceImplementationReadiness,
} from "@living-textbook/content-model";
import { samplePersistenceAdapterPlans } from "./samplePersistenceAdapterPlan";
import { samplePersistenceProviderSelectionPreflight } from "./samplePersistenceProviderSelectionPreflight";
import { samplePilotReviewDecisionImplementationReadiness } from "./samplePilotReviewDecisionImplementationReadiness";
import { sampleTeacherDraftAcceptanceReadiness } from "./sampleTeacherDraftAcceptanceReadiness";

const sampleHostedPilotAdapter = samplePersistenceAdapterPlans.find((plan) => plan.planId === "hosted-pilot-adapter");
if (!sampleHostedPilotAdapter) throw new Error("The hosted pilot adapter plan is required for implementation-readiness review.");

export const sampleTeacherDraftPersistenceImplementationReadiness: TeacherDraftPersistenceImplementationReadiness = {
  readinessId: "teacher-draft-persistence-implementation-readiness-sample-publisher-l1-u1",
  tenantId: sampleTeacherDraftAcceptanceReadiness.tenantId,
  draftId: sampleTeacherDraftAcceptanceReadiness.draftId,
  sourcePackageId: sampleTeacherDraftAcceptanceReadiness.sourcePackageId,
  acceptanceReadinessId: sampleTeacherDraftAcceptanceReadiness.readinessId,
  providerSelectionPreflightId: samplePersistenceProviderSelectionPreflight.preflightId,
  storageSelectionPreflightId: samplePersistenceProviderSelectionPreflight.preflightId,
  storageSelectionGateId: samplePersistenceProviderSelectionPreflight.evidenceStorageGateId,
  storageSelectionStatus: "blocked",
  storageSelectionAllowed: false,
  adapterPlanId: sampleHostedPilotAdapter.planId,
  reviewDecisionReadinessId: samplePilotReviewDecisionImplementationReadiness.readinessId,
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
  requiredWorkOrderRecords: [
    "Tenant-scoped adapter boundary and authorization record",
    "Draft schema, source lineage, and idempotency record",
    "Retention, export, deletion, rollback, and recovery record",
    "Hosted/local parity and deployment-cost evidence record",
  ],
  acceptanceTests: [
    { testId: "tenant-isolation", label: "Tenant isolation", purpose: "Reject cross-tenant reads, writes, exports, and assignment attempts.", passCriteria: ["A tenant mismatch is rejected before persistence.", "No record or error response leaks another tenant's content."], status: "not-run", evidenceRequired: "Recorded negative test matrix with tenant identifiers redacted." },
    { testId: "draft-lineage-identity", label: "Draft schema and source lineage", purpose: "Preserve exact draft, source package, unit, and release-candidate identity.", passCriteria: ["Every saved draft references one verified source lineage.", "Schema version and release candidate are immutable for a save."], status: "not-run", evidenceRequired: "Schema fixture and lineage replay report." },
    { testId: "owner-policy-binding", label: "Owner and policy binding", purpose: "Require teacher review authority and school or tenant policy evidence together.", passCriteria: ["Teacher identity never implies policy acceptance.", "Unaccepted policy keeps persistence and assignment blocked."], status: "not-run", evidenceRequired: "Policy-binding replay with blocked and accepted-review cases." },
    { testId: "idempotent-save", label: "Deterministic idempotent save", purpose: "Define the future save contract without enabling a live write.", passCriteria: ["The same idempotency key produces one deterministic result.", "A conflicting payload is rejected rather than silently merged."], status: "review-only", evidenceRequired: "Provider-neutral contract test plan; no live provider execution." },
    { testId: "raw-audio-transcript-exclusion", label: "Raw audio and transcript exclusion", purpose: "Keep raw learner microphone audio and transcripts outside the core teacher draft record.", passCriteria: ["Raw learner audio is rejected.", "Learner transcripts are rejected unless a separately approved entitlement exists."], status: "not-run", evidenceRequired: "Payload rejection fixtures and policy review." },
    { testId: "retention-export-deletion", label: "Retention, export, and deletion", purpose: "Prove tenant-controlled lifecycle behavior before any data is stored.", passCriteria: ["Export scope is tenant- and package-bound.", "Deletion and retention requests are auditable and reversible only where policy allows."], status: "not-run", evidenceRequired: "Lifecycle matrix and dry-run evidence." },
    { testId: "hosted-local-parity", label: "Hosted and local parity", purpose: "Keep hosted, installed PWA, and closed-local deployments on one contract.", passCriteria: ["The same canonical record shape is accepted across deployment channels.", "Unsupported capabilities fail explicitly rather than degrading silently."], status: "not-run", evidenceRequired: "Cross-adapter contract comparison." },
    { testId: "rollback-recovery", label: "Rollback and recovery", purpose: "Protect QR routes, package versions, and teacher reports during recovery.", passCriteria: ["Rollback does not mutate the source package or student history.", "Recovery evidence identifies the exact package and tenant scope."], status: "not-run", evidenceRequired: "Recovery rehearsal record with immutable identifiers." },
    { testId: "assignment-promotion-guard", label: "Assignment and promotion guard", purpose: "Prevent draft persistence from becoming student-visible without approval.", passCriteria: ["Unapproved drafts cannot receive a student assignment.", "Promotion requires the canonical verification and release gates."], status: "not-run", evidenceRequired: "Blocked route and assignment transition matrix." },
  ],
  requiredEvidence: [
    "Accepted owner and school-policy evidence for the exact draft scope",
    "Provider-neutral adapter contract and cost comparison",
    "Tenant isolation, idempotency, retention, export, deletion, rollback, and recovery evidence",
    "Hosted/local parity and student-data exclusion evidence",
  ],
  blockedActions: [
    "No provider selection",
    "No implementation work",
    "No migration",
    "No persistence writes",
    "No media uploads",
    "No test execution against live infrastructure",
    "No route mutation",
    "No student assignment or package promotion",
  ],
  blockers: [
    "The acceptance readiness and provider selection gates remain blocked.",
    "The hosted pilot adapter is a candidate work order only; it is not selected or activated.",
    "Acceptance tests are defined for review but have not been executed against live infrastructure.",
  ],
  nextSteps: [
    "Complete human policy acceptance for the exact tenant, draft, package, and release candidate.",
    "Approve the provider-neutral acceptance-test packet and assign evidence owners.",
    "Select a deployment path only after the policy and evidence gates pass.",
  ],
};

export const sampleTeacherDraftPersistenceImplementationReadinessErrors = [
  ...validateTeacherDraftPersistenceImplementationReadiness(sampleTeacherDraftPersistenceImplementationReadiness),
  ...validateTeacherDraftPersistenceImplementationReadinessSources(
    sampleTeacherDraftPersistenceImplementationReadiness,
    sampleTeacherDraftAcceptanceReadiness,
    samplePersistenceProviderSelectionPreflight,
    sampleHostedPilotAdapter,
    samplePilotReviewDecisionImplementationReadiness,
  ),
];
