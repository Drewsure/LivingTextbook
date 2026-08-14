export type AiTargetLanguageAudioApprovalPacketStatus =
  | "blocked"
  | "review-only"
  | "ready-for-audio-review";

export type AiTargetLanguageAudioApprovalCueStatus =
  | "missing-audio"
  | "needs-review"
  | "approved-preview"
  | "support-only"
  | "blocked";

export type AiTargetLanguageAudioApprovalCueKind =
  | "term"
  | "sentence"
  | "instruction"
  | "feedback"
  | "control"
  | "support-language"
  | "background-media";

export interface AiTargetLanguageAudioApprovalCue {
  cueId: string;
  kind: AiTargetLanguageAudioApprovalCueKind;
  text: string;
  language: string;
  gameModes: string[];
  status: AiTargetLanguageAudioApprovalCueStatus;
  sourceRecord: string;
  approvalQuestion: string;
  progressBoundary: string;
}

export interface AiTargetLanguageAudioApprovalPacket {
  packetId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: AiTargetLanguageAudioApprovalPacketStatus;
  summary: string;
  targetLanguage: string;
  assistLanguageBoundary: string;
  approvalOwner: string;
  cueManifestRecord: string;
  targetLanguageApprovalRecord: string;
  requiredCoverage: string[];
  approvalChecks: string[];
  cues: AiTargetLanguageAudioApprovalCue[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const AI_TARGET_LANGUAGE_AUDIO_REQUIRED_COVERAGE = [
  "vocabulary term cues",
  "target sentence cues",
  "instruction cues",
  "feedback cues",
  "control cues",
] as const;

export const AI_TARGET_LANGUAGE_AUDIO_APPROVAL_CHECKS = [
  "target-language audio text matches the reviewed payload exactly",
  "Every student-facing English text item has tap-to-speak coverage",
  "Background music and video sound never count as learning audio",
  "support-language",
  "Voice or speech API cost remains blocked",
] as const;

export const AI_TARGET_LANGUAGE_AUDIO_REQUIRED_CUE_KINDS = [
  "term",
  "sentence",
  "instruction",
  "control",
  "background-media",
] as const;

export const AI_TARGET_LANGUAGE_AUDIO_BLOCKED_ACTIONS = [
  "No audio approval capture",
  "No voice generation",
  "No speech API billing",
  "No package audio-complete marker",
  "No route creation from audio packet",
  "No playlist creation from audio packet",
  "No student assignment from audio packet",
] as const;

export const AI_TARGET_LANGUAGE_AUDIO_NEXT_RECORDS = [
  "audio_cue_manifest",
  "package_game_audio_coverage",
  "target_language_audio_approval",
  "media_rights_evidence_attachment",
  "teacher_approval_ledger",
] as const;

export function validateAiTargetLanguageAudioApprovalPacket(packet: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(packet)) {
    return ["Target-language audio approval packet must be a JSON object."];
  }

  const packetId = readString(packet, "packetId");
  const tenantId = readString(packet, "tenantId");
  const requestId = readString(packet, "requestId");
  const label = readString(packet, "label");
  const status = readString(packet, "status");
  const targetLanguage = readString(packet, "targetLanguage");
  const assistLanguageBoundary = readString(packet, "assistLanguageBoundary");
  const approvalOwner = readString(packet, "approvalOwner");
  const cueManifestRecord = readString(packet, "cueManifestRecord");
  const targetLanguageApprovalRecord = readString(packet, "targetLanguageApprovalRecord");
  const requiredCoverage = readStringArray(packet, "requiredCoverage");
  const approvalChecks = readStringArray(packet, "approvalChecks");
  const cues = readCues(packet, "cues");
  const blockedActions = readStringArray(packet, "blockedActions");
  const nextRequiredRecords = readStringArray(packet, "nextRequiredRecords");

  if (!packetId || !tenantId || !requestId || !label) {
    errors.push("Target-language audio approval packet must include packetId, tenantId, requestId, and label.");
  }

  if (!label.toLowerCase().includes("target-language audio approval packet")) {
    errors.push("Target-language audio approval packet label must name the audio approval packet.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-audio-review") {
    errors.push("Target-language audio approval packet must use a supported review-only status.");
  }

  if (targetLanguage !== "English") {
    errors.push("Current foundation target-language audio approval packets must name English as the target language.");
  }

  if (!approvalOwner) {
    errors.push("Target-language audio approval packet must name an approval owner.");
  }

  if (cueManifestRecord !== "audio_cue_manifest") {
    errors.push("Target-language audio approval packet must link to audio_cue_manifest.");
  }

  if (targetLanguageApprovalRecord !== "target_language_audio_approval") {
    errors.push("Target-language audio approval packet must link to target_language_audio_approval.");
  }

  for (const coverage of AI_TARGET_LANGUAGE_AUDIO_REQUIRED_COVERAGE) {
    if (!textListIncludes(requiredCoverage, coverage)) {
      errors.push(`Target-language audio approval packet must include coverage: ${coverage}.`);
    }
  }

  for (const check of AI_TARGET_LANGUAGE_AUDIO_APPROVAL_CHECKS) {
    if (!textListIncludes(approvalChecks, check)) {
      errors.push(`Target-language audio approval packet must include approval check: ${check}.`);
    }
  }

  for (const cueKind of AI_TARGET_LANGUAGE_AUDIO_REQUIRED_CUE_KINDS) {
    if (!cues.some((cue) => cue.kind === cueKind)) {
      errors.push(`Target-language audio approval packet must include cue kind: ${cueKind}.`);
    }
  }

  for (const cue of cues) {
    if (!cue.cueId || !cue.text || cue.gameModes.length === 0 || !cue.sourceRecord || !cue.approvalQuestion) {
      errors.push(`Target-language audio approval cue must include full review evidence: ${cue.cueId || cue.kind}.`);
    }

    if (!cue.progressBoundary.toLowerCase().includes("progress")) {
      errors.push(`Target-language audio approval cue must name its progress boundary: ${cue.cueId}.`);
    }

    if (cue.kind === "support-language" && cue.status !== "support-only") {
      errors.push(`Support-language audio cue must remain support-only: ${cue.cueId}.`);
    }

    if (cue.kind === "background-media" && !cue.progressBoundary.toLowerCase().includes("media-only")) {
      errors.push(`Background media cue must block media-only progress: ${cue.cueId}.`);
    }
  }

  for (const blockedAction of AI_TARGET_LANGUAGE_AUDIO_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`Target-language audio approval packet must block action: ${blockedAction}.`);
    }
  }

  for (const nextRecord of AI_TARGET_LANGUAGE_AUDIO_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(nextRecord)) {
      errors.push(`Target-language audio approval packet must include next required record: ${nextRecord}.`);
    }
  }

  if (tenantId === "sample-publisher" && !textListIncludes(blockedActions, "No media-only progress")) {
    errors.push("Sample publisher target-language audio approval packet must block media-only progress.");
  }

  if (tenantId === "ministar") {
    if (
      !assistLanguageBoundary.includes("hiragana-only") ||
      !assistLanguageBoundary.includes("cannot unlock progress") ||
      !textListIncludes(requiredCoverage, "hiragana-only Japanese support cue") ||
      !textListIncludes(approvalChecks, "Japanese support text is hiragana-only") ||
      !textListIncludes(blockedActions, "No Japanese support-language progress trigger")
    ) {
      errors.push("MiniStar target-language audio approval packet must preserve hiragana support-only boundaries.");
    }
  }

  return errors;
}

export function getAiTargetLanguageAudioApprovalPacketWarnings(packet: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(packet)) {
    return warnings;
  }

  const cues = readCues(packet, "cues");
  const blockedActions = readStringArray(packet, "blockedActions");

  if (!cues.some((cue) => cue.kind === "feedback")) {
    warnings.push("Target-language audio approval packets should add explicit feedback cue examples before production.");
  }

  if (cues.some((cue) => cue.kind !== "support-language" && cue.status === "approved-preview")) {
    warnings.push("Approved-preview audio cues still need future signed approval capture before package promotion.");
  }

  if (
    !textListIncludes(blockedActions, "No media-only progress") &&
    !textListIncludes(blockedActions, "No Japanese support-language progress trigger")
  ) {
    warnings.push("Audio approval packets should block media-only or support-language-only progress explicitly.");
  }

  return warnings;
}

export function validateAiTargetLanguageAudioApprovalPackets(packets: unknown[]): string[] {
  return packets.flatMap((packet) => validateAiTargetLanguageAudioApprovalPacket(packet));
}

export function getAiTargetLanguageAudioApprovalPacketCollectionWarnings(packets: unknown[]): string[] {
  return packets.flatMap((packet) => getAiTargetLanguageAudioApprovalPacketWarnings(packet));
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function readCues(source: Record<string, unknown>, key: string): AiTargetLanguageAudioApprovalCue[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    cueId: readString(item, "cueId"),
    kind: readString(item, "kind") as AiTargetLanguageAudioApprovalCueKind,
    text: readString(item, "text"),
    language: readString(item, "language"),
    gameModes: readStringArray(item, "gameModes"),
    status: readString(item, "status") as AiTargetLanguageAudioApprovalCueStatus,
    sourceRecord: readString(item, "sourceRecord"),
    approvalQuestion: readString(item, "approvalQuestion"),
    progressBoundary: readString(item, "progressBoundary"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
