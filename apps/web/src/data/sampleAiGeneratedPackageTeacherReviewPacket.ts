import {
  getAiGeneratedPackageTeacherReviewPacketCollectionWarnings,
  validateAiGeneratedPackageTeacherReviewPackets,
  type AiGeneratedPackageTeacherReviewLane as SharedAiGeneratedPackageTeacherReviewLane,
  type AiGeneratedPackageTeacherReviewPacket as SharedAiGeneratedPackageTeacherReviewPacket,
} from "@living-textbook/content-model/src/aiGeneratedPackageTeacherReviewPacket";

export type AiGeneratedPackageTeacherReviewPacketStatus =
  SharedAiGeneratedPackageTeacherReviewPacket["status"];

export type AiGeneratedPackageTeacherReviewLaneStatus =
  SharedAiGeneratedPackageTeacherReviewLane["status"];

export type AiGeneratedPackageTeacherReviewLane = SharedAiGeneratedPackageTeacherReviewLane;

export type AiGeneratedPackageTeacherReviewPacket = SharedAiGeneratedPackageTeacherReviewPacket;

export const sampleAiGeneratedPackageTeacherReviewPackets: AiGeneratedPackageTeacherReviewPacket[] = [
  {
    packetId: "ai-generated-package-teacher-review-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher generated package teacher review packet",
    status: "review-only",
    summary:
      "An AI generated package teacher review packet that gathers the draft payload, target-language audio, curated activity path, deterministic rewards, media rights, verifier readiness, and blocked package actions into one review-only surface.",
    decisionLanes: [
      {
        label: "Generated content fit",
        status: "review-ready",
        sourceRecord: "ai-draft-preview-sample-publisher-l1-routines-v1",
        evidence: "8 vocabulary terms, exactly 2 target sentences, and teacher launch copy are visible.",
        teacherQuestion: "Does the routine language match the textbook page and class age?",
        blocker: "Teacher approval ledger is not captured.",
      },
      {
        label: "Target-language audio",
        status: "needs-evidence",
        sourceRecord: "ai-audio-coverage-sample-publisher-l1-routines-v1",
        evidence: "Term, sentence, instruction, feedback, and control audio are listed for review.",
        teacherQuestion: "Is every target-language text item covered by approved audio?",
        blocker: "Target-language audio approval record missing.",
      },
      {
        label: "Curated activity pathway",
        status: "accepted-preview",
        sourceRecord: "activity_compatibility_snapshot",
        evidence: "Flashcards, Match Up, Label It, Memory Match, Quiz, Sentence Builder, Speak It, and printable review are curated.",
        teacherQuestion: "Should this unit use the recommended pathway without offering a broad switch panel?",
        blocker: "No student route can be created from this packet.",
      },
      {
        label: "Media and rights",
        status: "needs-evidence",
        sourceRecord: "media_rights_manifest",
        evidence: "Audio and video needs are named, but source rights and final asset attachments are missing.",
        teacherQuestion: "Can the publisher prove the music, audio, images, and video are owned or licensed?",
        blocker: "Media rights evidence attachment missing.",
      },
      {
        label: "Reward and progress",
        status: "review-ready",
        sourceRecord: "ai-reward-readiness-sample-publisher-l1-routines-v1",
        evidence: "Star Dust, mastery threshold, and collection unlocks are deterministic and learning-event based.",
        teacherQuestion: "Are rewards appropriate and free from random pressure mechanics?",
        blocker: "Collection inventory storage is not implemented.",
      },
      {
        label: "Verifier and release control",
        status: "blocked",
        sourceRecord: "ai_verifier_result_evidence_packet",
        evidence:
          "Verifier result evidence is defined, but result state remains verifier-result-not-submitted and teacher approval is blocked.",
        teacherQuestion: "What evidence must be fixed before this can become a package candidate?",
        blocker: "Verifier result finalization, signed approval, and release-control binding are missing.",
      },
    ],
    readySignals: [
      "Draft payload is JSON-first and reviewable.",
      "Curated pathway avoids a switch-to-anything panel.",
      "Deterministic reward mapping is visible.",
      "Support-language use is support-only.",
      "Teacher review questions are explicit before approval.",
    ],
    missingEvidence: [
      "Teacher approval ledger",
      "Verifier result evidence packet",
      "Target-language audio approval",
      "Media-rights attachment",
      "Release-control binding",
      "Assignment rollout gate",
    ],
    blockedActions: [
      "No teacher approval capture",
      "No teacher approval from verifier result",
      "No package assembly from teacher packet",
      "No route creation from teacher packet",
      "No playlist creation from teacher packet",
      "No assignment creation from teacher packet",
      "No student-ready marker from teacher packet",
      "No support-language progress trigger",
    ],
    nextRequiredRecords: [
      "teacher_approval_ledger",
      "ai_verifier_result_evidence_packet",
      "media_rights_evidence_attachment",
      "target_language_audio_approval",
      "release_control_binding",
      "assignment_rollout_gate",
    ],
  },
  {
    packetId: "ai-generated-package-teacher-review-ministar-l1-greetings-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar generated package teacher review packet",
    status: "review-only",
    summary:
      "An AI generated package teacher review packet for MiniStar that gathers the greetings draft, English target-language audio, Flashcards-to-Memory-Match pathway, deterministic Star Dust, media-rights blockers, hiragana-only Japanese support checks, and verifier readiness before package assembly can exist.",
    decisionLanes: [
      {
        label: "MiniStar content fit",
        status: "review-ready",
        sourceRecord: "ai-draft-preview-ministar-l1-greetings-v1",
        evidence: "8 greeting terms, exactly 2 target sentences, and teacher launch copy are visible.",
        teacherQuestion: "Does this Foundation greetings unit match the MiniStar sequence and classroom entry flow?",
        blocker: "MiniStar teacher approval not captured.",
      },
      {
        label: "English target-language audio",
        status: "needs-evidence",
        sourceRecord: "ai-audio-coverage-ministar-l1-greetings-v1",
        evidence: "English target-language audio is the approval trigger for term, sentence, instruction, and control text.",
        teacherQuestion: "Has every English target-language text item been approved for tap-to-speak use?",
        blocker: "English target-language audio approval record missing.",
      },
      {
        label: "Japanese support boundary",
        status: "review-ready",
        sourceRecord: "ai-draft-preview-ministar-l1-greetings-v1",
        evidence: "Japanese support remains hiragana-only and support-only for Foundation.",
        teacherQuestion: "Is the Japanese helper text correct without becoming the learning trigger?",
        blocker: "No Japanese support-language progress trigger.",
      },
      {
        label: "Curated activity pathway",
        status: "accepted-preview",
        sourceRecord: "activity_compatibility_snapshot",
        evidence: "Entry Flashcards, Match Up, Label It, Memory Match, Quiz, Sentence Builder, Speak It, and printable review are curated.",
        teacherQuestion: "Should the class begin with QR flashcards and unlock the next game only after English practice?",
        blocker: "No route or playlist creation from this packet.",
      },
      {
        label: "Rewards and collection",
        status: "review-ready",
        sourceRecord: "ai-reward-readiness-ministar-l1-greetings-v1",
        evidence: "Star Dust and collection unlocks are deterministic and tied to English learning events.",
        teacherQuestion: "Are the earned collection rewards age-appropriate for Foundation learners?",
        blocker: "Collection inventory storage is not implemented.",
      },
      {
        label: "Verifier, media, and approval",
        status: "blocked",
        sourceRecord: "ai_verifier_result_evidence_packet",
        evidence:
          "MiniStar verifier result evidence is defined, but verifier-result-not-submitted, media rights, and teacher approval blockers remain visible.",
        teacherQuestion: "What must be fixed before this can enter a private tenant package library?",
        blocker: "Verifier result finalization, MiniStar media rights evidence attachments, and approval ledger are missing.",
      },
    ],
    readySignals: [
      "MiniStar draft payload is JSON-first and reviewable.",
      "English target-language trigger is preserved.",
      "Foundation Japanese support remains hiragana-only.",
      "Japanese support remains support-only.",
      "Curated Flashcards-to-Memory-Match pathway is visible.",
      "Deterministic Star Dust mapping is visible.",
    ],
    missingEvidence: [
      "MiniStar teacher approval ledger",
      "MiniStar verifier result evidence packet",
      "English target-language audio approval",
      "MiniStar media rights evidence attachments",
      "Release-control binding",
      "Assignment rollout gate",
    ],
    blockedActions: [
      "No teacher approval capture",
      "No teacher approval from verifier result",
      "No package assembly from teacher packet",
      "No route creation from teacher packet",
      "No playlist creation from teacher packet",
      "No assignment creation from teacher packet",
      "No student-ready marker from teacher packet",
      "No Japanese support-language progress trigger",
    ],
    nextRequiredRecords: [
      "teacher_approval_ledger",
      "ai_verifier_result_evidence_packet",
      "media_rights_evidence_attachment",
      "target_language_audio_approval",
      "release_control_binding",
      "assignment_rollout_gate",
    ],
  },
];

export const sampleAiGeneratedPackageTeacherReviewPacketErrors =
  validateAiGeneratedPackageTeacherReviewPackets(sampleAiGeneratedPackageTeacherReviewPackets);

export const sampleAiGeneratedPackageTeacherReviewPacketWarnings =
  getAiGeneratedPackageTeacherReviewPacketCollectionWarnings(sampleAiGeneratedPackageTeacherReviewPackets);

export function filterAiGeneratedPackageTeacherReviewPacketsByTenant(
  packets: AiGeneratedPackageTeacherReviewPacket[],
  tenantId: string,
): AiGeneratedPackageTeacherReviewPacket[] {
  return packets.filter((packet) => packet.tenantId === tenantId);
}
