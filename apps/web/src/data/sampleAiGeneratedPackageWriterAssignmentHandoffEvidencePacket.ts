import {
  sampleAiGeneratedPackageWriterAssignmentShellGuards,
  type AiGeneratedPackageWriterAssignmentShellGuard,
} from "@/data/sampleAiGeneratedPackageWriterAssignmentShellGuard";
import {
  getAiGeneratedPackageWriterAssignmentHandoffEvidencePacketCollectionWarnings,
  validateAiGeneratedPackageWriterAssignmentHandoffEvidencePackets,
  type AiGeneratedPackageWriterAssignmentHandoffEvidenceLane,
  type AiGeneratedPackageWriterAssignmentHandoffEvidencePacket,
  type AiGeneratedPackageWriterAssignmentHandoffEvidencePacketStatus,
} from "@living-textbook/content-model/src/aiPackageWriterAssignmentHandoffEvidencePacket";

export type {
  AiGeneratedPackageWriterAssignmentHandoffEvidenceLane,
  AiGeneratedPackageWriterAssignmentHandoffEvidencePacket,
  AiGeneratedPackageWriterAssignmentHandoffEvidencePacketStatus,
};

export const sampleAiGeneratedPackageWriterAssignmentHandoffEvidencePackets:
  AiGeneratedPackageWriterAssignmentHandoffEvidencePacket[] =
  sampleAiGeneratedPackageWriterAssignmentShellGuards.map((guard) => createAssignmentHandoffEvidencePacket(guard));

export const sampleAiGeneratedPackageWriterAssignmentHandoffEvidencePacketErrors =
  validateAiGeneratedPackageWriterAssignmentHandoffEvidencePackets(
    sampleAiGeneratedPackageWriterAssignmentHandoffEvidencePackets,
  );

export const sampleAiGeneratedPackageWriterAssignmentHandoffEvidencePacketWarnings =
  getAiGeneratedPackageWriterAssignmentHandoffEvidencePacketCollectionWarnings(
    sampleAiGeneratedPackageWriterAssignmentHandoffEvidencePackets,
  );

export function filterAiGeneratedPackageWriterAssignmentHandoffEvidencePacketsByTenant(
  packets: AiGeneratedPackageWriterAssignmentHandoffEvidencePacket[],
  tenantId: string,
): AiGeneratedPackageWriterAssignmentHandoffEvidencePacket[] {
  return packets.filter((packet) => packet.tenantId === tenantId);
}

function createAssignmentHandoffEvidencePacket(
  guard: AiGeneratedPackageWriterAssignmentShellGuard,
): AiGeneratedPackageWriterAssignmentHandoffEvidencePacket {
  const isMiniStar = guard.tenantId === "ministar";
  const assignmentPreviewId = isMiniStar
    ? "assignment-ministar-generated-greetings-handoff-preview-blocked"
    : "assignment-sample-publisher-generated-routines-handoff-preview-blocked";

  return {
    evidencePacketId: `ai-generated-package-writer-assignment-handoff-evidence-packet-${guard.requestId}`,
    tenantId: guard.tenantId,
    requestId: guard.requestId,
    assignmentShellGuardId: guard.guardId,
    label: isMiniStar
      ? "MiniStar assignment handoff evidence packet"
      : "AI generated package writer assignment handoff evidence packet",
    summary: isMiniStar
      ? "Review-only packet for generated assignment handoff evidence. It keeps English progress triggers, hiragana support-only rules, teacher QR/front-door setup, privacy, reporting, launch, and rollback proof visible before assignment activation."
      : "Review-only packet for generated assignment handoff evidence. It keeps target-language triggers, teacher QR/front-door setup, privacy, reporting, launch, and rollback proof visible before assignment activation.",
    status: "blocked",
    evidenceState: "Assignment handoff blocked pending signed evidence and rollout gate",
    packageIdPreview: guard.packageIdPreview,
    assignmentPreviewId,
    evidenceLanes: [
      {
        laneId: `${assignmentPreviewId}-assignment-shell-evidence`,
        label: "Assignment shell evidence lane",
        sourceRecords: [guard.guardId, guard.packageIdPreview],
        requiredEvidence: [
          "Assignment shell guard storage contract",
          "Teacher QR/front-door assignment review",
          "Target-language trigger assignment check",
        ],
        acceptanceChecks: [
          isMiniStar
            ? "English actions are the only assignment progress trigger"
            : "Target-language actions are the only assignment progress trigger",
          "Assignment shell remains a preview record",
          "Teacher QR/front-door setup is reviewed before launch",
        ],
        blockedGaps: ["No assignment shell write", "No assignment activation from generated package"],
      },
      {
        laneId: `${assignmentPreviewId}-private-link-evidence`,
        label: "Private link evidence lane",
        sourceRecords: ["private-assignment-link-preview", "school-policy-acceptance-preflight"],
        requiredEvidence: [
          "Private assignment link policy",
          "Teacher access boundary proof",
          "School policy acceptance preflight",
        ],
        acceptanceChecks: [
          "Private links are tenant-scoped",
          "Public sharing remains blocked",
          "School policy can revoke assignment access",
        ],
        blockedGaps: ["No private assignment link activation", "No public assignment sharing"],
      },
      {
        laneId: `${assignmentPreviewId}-roster-privacy-evidence`,
        label: "Roster and privacy evidence lane",
        sourceRecords: ["class-roster-plan-preview", "teacher-report-package-preview"],
        requiredEvidence: ["No real learner data collection proof", "Class roster identity boundary", "Privacy review"],
        acceptanceChecks: [
          "Roster evidence is anonymous or synthetic in foundation",
          "No real learner names are required for package review",
          "Raw learner audio and transcript storage remain blocked",
        ],
        blockedGaps: ["No class roster binding", "No raw learner audio or transcript storage"],
      },
      {
        laneId: `${assignmentPreviewId}-progress-reporting-evidence`,
        label: "Progress and reporting evidence lane",
        sourceRecords: ["progress-event-taxonomy-preview", "teacher-report-package-preview"],
        requiredEvidence: ["Teacher report privacy proof", "Progress event taxonomy proof", "Report export policy draft"],
        acceptanceChecks: [
          "Progress events use approved event taxonomy",
          "Support-language taps remain support-only events",
          "Teacher reports show mastery summaries without raw transcript export",
        ],
        blockedGaps: ["No progress event stream activation", "No teacher report export"],
      },
      {
        laneId: `${assignmentPreviewId}-launch-rollback-evidence`,
        label: "Launch and rollback evidence lane",
        sourceRecords: ["classroom-launch-gate-preview", "rollback-restore-checkpoint-preview"],
        requiredEvidence: ["Classroom launch gate review", "Teacher dry-run evidence", "Rollback restore checkpoint"],
        acceptanceChecks: [
          "Launch gate remains blocked until school policy approval",
          "Rollback evidence is visible before pilot launch",
          isMiniStar ? "Hiragana Japanese support cannot approve launch" : "Support language cannot approve launch",
        ],
        blockedGaps: ["No live classroom launch", "No support-language-only assignment handoff"],
      },
    ],
    missingEvidence: [
      "Assignment handoff evidence packet storage contract",
      "Teacher assignment rollout gate",
      "Signed school policy acceptance",
      "Teacher report export policy review",
    ],
    blockedHandoffActions: [
      "No assignment shell write",
      "No private assignment link activation",
      "No class roster binding",
      "No progress event stream activation",
      "No teacher report export",
      "No live classroom launch",
      "No assignment activation from generated package",
      "No support-language-only assignment handoff",
      "No raw learner audio or transcript storage",
    ],
    nextRequiredRecords: [
      "Assignment handoff evidence packet storage contract",
      "Teacher assignment rollout gate",
      "Teacher report export policy review",
      "Class roster privacy policy review",
      "School policy acceptance record preview",
    ],
    supportLanguageBoundary: guard.supportLanguageBoundary,
  };
}
