import {
  getAiDraftRepairEvidencePacketCollectionWarnings,
  validateAiDraftRepairEvidencePackets,
  type AiDraftRepairEvidenceItem,
  type AiDraftRepairEvidenceItemStatus,
  type AiDraftRepairEvidencePacket,
  type AiDraftRepairEvidencePacketStatus,
} from "@living-textbook/content-model/src/aiDraftRepairEvidencePacket";

export type {
  AiDraftRepairEvidenceItem,
  AiDraftRepairEvidenceItemStatus,
  AiDraftRepairEvidencePacket,
  AiDraftRepairEvidencePacketStatus,
};

const sharedBlockedActions = [
  "No auto-fix from repair evidence",
  "No live AI regeneration from repair evidence",
  "No verifier submission from repair evidence",
  "No package assembly from repair evidence",
  "No route write from repair evidence",
  "No playlist write from repair evidence",
  "No student assignment from repair evidence",
  "No support-language progress from repair evidence",
];

const sharedRequiredBeforeVerifier = [
  "ai_generated_draft_payload_preview",
  "ai_draft_correction_queue",
  "schema_validation_packet",
  "package_game_audio_coverage",
  "media_rights_manifest",
  "teacher_draft_verifier_submission",
  "Teacher repair evidence reviewed before verifier submission",
];

export const sampleAiDraftRepairEvidencePackets: AiDraftRepairEvidencePacket[] = [
  {
    packetId: "ai-draft-repair-evidence-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    draftPreviewId: "ai-draft-preview-sample-publisher-l1-routines-v1",
    correctionQueueId: "ai-draft-correction-queue-ai-draft-preview-sample-publisher-l1-routines-v1",
    label: "Sample publisher draft repair evidence packet",
    summary:
      "Evidence-only packet showing what teacher/admin repair evidence is still required before verifier submission. It does not auto-fix, regenerate with live AI, submit to a verifier, assemble a package, write routes, create playlists, or assign students.",
    status: "blocked",
    targetLanguageProgressTrigger: "target-language-only",
    supportLanguageProgressAllowed: false,
    mediaOnlyProgressAllowed: false,
    autoFixAllowed: false,
    liveAiRegenerationAllowed: false,
    verifierSubmissionAllowed: false,
    packageAssemblyAllowed: false,
    routeWriteAllowed: false,
    playlistWriteAllowed: false,
    studentAssignmentAllowed: false,
    studentReadyMarkerAllowed: false,
    evidenceItems: [
      {
        evidenceId: "sample-schema-repair-evidence",
        label: "Schema validation evidence",
        sourceQueueItemId: "ai-draft-correction-01",
        repairLane: "Schema validation repair lane",
        status: "review-required",
        owner: "Teacher/admin reviewer",
        requiredRecord: "schema_validation_packet",
        evidenceNote: "Draft JSON shape must be reviewed and attached before verifier submission.",
        blocksVerifierSubmission: true,
      },
      {
        evidenceId: "sample-audio-repair-evidence",
        label: "Target-language audio evidence",
        sourceQueueItemId: "ai-draft-correction-02",
        repairLane: "Audio coverage repair lane",
        status: "missing",
        owner: "Audio reviewer",
        requiredRecord: "package_game_audio_coverage",
        evidenceNote: "Every target-language term, sentence, instruction, feedback, and control cue needs approved audio.",
        blocksVerifierSubmission: true,
      },
      {
        evidenceId: "sample-rights-repair-evidence",
        label: "Media rights evidence",
        sourceQueueItemId: "ai-draft-correction-03",
        repairLane: "Media rights repair lane",
        status: "missing",
        owner: "Publisher or rights reviewer",
        requiredRecord: "media_rights_manifest",
        evidenceNote: "Publisher PDF, image, audio, video, and music rights must be reviewed before verifier submission.",
        blocksVerifierSubmission: true,
      },
      {
        evidenceId: "sample-verifier-repair-evidence",
        label: "Verifier handoff evidence",
        sourceQueueItemId: "ai-draft-correction-04",
        repairLane: "Verifier submission repair lane",
        status: "review-required",
        owner: "Package reviewer",
        requiredRecord: "teacher_draft_verifier_submission",
        evidenceNote: "Verifier submission packet can be prepared only after repair evidence is complete.",
        blocksVerifierSubmission: true,
      },
    ],
    requiredBeforeVerifier: sharedRequiredBeforeVerifier,
    blockedActions: sharedBlockedActions,
    reviewerNotes: [
      "Keep repair evidence as metadata until durable evidence storage and reviewer identity exist.",
      "Target-language learning events remain the only progress trigger.",
      "Do not use support-language help or media-only listening as repair evidence for mastery.",
    ],
  },
  {
    packetId: "ai-draft-repair-evidence-ministar-l1-greetings-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    draftPreviewId: "ai-draft-preview-ministar-l1-greetings-v1",
    correctionQueueId: "ai-draft-correction-queue-ai-draft-preview-ministar-l1-greetings-v1",
    label: "MiniStar draft repair evidence packet",
    summary:
      "Evidence-only packet for MiniStar Level 1 greetings repairs before verifier submission. English remains the target-language trigger; Japanese support remains hiragana-only and support-only with no Japanese support-language unlock.",
    status: "blocked",
    targetLanguageProgressTrigger: "target-language-only",
    supportLanguageProgressAllowed: false,
    mediaOnlyProgressAllowed: false,
    autoFixAllowed: false,
    liveAiRegenerationAllowed: false,
    verifierSubmissionAllowed: false,
    packageAssemblyAllowed: false,
    routeWriteAllowed: false,
    playlistWriteAllowed: false,
    studentAssignmentAllowed: false,
    studentReadyMarkerAllowed: false,
    evidenceItems: [
      {
        evidenceId: "ministar-schema-repair-evidence",
        label: "MiniStar schema validation evidence",
        sourceQueueItemId: "ai-draft-correction-01",
        repairLane: "Schema validation repair lane",
        status: "review-required",
        owner: "MiniStar curriculum reviewer",
        requiredRecord: "schema_validation_packet",
        evidenceNote: "Level 1 draft JSON must keep 8 default vocabulary terms and exactly two English target sentences.",
        blocksVerifierSubmission: true,
      },
      {
        evidenceId: "ministar-audio-repair-evidence",
        label: "English audio evidence",
        sourceQueueItemId: "ai-draft-correction-02",
        repairLane: "Audio coverage repair lane",
        status: "missing",
        owner: "MiniStar audio reviewer",
        requiredRecord: "package_game_audio_coverage",
        evidenceNote: "English target-language term, sentence, instruction, feedback, and control audio must be approved.",
        blocksVerifierSubmission: true,
      },
      {
        evidenceId: "ministar-hiragana-support-evidence",
        label: "Hiragana support evidence",
        sourceQueueItemId: "ai-draft-correction-03",
        repairLane: "Support-language repair lane",
        status: "review-required",
        owner: "MiniStar support-language reviewer",
        requiredRecord: "schema_validation_packet",
        evidenceNote: "Japanese support text must remain hiragana-only, support-only, and unable to trigger a Japanese support-language unlock.",
        blocksVerifierSubmission: true,
      },
      {
        evidenceId: "ministar-rights-repair-evidence",
        label: "MiniStar media rights evidence",
        sourceQueueItemId: "ai-draft-correction-04",
        repairLane: "Media rights repair lane",
        status: "missing",
        owner: "MiniStar rights reviewer",
        requiredRecord: "media_rights_manifest",
        evidenceNote: "Mascot, avatar, image, audio, video, and music rights must be reviewed before verifier submission.",
        blocksVerifierSubmission: true,
      },
      {
        evidenceId: "ministar-verifier-repair-evidence",
        label: "MiniStar verifier handoff evidence",
        sourceQueueItemId: "ai-draft-correction-05",
        repairLane: "Verifier submission repair lane",
        status: "review-required",
        owner: "Package reviewer",
        requiredRecord: "teacher_draft_verifier_submission",
        evidenceNote: "Verifier submission remains blocked until English audio, hiragana support, rights, and schema evidence pass.",
        blocksVerifierSubmission: true,
      },
    ],
    requiredBeforeVerifier: [
      ...sharedRequiredBeforeVerifier,
      "Hiragana-only Japanese support evidence",
      "No Japanese support-language unlock",
    ],
    blockedActions: [...sharedBlockedActions, "No Japanese support-language unlock"],
    reviewerNotes: [
      "English target-language learning actions are the only progress evidence.",
      "Japanese support can assist comprehension but cannot satisfy game steps, Star Dust, mastery, verifier submission, approval, package assembly, or release.",
      "No auto-fix or live AI regeneration may run from this repair evidence packet.",
    ],
  },
];

export const sampleAiDraftRepairEvidencePacketErrors = validateAiDraftRepairEvidencePackets(
  sampleAiDraftRepairEvidencePackets,
);

export const sampleAiDraftRepairEvidencePacketWarnings =
  getAiDraftRepairEvidencePacketCollectionWarnings(sampleAiDraftRepairEvidencePackets);

export function filterAiDraftRepairEvidencePacketsByTenant(
  packets: AiDraftRepairEvidencePacket[],
  tenantId: string,
): AiDraftRepairEvidencePacket[] {
  return packets.filter((packet) => packet.tenantId === tenantId);
}
