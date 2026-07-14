import { samplePilotEvidencePacket, type PilotEvidencePacket } from "@/data/samplePilotEvidencePacket";
import { samplePilotHandoffPackage, type PilotHandoffPackage } from "@/data/samplePilotHandoffPackage";
import { samplePilotReadinessSummary, type PilotReadinessSummary } from "@/data/samplePilotReadinessSummary";

export type PilotLaunchChecklistStageStatus = "ready-for-demo" | "open" | "blocked";
export type PilotLaunchChecklistOwner = "platform" | "publisher" | "school" | "shared";

export interface PilotLaunchChecklistStage {
  stageId: string;
  label: string;
  status: PilotLaunchChecklistStageStatus;
  owner: PilotLaunchChecklistOwner;
  source: string;
  evidence: string;
  nextStep: string;
  requiredBeforeClassroomPilot: string[];
  stillBlocked: string[];
}

export interface PilotLaunchChecklist {
  checklistId: string;
  label: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  sourceOfTruth: string;
  launchActionStatus: string;
  summary: string;
  stages: PilotLaunchChecklistStage[];
  operatingRules: string[];
}

export const samplePilotLaunchChecklist = createPilotLaunchChecklist({
  readiness: samplePilotReadinessSummary,
  evidencePacket: samplePilotEvidencePacket,
  handoffPackage: samplePilotHandoffPackage,
});

export function createPilotLaunchChecklist({
  readiness,
  evidencePacket,
  handoffPackage,
}: {
  readiness: PilotReadinessSummary;
  evidencePacket: PilotEvidencePacket;
  handoffPackage: PilotHandoffPackage;
}): PilotLaunchChecklist {
  const blockedDecisions = handoffPackage.decisions.filter((decision) => decision.status === "blocked");
  const openHandoffAssets = handoffPackage.assets.filter((asset) => asset.status !== "ready");
  const evidenceOpenCount = evidencePacket.gateEvidence.concat(evidencePacket.approvalEvidence).filter((item) => item.status !== "attached").length;

  return {
    checklistId: `${handoffPackage.packageId}-pilot-launch-checklist`,
    label: "Pilot launch checklist preview",
    tenantId: handoffPackage.tenantId,
    packageId: handoffPackage.packageId,
    releaseCandidate: readiness.releaseCandidate,
    sourceOfTruth: "Source of truth: readiness summary, evidence packet, and pilot handoff package",
    launchActionStatus: "No classroom launch action",
    summary:
      "This checklist turns the partner demo, evidence packet, and handoff package into a staged go/no-go view. It helps the team see what is ready to show, what the publisher must provide, and what still blocks real classroom use.",
    stages: [
      {
        stageId: "controlled-demo",
        label: "Controlled partner demo",
        status: readiness.demoReadyNow.length > 0 ? "ready-for-demo" : "open",
        owner: "platform",
        source: "Publisher pilot readiness summary",
        evidence: `${readiness.demoReadyNow.length} demo-ready gate(s) are currently marked ready.`,
        nextStep: "Use the demo routes for walkthrough only and keep pilot-publishable language blocked.",
        requiredBeforeClassroomPilot: [
          "Confirm demo scope is understood by publisher and school owner.",
          "Record which routes are shown in the partner walkthrough.",
        ],
        stillBlocked: ["Demo-ready cannot be described as classroom pilot-ready."],
      },
      {
        stageId: "publisher-materials",
        label: "Publisher materials and rights",
        status: openHandoffAssets.length === 0 ? "ready-for-demo" : "open",
        owner: "publisher",
        source: "Pilot handoff package",
        evidence: `${openHandoffAssets.length} handoff asset(s) still need review or replacement.`,
        nextStep: "Collect real partner unit files, audio, video, posters, rights notes, and replacement policy.",
        requiredBeforeClassroomPilot: openHandoffAssets.map((asset) => `${asset.label}: ${asset.nextStep}`),
        stillBlocked: ["No unlicensed or placeholder media can ship to a real pilot."],
      },
      {
        stageId: "evidence-packet",
        label: "Evidence packet completion",
        status: evidenceOpenCount === 0 ? "ready-for-demo" : "open",
        owner: "shared",
        source: "Pilot evidence packet preview",
        evidence: `${evidenceOpenCount} evidence item(s) are missing or blocked.`,
        nextStep: "Attach proof metadata only after evidence storage, identity, retention, and policy are accepted.",
        requiredBeforeClassroomPilot: [
          "Gate evidence is complete.",
          "Approval evidence is complete.",
          "Evidence export and retention rules are accepted.",
        ],
        stillBlocked: evidencePacket.blockedActions,
      },
      {
        stageId: "school-policy",
        label: "School policy and reports",
        status: blockedDecisions.length === 0 ? "open" : "blocked",
        owner: "school",
        source: "Pilot handoff package and package publish gate",
        evidence: `${blockedDecisions.length} human decision(s) are currently blocked.`,
        nextStep: "Accept privacy, retention, report export, access control, and student data boundaries before real progress storage.",
        requiredBeforeClassroomPilot: blockedDecisions.map((decision) => `${decision.label}: ${decision.note}`),
        stillBlocked: ["No real learner progress storage or report export before school policy is accepted."],
      },
      {
        stageId: "technical-release",
        label: "Technical release gate",
        status: readiness.pilotBlockers.length === 0 ? "ready-for-demo" : "blocked",
        owner: "platform",
        source: "Package publish gate",
        evidence: `${readiness.pilotBlockers.length} pilot blocker(s) remain open.`,
        nextStep: "Close release-blocking gates through review rather than manual override.",
        requiredBeforeClassroomPilot: readiness.missingEvidence.map((item) => `${item.gateLabel}: ${item.requirement}`),
        stillBlocked: readiness.stillNotAllowed.map((item) => item.restriction),
      },
      {
        stageId: "classroom-dry-run",
        label: "Teacher classroom dry run",
        status: "open",
        owner: "shared",
        source: "Pilot handoff route map",
        evidence: `${handoffPackage.routes.length} route(s) are available for teacher/admin review.`,
        nextStep: "Run a teacher-only rehearsal using entry code, learner code, launch route, games, media, and report preview.",
        requiredBeforeClassroomPilot: [
          "Teacher can open the front door and direct launch routes.",
          "Teacher understands support-language, microphone, media, and report-export limits.",
          "Teacher confirms the first two to four units are the correct scope.",
        ],
        stillBlocked: ["No student-facing launch until policy, persistence, evidence, and release gates close."],
      },
    ],
    operatingRules: [
      "Pilot launch checklist is a planning surface, not a launch button.",
      "Controlled demo can proceed before real pilot only when everyone understands the limits.",
      "Classroom pilot requires closed policy, evidence, release, and deployment gates.",
      "Hosted PWA remains the recommended first pilot unless the partner requires closed local installation.",
      "Local/closed companion remains compatible but cannot be promised before backup, update, and export procedures exist.",
    ],
  };
}
