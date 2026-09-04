export type PilotDashboardLaneStatus = "demo-ready" | "needs-decision" | "blocked";

export interface PilotDashboardLane {
  laneId: string;
  label: string;
  status: PilotDashboardLaneStatus;
  owner: "platform" | "publisher" | "school" | "shared";
  visibleEvidence: string;
  pilotRisk: string;
  nextAction: string;
  sourceRoute: string;
  dependentGates: string[];
}

export interface PilotReadinessDashboard {
  dashboardId: string;
  label: string;
  summary: string;
  firstConversationPosition: string;
  targetPilotWindow: string;
  statusStatement: string;
  lanes: PilotDashboardLane[];
  hardBlocks: string[];
}

export const samplePilotReadinessDashboard: PilotReadinessDashboard = {
  dashboardId: "first-partner-pilot-readiness-dashboard-v2026-09-03",
  label: "Pilot readiness dashboard",
  summary:
    "A single go/no-go view for the first partner or school conversation. It separates what can be demonstrated now from what must be closed before a real classroom pilot.",
  firstConversationPosition:
    "We can show a controlled white-label Living Textbook demo now. A real colleague or school pilot is still gated by source evidence, school policy, persistence, reports, media rights, and deployment decisions.",
  targetPilotWindow: "8-12 week pilot target",
  statusStatement: "Demo-ready, not classroom-ready",
  lanes: [
    {
      laneId: "partner-demo-routes",
      label: "Controlled partner demo routes",
      status: "demo-ready",
      owner: "platform",
      visibleEvidence: "Partner demo, front-door entry, activity hub, games, media playlist, print preview, and teacher session routes are active local scaffolds.",
      pilotRisk: "A demo can be mistaken for a live product if policy and persistence blockers are hidden.",
      nextAction: "Use the demo only as a walkthrough while preserving the launch and report blockers.",
      sourceRoute: "/partner-demo",
      dependentGates: ["Active route checks", "Launch safety boundaries", "Teacher session monitor"],
    },
    {
      laneId: "publisher-source-evidence",
      label: "Publisher source and media evidence",
      status: "needs-decision",
      owner: "publisher",
      visibleEvidence: "Upload, source review, evidence packet, media library, and asset workspaces are review-only.",
      pilotRisk: "Unreviewed PDF, audio, video, or image assets could create copyright, accuracy, or classroom-quality problems.",
      nextAction: "Collect real source files, rights notes, audio/video ownership, target unit scope, and replacement rules.",
      sourceRoute: "/teacher/sources/sample-publisher",
      dependentGates: ["Source review queue", "Evidence packet review", "Media bundle integrity"],
    },
    {
      laneId: "school-policy-readiness",
      label: "School policy and learner data",
      status: "blocked",
      owner: "school",
      visibleEvidence: "School policy handoff, launch gate, roster boundary, and reporting routes show required acceptance records.",
      pilotRisk: "Real learner progress, reports, microphone use, or retained data cannot start without policy acceptance.",
      nextAction: "Confirm privacy, retention, classroom operating mode, report export, microphone, and AI Tutor adoption choices.",
      sourceRoute: "/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet",
      dependentGates: ["School launch policy gate", "Class roster readiness", "Teacher reporting readiness"],
    },
    {
      laneId: "persistence-and-reports",
      label: "Persistence and teacher reports",
      status: "blocked",
      owner: "platform",
      visibleEvidence: "Persistence, backend schema, adapter readiness, report package, and event acceptance routes are defined.",
      pilotRisk: "Without a chosen adapter, reports and progress storage would be unreliable or vendor-locked too early.",
      nextAction: "Choose the first hosted or local persistence adapter only after school policy and export boundaries are accepted.",
      sourceRoute: "/teacher/persistence",
      dependentGates: ["Backend selection gate", "Event acceptance gate", "Report export policy"],
    },
    {
      laneId: "deployment-choice",
      label: "Deployment choice",
      status: "needs-decision",
      owner: "shared",
      visibleEvidence: "Hosted PWA, local classroom server, packaged companion, PWA/offline, and local bundle gates are visible.",
      pilotRisk: "Local or packaged delivery could raise support cost if chosen before media, QR, storage, and rollback evidence exists.",
      nextAction: "Keep hosted PWA as the first pilot recommendation unless the partner requires closed local operation.",
      sourceRoute: "/teacher/deployment",
      dependentGates: ["PWA/offline readiness", "Local deployment preflight", "Media bundle integrity"],
    },
  ],
  hardBlocks: [
    "No classroom launch",
    "No real learner data",
    "No report export",
    "No policy acceptance",
    "No local package activation",
    "No offline-ready claim",
    "No premium AI Tutor activation",
    "No Z.ai prototype intake request",
  ],
};

export function countPilotDashboardLanes(
  dashboard: PilotReadinessDashboard,
  status: PilotDashboardLaneStatus,
): number {
  return dashboard.lanes.filter((lane) => lane.status === status).length;
}
