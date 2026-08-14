import {
  sampleAiExternalPrototypeTaskPackets,
  type AiExternalPrototypeTaskPacket,
} from "@/data/sampleAiExternalPrototypeTaskPacket";
import {
  getAiExternalPrototypeTaskExportReadinessGateCollectionWarnings,
  validateAiExternalPrototypeTaskExportReadinessGates,
  type AiExternalPrototypeTaskExportChannel as SharedAiExternalPrototypeTaskExportChannel,
  type AiExternalPrototypeTaskExportCheck as SharedAiExternalPrototypeTaskExportCheck,
  type AiExternalPrototypeTaskExportCheckStatus,
  type AiExternalPrototypeTaskExportGateStatus,
  type AiExternalPrototypeTaskExportReadinessGate as SharedAiExternalPrototypeTaskExportReadinessGate,
} from "@living-textbook/content-model/src/aiExternalPrototypeTaskExportReadinessGate";

export type AiExternalPrototypeTaskExportCheck = SharedAiExternalPrototypeTaskExportCheck;
export type AiExternalPrototypeTaskExportChannel = SharedAiExternalPrototypeTaskExportChannel;
export type AiExternalPrototypeTaskExportReadinessGate = SharedAiExternalPrototypeTaskExportReadinessGate;
export type { AiExternalPrototypeTaskExportCheckStatus, AiExternalPrototypeTaskExportGateStatus };

export const sampleAiExternalPrototypeTaskExportReadinessGates: AiExternalPrototypeTaskExportReadinessGate[] =
  sampleAiExternalPrototypeTaskPackets.map((packet) => createExportGate(packet));

export const sampleAiExternalPrototypeTaskExportReadinessGateErrors =
  validateAiExternalPrototypeTaskExportReadinessGates(sampleAiExternalPrototypeTaskExportReadinessGates);

export const sampleAiExternalPrototypeTaskExportReadinessGateWarnings =
  getAiExternalPrototypeTaskExportReadinessGateCollectionWarnings(sampleAiExternalPrototypeTaskExportReadinessGates);

function createExportGate(packet: AiExternalPrototypeTaskPacket): AiExternalPrototypeTaskExportReadinessGate {
  const isMiniStar = packet.tenantId === "ministar";

  return {
    gateId: `ai-external-task-export-readiness-${packet.requestId}`,
    tenantId: packet.tenantId,
    requestId: packet.requestId,
    taskPacketId: packet.packetId,
    label: isMiniStar
      ? "MiniStar external task export readiness gate"
      : "AI external task export readiness gate",
    status: "blocked",
    summary:
      "Export readiness blocked. This preview defines what must be true before a copy-ready outside-builder task packet can ever be exported, copied, or handed off.",
    sourceRecords: [
      "ai_external_prototype_task_packet",
      "ai_generator_responsibility_matrix",
      "ai_generator_reviewer_runbook",
      "ai_generator_review_summary",
      "reviewer_identity_signature_gate",
      "evidence_packet",
      "ai_prototype_return_review",
    ],
    exportChannels: [
      {
        channelId: "manual-prompt-copy-preview",
        label: "Manual prompt copy preview",
        status: "blocked",
        purpose: "Future controlled copy of the task brief into an outside builder interface.",
        blockedReason: "No prompt copy action until reviewer identity, evidence storage, and export policy exist.",
      },
      {
        channelId: "repository-issue-preview",
        label: "Repository issue creation preview",
        status: "blocked",
        purpose: "Future issue or task creation in the isolated prototype repository.",
        blockedReason: "No repository issue creation until external builder repository policy is accepted.",
      },
      {
        channelId: "task-archive-preview",
        label: "Task archive download preview",
        status: "blocked",
        purpose: "Future export of the task packet and linked fixtures as a reviewable archive.",
        blockedReason: "No archive download until task packet storage and evidence manifest export gates exist.",
      },
    ],
    readinessChecks: [
      {
        checkId: "reviewer-identity-required",
        label: "Reviewer identity required",
        status: "blocked",
        evidenceRequired: ["Authenticated reviewer", "Reviewer signature policy", "Audit trail write intent"],
        blocksUntil: "Reviewer identity and signature gate is accepted.",
      },
      {
        checkId: "evidence-storage-required",
        label: "Evidence storage required",
        status: "blocked",
        evidenceRequired: ["Evidence packet storage", "Attachment policy", "Export manifest policy"],
        blocksUntil: "Evidence storage adapter selection is accepted.",
      },
      {
        checkId: "task-packet-storage-required",
        label: "Task packet storage required",
        status: "ready-preview",
        evidenceRequired: ["ai_external_prototype_task_packet", "Hosted/local adapter flags", "Migration spec"],
        blocksUntil: "Task packet record is durable and versioned for export.",
      },
      {
        checkId: "repository-policy-required",
        label: "External builder repository policy required",
        status: "blocked",
        evidenceRequired: ["Drewsure/ministar-lab only", "Prototype folder rule", "No apps/web patch authority"],
        blocksUntil: "Repository scope and outside-builder policy are accepted.",
      },
      {
        checkId: "return-review-intake-required",
        label: "Return review intake required",
        status: "blocked",
        evidenceRequired: ["AI prototype return review", "Return evidence checklist", "Codex owner confirmation required"],
        blocksUntil: "Return-review intake gate is ready to receive external prototype evidence.",
      },
    ],
    blockedActions: [
      "No task export",
      "No prompt copy action",
      "No repository issue creation",
      "No archive download",
      "No live handoff",
      "No app file writes",
      "No route creation",
      "No scoring authority",
      "No student-facing pathway",
      "No support-language progress",
      ...(isMiniStar ? ["No Japanese support-language progress"] : []),
    ],
  };
}

export function filterAiExternalPrototypeTaskExportReadinessGatesByTenant(
  gates: AiExternalPrototypeTaskExportReadinessGate[],
  tenantId: string,
): AiExternalPrototypeTaskExportReadinessGate[] {
  return gates.filter((gate) => gate.tenantId === tenantId);
}
