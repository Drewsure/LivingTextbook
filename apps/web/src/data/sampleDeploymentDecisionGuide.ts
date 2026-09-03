export type DeploymentDecisionStatus = "recommended" | "guarded" | "blocked";

export interface DeploymentDecisionOption {
  optionId: string;
  label: string;
  status: DeploymentDecisionStatus;
  channel: string;
  commercialFit: string;
  costProfile: string;
  whyNow: string;
  nextDecision: string;
  requiredEvidence: string[];
  blockedActions: string[];
}

export interface DeploymentDecisionGuide {
  guideId: string;
  label: string;
  summary: string;
  standingRecommendation: string;
  options: DeploymentDecisionOption[];
  globalBlocks: string[];
}

export const sampleDeploymentDecisionGuide: DeploymentDecisionGuide = {
  guideId: "deployment-decision-guide-v2026-09-03",
  label: "Deployment decision guide",
  summary:
    "This guide keeps hosted PWA, local classroom server, and packaged companion decisions visible as saleable white-label options while the foundation build remains review-only.",
  standingRecommendation:
    "Start partner pilots with hosted PWA review routes for the lowest operating cost and fastest learning loop. Keep local classroom server and packaged companion delivery as priced, policy-gated options after media, storage, QR, report, and rollback evidence is complete.",
  options: [
    {
      optionId: "hosted-pwa-first-pilot",
      label: "Hosted PWA first pilot",
      status: "recommended",
      channel: "Hosted PWA",
      commercialFit: "Best first offer for schools and publishers that can use a stable web link, teacher QR entry, and controlled hosted demos.",
      costProfile:
        "Lowest initial support cost because there is no installer, no offline media copy, no local network setup, and no retained learner-data store until the pilot policy allows it.",
      whyNow:
        "The current route shell, manifest, teacher workbenches, curated activity pathways, audio-first games, and report previews can support a controlled sales demo without new infrastructure.",
      nextDecision: "Choose the first persistence adapter only after school policy and report/export boundaries are approved.",
      requiredEvidence: [
        "Tenant branding and domain or subpath decision",
        "Reviewed package manifest",
        "Target-language audio coverage",
        "Private assignment or front-door access policy",
        "School launch policy acceptance",
      ],
      blockedActions: [
        "No live classroom launch",
        "No real learner data collection",
        "No report export",
        "No premium AI Tutor activation",
      ],
    },
    {
      optionId: "local-classroom-server-pilot",
      label: "Local classroom server pilot",
      status: "guarded",
      channel: "Local classroom server",
      commercialFit:
        "Strong paid option for schools that need a closed classroom network, predictable media playback, and reduced internet dependency.",
      costProfile:
        "Moderate support cost because network setup, local URLs, device testing, backup policy, and teacher report handoff must be managed.",
      whyNow:
        "The local preview pages, bundle manifests, QR fallback paths, PWA/offline gate, and media integrity gate already define the planning shape.",
      nextDecision: "Decide whether local reports stay local-only, sync to hosted storage, or remain disabled for the first pilot.",
      requiredEvidence: [
        "Local device and browser matrix",
        "QR alias fallback proof",
        "Media rights proof and checksum manifest",
        "Backup and restore procedure",
        "School retention policy",
      ],
      blockedActions: [
        "No local package activation",
        "No offline-ready claim",
        "No local learner-data storage",
        "No background sync",
      ],
    },
    {
      optionId: "packaged-companion-product",
      label: "Packaged textbook companion",
      status: "blocked",
      channel: "Closed packaged app",
      commercialFit:
        "Longer-term premium product for publishers that want yearly textbook editions with bundled music, video, games, QR fallbacks, and controlled updates.",
      costProfile:
        "Highest support cost because installer signing, updates, rollback, media bundles, checksums, local storage, and edition migration become product obligations.",
      whyNow:
        "It belongs in the architecture now because publisher conversations need a credible path, but it must not be sold as ready before package engineering is proven.",
      nextDecision: "Choose installer, update, rollback, and edition migration strategy after the hosted PWA and local server pilots are stable.",
      requiredEvidence: [
        "Installer and update strategy",
        "Signed local bundle manifest",
        "Package size budget",
        "Versioned media replacement plan",
        "Rollback and restoration plan",
      ],
      blockedActions: [
        "No installer export",
        "No checksum-free bundle",
        "No uncompressed video handoff",
        "No production QR redirect mutation",
      ],
    },
  ],
  globalBlocks: [
    "No offline-ready claim",
    "No local package activation",
    "No report export",
    "No real learner data collection",
    "No student-facing paid feature prompt",
    "No media-only progress",
    "No support-language-only progression",
  ],
};

export function countDeploymentDecisionOptions(
  guide: DeploymentDecisionGuide,
  status: DeploymentDecisionStatus,
): number {
  return guide.options.filter((option) => option.status === status).length;
}
