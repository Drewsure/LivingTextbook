import type { DeploymentChannel } from "@living-textbook/content-model";
import type {
  DurableRecordContract,
  PersistenceRecordReadiness,
} from "@living-textbook/content-model/src/persistenceRecords";
import {
  getDurableRecordReadinessWarnings,
  validateDurableRecordContracts,
} from "@living-textbook/content-model/src/persistenceRecords";

export type PersistenceReadinessStatus = "demo-static" | "needs-backend" | "needs-policy";

export type PersistenceBoundaryCategory =
  | "tenant-config"
  | "content-package"
  | "route-registry"
  | "launch-session"
  | "progress-event"
  | "media-manifest"
  | "deployment-profile"
  | "package-publish-gate"
  | "package-approval-ledger";

export interface PersistenceBoundary {
  boundaryId: string;
  category: PersistenceBoundaryCategory;
  label: string;
  status: PersistenceReadinessStatus;
  recordShape: string;
  whyItMatters: string;
  visibleTo: string[];
  deploymentChannels: DeploymentChannel[];
  nextDecision: string;
}

export interface PersistenceStrategyOption {
  optionId: string;
  label: string;
  recommendedForFirstPilot: boolean;
  costPosture: "lowest" | "controlled" | "higher";
  fit: string;
  caution: string;
}

export const sampleDurableRecordContracts: DurableRecordContract[] = [
  {
    recordId: "tenant-config-record",
    category: "tenant-config",
    label: "Tenant configuration record",
    readiness: "static-demo",
    sourceOfTruth: "TenantConfig plus tenant language and entitlement settings",
    requiredBeforePilot: false,
    containsStudentData: false,
    containsMediaRights: false,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    recommendedFirstPilotStore: ["source-control-demo", "hosted-database", "local-classroom-store"],
    note: "Static tenant config is acceptable for demos; partner self-maintenance requires an admin-editable record later.",
  },
  {
    recordId: "reviewed-content-package-record",
    category: "content-package",
    label: "Reviewed content package record",
    readiness: "durable-required",
    sourceOfTruth: "ContentPackage, unit payloads, audio cues, assist-language plans, multimedia plans",
    requiredBeforePilot: true,
    containsStudentData: false,
    containsMediaRights: false,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    recommendedFirstPilotStore: ["hosted-database", "local-classroom-store"],
    note: "PDF/DOCX intake must publish reviewed package versions rather than live-editing student routes from source files.",
  },
  {
    recordId: "qr-route-registry-record",
    category: "route-registry",
    label: "QR and route registry record",
    readiness: "durable-required",
    sourceOfTruth: "FrontDoorRouteRegistryEntry and PermanentQrRoute records",
    requiredBeforePilot: true,
    containsStudentData: false,
    containsMediaRights: false,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    recommendedFirstPilotStore: ["hosted-database", "local-classroom-store"],
    note: "Printed QR codes need stable IDs, redirects, and local fallback targets that survive yearly textbook updates.",
  },
  {
    recordId: "teacher-launch-session-record",
    category: "launch-session",
    label: "Teacher launch session and settings record",
    readiness: "durable-required",
    sourceOfTruth: "LaunchSession plus TeacherSessionSettings",
    requiredBeforePilot: true,
    containsStudentData: true,
    containsMediaRights: false,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    ownsTeacherSessionSettings: true,
    recommendedFirstPilotStore: ["hosted-database", "local-classroom-store", "school-policy"],
    note: "Teacher microphone approval, assist-language visibility, background media, AI Tutor state, and reporting settings belong here.",
  },
  {
    recordId: "progress-event-stream-record",
    category: "progress-event-stream",
    label: "Progress and media event stream record",
    readiness: "policy-required",
    sourceOfTruth: "GameProgressEvent, media events, recovery metadata, Star Dust changes, mastery updates",
    requiredBeforePilot: true,
    containsStudentData: true,
    containsMediaRights: false,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    recommendedFirstPilotStore: ["hosted-database", "local-classroom-store", "school-policy"],
    note: "This stream powers reports and recovery, but retention/export/access policy must be chosen before real student storage.",
  },
  {
    recordId: "media-manifest-rights-record",
    category: "media-manifest",
    label: "Media manifest and rights record",
    readiness: "durable-required",
    sourceOfTruth: "MediaAsset, UnitMediaPlaylist, UnitMultimediaPlan, rights status, local bundle paths",
    requiredBeforePilot: true,
    containsStudentData: false,
    containsMediaRights: true,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    recommendedFirstPilotStore: ["hosted-object-storage", "hosted-database", "local-classroom-store"],
    note: "Music, videos, chants, and posters need rights-safe manifests for hosted and local packages.",
  },
  {
    recordId: "deployment-profile-record",
    category: "deployment-profile",
    label: "Deployment profile record",
    readiness: "static-demo",
    sourceOfTruth: "TenantDeploymentProfile and pilot readiness decisions",
    requiredBeforePilot: false,
    containsStudentData: false,
    containsMediaRights: false,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    recommendedFirstPilotStore: ["source-control-demo", "hosted-database", "local-classroom-store"],
    note: "Demo profiles can stay static while hosted PWA, local server, and packaged app options are compared.",
  },
  {
    recordId: "report-export-policy-record",
    category: "report-export-policy",
    label: "Report export and retention policy record",
    readiness: "policy-required",
    sourceOfTruth: "School/tenant privacy, retention, export, parent access, and admin access rules",
    requiredBeforePilot: true,
    containsStudentData: true,
    containsMediaRights: false,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    recommendedFirstPilotStore: ["school-policy", "hosted-database", "local-classroom-store"],
    note: "Reports are a saleable feature, but real student event storage needs clear school policy before activation.",
  },
  {
    recordId: "package-publish-gate-record",
    category: "package-publish-gate",
    label: "Package publish gate record",
    readiness: "durable-required",
    sourceOfTruth: "PackagePublishGate, release-blocking items, gate status, owner, evidence, and next step fields",
    requiredBeforePilot: true,
    containsStudentData: false,
    containsMediaRights: true,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    recommendedFirstPilotStore: ["hosted-database", "hosted-object-storage", "local-classroom-store"],
    note: "The release gate must become durable so a tenant package cannot be promoted while media rights, reports, persistence, deployment, or policy gates remain open.",
  },
  {
    recordId: "package-approval-ledger-record",
    category: "package-approval-ledger",
    label: "Package approval ledger record",
    readiness: "policy-required",
    sourceOfTruth: "PackageApprovalLedger, sign-off roles, owners, evidence links, approver identity, timestamp, and release candidate",
    requiredBeforePilot: true,
    containsStudentData: false,
    containsMediaRights: true,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    recommendedFirstPilotStore: ["hosted-database", "hosted-object-storage", "local-classroom-store", "school-policy"],
    note: "The ledger needs policy and identity rules before real signatures, but its record shape should be fixed before backend selection.",
  },
];

export const sampleDurableRecordErrors = validateDurableRecordContracts(sampleDurableRecordContracts);
export const sampleDurableRecordWarnings = getDurableRecordReadinessWarnings(sampleDurableRecordContracts);

export const persistenceRecordReadinessLabels: Record<PersistenceRecordReadiness, string> = {
  "static-demo": "Static demo",
  "durable-required": "Durable required",
  "policy-required": "Policy required",
  "pilot-ready": "Pilot ready",
  "not-stored": "Not stored",
};

export const samplePersistenceBoundaries: PersistenceBoundary[] = [
  {
    boundaryId: "tenant-config-boundary",
    category: "tenant-config",
    label: "Tenant configuration",
    status: "demo-static",
    recordShape: "TenantConfig, branding tokens, feature entitlements, language settings",
    whyItMatters:
      "White-label partners need configurable branding, assist-language rules, avatar families, and optional premium features without MiniStar hard-coding.",
    visibleTo: ["Platform admin", "Tenant admin"],
    deploymentChannels: ["hosted-web", "installed-pwa", "desktop-app", "local-classroom-server"],
    nextDecision: "Keep static config for demos; move to reviewed tenant records before partner onboarding.",
  },
  {
    boundaryId: "content-package-boundary",
    category: "content-package",
    label: "Reviewed content packages",
    status: "needs-backend",
    recordShape: "ContentPackage, unit payloads, audio cues, assist-language plans, AI Tutor plans",
    whyItMatters:
      "PDF, DOCX, and spreadsheet imports must pass human review before any unit becomes student-facing.",
    visibleTo: ["Teacher", "Tenant admin", "Content reviewer"],
    deploymentChannels: ["hosted-web", "installed-pwa", "desktop-app", "local-classroom-server"],
    nextDecision: "Choose where approved package versions are stored and how yearly textbook updates are versioned.",
  },
  {
    boundaryId: "route-registry-boundary",
    category: "route-registry",
    label: "Front-door and permanent QR registry",
    status: "needs-backend",
    recordShape: "FrontDoorRouteRegistryEntry, PermanentQrRoute, fallback target, deployment preference",
    whyItMatters:
      "Printed textbook QR codes and teacher entry codes must survive content updates, deployment changes, and app refactors.",
    visibleTo: ["Teacher", "Tenant admin", "Platform admin"],
    deploymentChannels: ["hosted-web", "installed-pwa", "desktop-app", "local-classroom-server", "custom-deep-link"],
    nextDecision: "Define stable IDs and redirect/fallback behavior before printing partner textbook QR codes.",
  },
  {
    boundaryId: "launch-session-boundary",
    category: "launch-session",
    label: "Teacher launch sessions",
    status: "needs-backend",
    recordShape: "LaunchSession, access policy, teacher toggles, microphone approval, expiry settings",
    whyItMatters:
      "A teacher must be able to open, pause, close, and report on a class session across student devices.",
    visibleTo: ["Teacher", "Tenant admin"],
    deploymentChannels: ["hosted-web", "installed-pwa", "desktop-app", "local-classroom-server"],
    nextDecision: "Move browser-only teacher toggles into session records before classroom testing.",
  },
  {
    boundaryId: "progress-event-boundary",
    category: "progress-event",
    label: "Progress and media event stream",
    status: "needs-policy",
    recordShape: "GameProgressEvent, media events, recovery metadata, Star Dust changes, mastery updates",
    whyItMatters:
      "Teacher reports, recovery recommendations, and mastery progression require trustworthy event records.",
    visibleTo: ["Teacher", "Tenant admin", "Student summary"],
    deploymentChannels: ["hosted-web", "installed-pwa", "desktop-app", "local-classroom-server"],
    nextDecision: "Set retention, privacy, export, and parent/school policy before storing real student data.",
  },
  {
    boundaryId: "media-manifest-boundary",
    category: "media-manifest",
    label: "Media manifest and rights records",
    status: "needs-backend",
    recordShape: "MediaAsset, UnitMediaPlaylist, UnitMultimediaPlan, local bundle paths, rights status",
    whyItMatters:
      "Music, video, chants, and background media are part of the Living Textbook product and need ownership-safe delivery.",
    visibleTo: ["Teacher", "Tenant admin", "Content reviewer"],
    deploymentChannels: ["hosted-web", "installed-pwa", "desktop-app", "local-classroom-server"],
    nextDecision: "Choose hosted object storage and local bundle manifest rules before real partner media is imported.",
  },
  {
    boundaryId: "deployment-profile-boundary",
    category: "deployment-profile",
    label: "Deployment profile records",
    status: "demo-static",
    recordShape: "TenantDeploymentProfile, deployment requirements, readiness status, recommended pilot flag",
    whyItMatters:
      "Sales and implementation planning need to show which deployment path is being tested and which risks remain open.",
    visibleTo: ["Platform admin", "Tenant admin"],
    deploymentChannels: ["hosted-web", "desktop-app", "local-classroom-server"],
    nextDecision: "Keep profile data in source control for demos; move it to admin-editable records before partner rollout.",
  },
  {
    boundaryId: "package-publish-gate-boundary",
    category: "package-publish-gate",
    label: "Package publish gates",
    status: "needs-backend",
    recordShape: "PackagePublishGate, release candidate, blocking gates, owner, evidence, next step, not-allowed-yet rules",
    whyItMatters:
      "A tenant package must not move from demo-ready to pilot-publishable unless its release-blocking gates are durable, reviewable, and connected to evidence.",
    visibleTo: ["Platform admin", "Tenant admin", "Content reviewer"],
    deploymentChannels: ["hosted-web", "installed-pwa", "desktop-app", "local-classroom-server"],
    nextDecision: "Store publish-gate state beside package releases before any partner package is marked pilot-publishable.",
  },
  {
    boundaryId: "package-approval-ledger-boundary",
    category: "package-approval-ledger",
    label: "Package approval ledgers",
    status: "needs-policy",
    recordShape: "PackageApprovalLedger, sign-off owner, approver identity, timestamp, evidence links, blockers, release candidate",
    whyItMatters:
      "Publisher and school pilots need accountable sign-off for content, media, game QA, QR stability, privacy, deployment, and platform release review.",
    visibleTo: ["Platform admin", "Tenant admin", "School admin"],
    deploymentChannels: ["hosted-web", "installed-pwa", "desktop-app", "local-classroom-server"],
    nextDecision: "Define approver identity, timestamp, evidence, and rollback fields before real approval storage is enabled.",
  },
];

export const samplePersistenceStrategyOptions: PersistenceStrategyOption[] = [
  {
    optionId: "static-demo-data",
    label: "Static reviewed demo data",
    recommendedForFirstPilot: false,
    costPosture: "lowest",
    fit: "Useful for design and early sales demos where no real student data is stored.",
    caution: "Not enough for classroom reporting, partner self-maintenance, or durable QR registries.",
  },
  {
    optionId: "hosted-managed-db",
    label: "Hosted managed database",
    recommendedForFirstPilot: true,
    costPosture: "controlled",
    fit: "Best first pilot path for route registry, launch sessions, progress reports, package release gates, approval ledgers, and admin review without local installer complexity.",
    caution: "Requires privacy rules, access control, backup/export policy, approver identity rules, and monthly service cost planning.",
  },
  {
    optionId: "local-first-store",
    label: "Local-first classroom store",
    recommendedForFirstPilot: false,
    costPosture: "higher",
    fit: "Important for closed textbook companion deployments and schools that cannot rely on hosted services.",
    caution: "Needs sync/export, backup, device support, update, approval audit handling, and QR/deep-link fallback decisions.",
  },
];
