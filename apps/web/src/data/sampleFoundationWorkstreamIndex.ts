export type FoundationWorkstreamStatus = "active" | "guarded" | "blocked" | "future-alert";

export interface FoundationWorkstreamIndexItem {
  workstreamId: string;
  label: string;
  status: FoundationWorkstreamStatus;
  owner: string;
  currentFocus: string;
  visibleEvidence: string[];
  nextGate: string;
}

export interface FoundationWorkstreamIndex {
  indexId: string;
  label: string;
  summary: string;
  currentBuildFocus: string;
  items: FoundationWorkstreamIndexItem[];
  blockedShortcuts: string[];
}

export const sampleFoundationWorkstreamIndex: FoundationWorkstreamIndex = {
  indexId: "foundation-workstream-index-v2026-09-02",
  label: "Foundation workstream index",
  summary:
    "This index keeps the growing teacher/admin foundation readable. It shows the active build lanes, the review evidence already visible, and the next gate before each lane can move toward live product behavior.",
  currentBuildFocus:
    "Current build focus: clean structure, tenant boundaries, route graduation, audio-first games, evidence packets, and backend-neutral storage contracts before visual polish or live workflow activation.",
  items: [
    {
      workstreamId: "visible-build-map",
      label: "Visible build map",
      status: "active",
      owner: "Codex architecture",
      currentFocus: "Keep build order and decision records visible before adding deeper game polish.",
      visibleEvidence: ["Principles and standards", "Build sessions", "Decision register"],
      nextGate: "Every new foundation slice updates standards, ADR/decision records, and verification notes.",
    },
    {
      workstreamId: "route-and-qr-safety",
      label: "Route and QR safety",
      status: "guarded",
      owner: "Platform routing",
      currentFocus: "Separate scaffold routes, student-ready routes, pilot-ready routes, and production QR routes.",
      visibleEvidence: ["Tenant navigation boundary", "Route graduation gate", "Edition QR aliases"],
      nextGate: "No route graduates until route helper, QR alias, rollback, tenant, and local fallback evidence are present.",
    },
    {
      workstreamId: "content-intake-and-uploads",
      label: "Content intake and uploads",
      status: "guarded",
      owner: "Teacher authoring",
      currentFocus: "Preview upload channels for PDF/text, images, audio, music, and video without enabling live file pickers.",
      visibleEvidence: ["Upload channel readiness", "Upload review queue", "Upload promotion readiness"],
      nextGate: "No uploaded file becomes student-facing without review, rights, target mapping, and package promotion evidence.",
    },
    {
      workstreamId: "game-engine-readiness",
      label: "Game engine readiness",
      status: "active",
      owner: "Game systems",
      currentFocus: "Keep active game routes data-driven through parent engines and standard progress events.",
      visibleEvidence: ["Parent engine readiness", "Active game replay checklist", "Curated activity pathways"],
      nextGate: "Phaser or Z.ai prototypes wait for the future Z.ai intake alert and Codex integration review.",
    },
    {
      workstreamId: "audio-media-and-language",
      label: "Audio, media, and language",
      status: "guarded",
      owner: "Learning media",
      currentFocus: "Protect target-language tap-to-speak learning audio while keeping support language and background media subordinate.",
      visibleEvidence: ["Learning audio contract", "Multimedia asset readiness", "Target language expansion"],
      nextGate: "No media-only progress, support-language-only progress, or background music override is allowed.",
    },
    {
      workstreamId: "teacher-operations-and-reporting",
      label: "Teacher operations and reporting",
      status: "guarded",
      owner: "Teacher workflow",
      currentFocus: "Shape assignment, session settings, roster, and report previews without collecting real learner data.",
      visibleEvidence: ["Teacher assignment rollout", "Session settings review packet", "Class roster readiness"],
      nextGate: "No live class scheduling, roster binding, progress stream activation, or report export before school policy and storage gates.",
    },
    {
      workstreamId: "pilot-policy-and-evidence",
      label: "Pilot, policy, and evidence",
      status: "blocked",
      owner: "School/publisher launch",
      currentFocus: "Collect launch, policy, evidence, and rollback requirements before any pilot claims.",
      visibleEvidence: ["Pilot evidence packet", "School policy handoff", "Rollback previews"],
      nextGate: "No classroom launch until school policy, evidence export, acceptance records, and rollback controls exist.",
    },
    {
      workstreamId: "backend-persistence-and-local-companion",
      label: "Backend, persistence, and local companion",
      status: "blocked",
      owner: "Storage architecture",
      currentFocus: "Keep hosted, local, and hybrid persistence options visible without selecting a vendor too early.",
      visibleEvidence: ["Backend decision matrix", "Persistence boundary", "Local bundle manifests"],
      nextGate: "No storage write, local package export, or local companion activation before backend selection and policy acceptance.",
    },
    {
      workstreamId: "future-zai-intake-alert",
      label: "Future Z.ai intake alert",
      status: "future-alert",
      owner: "Codex review",
      currentFocus: "Hold Z.ai and outside game prototype integration until the foundation route and storage gates are stable.",
      visibleEvidence: ["Prototype intake queue", "Prototype return checklist", "Game readiness workbench"],
      nextGate: "Codex will explicitly signal when outside prototypes should be inventoried, reviewed, and wrapped.",
    },
  ],
  blockedShortcuts: [
    "No live feature activation",
    "No student data collection",
    "No public community library",
    "No unmanaged asset adoption",
    "No direct AI publish",
    "No Z.ai import before the intake alert",
  ],
};
