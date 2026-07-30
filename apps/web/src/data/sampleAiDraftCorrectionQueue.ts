import {
  getAiGeneratedDraftPayloadPreviewWarnings,
  validateAiGeneratedDraftPayloadPreview,
} from "@living-textbook/content-model/src/aiGeneratedDraftPayload";
import {
  type AiGeneratedDraftPayloadPreview,
  sampleAiGeneratedDraftPayloadPreviews,
} from "@/data/sampleAiGeneratedDraftPayloadPreview";

export type AiDraftCorrectionQueueStatus = "blocked" | "needs-review" | "ready-for-review";
export type AiDraftCorrectionItemSeverity = "validation block" | "review warning";

export interface AiDraftCorrectionItem {
  itemId: string;
  severity: AiDraftCorrectionItemSeverity;
  lane: string;
  requiredOwner: string;
  issue: string;
  nextRecord: string;
  studentUseEffect: string;
}

export interface AiDraftCorrectionQueue {
  queueId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  status: AiDraftCorrectionQueueStatus;
  validationBlockCount: number;
  warningCount: number;
  items: AiDraftCorrectionItem[];
  blockedActions: string[];
  nextRequirements: string[];
}

export const sampleAiDraftCorrectionQueues: AiDraftCorrectionQueue[] =
  sampleAiGeneratedDraftPayloadPreviews.map(createAiDraftCorrectionQueue);

export function filterAiDraftCorrectionQueuesByTenant(
  queues: AiDraftCorrectionQueue[],
  tenantId: string,
): AiDraftCorrectionQueue[] {
  return queues.filter((queue) => queue.tenantId === tenantId);
}

function createAiDraftCorrectionQueue(preview: AiGeneratedDraftPayloadPreview): AiDraftCorrectionQueue {
  const validationBlocks = validateAiGeneratedDraftPayloadPreview(preview);
  const warnings = getAiGeneratedDraftPayloadPreviewWarnings(preview);
  const items = [
    ...validationBlocks.map((issue, index) => createCorrectionItem(issue, "validation block", index)),
    ...warnings.map((issue, index) => createCorrectionItem(issue, "review warning", index + validationBlocks.length)),
  ];

  return {
    queueId: `ai-draft-correction-queue-${preview.previewId}`,
    tenantId: preview.tenantId,
    requestId: preview.requestId,
    label: "AI draft correction queue",
    summary:
      "Validator output becomes a teacher/admin repair queue before verifier submission, package assembly, route creation, playlist creation, or assignment can be considered.",
    status: validationBlocks.length > 0 ? "blocked" : warnings.length > 0 ? "needs-review" : "ready-for-review",
    validationBlockCount: validationBlocks.length,
    warningCount: warnings.length,
    items,
    blockedActions: [
      "No auto-fix from AI draft",
      "No regenerate live AI",
      "No verifier submission from correction queue",
      "No package assembly from correction queue",
      "No route or playlist creation",
      "No student assignment",
    ],
    nextRequirements: [
      "Teacher content repair",
      "Target-language audio approval",
      "Media rights evidence",
      "Schema validation packet",
      "AI verifier submission packet",
      "Package approval ledger binding",
    ],
  };
}

function createCorrectionItem(
  issue: string,
  severity: AiDraftCorrectionItemSeverity,
  index: number,
): AiDraftCorrectionItem {
  const classification = classifyIssue(issue);

  return {
    itemId: `ai-draft-correction-${String(index + 1).padStart(2, "0")}`,
    severity,
    lane: classification.lane,
    requiredOwner: classification.requiredOwner,
    issue,
    nextRecord: classification.nextRecord,
    studentUseEffect: classification.studentUseEffect,
  };
}

function classifyIssue(issue: string): Omit<AiDraftCorrectionItem, "itemId" | "severity" | "issue"> {
  const normalizedIssue = issue.toLowerCase();

  if (normalizedIssue.includes("audio")) {
    return {
      lane: "Audio coverage repair lane",
      requiredOwner: "Teacher or audio reviewer",
      nextRecord: "package_game_audio_coverage",
      studentUseEffect: "Blocks student play because young learners need approved target-language audio.",
    };
  }

  if (
    normalizedIssue.includes("target_language_progress_trigger") ||
    normalizedIssue.includes("support_language_progress_allowed") ||
    normalizedIssue.includes("media_only_progress_allowed")
  ) {
    return {
      lane: "Progress policy repair lane",
      requiredOwner: "Platform reviewer",
      nextRecord: "progress_event_acceptance_map",
      studentUseEffect: "Blocks mastery because only target-language learning actions may unlock progress.",
    };
  }

  if (normalizedIssue.includes("vocabulary_terms") || normalizedIssue.includes("target_sentences")) {
    return {
      lane: "Pedagogical payload repair lane",
      requiredOwner: "Teacher or curriculum reviewer",
      nextRecord: "teacher_draft_package",
      studentUseEffect: "Blocks assignment until the vocabulary and sentence lock is correct.",
    };
  }

  if (normalizedIssue.includes("verifier") || normalizedIssue.includes("approved_for_students")) {
    return {
      lane: "Verifier submission repair lane",
      requiredOwner: "Package reviewer",
      nextRecord: "teacher_draft_verifier_submission",
      studentUseEffect: "Blocks review promotion until the verifier state is durable and explicit.",
    };
  }

  if (normalizedIssue.includes("blocked action") || normalizedIssue.includes("next required record")) {
    return {
      lane: "Release lock repair lane",
      requiredOwner: "Release owner",
      nextRecord: "ai_generated_package_manifest",
      studentUseEffect: "Blocks package release until all draft-only locks are represented.",
    };
  }

  return {
    lane: "General schema repair lane",
    requiredOwner: "Teacher/admin reviewer",
    nextRecord: "schema_validation_packet",
    studentUseEffect: "Blocks student use until the draft payload can pass shared validation.",
  };
}
