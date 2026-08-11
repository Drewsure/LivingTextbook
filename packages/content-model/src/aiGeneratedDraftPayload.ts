export type AiGeneratedDraftPayloadStatus = "draft-only" | "blocked";

export interface AiGeneratedDraftPreflightItem {
  checkId: string;
  label: string;
  status: AiGeneratedDraftPayloadStatus;
  result: string;
  blocksStudentUse: boolean;
}

export interface AiGeneratedDraftPayloadPreview {
  previewId: string;
  requestId: string;
  tenantId: string;
  label: string;
  summary: string;
  status: AiGeneratedDraftPayloadStatus;
  draftJson: Record<string, unknown>;
  preflight: AiGeneratedDraftPreflightItem[];
  blockedActions: string[];
  nextRecords: string[];
}

export const AI_GENERATED_DRAFT_REQUIRED_BLOCKED_ACTIONS = [
  "Copy JSON blocked",
  "Submit to verifier blocked",
  "Publish generated package blocked",
  "Create student assignment blocked",
  "Create playlist from draft blocked",
] as const;

export const AI_GENERATED_DRAFT_REQUIRED_NEXT_RECORDS = [
  "teacher_draft_package",
  "teacher_draft_verifier_submission",
  "package_game_audio_coverage",
  "activity_compatibility_snapshot",
  "media_rights_manifest",
] as const;

export function validateAiGeneratedDraftPayload(draftJson: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(draftJson)) {
    return ["AI generated draft payload must be a JSON object."];
  }

  const unitMeta = readRecord(draftJson, "unit_meta", errors);
  const pedagogicalPayload = readRecord(draftJson, "pedagogical_payload", errors);
  const progressPolicy = readRecord(draftJson, "progress_policy", errors);
  const verifierSubmission = readRecord(draftJson, "verifier_submission", errors);

  const targetLanguage = readString(unitMeta, "target_language") ?? "en";
  const supportLanguage = readString(unitMeta, "support_language");
  const level = readNumber(unitMeta, "level");
  const theme = readString(unitMeta, "theme");
  const gameMode = readString(unitMeta, "game_mode");
  const engineId = readString(unitMeta, "engine_id");

  if (level === undefined || !Number.isInteger(level) || level < 1 || level > 8) {
    errors.push("AI generated draft payload must include unit_meta.level as an integer from 1 to 8.");
  }

  if (!theme) {
    errors.push("AI generated draft payload must include a non-empty unit_meta.theme.");
  }

  if (!gameMode) {
    errors.push("AI generated draft payload must include a non-empty unit_meta.game_mode.");
  }

  if (!engineId) {
    errors.push("AI generated draft payload must include a non-empty unit_meta.engine_id.");
  }

  const vocabularyTerms = readStringArray(pedagogicalPayload, "vocabulary_terms");
  const targetSentences = readStringArray(pedagogicalPayload, "target_sentences");

  if (vocabularyTerms.length < 8 || vocabularyTerms.length > 12) {
    errors.push("AI generated draft payload vocabulary_terms count must be between 8 and 12.");
  }

  if (targetSentences.length !== 2) {
    errors.push("AI generated draft payload must include exactly 2 target_sentences.");
  }

  const duplicateTerms = findDuplicateNormalizedValues(vocabularyTerms);

  if (duplicateTerms.length > 0) {
    errors.push(`AI generated draft payload vocabulary_terms must be unique. Duplicates: ${duplicateTerms.join(", ")}.`);
  }

  if (vocabularyTerms.some((term) => term.trim().length === 0)) {
    errors.push("AI generated draft payload vocabulary_terms must not contain blank terms.");
  }

  if (targetSentences.some((sentence) => sentence.trim().length === 0)) {
    errors.push("AI generated draft payload target_sentences must not contain blank sentences.");
  }

  if (readString(progressPolicy, "target_language_progress_trigger") !== "target-language-only") {
    errors.push("AI generated draft payload must keep target_language_progress_trigger as target-language-only.");
  }

  if (readBoolean(progressPolicy, "support_language_progress_allowed") !== false) {
    errors.push("AI generated draft payload must keep support_language_progress_allowed: false.");
  }

  if (readBoolean(progressPolicy, "media_only_progress_allowed") !== false) {
    errors.push("AI generated draft payload must keep media_only_progress_allowed: false.");
  }

  if (level !== undefined && level <= 3 && supportLanguage?.startsWith("ja") && supportLanguage !== "ja-hiragana") {
    errors.push("MiniStar Foundation/Bronze/Plus Japanese support must use support_language: ja-hiragana.");
  }

  if (supportLanguage === "ja-hiragana") {
    errors.push(...validateJaHiraganaSupportCues(draftJson));
  }

  if (readString(verifierSubmission, "teacher_draft_verifier_submission") !== "required") {
    errors.push("AI generated draft payload must require teacher_draft_verifier_submission before review.");
  }

  if (readBoolean(verifierSubmission, "submitted_to_verifier") !== false) {
    errors.push("AI generated draft payload must keep submitted_to_verifier: false until durable verifier storage exists.");
  }

  if (readBoolean(verifierSubmission, "approved_for_students") !== false) {
    errors.push("AI generated draft payload must keep approved_for_students: false until review gates pass.");
  }

  errors.push(...validateTargetLanguageAudioCues(draftJson, targetLanguage, vocabularyTerms, targetSentences));

  return errors;
}

export function getAiGeneratedDraftPayloadWarnings(draftJson: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(draftJson)) {
    return warnings;
  }

  const pedagogicalPayload = readOptionalRecord(draftJson, "pedagogical_payload");
  const vocabularyTerms = readStringArray(pedagogicalPayload, "vocabulary_terms");
  const targetSentences = readStringArray(pedagogicalPayload, "target_sentences");

  if (vocabularyTerms.length > 0 && vocabularyTerms.length !== 8) {
    warnings.push("Canonical unit generation defaults to 8 vocabulary terms; 9-12 terms require review as extension content.");
  }

  for (const sentence of targetSentences) {
    if (!targetSentencesUseVocabulary(sentence, vocabularyTerms)) {
      warnings.push(`Target sentence may not reuse the approved vocabulary list: ${sentence}`);
    }
  }

  if (!Array.isArray(draftJson.audio_cues) || draftJson.audio_cues.length === 0) {
    warnings.push("Draft payload has no audio_cues array; every learner-facing target-language text needs reviewed audio.");
  }

  return warnings;
}

export function validateAiGeneratedDraftPayloadPreview(preview: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(preview)) {
    return ["AI generated draft payload preview must be a JSON object."];
  }

  const previewId = readString(preview, "previewId");
  const requestId = readString(preview, "requestId");
  const tenantId = readString(preview, "tenantId");
  const status = readString(preview, "status");
  const blockedActions = readStringArray(preview, "blockedActions");
  const nextRecords = readStringArray(preview, "nextRecords");
  const preflight = readArray(preview, "preflight");

  if (!previewId || !requestId || !tenantId) {
    errors.push("AI generated draft payload preview must include previewId, requestId, and tenantId.");
  }

  if (status !== "draft-only" && status !== "blocked") {
    errors.push("AI generated draft payload preview must remain draft-only or blocked.");
  }

  errors.push(...validateAiGeneratedDraftPayload(preview.draftJson));

  for (const action of AI_GENERATED_DRAFT_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(action)) {
      errors.push(`AI generated draft payload preview must include blocked action: ${action}.`);
    }
  }

  for (const record of AI_GENERATED_DRAFT_REQUIRED_NEXT_RECORDS) {
    if (!nextRecords.includes(record)) {
      errors.push(`AI generated draft payload preview must include next required record: ${record}.`);
    }
  }

  if (!preflight.some((item) => isRecord(item) && item.blocksStudentUse === true)) {
    errors.push("AI generated draft payload preview must include at least one student-use blocking preflight item.");
  }

  return errors;
}

export function getAiGeneratedDraftPayloadPreviewWarnings(preview: unknown): string[] {
  if (!isRecord(preview)) {
    return [];
  }

  return getAiGeneratedDraftPayloadWarnings(preview.draftJson);
}

export function isAiGeneratedDraftPayloadPreviewStudentUseBlocked(preview: unknown): boolean {
  if (!isRecord(preview)) {
    return true;
  }

  const blockedActions = readStringArray(preview, "blockedActions");
  const preflight = readArray(preview, "preflight");

  return (
    preview.status !== "draft-only" ||
    blockedActions.length > 0 ||
    preflight.some((item) => isRecord(item) && item.blocksStudentUse === true) ||
    validateAiGeneratedDraftPayload(preview.draftJson).length > 0
  );
}

function validateTargetLanguageAudioCues(
  draftJson: Record<string, unknown>,
  targetLanguage: string,
  vocabularyTerms: string[],
  targetSentences: string[],
): string[] {
  const errors: string[] = [];
  const audioCues = readArray(draftJson, "audio_cues");

  if (audioCues.length === 0) {
    errors.push("AI generated draft payload must include target-language audio_cues before student assignment.");
    return errors;
  }

  const termCueTexts = new Set<string>();
  const sentenceCueTexts = new Set<string>();
  let unapprovedTargetCueCount = 0;

  for (const cue of audioCues) {
    if (!isRecord(cue)) {
      errors.push("AI generated draft payload audio_cues must contain cue objects.");
      continue;
    }

    const cueLanguage = readString(cue, "language");
    const cueKind = readString(cue, "kind");
    const cueText = readString(cue, "text");
    const cueStatus = readString(cue, "status");

    if (cueLanguage !== targetLanguage || !cueText) {
      continue;
    }

    if (cueKind === "term") {
      termCueTexts.add(normalizeText(cueText));
    }

    if (cueKind === "sentence") {
      sentenceCueTexts.add(normalizeText(cueText));
    }

    if (cueStatus !== "approved") {
      unapprovedTargetCueCount += 1;
    }
  }

  const missingTermCues = vocabularyTerms.filter((term) => !termCueTexts.has(normalizeText(term)));
  const missingSentenceCues = targetSentences.filter((sentence) => !sentenceCueTexts.has(normalizeText(sentence)));

  if (missingTermCues.length > 0) {
    errors.push(`AI generated draft payload is missing target-language term audio cues for: ${missingTermCues.join(", ")}.`);
  }

  if (missingSentenceCues.length > 0) {
    errors.push(
      `AI generated draft payload is missing target-language sentence audio cues for: ${missingSentenceCues.join(" | ")}.`,
    );
  }

  if (unapprovedTargetCueCount > 0) {
    errors.push("AI generated draft payload target-language audio cues must be approved before student assignment.");
  }

  return errors;
}

function validateJaHiraganaSupportCues(draftJson: Record<string, unknown>): string[] {
  const errors: string[] = [];
  const audioCues = readArray(draftJson, "audio_cues");

  for (const cue of audioCues) {
    if (!isRecord(cue) || readString(cue, "language") !== "ja-hiragana") {
      continue;
    }

    const cueKind = readString(cue, "kind");
    const cueText = readString(cue, "text");
    const cueStatus = readString(cue, "status");

    if (cueKind !== "support") {
      errors.push("AI generated draft payload ja-hiragana cues must use kind: support.");
    }

    if (cueStatus !== "support-only") {
      errors.push("AI generated draft payload ja-hiragana support cues must be marked support-only.");
    }

    if (!cueText) {
      errors.push("AI generated draft payload ja-hiragana support cues must include reviewed support text.");
      continue;
    }

    if (!isHiraganaOnlySupportText(cueText)) {
      errors.push(`AI generated draft payload ja-hiragana support text must be hiragana-only: ${cueText}`);
    }
  }

  return errors;
}

function readRecord(source: Record<string, unknown>, key: string, errors: string[]): Record<string, unknown> {
  const value = source[key];

  if (!isRecord(value)) {
    errors.push(`AI generated draft payload must include ${key} as an object.`);
    return {};
  }

  return value;
}

function readOptionalRecord(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key];
  return isRecord(value) ? value : {};
}

function readArray(source: Record<string, unknown>, key: string): unknown[] {
  const value = source[key];
  return Array.isArray(value) ? value : [];
}

function readString(source: Record<string, unknown>, key: string): string | undefined {
  const value = source[key];
  return typeof value === "string" ? value.trim() : undefined;
}

function readNumber(source: Record<string, unknown>, key: string): number | undefined {
  const value = source[key];
  return typeof value === "number" ? value : undefined;
}

function readBoolean(source: Record<string, unknown>, key: string): boolean | undefined {
  const value = source[key];
  return typeof value === "boolean" ? value : undefined;
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function findDuplicateNormalizedValues(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    const normalized = normalizeText(value);

    if (seen.has(normalized)) {
      duplicates.add(value.trim());
    }

    seen.add(normalized);
  }

  return Array.from(duplicates);
}

function targetSentencesUseVocabulary(sentence: string, vocabularyTerms: string[]): boolean {
  const normalizedSentence = normalizeText(sentence);
  return vocabularyTerms.some((term) => normalizedSentence.includes(normalizeText(term)));
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isHiraganaOnlySupportText(value: string): boolean {
  return /^[\u3040-\u309F\s。、！？!?・（）()「」『』［］\[\]：:；;，,．.]+$/u.test(value.trim());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
