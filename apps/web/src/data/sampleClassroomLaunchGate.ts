import { samplePackageApprovalLedger, type PackageApprovalLedger } from "@/data/samplePackageApprovalLedger";
import { samplePackagePublishGate, type PackagePublishGate } from "@/data/samplePackagePublishGate";
import { samplePilotEvidencePacket, type PilotEvidencePacket } from "@/data/samplePilotEvidencePacket";
import { sampleTeacherDryRunRehearsal, type TeacherDryRunRehearsal } from "@/data/sampleTeacherDryRunRehearsal";

export type ClassroomLaunchGateStatus = "ready" | "needs-policy" | "blocked";
export type ClassroomLaunchGateSource =
  | "publish-gate"
  | "approval-ledger"
  | "evidence-packet"
  | "teacher-dry-run"
  | "policy";

export interface ClassroomLaunchGateItem {
  itemId: string;
  label: string;
  status: ClassroomLaunchGateStatus;
  source: ClassroomLaunchGateSource;
  owner: string;
  evidence: string;
  nextStep: string;
  requiredBeforeLaunch: string[];
  blockedActions: string[];
}

export interface ClassroomLaunchGate {
  gateId: string;
  label: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  launchStatus: string;
  sourceOfTruth: string;
  summary: string;
  items: ClassroomLaunchGateItem[];
  operatingRules: string[];
}

export const sampleClassroomLaunchGate = createClassroomLaunchGate({
  gate: samplePackagePublishGate,
  ledger: samplePackageApprovalLedger,
  evidencePacket: samplePilotEvidencePacket,
  rehearsal: sampleTeacherDryRunRehearsal,
});

export function createClassroomLaunchGate({
  gate,
  ledger,
  evidencePacket,
  rehearsal,
}: {
  gate: PackagePublishGate;
  ledger: PackageApprovalLedger;
  evidencePacket: PilotEvidencePacket;
  rehearsal: TeacherDryRunRehearsal;
}): ClassroomLaunchGate {
  const releaseBlockingItems = gate.items.filter((item) => item.blocksRelease && item.status !== "ready");
  const openSignoffs = ledger.signoffs.filter((signoff) => signoff.requiredBeforePilot && signoff.status !== "signed");
  const openEvidence = evidencePacket.gateEvidence
    .concat(evidencePacket.approvalEvidence)
    .filter((item) => item.status !== "attached");
  const dryRunOpenStages = rehearsal.stages.filter((stage) => stage.status !== "ready-for-rehearsal");
  const hasBlockedEvidence = openEvidence.some((item) => item.status === "blocked");
  const hasBlockedDryRunStage = dryRunOpenStages.some((stage) => stage.status === "blocked");
  const items: ClassroomLaunchGateItem[] = [
    ...releaseBlockingItems.map((item) => ({
      itemId: `publish-${item.gateId}`,
      label: item.label,
      status: toClassroomLaunchGateStatus(item.status),
      source: "publish-gate" as const,
      owner: item.owner,
      evidence: item.evidence,
      nextStep: item.nextStep,
      requiredBeforeLaunch: item.requiredBeforePilot,
      blockedActions: item.notAllowedYet,
    })),
    ...openSignoffs.map((signoff) => ({
      itemId: `approval-${signoff.signoffId}`,
      label: signoff.label,
      status: toClassroomLaunchApprovalStatus(signoff.status),
      source: "approval-ledger" as const,
      owner: signoff.owner,
      evidence: signoff.evidence,
      nextStep: signoff.nextStep,
      requiredBeforeLaunch: signoff.cannotApproveWhile,
      blockedActions: signoff.cannotApproveWhile,
    })),
    {
      itemId: "evidence-packet-open-items",
      label: "Dry-run evidence required",
      status: hasBlockedEvidence ? "blocked" : "needs-policy",
      source: "evidence-packet",
      owner: "shared",
      evidence: `${openEvidence.length} evidence item(s) remain missing or blocked before a live classroom launch can be considered.`,
      nextStep: "Attach reviewed evidence records through a real storage and approval workflow before any student launch action exists.",
      requiredBeforeLaunch: [
        "Gate evidence must be attached.",
        "Approval evidence must be attached.",
        "Evidence upload and signed approval capture must be implemented before live launch review.",
      ],
      blockedActions: [
        "No live student session",
        "No launch button",
        "No chat-only approval proof",
        "No pilot release from evidence packet alone",
      ],
    },
    {
      itemId: "teacher-dry-run-open-items",
      label: "Teacher dry-run completion required",
      status: hasBlockedDryRunStage ? "blocked" : "needs-policy",
      source: "teacher-dry-run",
      owner: "teacher",
      evidence: `${dryRunOpenStages.length} dry-run stage(s) still need review or policy closure before classroom use.`,
      nextStep: "Complete the teacher-only route, game, audio, media, support-language, report, and local fallback rehearsal without using real learner data.",
      requiredBeforeLaunch: dryRunOpenStages.map((stage) => stage.label),
      blockedActions: [
        "Do not collect real learner data",
        "Do not store live progress",
        "Do not export reports",
        "Do not describe dry-run evidence as pilot approval",
      ],
    },
    {
      itemId: "policy-persistence-real-learner-data",
      label: "Policy and persistence required",
      status: "blocked",
      source: "policy",
      owner: "school",
      evidence: "Teacher reports, durable storage, learner identity, retention, and export policy remain blocked for real children.",
      nextStep: "Accept privacy, retention, export, access-control, backend, and cost policies before real student assignment.",
      requiredBeforeLaunch: [
        "Privacy and retention policy accepted.",
        "Persistence adapter selected and verified.",
        "Report event acceptance gate passed.",
        "Teacher report export policy accepted.",
      ],
      blockedActions: ["Real learner data blocked", "Report export still blocked", "No live student session", "No launch button"],
    },
  ];

  return {
    gateId: `${gate.packageId}-${gate.releaseCandidate.toLowerCase().replaceAll(" ", "-")}-classroom-launch-gate`,
    label: "Classroom launch gate preview",
    tenantId: gate.tenantId,
    packageId: gate.packageId,
    releaseCandidate: gate.releaseCandidate,
    launchStatus: "Launch blocked",
    sourceOfTruth:
      "Source of truth: package publish gate, approval ledger, pilot evidence packet, and teacher dry-run rehearsal",
    summary:
      "This final pre-launch surface keeps teacher rehearsal separate from real classroom launch. It lists the release, approval, evidence, dry-run, policy, and persistence items that must close before children are invited.",
    items,
    operatingRules: [
      "No live student session can start from this foundation gate.",
      "No launch button appears until publish gates, approvals, evidence, dry-run checks, policy, and persistence are closed.",
      "Teacher dry-run evidence helps readiness review but does not approve a classroom pilot.",
      "Real learner data blocked remains the default until school policy and durable storage are accepted.",
      "Report export still blocked remains visible until reporting, privacy, retention, and access-control rules are accepted.",
    ],
  };
}

function toClassroomLaunchGateStatus(status: PackagePublishGate["items"][number]["status"]): ClassroomLaunchGateStatus {
  return status === "ready" ? "ready" : status === "blocked" ? "blocked" : "needs-policy";
}

function toClassroomLaunchApprovalStatus(status: PackageApprovalLedger["signoffs"][number]["status"]): ClassroomLaunchGateStatus {
  return status === "signed" ? "ready" : status === "blocked" ? "blocked" : "needs-policy";
}
