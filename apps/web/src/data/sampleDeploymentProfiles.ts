import type { DeploymentChannel } from "@living-textbook/content-model";

export type DeploymentReadinessStatus = "ready-for-demo" | "needs-decision" | "future";

export interface DeploymentRequirement {
  requirementId: string;
  label: string;
  status: DeploymentReadinessStatus;
  note: string;
}

export interface TenantDeploymentProfile {
  profileId: string;
  tenantId: string;
  label: string;
  channel: DeploymentChannel;
  recommendedForPilot: boolean;
  summary: string;
  requirements: DeploymentRequirement[];
}

export const sampleDeploymentProfiles: TenantDeploymentProfile[] = [
  {
    profileId: "hosted-pwa-sample-publisher",
    tenantId: "sample-publisher",
    label: "Hosted PWA pilot",
    channel: "hosted-web",
    recommendedForPilot: true,
    summary:
      "Fastest partner pilot path: stable hosted route, teacher/admin review pages, QR/front-door entry, and controlled demo content packages.",
    requirements: [
      {
        requirementId: "hosted-domain",
        label: "Hosted route",
        status: "ready-for-demo",
        note: "The current Next app can demonstrate hosted routes locally and later deploy behind a tenant domain or subpath.",
      },
      {
        requirementId: "content-review",
        label: "Reviewed content package",
        status: "ready-for-demo",
        note: "Sample packages already model human-reviewed payloads, audio cues, and media placeholders.",
      },
      {
        requirementId: "persistence",
        label: "Persistence and reporting",
        status: "needs-decision",
        note: "Real pilots need a database-backed route registry, launch sessions, and progress reporting.",
      },
    ],
  },
  {
    profileId: "local-classroom-sample-publisher",
    tenantId: "sample-publisher",
    label: "Local classroom server",
    channel: "local-classroom-server",
    recommendedForPilot: false,
    summary:
      "Useful for closed school deployments where media packages and routes must work on a local network with limited internet dependency.",
    requirements: [
      {
        requirementId: "local-network",
        label: "Local network address",
        status: "needs-decision",
        note: "The school must decide how students reach the local app from printed QR codes or short entry codes.",
      },
      {
        requirementId: "media-bundle",
        label: "Offline media bundle",
        status: "needs-decision",
        note: "Audio/video files need a local bundle manifest, rights confirmation, and update procedure.",
      },
      {
        requirementId: "sync-policy",
        label: "Progress sync policy",
        status: "future",
        note: "A local-first deployment needs a clear rule for exporting or syncing teacher reports.",
      },
    ],
  },
  {
    profileId: "packaged-local-app-sample-publisher",
    tenantId: "sample-publisher",
    label: "Packaged local app",
    channel: "desktop-app",
    recommendedForPilot: false,
    summary:
      "Closed companion product path for publishers that need yearly content packages and controlled local media distribution.",
    requirements: [
      {
        requirementId: "installer",
        label: "Installer/update strategy",
        status: "future",
        note: "A real packaged app needs installer, updates, signing, backup, and content package migration decisions.",
      },
      {
        requirementId: "deep-link",
        label: "Deep-link or front-door fallback",
        status: "needs-decision",
        note: "Printed QR behavior must be explicit because local app deep links vary by operating system and install state.",
      },
      {
        requirementId: "offline-auth",
        label: "Offline access control",
        status: "future",
        note: "Entry/user codes in the current scaffold are demo gates, not production authentication.",
      },
    ],
  },
];
