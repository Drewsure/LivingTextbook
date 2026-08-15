export type AssignmentRolloutStatus = "demo-preview" | "blocked" | "ready-to-schedule" | "pilot-ready";
export type AssignmentRolloutGateStatus = "pass" | "warning" | "blocked";

export interface AssignmentRolloutGate {
  gateId: string;
  label: string;
  status: AssignmentRolloutGateStatus;
  owner: "teacher" | "platform" | "tenant" | "policy" | "persistence";
  note: string;
}

export interface AssignmentRolloutPlan {
  rolloutId: string;
  assignmentId: string;
  label: string;
  tenantId: string;
  launchCode: string;
  status: AssignmentRolloutStatus;
  targetAudience: string;
  schedulingNote: string;
  gates: AssignmentRolloutGate[];
}

export const sampleAssignmentRolloutPlans: AssignmentRolloutPlan[] = [
  {
    rolloutId: "rollout-ministar-demo-unit-1",
    assignmentId: "assignment-ministar-demo-whole-class",
    label: "MiniStar Unit 1 classroom demo rollout",
    tenantId: "ministar",
    launchCode: "demo-unit-1",
    status: "demo-preview",
    targetAudience: "Teacher-led class preview with anonymous student practice.",
    schedulingNote:
      "Good for guided demonstration. Not yet a production report because progress persistence and report export policy are not accepted.",
    gates: [
      {
        gateId: "package-reviewed",
        label: "Package reviewed",
        status: "pass",
        owner: "teacher",
        note: "The sample package uses reviewed Level 1 Unit 1 payload data.",
      },
      {
        gateId: "launch-route",
        label: "Launch route ready",
        status: "pass",
        owner: "platform",
        note: "The direct launch route is available at /launch/demo-unit-1.",
      },
      {
        gateId: "game-audio-coverage",
        label: "Game audio coverage",
        status: "pass",
        owner: "platform",
        note: "Assigned demo modes have reviewed package audio coverage for instructions, prompts, feedback, and critical controls.",
      },
      {
        gateId: "progress-persistence",
        label: "Progress persistence",
        status: "warning",
        owner: "persistence",
        note: "Events are local/sample data. Real classroom reports require durable event storage.",
      },
      {
        gateId: "report-policy",
        label: "Report policy",
        status: "blocked",
        owner: "policy",
        note: "Export and retention policy are still blocked for live student data.",
      },
    ],
  },
  {
    rolloutId: "rollout-sample-publisher-front-door",
    assignmentId: "assignment-sample-publisher-front-door",
    label: "Sample publisher front-door pilot rollout",
    tenantId: "sample-publisher",
    launchCode: "partner-demo-unit-1",
    status: "blocked",
    targetAudience: "Whole-class partner pilot with entry code and learner code.",
    schedulingNote:
      "Do not schedule as a real partner pilot until media rights, stable QR registry, teacher approval, and reporting policy are accepted.",
    gates: [
      {
        gateId: "package-reviewed",
        label: "Package reviewed",
        status: "warning",
        owner: "teacher",
        note: "The package is a white-label scaffold and still needs partner review.",
      },
      {
        gateId: "stable-front-door",
        label: "Stable front door",
        status: "warning",
        owner: "platform",
        note: "Front-door route exists, but printed QR permanence requires persisted alias registry.",
      },
      {
        gateId: "media-rights",
        label: "Media rights",
        status: "blocked",
        owner: "tenant",
        note: "Partner audio/video files and rights proof are not present.",
      },
      {
        gateId: "game-audio-coverage",
        label: "Game audio coverage",
        status: "pass",
        owner: "platform",
        note: "The front-door pilot draft has audio-covered assignment metadata for Flashcards, Match Up, Memory Match, Balloon Pop, Quiz, Sentence Builder, and Speak It.",
      },
      {
        gateId: "learner-codes",
        label: "Learner codes",
        status: "warning",
        owner: "persistence",
        note: "Learner code grouping needs a persisted class/session model before reports are relied on.",
      },
    ],
  },
  {
    rolloutId: "rollout-local-companion-draft",
    assignmentId: "assignment-local-companion-draft",
    label: "Closed local companion rollout",
    tenantId: "sample-publisher",
    launchCode: "local-companion-routines-draft",
    status: "blocked",
    targetAudience: "Closed local textbook companion install.",
    schedulingNote:
      "Keep this visible as a product requirement, but do not prioritize over the hosted pilot until local bundle/update/export policy is designed.",
    gates: [
      {
        gateId: "local-bundle",
        label: "Local bundle",
        status: "blocked",
        owner: "platform",
        note: "Offline bundle manifest, checksums, media paths, and installer/update process are still draft-only.",
      },
      {
        gateId: "local-storage",
        label: "Local storage",
        status: "blocked",
        owner: "persistence",
        note: "Local progress export, backup, restore, and device ownership policy are unresolved.",
      },
      {
        gateId: "qr-fallback",
        label: "QR fallback",
        status: "warning",
        owner: "platform",
        note: "Hybrid QR strategy is defined, but local deep-link behavior is not production-ready.",
      },
      {
        gateId: "game-audio-coverage",
        label: "Game audio coverage",
        status: "warning",
        owner: "platform",
        note: "Local companion scheduling needs reviewed offline audio coverage for every assigned game mode before pilot use.",
      },
    ],
  },
];

export function countAssignmentRolloutGates(
  plan: AssignmentRolloutPlan,
  status: AssignmentRolloutGateStatus,
): number {
  return plan.gates.filter((gate) => gate.status === status).length;
}
