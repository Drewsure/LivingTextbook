import type {
  DurableRecordContract,
  PersistenceAdapterPlan,
  PersistenceWriteIntent,
} from "@living-textbook/content-model";
import {
  validateDurableRecordContracts,
  validatePersistenceAdapterPlan,
} from "@living-textbook/content-model";

export const samplePilotReviewDecisionRecord: DurableRecordContract = {
  recordId: "sample-publisher-pilot-review-decision",
  category: "pilot-review-decision",
  label: "Canonical pilot review decision record",
  readiness: "durable-required",
  sourceOfTruth: "Canonical teacher review decision contract and evidence bindings",
  requiredBeforePilot: false,
  containsStudentData: false,
  containsMediaRights: false,
  supportsLocalDeployment: true,
  storesRawAudio: false,
  storesTranscript: false,
  preservesTenantBoundary: true,
  tenantBoundaryKey: "tenantId",
  preservesPilotReviewDecision: true,
  blocksPilotReviewDecisionActivation: true,
  recommendedFirstPilotStore: ["hosted-database", "local-classroom-store"],
  note:
    "Stores the review-only decision, blockers, required next steps, and evidence bindings as metadata. It must never become an activation or student-launch authority by itself.",
};

export const samplePilotReviewDecisionWriteIntents: PersistenceWriteIntent[] = [
  {
    intentId: "hosted-pilot-review-decision-write",
    category: "pilot-review-decision",
    label: "Write hosted pilot review decision metadata",
    readiness: "requires-backend",
    targetStore: ["hosted-database"],
    deploymentChannels: ["hosted-web", "installed-pwa"],
    requiredBeforePilot: false,
    containsStudentData: false,
    requiresSchoolPolicy: false,
    canRunOffline: false,
    allowsExport: false,
    rejectsRawAudio: true,
    rejectsTranscripts: true,
    preservesTenantBoundary: true,
    tenantBoundaryKey: "tenantId",
    preservesPilotReviewDecision: true,
    blocksPilotReviewDecisionActivation: true,
    note: "Provider-neutral hosted storage may retain the canonical review decision for audit and teacher visibility, but it cannot authorize pilot launch or student data collection.",
  },
  {
    intentId: "local-pilot-review-decision-write",
    category: "pilot-review-decision",
    label: "Write local pilot review decision metadata",
    readiness: "requires-backend",
    targetStore: ["local-classroom-store"],
    deploymentChannels: ["local-classroom-server", "desktop-app"],
    requiredBeforePilot: false,
    containsStudentData: false,
    requiresSchoolPolicy: false,
    canRunOffline: true,
    allowsExport: false,
    rejectsRawAudio: true,
    rejectsTranscripts: true,
    preservesTenantBoundary: true,
    tenantBoundaryKey: "tenantId",
    preservesPilotReviewDecision: true,
    blocksPilotReviewDecisionActivation: true,
    note: "Closed deployments may retain the same review metadata locally for inspection and recovery without enabling approval capture, launch, or report export.",
  },
];

const hostedPilotReviewDecisionPlan: PersistenceAdapterPlan = {
  planId: "hosted-pilot-review-decision-boundary",
  label: "Hosted pilot review decision boundary",
  mode: "hosted-managed",
  recommendedForFirstPilot: false,
  costPosture: "controlled",
  deploymentChannels: ["hosted-web", "installed-pwa"],
  writeIntents: [samplePilotReviewDecisionWriteIntents[0]],
  handoffSteps: [
    "Persist only the review decision and evidence bindings after the provider contract is selected.",
    "Keep activation, student launch, report export, and approval capture blocked in the adapter.",
  ],
  note: "A metadata boundary for review continuity, not a live activation path.",
};

const localPilotReviewDecisionPlan: PersistenceAdapterPlan = {
  planId: "local-pilot-review-decision-boundary",
  label: "Local pilot review decision boundary",
  mode: "local-classroom",
  recommendedForFirstPilot: false,
  costPosture: "higher",
  deploymentChannels: ["local-classroom-server", "desktop-app"],
  writeIntents: [samplePilotReviewDecisionWriteIntents[1]],
  handoffSteps: [
    "Retain the same tenant-scoped metadata shape in a closed local bundle.",
    "Require an explicit future policy decision before any local record can influence launch readiness.",
  ],
  note: "The local fallback preserves review evidence without creating a hidden approval authority.",
};

export const samplePilotReviewDecisionPersistenceErrors = [
  ...validateDurableRecordContracts([samplePilotReviewDecisionRecord]),
  ...validatePersistenceAdapterPlan(hostedPilotReviewDecisionPlan),
  ...validatePersistenceAdapterPlan(localPilotReviewDecisionPlan),
];
