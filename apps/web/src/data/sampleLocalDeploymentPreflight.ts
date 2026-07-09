export type LocalDeploymentPreflightStatus = "pass" | "warning" | "blocked";

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

export function countLocalDeploymentChecks(
  plan: LocalDeploymentPreflightPlan,
  status: LocalDeploymentPreflightStatus,
): number {
  return plan.checks.filter((check) => check.status === status).length;
}
