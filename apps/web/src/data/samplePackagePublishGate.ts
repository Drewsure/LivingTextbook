export type PackagePublishGateStatus = "ready" | "needs-review" | "blocked";
export type PackagePublishGateOwner = "codex" | "tenant" | "school" | "shared";
export type PackagePublishGateDomain =
  | "content"
  | "media"
  | "games"
  | "qr"
  | "reports"
  | "policy"
  | "deployment"
  | "persistence";

export interface PackagePublishGateItem {
  gateId: string;
  label: string;
  domain: PackagePublishGateDomain;
  status: PackagePublishGateStatus;
  owner: PackagePublishGateOwner;
  blocksRelease: boolean;
  evidence: string;
  nextStep: string;
  requiredBeforePilot: string[];
  notAllowedYet: string[];
}

export interface PackagePublishGate {
  gateId: string;
  tenantId: string;
  packageId: string;
  label: string;
  releaseCandidate: string;
  targetPilotRoute: string;
  summary: string;
  decisionRule: string;
  items: PackagePublishGateItem[];
  standingRules: string[];
  releaseNotes: string[];
}

export const samplePackagePublishGate: PackagePublishGate = {
  gateId: "sample-publisher-package-publish-gate",
  tenantId: "sample-publisher",
  packageId: "starter-english-level-1-unit-1",
  label: "Sample publisher Unit 1 pilot publish gate",
  releaseCandidate: "2026.1 pilot candidate",
  targetPilotRoute: "/launch/partner-demo-unit-1",
  summary:
    "This gate turns the scattered teacher-intake checks into one release decision. It separates demo-ready scaffolds from pilot-ready package obligations so a publisher package is not released with fragile QR, unreviewed media, missing reports, or unclear policy.",
  decisionRule:
    "A package may be shown as a controlled demo while review gates are open, but it cannot be marked pilot-publishable while any release-blocking item is blocked or still needs review.",
  items: [
    {
      gateId: "reviewed-content-payload",
      label: "Reviewed student content payload",
      domain: "content",
      status: "ready",
      owner: "codex",
      blocksRelease: true,
      evidence: "Sample publisher Unit 1 has reviewed vocabulary, target sentences, launch route, and tenant-branded student flow.",
      nextStep: "Replace sample text with two to four reviewed partner units before a live pilot.",
      requiredBeforePilot: [
        "Human review confirms every learner-facing term and sentence.",
        "Support language is marked as support only and cannot unlock progress.",
      ],
      notAllowedYet: ["Raw PDF extraction cannot become student-facing automatically."],
    },
    {
      gateId: "audio-video-rights",
      label: "Audio and video rights manifest",
      domain: "media",
      status: "needs-review",
      owner: "tenant",
      blocksRelease: true,
      evidence: "The model supports unit playlists and media assets, but real files, licenses, durations, and delivery paths are not attached yet.",
      nextStep: "Collect the partner's owned audio/video list with file names, rights owner, duration, local bundle path, hosted path, and replacement policy.",
      requiredBeforePilot: [
        "Every required audio cue has a real file or approved TTS fallback.",
        "Every video has rights, poster, duration, and delivery route metadata.",
      ],
      notAllowedYet: ["No unlicensed music, chants, videos, posters, or background media can ship in a tenant package."],
    },
    {
      gateId: "game-offer-map",
      label: "Unit game offer map",
      domain: "games",
      status: "needs-review",
      owner: "shared",
      blocksRelease: true,
      evidence: "Flashcards, Memory Match, Speak It, Training Academy, and prototype assignment contracts exist, but the final pilot game set must be approved per unit.",
      nextStep: "Choose the first two to four pilot-quality modes and confirm which are DOM reference, Phaser, or hybrid wrappers.",
      requiredBeforePilot: [
        "Each offered game emits standard progress events.",
        "Every text prompt, instruction, and critical control has audio support.",
        "Phaser prototypes remain isolated until wrapped by the LivingTextbook event and payload contract.",
      ],
      notAllowedYet: ["No one-off game may bypass scoring, audio, route, or teacher-report events."],
    },
    {
      gateId: "stable-qr-alias",
      label: "Stable QR alias and edition route",
      domain: "qr",
      status: "ready",
      owner: "codex",
      blocksRelease: true,
      evidence: "The sample edition QR route resolves a tenant/book/unit/activity/version style alias instead of a fragile file path.",
      nextStep: "Map real printed textbook QR codes to stable registry entries before printing or distribution.",
      requiredBeforePilot: [
        "Printed QR points to a stable registry or alias, not a raw asset file.",
        "Edition, version, language, unit, and activity can be changed without breaking the printed QR code.",
      ],
      notAllowedYet: ["No direct QR-to-local-file route is allowed for a publishable package."],
    },
    {
      gateId: "teacher-report-policy",
      label: "Teacher report and export policy",
      domain: "reports",
      status: "blocked",
      owner: "school",
      blocksRelease: true,
      evidence: "Teacher monitor screens exist, but real student progress storage and report export require privacy and retention decisions.",
      nextStep: "Accept the pilot policy, retention period, export fields, and guardian/school access rules before storing real learner data.",
      requiredBeforePilot: [
        "Report fields are limited to the approved pilot data contract.",
        "Exports are blocked until policy and persistence are accepted.",
      ],
      notAllowedYet: ["No real student report exports before privacy, retention, and access-control policy are accepted."],
    },
    {
      gateId: "deployment-profile",
      label: "Deployment profile selected",
      domain: "deployment",
      status: "needs-review",
      owner: "shared",
      blocksRelease: true,
      evidence: "Hosted PWA, local classroom server, and packaged local app paths are visible, but the first real pilot profile must be selected.",
      nextStep: "Use hosted PWA for the first low-cost pilot unless the partner requires a closed local installation immediately.",
      requiredBeforePilot: [
        "Deployment owner, update path, asset delivery, backup, and support expectations are recorded.",
        "Local/offline requirements are separated from hosted pilot requirements.",
      ],
      notAllowedYet: ["Do not promise closed local install support until backup, update, sync, and offline media bundle procedures are accepted."],
    },
    {
      gateId: "persistence-adapter",
      label: "Persistence adapter and durable records",
      domain: "persistence",
      status: "blocked",
      owner: "shared",
      blocksRelease: true,
      evidence: "Durable record boundaries and adapter readiness scaffolds exist, but no production backend has been accepted for real writes.",
      nextStep: "Choose the first pilot backend after privacy, reporting, local/hosted deployment, and cost limits are reviewed.",
      requiredBeforePilot: [
        "Durable event, route, media, roster, and package records have accepted storage ownership.",
        "Migration and export expectations are clear before vendor lock-in.",
      ],
      notAllowedYet: ["Do not connect live student records to a backend before policy and adapter gates are closed."],
    },
    {
      gateId: "pilot-package-policy",
      label: "Pilot package policy accepted",
      domain: "policy",
      status: "needs-review",
      owner: "shared",
      blocksRelease: true,
      evidence: "Safety, microphone approval, assist language, AI Tutor entitlement, media, reporting, and retention rules are scaffolded but need pilot acceptance.",
      nextStep: "Turn the policy scaffold into a signed pilot checklist for the school or publisher owner.",
      requiredBeforePilot: [
        "Microphone and AI Tutor features are explicitly on/off per tenant.",
        "Audio/video and support-language rules are reviewed before assignment.",
      ],
      notAllowedYet: ["Do not enable optional premium AI or microphone scoring by default."],
    },
  ],
  standingRules: [
    "Demo-ready is not the same as pilot-publishable.",
    "A package cannot be published to real learners while any release-blocking gate is blocked or needs review.",
    "Support language helps comprehension but never unlocks target-language progression.",
    "All learner-facing text must remain audio-supported before student assignment.",
    "QR codes must resolve stable registry entries and must not point directly to raw local files.",
    "Optional premium features such as AI Tutor and speech scoring stay tenant-gated and cost-visible.",
  ],
  releaseNotes: [
    "This scaffold is a publisher/admin decision surface, not an automatic release system.",
    "The first partner pilot should stay small: one tenant, two to four reviewed units, two to four pilot-quality games, and approved audio/video rights.",
    "Once persistence is chosen, this gate should become the source for release status and publish approval records.",
  ],
};
