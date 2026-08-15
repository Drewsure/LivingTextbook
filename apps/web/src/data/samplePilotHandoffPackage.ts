export type PilotHandoffStatus = "ready" | "needs-review" | "blocked";
export type PilotHandoffOwner = "codex" | "tenant" | "school" | "shared";

export interface PilotHandoffAsset {
  assetId: string;
  label: string;
  status: PilotHandoffStatus;
  owner: PilotHandoffOwner;
  evidence: string;
  nextStep: string;
}

export interface PilotHandoffRoute {
  routeId: string;
  label: string;
  path: string;
  status: PilotHandoffStatus;
  purpose: string;
}

export interface PilotHandoffDecision {
  decisionId: string;
  label: string;
  status: PilotHandoffStatus;
  owner: PilotHandoffOwner;
  costImpact: "low" | "controlled" | "higher";
  note: string;
}

export interface PilotHandoffPackage {
  packageId: string;
  tenantId: string;
  label: string;
  recommendedPilotWindow: string;
  recommendedDeployment: string;
  summary: string;
  routes: PilotHandoffRoute[];
  assets: PilotHandoffAsset[];
  decisions: PilotHandoffDecision[];
  handoffNotes: string[];
}

export const samplePilotHandoffPackage: PilotHandoffPackage = {
  packageId: "sample-publisher-first-handoff",
  tenantId: "sample-publisher",
  label: "Sample publisher first pilot handoff",
  recommendedPilotWindow: "8-12 weeks",
  recommendedDeployment: "Hosted PWA first, local/closed package kept compatible",
  summary:
    "This package is the practical bridge from static demo to a controlled partner pilot. It keeps content, routes, games, media, reports, roster identity, and policy decisions visible before any live student-data storage is promised.",
  routes: [
    {
      routeId: "partner-demo-home",
      label: "Partner demo overview",
      path: "/partner-demo",
      status: "ready",
      purpose: "Show the second tenant proof without MiniStar branding assumptions.",
    },
    {
      routeId: "partner-front-door",
      label: "Student front door",
      path: "/enter/sample-publisher",
      status: "ready",
      purpose: "Show entry-code and learner-code access for a textbook companion package.",
    },
    {
      routeId: "partner-direct-launch",
      label: "Direct unit launch",
      path: "/launch/partner-demo-unit-1",
      status: "ready",
      purpose: "Show QR-style student launch into flashcards, games, media, and rewards.",
    },
    {
      routeId: "partner-speak-it",
      label: "Speak It route",
      path: "/speak/partner-demo-unit-1",
      status: "needs-review",
      purpose: "Show local record/replay speech practice without upload, transcript, or AI scoring.",
    },
    {
      routeId: "partner-teacher-session",
      label: "Teacher session monitor",
      path: "/teacher/sessions/partner-demo-unit-1",
      status: "needs-review",
      purpose: "Show coded learner reporting, event summaries, teacher settings, and export blockers.",
    },
  ],
  assets: [
    {
      assetId: "reviewed-unit-payload",
      label: "Reviewed sample unit payload",
      status: "ready",
      owner: "codex",
      evidence: "The second tenant package has reviewed sample vocabulary, target sentences, and routes.",
      nextStep: "Replace the sample unit with two to four real reviewed partner units.",
    },
    {
      assetId: "audio-cues",
      label: "Learner text audio support",
      status: "needs-review",
      owner: "shared",
      evidence: "The package has audio cue structure, but real partner audio files are still placeholders.",
      nextStep: "Collect partner audio or approve text-to-speech fallback for pilot content.",
    },
    {
      assetId: "video-playlist",
      label: "Video and playlist package",
      status: "needs-review",
      owner: "tenant",
      evidence: "The content model supports video assets and playlists, but real media rights are not loaded.",
      nextStep: "Confirm ownership, license, filenames, duration, and local/hosted delivery rules.",
    },
    {
      assetId: "games",
      label: "First game set",
      status: "needs-review",
      owner: "codex",
      evidence: "Flashcards, Match Up, Label It, Memory Match, Balloon Pop, Training Academy, and Speak It exist as foundation routes.",
      nextStep: "Promote two to four modes to pilot quality before a real classroom run.",
    },
    {
      assetId: "teacher-reports",
      label: "Teacher report preview",
      status: "blocked",
      owner: "shared",
      evidence: "Report shape exists, but durable event storage and export policy are not accepted.",
      nextStep: "Choose persistence and accept retention/export rules before storing real student progress.",
    },
  ],
  decisions: [
    {
      decisionId: "deployment-style",
      label: "First pilot deployment style",
      status: "needs-review",
      owner: "shared",
      costImpact: "controlled",
      note: "Hosted PWA is recommended for the first pilot because it avoids installer, sync, and local backup cost.",
    },
    {
      decisionId: "student-data-policy",
      label: "Student progress policy",
      status: "blocked",
      owner: "school",
      costImpact: "controlled",
      note: "Real progress storage needs privacy, retention, report export, and access-control decisions.",
    },
    {
      decisionId: "local-package",
      label: "Closed local companion requirement",
      status: "needs-review",
      owner: "tenant",
      costImpact: "higher",
      note: "Local packaging remains supported, but should not become first-pilot scope unless the partner requires it.",
    },
    {
      decisionId: "premium-ai",
      label: "AI Tutor adoption",
      status: "ready",
      owner: "tenant",
      costImpact: "higher",
      note: "AI Tutor remains off for the core pilot and can be priced as an optional premium package later.",
    },
  ],
  handoffNotes: [
    "Quote the pilot as a controlled test package, not a complete commercial product.",
    "Keep MiniStar and sample publisher content separated by tenant configuration.",
    "Do not promise automated PDF conversion before the reviewed intake workflow exists.",
    "Do not promise durable student reports until persistence and policy gates are closed.",
    "Do not promise full offline/local packaging until backup, update, and export procedures are designed.",
  ],
};
