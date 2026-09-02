export type MediaBundleIntegrityStatus = "ready" | "needs-proof" | "blocked";

export type MediaBundleIntegrityOwner = "platform" | "tenant" | "publisher" | "school";

export interface MediaBundleIntegrityLane {
  laneId: string;
  label: string;
  status: MediaBundleIntegrityStatus;
  owner: MediaBundleIntegrityOwner;
  targetRecord: string;
  currentState: string;
  packageImpact: string;
  requiredBeforeBundle: string[];
  blockedActions: string[];
}

export interface MediaBundleIntegrityPlan {
  planId: string;
  label: string;
  summary: string;
  packageBudgetRule: string;
  checksumRule: string;
  lanes: MediaBundleIntegrityLane[];
  packageReadinessRules: string[];
  globallyBlockedActions: string[];
}

export const sampleMediaBundleIntegrityPlan: MediaBundleIntegrityPlan = {
  planId: "media-bundle-integrity-v2026-09-03",
  label: "Media bundle integrity readiness",
  summary:
    "Media package engineering gate for audio, music, video, poster, image, and future game asset bundles. It keeps local companion media practical to ship, update, verify, and replace year by year.",
  packageBudgetRule:
    "Bundle size budget must be reviewed before offline or closed-package delivery. Video should prefer compressed, streaming-friendly or edition-bundled variants, while learning audio remains lightweight and always available.",
  checksumRule:
    "Checksum manifest is required for every distributed media file before local bundle, installer, or yearly update handoff.",
  lanes: [
    {
      laneId: "bundle-size-budget",
      label: "Bundle size budget",
      status: "blocked",
      owner: "publisher",
      targetRecord: "local_media_bundle_entry",
      currentState: "No package-size approval",
      packageImpact:
        "Large video, music, and image folders can make yearly textbook packages slow to download, expensive to host, and unreliable on school devices.",
      requiredBeforeBundle: ["Per-unit size cap", "Per-edition size cap", "Compressed media variants", "Low-bandwidth fallback"],
      blockedActions: ["No uncompressed video handoff", "No offline-ready claim", "No local installer export"],
    },
    {
      laneId: "checksum-manifest",
      label: "Checksum manifest",
      status: "blocked",
      owner: "platform",
      targetRecord: "checksums.json",
      currentState: "Checksum manifest pending",
      packageImpact:
        "Teachers and schools need to know that copied local media has not gone missing, been replaced, or become mismatched with the package manifest.",
      requiredBeforeBundle: ["Checksum for each file", "Relative path map", "Versioned manifest id", "Restore verification step"],
      blockedActions: ["No checksum-free bundle", "No local folder activation", "No media pre-cache"],
    },
    {
      laneId: "media-deduplication",
      label: "Duplicate media detection",
      status: "needs-proof",
      owner: "platform",
      targetRecord: "media_manifest",
      currentState: "Duplicate media detection not implemented",
      packageImpact:
        "Shared songs, chants, posters, and avatar clips should not be copied into every unit package if a tenant-level library can reference them safely.",
      requiredBeforeBundle: ["Tenant media library reference", "Shared asset id", "Rights scope per reuse", "Fallback if shared asset is missing"],
      blockedActions: ["No repeated media copying", "No untracked shared asset reuse"],
    },
    {
      laneId: "yearly-edition-replacement",
      label: "Yearly edition replacement",
      status: "blocked",
      owner: "publisher",
      targetRecord: "publisher_maintenance_record",
      currentState: "Yearly replacement policy missing",
      packageImpact:
        "A publisher must be able to replace a song, video, poster, or unit image without breaking old printed QR codes or previous school installs.",
      requiredBeforeBundle: ["Edition version", "Replacement rights proof", "QR alias rollback", "Legacy package retention rule"],
      blockedActions: ["No production QR mutation", "No direct folder overwrite", "No old-edition package removal"],
    },
    {
      laneId: "learning-audio-priority",
      label: "Learning audio priority",
      status: "ready",
      owner: "platform",
      targetRecord: "background_media_policy_binding",
      currentState: "Learning audio priority preserved",
      packageImpact:
        "Text-to-speech cues, recorded vocabulary, instructions, and target sentences must remain audible even when a game has background music or video.",
      requiredBeforeBundle: ["Tap-to-speak cues", "Mute or duck background media", "No support-language progress", "No media-only progress"],
      blockedActions: ["No background music overriding learning audio", "No passive media mastery", "No support-language-only unlock"],
    },
  ],
  packageReadinessRules: [
    "Asset rights proof first",
    "Bundle size budget",
    "Checksum manifest",
    "Duplicate media detection",
    "Streaming/local fallback",
    "Yearly edition replacement",
    "Learning audio priority preserved",
  ],
  globallyBlockedActions: [
    "No package-size approval",
    "No checksum-free bundle",
    "No direct folder activation",
    "No uncompressed video handoff",
    "No media-only progress",
    "No background music overriding learning audio",
    "No offline-ready claim",
    "No local installer export",
  ],
};

export function countMediaBundleIntegrityLanes(
  plan: MediaBundleIntegrityPlan,
  status: MediaBundleIntegrityStatus,
): number {
  return plan.lanes.filter((lane) => lane.status === status).length;
}
