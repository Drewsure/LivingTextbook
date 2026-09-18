import { validateLocalBundleHandoffPacket, type LocalBundleHandoffPacket } from "@living-textbook/content-model";
import type { LocalBundleManifestSummary } from "./sampleLocalBundlePlan";

export function buildLocalBundleHandoffPacket({
  manifest,
  assetEvidenceBlockedCount,
  routeResolutionReady,
  releaseBlockedCount,
  preflightBlockedCount,
}: {
  manifest: LocalBundleManifestSummary;
  assetEvidenceBlockedCount: number;
  routeResolutionReady: boolean;
  releaseBlockedCount: number;
  preflightBlockedCount: number;
}): { packet: LocalBundleHandoffPacket; errors: string[] } {
  const packet: LocalBundleHandoffPacket = {
    packetId: `${manifest.bundleId}-review-handoff`,
    tenantId: manifest.tenantName,
    bundleId: manifest.bundleId,
    mode: "review-only",
    summary: "This evidence packet assembles local companion readiness without writing, exporting, activating, or promoting a package.",
    offlineReadyAllowed: false,
    checks: [
      {
        checkId: "manifest",
        label: "Manifest identity and declared shape",
        status: manifest.contentPackagePath && manifest.mediaRoot ? "passed" : "blocked",
        detail: "The preview carries tenant-scoped content and media locations; a future writer must still validate the final manifest.",
      },
      {
        checkId: "asset-evidence",
        label: "Per-asset evidence",
        status: assetEvidenceBlockedCount === 0 ? "passed" : "blocked",
        detail: assetEvidenceBlockedCount === 0 ? "Every declared asset is handoff-ready." : `${assetEvidenceBlockedCount} asset evidence blocker(s) remain visible in the review surface.`,
      },
      {
        checkId: "route-resolution",
        label: "QR and local route resolution",
        status: routeResolutionReady ? "passed" : "blocked",
        detail: routeResolutionReady ? "Declared QR fallbacks resolve through the tenant-scoped read-only resolver." : "One or more declared routes still need resolver evidence.",
      },
      {
        checkId: "release-gate",
        label: "Release and deployment gates",
        status: releaseBlockedCount > 0 || preflightBlockedCount > 0 ? "blocked" : "passed",
        detail: releaseBlockedCount > 0 || preflightBlockedCount > 0
          ? `${releaseBlockedCount + preflightBlockedCount} release or deployment blocker(s) remain.`
          : "Release and deployment checks are clear for review.",
      },
      {
        checkId: "side-effects",
        label: "Live side effects remain disabled",
        status: "passed",
        detail: "The packet has no package-write, file-copy, export, activation, redirect-mutation, or student-promotion action.",
      },
    ],
    blockedActions: ["package-write", "offline-activation", "student-promotion", "hosted-redirect-mutation"],
  };

  return { packet, errors: validateLocalBundleHandoffPacket(packet) };
}
