import type { DeploymentChannel } from "./index";
import type { PersistenceRecordCategory, PersistenceStorageTier } from "./persistenceRecords";

export type PersistenceAdapterMode = "static-demo" | "hosted-managed" | "local-classroom";
export type PersistenceWriteReadiness = "demo-only" | "requires-backend" | "requires-policy" | "pilot-ready";

export interface PersistenceWriteIntent {
  intentId: string;
  category: PersistenceRecordCategory;
  label: string;
  readiness: PersistenceWriteReadiness;
  targetStore: PersistenceStorageTier[];
  deploymentChannels: DeploymentChannel[];
  requiredBeforePilot: boolean;
  containsStudentData: boolean;
  requiresSchoolPolicy: boolean;
  canRunOffline: boolean;
  allowsExport: boolean;
  rejectsRawAudio: boolean;
  rejectsTranscripts: boolean;
  preservesEventEffectTaxonomy?: boolean;
  requiresEventAcceptanceGate?: boolean;
  preservesReportEventAcceptanceSummary?: boolean;
  preservesGameAudioCoverageSnapshot?: boolean;
  preservesTeacherSessionSettingsSnapshot?: boolean;
  preservesTeacherSessionEventAcceptanceGate?: boolean;
  preservesEarnedCollectionRules?: boolean;
  rejectsRandomRewardPressure?: boolean;
  preservesDraftReviewGate?: boolean;
  blocksDirectStudentAssignment?: boolean;
  preservesLibrarySourceLineage?: boolean;
  blocksStudentDataCopy?: boolean;
  blocksPublicCommunityPublishing?: boolean;
  note: string;
}

export interface PersistenceAdapterPlan {
  planId: string;
  label: string;
  mode: PersistenceAdapterMode;
  recommendedForFirstPilot: boolean;
  costPosture: "lowest" | "controlled" | "higher";
  deploymentChannels: DeploymentChannel[];
  writeIntents: PersistenceWriteIntent[];
  handoffSteps: string[];
  note: string;
}

export function validatePersistenceAdapterPlan(plan: PersistenceAdapterPlan): string[] {
  const errors: string[] = [];
  const intentIds = new Set<string>();

  if (plan.planId.trim().length === 0) {
    errors.push("Persistence adapter plan must include a plan id.");
  }

  if (plan.label.trim().length === 0) {
    errors.push(`Persistence adapter plan ${plan.planId} must include a label.`);
  }

  if (plan.writeIntents.length === 0) {
    errors.push(`Persistence adapter plan ${plan.planId} must list write intents.`);
  }

  if (plan.handoffSteps.length === 0) {
    errors.push(`Persistence adapter plan ${plan.planId} must list handoff steps.`);
  }

  for (const intent of plan.writeIntents) {
    if (intent.intentId.trim().length === 0) {
      errors.push(`Persistence adapter plan ${plan.planId} includes an intent without an id.`);
    }

    if (intentIds.has(intent.intentId)) {
      errors.push(`Duplicate persistence write intent id: ${intent.intentId}.`);
    }

    intentIds.add(intent.intentId);

    if (intent.label.trim().length === 0) {
      errors.push(`Persistence write intent ${intent.intentId} must include a label.`);
    }

    if (intent.targetStore.length === 0) {
      errors.push(`Persistence write intent ${intent.intentId} must name at least one target store.`);
    }

    if (intent.deploymentChannels.length === 0) {
      errors.push(`Persistence write intent ${intent.intentId} must name at least one deployment channel.`);
    }

    if (intent.note.trim().length === 0) {
      errors.push(`Persistence write intent ${intent.intentId} must include a note.`);
    }

    if (intent.containsStudentData && !intent.requiresSchoolPolicy) {
      errors.push(`Student-data write intent ${intent.intentId} must require school or tenant policy.`);
    }

    if (!intent.rejectsRawAudio) {
      errors.push(`Core persistence write intent ${intent.intentId} must reject raw learner audio.`);
    }

    if (!intent.rejectsTranscripts) {
      errors.push(`Core persistence write intent ${intent.intentId} must reject learner transcripts.`);
    }

    if (intent.readiness === "pilot-ready" && intent.requiredBeforePilot && intent.containsStudentData && !intent.requiresSchoolPolicy) {
      errors.push(`Pilot-ready student-data write intent ${intent.intentId} must include policy readiness.`);
    }

    if (intent.category === "progress-event-stream" && !intent.preservesEventEffectTaxonomy) {
      errors.push(`Progress event write intent ${intent.intentId} must preserve event effect taxonomy.`);
    }

    if (intent.category === "progress-event-stream" && intent.containsStudentData && !intent.requiresEventAcceptanceGate) {
      errors.push(`Progress event write intent ${intent.intentId} must require a passed teacher session event acceptance gate.`);
    }

    if (intent.category === "teacher-report-package" && !intent.preservesReportEventAcceptanceSummary) {
      errors.push(`Teacher report package write intent ${intent.intentId} must preserve event acceptance summaries.`);
    }

    if (intent.category === "collection-inventory" && !intent.preservesEarnedCollectionRules) {
      errors.push(`Collection inventory write intent ${intent.intentId} must preserve earned collection rules.`);
    }

    if (intent.category === "collection-inventory" && !intent.rejectsRandomRewardPressure) {
      errors.push(`Collection inventory write intent ${intent.intentId} must reject random reward pressure.`);
    }

    if (intent.category === "teacher-draft-package" && !intent.preservesDraftReviewGate) {
      errors.push(`Teacher draft package write intent ${intent.intentId} must preserve review gates.`);
    }

    if (intent.category === "teacher-draft-package" && !intent.blocksDirectStudentAssignment) {
      errors.push(`Teacher draft package write intent ${intent.intentId} must block direct student assignment.`);
    }

    if (intent.category === "tenant-library-item" && !intent.preservesLibrarySourceLineage) {
      errors.push(`Tenant library write intent ${intent.intentId} must preserve source lineage.`);
    }

    if (intent.category === "tenant-library-item" && !intent.blocksStudentDataCopy) {
      errors.push(`Tenant library write intent ${intent.intentId} must block student data copies.`);
    }

    if (intent.category === "tenant-library-item" && !intent.blocksPublicCommunityPublishing) {
      errors.push(`Tenant library write intent ${intent.intentId} must block public community publishing.`);
    }

    if (intent.intentId.includes("package-audio-coverage") && !intent.preservesGameAudioCoverageSnapshot) {
      errors.push(`Package game/audio coverage write intent ${intent.intentId} must preserve reviewed game/audio coverage snapshots.`);
    }

    if (intent.category === "launch-session" && !intent.preservesTeacherSessionSettingsSnapshot) {
      errors.push(`Launch session write intent ${intent.intentId} must preserve teacher session settings snapshots.`);
    }

    if (intent.category === "launch-session" && !intent.preservesTeacherSessionEventAcceptanceGate) {
      errors.push(`Launch session write intent ${intent.intentId} must preserve teacher session event acceptance gates.`);
    }
  }

  return errors;
}

export function getPersistenceAdapterWarnings(plan: PersistenceAdapterPlan): string[] {
  const warnings: string[] = [];

  if (plan.mode === "static-demo") {
    warnings.push(`${plan.label} is useful for demos, but cannot support real teacher reports or QR registry changes.`);
  }

  for (const intent of plan.writeIntents) {
    if (intent.requiredBeforePilot && intent.readiness !== "pilot-ready") {
      warnings.push(`${intent.label} must be resolved before pilot use. Current readiness: ${intent.readiness}.`);
    }

    if (intent.containsStudentData && intent.readiness !== "pilot-ready") {
      warnings.push(`${intent.label} contains student data and needs policy plus persistence before live use.`);
    }

    if (intent.allowsExport && !intent.requiresSchoolPolicy) {
      warnings.push(`${intent.label} allows export and should require school or tenant policy.`);
    }
  }

  return warnings;
}
