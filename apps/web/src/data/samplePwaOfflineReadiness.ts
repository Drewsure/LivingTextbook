export type PwaOfflineReadinessStatus = "pass" | "manual-review" | "blocked";

export type PwaOfflineReadinessOwner = "platform" | "tenant" | "school" | "publisher" | "persistence";

export interface PwaOfflineReadinessLane {
  laneId: string;
  label: string;
  status: PwaOfflineReadinessStatus;
  owner: PwaOfflineReadinessOwner;
  currentState: string;
  purpose: string;
  requiredBeforeLive: string[];
  blockedActions: string[];
}

export interface PwaOfflineReadinessGate {
  gateId: string;
  label: string;
  summary: string;
  installabilityRule: string;
  offlineHonestyRule: string;
  lanes: PwaOfflineReadinessLane[];
  hardRequirements: string[];
  globallyBlockedActions: string[];
}

export const samplePwaOfflineReadinessGate: PwaOfflineReadinessGate = {
  gateId: "pwa-offline-readiness-v2026-09-03",
  label: "PWA and offline readiness",
  summary:
    "The platform may expose an installable hosted PWA shell during foundation, but it must not claim offline learning, local textbook companion readiness, media bundle portability, or stored learner progress until cache, media rights, installer/update, storage, and school policy gates are reviewed together.",
  installabilityRule:
    "Hosted PWA first, offline claim later: installability can support teacher demos, but it is not the same as a closed local companion package.",
  offlineHonestyRule:
    "No offline-ready claim is allowed until the service worker, cache policy, versioned media manifest, rights proof, QR fallback, and learner-data exclusion rules are complete.",
  lanes: [
    {
      laneId: "installable-shell",
      label: "Installable shell",
      status: "manual-review",
      owner: "platform",
      currentState: "Manifest available",
      purpose:
        "Confirm the app has a stable installable identity for demos without implying that lessons, media, reports, or QR routes work offline.",
      requiredBeforeLive: ["Tenant icons", "Tenant display name", "HTTPS or localhost", "Reviewed start_url and scope"],
      blockedActions: ["No offline-ready claim", "No local installer export"],
    },
    {
      laneId: "service-worker-cache",
      label: "Service worker and cache policy",
      status: "blocked",
      owner: "platform",
      currentState: "Service worker not enabled yet",
      purpose:
        "Prevent stale lessons, unreviewed media, unsupported routes, or teacher reports from being cached before version and rollback rules are designed.",
      requiredBeforeLive: [
        "Cache strategy not approved yet",
        "Versioned package manifest",
        "Rollback and cache invalidation plan",
        "Route allowlist",
      ],
      blockedActions: ["No service worker registration", "No cache mutation", "No background sync"],
    },
    {
      laneId: "offline-media-bundle",
      label: "Offline media bundle",
      status: "blocked",
      owner: "tenant",
      currentState: "Offline media bundle not approved yet",
      purpose:
        "Keep audio, music, video, posters, and game images out of local distribution until rights, checksums, priority rules, and package size are known.",
      requiredBeforeLive: [
        "Rights and versioned manifest required",
        "Learning audio priority preserved",
        "Checksums for every asset",
        "Tenant approval for offline distribution",
      ],
      blockedActions: ["No media pre-cache", "No local folder activation", "No direct media file target"],
    },
    {
      laneId: "offline-learner-data",
      label: "Offline learner data",
      status: "blocked",
      owner: "persistence",
      currentState: "Student data offline storage blocked",
      purpose:
        "Protect children, teachers, and schools by keeping local records out of the product until identity, retention, export, backup, and sync behavior are approved.",
      requiredBeforeLive: [
        "Backend storage selection",
        "School policy acceptance",
        "Retention and export policy",
        "No raw learner audio or transcript storage",
      ],
      blockedActions: ["No student data offline storage", "No background sync", "No report export"],
    },
    {
      laneId: "qr-local-fallback",
      label: "QR and local companion fallback",
      status: "manual-review",
      owner: "publisher",
      currentState: "Local companion fallback required",
      purpose:
        "Ensure printed QR codes can point to a stable hosted front door, then fall back to a packaged local route only when the correct edition is installed.",
      requiredBeforeLive: [
        "QR alias compatibility required",
        "Edition-aware redirect registry",
        "Local companion fallback required",
        "School rollback plan",
      ],
      blockedActions: ["No production QR mutation", "No raw localhost QR target", "No local package activation"],
    },
  ],
  hardRequirements: [
    "Manifest available",
    "Service worker not enabled yet",
    "Cache strategy not approved yet",
    "Offline media bundle not approved yet",
    "Rights and versioned manifest required",
    "Learning audio priority preserved",
    "Local companion fallback required",
    "QR alias compatibility required",
    "Student data offline storage blocked",
  ],
  globallyBlockedActions: [
    "No offline-ready claim",
    "No service worker registration",
    "No cache mutation",
    "No media pre-cache",
    "No local installer export",
    "No student data offline storage",
    "No background sync",
    "No production QR mutation",
  ],
};

export function countPwaOfflineReadinessLanes(
  gate: PwaOfflineReadinessGate,
  status: PwaOfflineReadinessStatus,
): number {
  return gate.lanes.filter((lane) => lane.status === status).length;
}
