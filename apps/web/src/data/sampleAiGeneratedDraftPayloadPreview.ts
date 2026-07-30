import {
  getAiGeneratedDraftPayloadPreviewWarnings,
  type AiGeneratedDraftPayloadPreview,
  type AiGeneratedDraftPayloadStatus,
  validateAiGeneratedDraftPayloadPreview,
} from "@living-textbook/content-model/src/aiGeneratedDraftPayload";

export type { AiGeneratedDraftPayloadPreview, AiGeneratedDraftPayloadStatus };

export const sampleAiGeneratedDraftPayloadPreviews: AiGeneratedDraftPayloadPreview[] = [
  {
    previewId: "ai-draft-preview-sample-publisher-l1-routines-v1",
    requestId: "sample-publisher-l1-routines-game-draft",
    tenantId: "sample-publisher",
    label: "Sample publisher Draft JSON preview",
    summary:
      "A concrete preview of the kind of JSON-first payload the generator may create after reviewed source material exists. This preview is intentionally not assigned, published, or submitted to a live verifier.",
    status: "draft-only",
    draftJson: {
      unit_meta: {
        tenant_id: "sample-publisher",
        level: 1,
        theme: "Daily Routines",
        game_mode: "curated-pathway",
        engine_id: "multi-engine",
        pathway_modes: ["flashcards", "memory-match", "sentence-builder"],
      },
      pedagogical_payload: {
        vocabulary_terms: ["wake up", "wash", "eat", "drink", "brush", "pack", "walk", "sleep"],
        target_sentences: ["I wake up in the morning.", "I brush my teeth, please."],
      },
      audio_cues: [
        { kind: "term", text: "wake up", language: "en", status: "required-not-approved" },
        { kind: "term", text: "wash", language: "en", status: "required-not-approved" },
        { kind: "sentence", text: "I wake up in the morning.", language: "en", status: "required-not-approved" },
        { kind: "instruction", text: "Tap each card. Listen and repeat.", language: "en", status: "required-not-approved" },
      ],
      progress_policy: {
        target_language_progress_trigger: "target-language-only",
        progress_unlock_allowed: true,
        support_language_progress_allowed: false,
        media_only_progress_allowed: false,
      },
      verifier_submission: {
        teacher_draft_verifier_submission: "required",
        submitted_to_verifier: false,
        approved_for_students: false,
      },
    },
    preflight: [
      {
        checkId: "draft-json-shape",
        label: "Draft JSON shape",
        status: "draft-only",
        result: "Schema preview is present but not persisted.",
        blocksStudentUse: true,
      },
      {
        checkId: "target-language-audio",
        label: "Target-language audio coverage",
        status: "blocked",
        result: "audio_coverage_status: required-not-approved",
        blocksStudentUse: true,
      },
      {
        checkId: "support-language-progress",
        label: "Support-language progress boundary",
        status: "draft-only",
        result: "support_language_progress_allowed: false",
        blocksStudentUse: true,
      },
      {
        checkId: "teacher-approval",
        label: "Teacher approval",
        status: "blocked",
        result: "Teacher approval missing",
        blocksStudentUse: true,
      },
      {
        checkId: "media-rights",
        label: "Media rights",
        status: "blocked",
        result: "Media rights missing",
        blocksStudentUse: true,
      },
    ],
    blockedActions: [
      "Copy JSON blocked",
      "Submit to verifier blocked",
      "Publish generated package blocked",
      "Create student assignment blocked",
      "Create playlist from draft blocked",
      "Use target audio before approval blocked",
    ],
    nextRecords: [
      "teacher_draft_package",
      "teacher_draft_verifier_submission",
      "package_game_audio_coverage",
      "activity_compatibility_snapshot",
      "media_rights_manifest",
    ],
  },
  {
    previewId: "ai-draft-preview-ministar-l1-greetings-v1",
    requestId: "ministar-l1-greetings-game-draft",
    tenantId: "ministar",
    label: "MiniStar Draft JSON preview",
    summary:
      "A review-only MiniStar Level 1 greetings payload preview. English remains the target-language progress trigger, Japanese support remains hiragana-only and support-only, and no route, playlist, verifier submission, or assignment can be created from this draft.",
    status: "draft-only",
    draftJson: {
      unit_meta: {
        tenant_id: "ministar",
        level: 1,
        theme: "Greetings",
        target_language: "en",
        support_language: "ja-hiragana",
        game_mode: "curated-pathway",
        engine_id: "multi-engine",
        pathway_modes: ["flashcards", "memory-match", "speak-it"],
      },
      pedagogical_payload: {
        vocabulary_terms: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please", "thank you"],
        target_sentences: ["Hello, teacher.", "Thank you, friend."],
      },
      audio_cues: [
        { kind: "term", text: "hello", language: "en", status: "required-not-approved" },
        { kind: "term", text: "goodbye", language: "en", status: "required-not-approved" },
        { kind: "term", text: "teacher", language: "en", status: "required-not-approved" },
        { kind: "term", text: "friend", language: "en", status: "required-not-approved" },
        { kind: "term", text: "morning", language: "en", status: "required-not-approved" },
        { kind: "term", text: "afternoon", language: "en", status: "required-not-approved" },
        { kind: "term", text: "please", language: "en", status: "required-not-approved" },
        { kind: "term", text: "thank you", language: "en", status: "required-not-approved" },
        { kind: "sentence", text: "Hello, teacher.", language: "en", status: "required-not-approved" },
        { kind: "sentence", text: "Thank you, friend.", language: "en", status: "required-not-approved" },
        { kind: "instruction", text: "Tap each card. Listen and repeat.", language: "en", status: "required-not-approved" },
        { kind: "support", text: "ことばをおして、きいて、まねしましょう。", language: "ja-hiragana", status: "support-only" },
      ],
      progress_policy: {
        target_language_progress_trigger: "target-language-only",
        progress_unlock_allowed: true,
        support_language_progress_allowed: false,
        media_only_progress_allowed: false,
      },
      verifier_submission: {
        teacher_draft_verifier_submission: "required",
        submitted_to_verifier: false,
        approved_for_students: false,
      },
    },
    preflight: [
      {
        checkId: "ministar-draft-json-shape",
        label: "MiniStar draft JSON shape",
        status: "draft-only",
        result: "Schema preview is present for review only.",
        blocksStudentUse: true,
      },
      {
        checkId: "ministar-target-language-audio",
        label: "MiniStar target-language audio coverage",
        status: "blocked",
        result: "audio_coverage_status: required-not-approved",
        blocksStudentUse: true,
      },
      {
        checkId: "ministar-japanese-support-boundary",
        label: "MiniStar Japanese support boundary",
        status: "draft-only",
        result: "ja-hiragana support is support-only and cannot unlock progress.",
        blocksStudentUse: true,
      },
      {
        checkId: "ministar-teacher-approval",
        label: "MiniStar teacher approval",
        status: "blocked",
        result: "Teacher approval missing",
        blocksStudentUse: true,
      },
      {
        checkId: "ministar-media-rights",
        label: "MiniStar media rights",
        status: "blocked",
        result: "Media rights missing",
        blocksStudentUse: true,
      },
    ],
    blockedActions: [
      "Copy JSON blocked",
      "Submit to verifier blocked",
      "Publish generated package blocked",
      "Create student assignment blocked",
      "Create playlist from draft blocked",
      "Use target audio before approval blocked",
      "Use Japanese support to unlock progress blocked",
    ],
    nextRecords: [
      "teacher_draft_package",
      "teacher_draft_verifier_submission",
      "package_game_audio_coverage",
      "activity_compatibility_snapshot",
      "media_rights_manifest",
    ],
  },
];

export function filterAiGeneratedDraftPayloadPreviewsByTenant(
  previews: AiGeneratedDraftPayloadPreview[],
  tenantId: string,
): AiGeneratedDraftPayloadPreview[] {
  return previews.filter((preview) => preview.tenantId === tenantId);
}

export const sampleAiGeneratedDraftPayloadPreviewErrors = sampleAiGeneratedDraftPayloadPreviews.flatMap(
  validateAiGeneratedDraftPayloadPreview,
);

export const sampleAiGeneratedDraftPayloadPreviewWarnings = sampleAiGeneratedDraftPayloadPreviews.flatMap(
  getAiGeneratedDraftPayloadPreviewWarnings,
);
