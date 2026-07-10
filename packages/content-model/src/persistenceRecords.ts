export type PersistenceRecordCategory =
  | "tenant-config"
  | "content-package"
  | "route-registry"
  | "launch-session"
  | "progress-event-stream"
  | "media-manifest"
  | "deployment-profile"
  | "report-export-policy"
  | "teacher-report-package"
  | "package-release-candidate"
  | "package-publish-gate"
  | "package-approval-ledger";

export type PersistenceRecordReadiness =
  | "static-demo"
  | "durable-required"
  | "policy-required"
  | "pilot-ready"
  | "not-stored";

export type PersistenceStorageTier =
  | "source-control-demo"
  | "hosted-database"
  | "hosted-object-storage"
  | "local-classroom-store"
  | "school-policy";

export interface DurableRecordContract {
  recordId: string;
  category: PersistenceRecordCategory;
  label: string;
  readiness: PersistenceRecordReadiness;
  sourceOfTruth: string;
  requiredBeforePilot: boolean;
  containsStudentData: boolean;
  containsMediaRights: boolean;
  supportsLocalDeployment: boolean;
  storesRawAudio: boolean;
  storesTranscript: boolean;
  ownsTeacherSessionSettings?: boolean;
  recommendedFirstPilotStore: PersistenceStorageTier[];
  note: string;
}

export function validateDurableRecordContracts(records: DurableRecordContract[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const record of records) {
    if (record.recordId.trim().length === 0) {
      errors.push("Durable record contract must include a record id.");
    }

    if (ids.has(record.recordId)) {
      errors.push(`Duplicate durable record id: ${record.recordId}.`);
    }

    ids.add(record.recordId);

    if (record.label.trim().length === 0) {
      errors.push(`Durable record ${record.recordId} must include a label.`);
    }

    if (record.sourceOfTruth.trim().length === 0) {
      errors.push(`Durable record ${record.recordId} must identify a source of truth.`);
    }

    if (record.storesRawAudio) {
      errors.push(`Durable record ${record.recordId} must not store raw learner audio in the core persistence scaffold.`);
    }

    if (record.storesTranscript) {
      errors.push(`Durable record ${record.recordId} must not store learner transcripts in the core persistence scaffold.`);
    }

    if (record.containsStudentData && record.readiness === "static-demo") {
      errors.push(`Student-data record ${record.recordId} cannot remain static-demo for pilot use.`);
    }

    if (record.ownsTeacherSessionSettings && record.category !== "launch-session") {
      errors.push(`Teacher session settings must belong to a launch-session record, not ${record.category}.`);
    }

    if (record.supportsLocalDeployment && !record.recommendedFirstPilotStore.includes("local-classroom-store")) {
      errors.push(`Local-capable record ${record.recordId} must name the local classroom store path.`);
    }
  }

  return errors;
}

export function getDurableRecordReadinessWarnings(records: DurableRecordContract[]): string[] {
  const warnings: string[] = [];

  for (const record of records) {
    if (record.requiredBeforePilot && record.readiness !== "pilot-ready") {
      warnings.push(`${record.label} must be resolved before a real pilot. Current readiness: ${record.readiness}.`);
    }

    if (record.containsStudentData && !record.recommendedFirstPilotStore.includes("school-policy")) {
      warnings.push(`${record.label} contains student data and must include a school-policy decision.`);
    }

    if (record.containsMediaRights && !record.recommendedFirstPilotStore.includes("hosted-object-storage")) {
      warnings.push(`${record.label} contains media rights data and should include an object-storage or bundle manifest decision.`);
    }
  }

  return warnings;
}
