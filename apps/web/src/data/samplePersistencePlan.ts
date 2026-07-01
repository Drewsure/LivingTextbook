import type { DeploymentChannel } from "@living-textbook/content-model";

export type PersistenceReadinessStatus = "demo-static" | "needs-backend" | "needs-policy";

export type PersistenceBoundaryCategory =
  | "tenant-config"
  | "content-package"
  | "route-registry"
  | "launch-session"
  | "progress-event"
  | "media-manifest"
  | "deployment-profile";

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
    fit: "Best first pilot path for route registry, launch sessions, progress reports, and admin review without local installer complexity.",
    caution: "Requires privacy rules, access control, backup/export policy, and monthly service cost planning.",
  },
  {
    optionId: "local-first-store",
    label: "Local-first classroom store",
    recommendedForFirstPilot: false,
    costPosture: "higher",
    fit: "Important for closed textbook companion deployments and schools that cannot rely on hosted services.",
    caution: "Needs sync/export, backup, device support, update, and QR/deep-link fallback decisions.",
  },
];
