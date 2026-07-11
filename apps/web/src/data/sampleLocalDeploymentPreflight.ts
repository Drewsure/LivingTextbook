export type LocalDeploymentPreflightStatus = "pass" | "warning" | "blocked";
export type LocalCompanionReleaseGateStatus = "pass" | "warning" | "blocked";

export interface LocalDeploymentPreflightCheck {
  checkId: string;
  label: string;
  status: LocalDeploymentPreflightStatus;
  owner: "platform" | "tenant" | "school" | "publisher" | "persistence";
  note: string;
}

export interface LocalDeploymentPreflightPlan {
  planId: string;
  label: string;
  summary: string;
  recommendation: string;
  checks: LocalDeploymentPreflightCheck[];
}

export interface LocalCompanionReleaseGateItem {
  gateId: string;
  label: string;
  status: LocalCompanionReleaseGateStatus;
  owner: "platform" | "tenant" | "school" | "publisher" | "persistence";
  evidence: string;
  blocker: string;
  nextAction: string;
}

export interface LocalCompanionReleaseGate {
  gateId: string;
  label: string;
  decision: string;
  summary: string;
  items: LocalCompanionReleaseGateItem[];
}

export const sampleLocalDeploymentPreflightPlan: LocalDeploymentPreflightPlan = {
  planId: "sample-publisher-local-deployment-preflight",
  label: "Closed local companion preflight",
  summary:
    "Readiness checks for a closed textbook companion that can run with bundled content, audio, video, routes, and local reporting.",
  recommendation:
    "Keep hosted PWA as the first pilot path. Treat local classroom server and packaged local app as product requirements that need installer/update, backup, report export, media rights, and QR/deep-link decisions before production.",
  checks: [
    {
      checkId: "content-bundle",
      label: "Content bundle manifest",
      status: "warning",
      owner: "platform",
      note: "Planning manifests exist, but no production bundle loader, checksums, or signed package format is implemented.",
    },
    {
      checkId: "media-bundle",
      label: "Audio/video bundle",
      status: "blocked",
      owner: "tenant",
      note: "Real partner media files, rights proof, offline distribution permission, and checksums are missing.",
    },
    {
      checkId: "installer-update",
      label: "Installer and yearly updates",
      status: "blocked",
      owner: "publisher",
      note: "Packaged app updates, rollback, edition upgrades, and content migration strategy are not designed yet.",
    },
    {
      checkId: "local-reporting",
      label: "Local reporting and export",
      status: "blocked",
      owner: "persistence",
      note: "Local storage, teacher export, backup, restore, and optional sync policy are unresolved.",
    },
    {
      checkId: "qr-deep-link",
      label: "QR and deep-link behavior",
      status: "warning",
      owner: "platform",
      note: "Hybrid QR strategy is defined, but app deep-link behavior and local server fallback need device testing.",
    },
    {
      checkId: "offline-access",
      label: "Offline access control",
      status: "blocked",
      owner: "school",
      note: "Entry/user code behavior is demo-only until local roster, device ownership, and student privacy policy are accepted.",
    },
  ],
};

export const sampleLocalCompanionReleaseGate: LocalCompanionReleaseGate = {
  gateId: "sample-publisher-local-release-gate",
  label: "Local release gate",
  decision: "Previewable only. Do not hand off as a closed local product yet.",
  summary:
    "A local textbook companion becomes saleable only when content rights, installer/update rules, backup/export, QR fallback, and game/audio/reporting coverage have all been reviewed together.",
  items: [
    {
      gateId: "content-source-review",
      label: "Source package reviewed",
      status: "warning",
      owner: "publisher",
      evidence: "Sample unit package exists for route and UI testing.",
      blocker: "Real textbook PDF/unit source review is not complete.",
      nextAction: "Run the first partner unit through the intake review before generating a release candidate.",
    },
    {
      gateId: "media-rights-checksums",
      label: "Media rights and checksums",
      status: "blocked",
      owner: "tenant",
      evidence: "Demo audio/video paths exist in the sample package.",
      blocker: "Rights proof, offline distribution permission, and checksums are not present.",
      nextAction: "Collect signed media permissions and generate checksums for every audio/video file.",
    },
    {
      gateId: "installer-update-path",
      label: "Installer and update path",
      status: "blocked",
      owner: "platform",
      evidence: "Hosted PWA routes are verified.",
      blocker: "No packaged local installer, update channel, rollback plan, or yearly edition migration exists.",
      nextAction: "Choose the local companion shell strategy and document update/rollback behavior.",
    },
    {
      gateId: "backup-restore-export",
      label: "Backup, restore, and report export",
      status: "blocked",
      owner: "persistence",
      evidence: "Teacher report package boundary and storage contracts are scaffolded.",
      blocker: "Local database backup, restore, and teacher export policy are not implemented.",
      nextAction: "Define local records, encrypted backup location, restore test, and teacher export format.",
    },
    {
      gateId: "qr-deeplink-fallback",
      label: "QR and deep-link fallback",
      status: "warning",
      owner: "platform",
      evidence: "Stable hosted QR route and local fallback paths are represented.",
      blocker: "Device-level local deep-link behavior is not tested.",
      nextAction: "Test printed QR codes against hosted redirect, local browser route, and packaged-app fallback.",
    },
    {
      gateId: "game-audio-reporting",
      label: "Game audio and reporting coverage",
      status: "pass",
      owner: "platform",
      evidence: "Flashcard, quiz, sentence, and speak routes report reusable mode metadata in the sample package.",
      blocker: "Future games still need the same event and audio contract before inclusion.",
      nextAction: "Keep blocking new game modes until tap-to-speak, listen controls, and progress events are verified.",
    },
    {
      gateId: "school-access-policy",
      label: "School access and privacy policy",
      status: "blocked",
      owner: "school",
      evidence: "Entry/user code behavior is represented as a product requirement.",
      blocker: "No approved local roster, device sharing, privacy, or retention policy exists.",
      nextAction: "Confirm school-side account, classroom-device, and data-retention rules before release.",
    },
  ],
};

export function countLocalDeploymentChecks(
  plan: LocalDeploymentPreflightPlan,
  status: LocalDeploymentPreflightStatus,
): number {
  return plan.checks.filter((check) => check.status === status).length;
}

export function countLocalCompanionReleaseGateItems(
  gate: LocalCompanionReleaseGate,
  status: LocalCompanionReleaseGateStatus,
): number {
  return gate.items.filter((item) => item.status === status).length;
}
