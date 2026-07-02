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
