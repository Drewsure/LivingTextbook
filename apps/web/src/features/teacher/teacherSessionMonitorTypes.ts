import type {
  ContentPackage,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  ProgressEventEnvelope,
  ProgressEventSettingsContext,
  StudentProgressionState,
  TeacherReportExportPlan,
  TeacherSessionControlAction,
  TeacherSessionSetting,
  TeacherSessionSettings,
  UnitPayload,
} from "@living-textbook/content-model";
import type { ClassRosterPlan } from "@living-textbook/content-model/src/classRoster";
import type { validateCanonicalGameReportEvidence } from "@living-textbook/content-model";
import type { TenantConfig } from "@/features/tenant/types";

export interface TeacherSessionMonitorMetric {
  label: string;
  value: string;
  note: string;
}

export type TeacherSessionPreflightStatus = "pass" | "warning" | "blocked";

export interface TeacherSessionPreflightCheck {
  checkId: string;
  label: string;
  status: TeacherSessionPreflightStatus;
  owner: "teacher" | "platform" | "policy" | "persistence";
  note: string;
}

export type TeacherSessionEventAcceptanceStatus = "demo-only" | "blocked" | "ready";
export type TeacherSessionEventAcceptanceItemStatus = "pass" | "warning" | "blocked";

export interface TeacherSessionEventAcceptanceItem {
  itemId: string;
  label: string;
  status: TeacherSessionEventAcceptanceItemStatus;
  owner: "teacher" | "platform" | "policy" | "persistence";
  evidence: string;
  nextStep: string;
}

export interface TeacherSessionEventAcceptanceGate {
  gateId: string;
  label: string;
  status: TeacherSessionEventAcceptanceStatus;
  decision: string;
  summary: string;
  items: TeacherSessionEventAcceptanceItem[];
}

export type TeacherSessionProgressEventEnvelopeGateStatus = "blocked" | "demo-only" | "ready";

export interface TeacherSessionProgressEventEnvelopeGate {
  gateId: string;
  label: string;
  status: TeacherSessionProgressEventEnvelopeGateStatus;
  standardEventContractId: string;
  taxonomyVersion: string;
  eventAcceptanceGateId: string;
  decision: string;
  summary: string;
  envelopeCount: number;
  blockedCount: number;
  warningCount: number;
  requiredFields: string[];
  guardBlocks: string[];
  guardWarnings: string[];
  settingsContexts: ProgressEventSettingsContext[];
  sampleEnvelope?: ProgressEventEnvelope;
}

export type TeacherSessionPilotReadinessStatus = "demo-safe" | "pilot-blocked" | "pilot-ready";

export interface TeacherSessionPilotReadinessSnapshot {
  snapshotId: string;
  label: string;
  status: TeacherSessionPilotReadinessStatus;
  decision: string;
  summary: string;
  demoSafeSignals: string[];
  pilotBlockers: string[];
  requiredBeforeLiveUse: string[];
}

export type TeacherReportPackageBoundaryStatus = "demo-preview" | "export-blocked" | "export-ready";

export interface TeacherReportPackageBoundaryMetric {
  label: string;
  value: string;
  note: string;
}

export interface TeacherReportPackageBoundary {
  boundaryId: string;
  label: string;
  status: TeacherReportPackageBoundaryStatus;
  decision: string;
  summary: string;
  metrics: TeacherReportPackageBoundaryMetric[];
  includedEvidence: string[];
  supportOnlySignals: string[];
  excludedSensitiveFields: string[];
  requiredBeforeExport: string[];
}

export type TeacherSessionLaunchGateBoundaryStatus = "launch-blocked" | "preview-only" | "ready";

export interface TeacherSessionLaunchGateBoundary {
  boundaryId: string;
  label: string;
  status: TeacherSessionLaunchGateBoundaryStatus;
  launchStatus: string;
  decision: string;
  summary: string;
  workspacePath: string;
  sourceOfTruth: string;
  blockedActions: string[];
  requiredBeforeLiveSession: string[];
  reportRules: string[];
}

export interface TeacherSessionMonitorContext {
  tenant: TenantConfig;
  contentPackage: ContentPackage;
  unit?: UnitPayload;
  classRosterPlan?: ClassRosterPlan;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  events: GameProgressEvent[];
  metrics: TeacherSessionMonitorMetric[];
  assignedGameModes: GameModeId[];
  audioCoveredGameModes: GameModeId[];
  assignedGameAudioGaps: GameModeId[];
  sessionSettings: TeacherSessionSettings;
  settings: TeacherSessionSetting[];
  sessionSettingErrors: string[];
  sessionSettingWarnings: string[];
  sessionControlActions: TeacherSessionControlAction[];
  sessionControlErrors: string[];
  sessionControlWarnings: string[];
  reportExportPlan: TeacherReportExportPlan;
  reportExportErrors: string[];
  reportExportWarnings: string[];
  reportPackageBoundary: TeacherReportPackageBoundary;
  launchGateBoundary: TeacherSessionLaunchGateBoundary;
  preflightChecks: TeacherSessionPreflightCheck[];
  eventAcceptanceGate: TeacherSessionEventAcceptanceGate;
  eventEnvelopeGate: TeacherSessionProgressEventEnvelopeGate;
  canonicalGameReportEvidence: ReturnType<typeof validateCanonicalGameReportEvidence>;
  pilotReadinessSnapshot: TeacherSessionPilotReadinessSnapshot;
  readinessNotes: string[];
}
