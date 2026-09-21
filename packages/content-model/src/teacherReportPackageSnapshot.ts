import type { TeacherLaunchReportAggregation, TeacherLaunchReportAggregationScope } from "./teacherLaunchReportAggregation";
import type {
  TeacherReportPackageBoundary,
  TeacherSessionEventAcceptanceGate,
  TeacherSessionProgressEventEnvelopeGate,
} from "./teacherReporting";
import type { TeacherReportExportPlan } from "./sessionSettings";

export type TeacherReportPackageSnapshotDeployment = "hosted-managed" | "local-classroom";

export interface TeacherReportPackageSnapshot {
  recordVersion: 1;
  category: "teacher-report-package-snapshot";
  snapshotId: string;
  storageMode: "provider-neutral";
  deploymentMode: TeacherReportPackageSnapshotDeployment;
  tenantId: string;
  packageId: string;
  launchCode: string;
  createdAt: string;
  report: TeacherLaunchReportAggregation;
  boundary: {
    status: TeacherReportPackageBoundary["status"];
    includedEvidence: string[];
    supportOnlySignals: string[];
    excludedSensitiveFields: string[];
    requiredBeforeExport: string[];
  };
  exportPlan: {
    readiness: TeacherReportExportPlan["readiness"];
    allowedFormats: TeacherReportExportPlan["allowedFormats"];
    includedScopes: TeacherReportExportPlan["includedScopes"];
    retentionPolicy: TeacherReportExportPlan["retentionPolicy"];
    policyAccepted: boolean;
    persistenceReady: boolean;
    excludesRawAudio: boolean;
    excludesTranscripts: boolean;
  };
  eventAcceptance: {
    gateId: string;
    status: TeacherSessionEventAcceptanceGate["status"];
    blockedCount: number;
    warningCount: number;
  };
  eventEnvelope: {
    gateId: string;
    status: TeacherSessionProgressEventEnvelopeGate["status"];
    taxonomyVersion: string;
    envelopeCount: number;
    blockedCount: number;
    warningCount: number;
  };
  exportAllowed: false;
  writesAllowed: false;
  rawLearnerAudioIncluded: false;
  learnerTranscriptIncluded: false;
  realLearnerIdentifiersIncluded: false;
}

export interface CreateTeacherReportPackageSnapshotArgs {
  scope: TeacherLaunchReportAggregationScope;
  deploymentMode: TeacherReportPackageSnapshotDeployment;
  createdAt: string;
  report: TeacherLaunchReportAggregation;
  boundary: TeacherReportPackageBoundary;
  reportPlan: TeacherReportExportPlan;
  eventAcceptance: TeacherSessionEventAcceptanceGate;
  eventEnvelope: TeacherSessionProgressEventEnvelopeGate;
}

export function createTeacherReportPackageSnapshot(
  args: CreateTeacherReportPackageSnapshotArgs,
): TeacherReportPackageSnapshot {
  const snapshot: TeacherReportPackageSnapshot = {
    recordVersion: 1,
    category: "teacher-report-package-snapshot",
    snapshotId: createTeacherReportPackageSnapshotId(args.scope),
    storageMode: "provider-neutral",
    deploymentMode: args.deploymentMode,
    tenantId: args.scope.tenantId,
    packageId: args.scope.packageId,
    launchCode: args.scope.launchCode,
    createdAt: args.createdAt,
    report: args.report,
    boundary: {
      status: args.boundary.status,
      includedEvidence: [...args.boundary.includedEvidence],
      supportOnlySignals: [...args.boundary.supportOnlySignals],
      excludedSensitiveFields: [...args.boundary.excludedSensitiveFields],
      requiredBeforeExport: [...args.boundary.requiredBeforeExport],
    },
    exportPlan: {
      readiness: args.reportPlan.readiness,
      allowedFormats: [...args.reportPlan.allowedFormats],
      includedScopes: [...args.reportPlan.includedScopes],
      retentionPolicy: args.reportPlan.retentionPolicy,
      policyAccepted: args.reportPlan.policyAccepted,
      persistenceReady: args.reportPlan.persistenceReady,
      excludesRawAudio: args.reportPlan.excludesRawAudio,
      excludesTranscripts: args.reportPlan.excludesTranscripts,
    },
    eventAcceptance: {
      gateId: args.eventAcceptance.gateId,
      status: args.eventAcceptance.status,
      blockedCount: args.eventAcceptance.items.filter((item) => item.status === "blocked").length,
      warningCount: args.eventAcceptance.items.filter((item) => item.status === "warning").length,
    },
    eventEnvelope: {
      gateId: args.eventEnvelope.gateId,
      status: args.eventEnvelope.status,
      taxonomyVersion: args.eventEnvelope.taxonomyVersion,
      envelopeCount: args.eventEnvelope.envelopeCount,
      blockedCount: args.eventEnvelope.blockedCount,
      warningCount: args.eventEnvelope.warningCount,
    },
    exportAllowed: false,
    writesAllowed: false,
    rawLearnerAudioIncluded: false,
    learnerTranscriptIncluded: false,
    realLearnerIdentifiersIncluded: false,
  };
  const errors = validateTeacherReportPackageSnapshot(snapshot);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return snapshot;
}

export function validateTeacherReportPackageSnapshot(snapshot: unknown): string[] {
  const errors: string[] = [];
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return ["Teacher report package snapshot must be an object."];
  }
  const candidate = snapshot as Partial<TeacherReportPackageSnapshot> & Record<string, unknown>;
  if (candidate.recordVersion !== 1) errors.push("Teacher report package snapshot recordVersion must be 1.");
  if (candidate.category !== "teacher-report-package-snapshot") errors.push("Teacher report package snapshot category is invalid.");
  if (candidate.storageMode !== "provider-neutral") errors.push("Teacher report package snapshot storageMode must be provider-neutral.");
  if (candidate.deploymentMode !== "hosted-managed" && candidate.deploymentMode !== "local-classroom") errors.push("Teacher report package snapshot deploymentMode is invalid.");
  if (candidate.exportAllowed !== false) errors.push("Teacher report package snapshot exportAllowed must remain false.");
  if (candidate.writesAllowed !== false) errors.push("Teacher report package snapshot writesAllowed must remain false.");
  if (candidate.rawLearnerAudioIncluded !== false) errors.push("Teacher report package snapshot must exclude raw learner audio.");
  if (candidate.learnerTranscriptIncluded !== false) errors.push("Teacher report package snapshot must exclude learner transcripts.");
  if (candidate.realLearnerIdentifiersIncluded !== false) errors.push("Teacher report package snapshot must exclude real learner identifiers.");
  for (const field of ["snapshotId", "tenantId", "packageId", "launchCode", "createdAt"] as const) {
    if (typeof candidate[field] !== "string" || candidate[field].trim().length === 0) errors.push(`Teacher report package snapshot ${field} is required.`);
  }
  if (typeof candidate.createdAt === "string" && Number.isNaN(Date.parse(candidate.createdAt))) errors.push("Teacher report package snapshot createdAt must be a valid timestamp.");
  if ("records" in candidate || "events" in candidate || "eventEnvelopes" in candidate) errors.push("Teacher report package snapshot must not embed raw event records.");

  const report = candidate.report;
  if (!report || typeof report !== "object" || Array.isArray(report)) {
    errors.push("Teacher report package snapshot report aggregation is required.");
  } else {
    const reportCandidate = report as Partial<TeacherLaunchReportAggregation>;
    if (reportCandidate.reportVersion !== 1) errors.push("Teacher report package snapshot report version must be 1.");
    const scope = reportCandidate.scope;
    if (!scope || scope.tenantId !== candidate.tenantId || scope.packageId !== candidate.packageId || scope.launchCode !== candidate.launchCode) {
      errors.push("Teacher report package snapshot report scope must match its tenant, package, and launch.");
    }
    if (!Array.isArray(reportCandidate.excludedFields) || !reportCandidate.excludedFields.includes("raw learner audio") || !reportCandidate.excludedFields.includes("learner transcripts") || !reportCandidate.excludedFields.includes("real learner identifiers")) {
      errors.push("Teacher report package snapshot report must preserve all privacy exclusions.");
    }
  }

  const eventAcceptance = candidate.eventAcceptance;
  if (!eventAcceptance || typeof eventAcceptance !== "object" || typeof eventAcceptance.gateId !== "string" || eventAcceptance.gateId.trim().length === 0) errors.push("Teacher report package snapshot event acceptance gate is required.");
  const eventEnvelope = candidate.eventEnvelope;
  if (!eventEnvelope || typeof eventEnvelope !== "object" || typeof eventEnvelope.gateId !== "string" || eventEnvelope.gateId.trim().length === 0) errors.push("Teacher report package snapshot event envelope gate is required.");
  const boundary = candidate.boundary;
  if (!boundary || typeof boundary !== "object" || !Array.isArray(boundary.excludedSensitiveFields)) errors.push("Teacher report package snapshot boundary exclusions are required.");
  const plan = candidate.exportPlan;
  if (!plan || typeof plan !== "object" || plan.excludesRawAudio !== true || plan.excludesTranscripts !== true) errors.push("Teacher report package snapshot export plan must exclude raw audio and transcripts.");
  return [...new Set(errors)];
}

export function createTeacherReportPackageSnapshotId(scope: TeacherLaunchReportAggregationScope): string {
  return `teacher-report-package-snapshot-v1:${scope.tenantId}:${scope.packageId}:${scope.launchCode}`;
}
