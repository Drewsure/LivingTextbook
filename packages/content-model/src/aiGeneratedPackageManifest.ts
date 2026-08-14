export type AiGeneratedPackageManifestStatus = "manifest-preview" | "blocked";
export type AiGeneratedPackageManifestRecordStatus = "ready-preview" | "blocked-preview" | "missing";

export interface AiGeneratedPackageManifestRecord {
  recordType: string;
  label: string;
  status: AiGeneratedPackageManifestRecordStatus;
  source: string;
  blocker: string;
}

export interface AiGeneratedPackageManifestLink {
  label: string;
  recordId: string;
  purpose: string;
}

export interface AiGeneratedPackageManifest {
  manifestId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageManifestStatus;
  assemblyState: string;
  links: AiGeneratedPackageManifestLink[];
  records: AiGeneratedPackageManifestRecord[];
  assemblySteps: string[];
  releaseLocks: string[];
  blockedActions: string[];
  nextRequirements: string[];
}

export const AI_GENERATED_PACKAGE_MANIFEST_REQUIRED_LINK_LABELS = [
  "Prompt package",
  "Draft JSON preview",
  "Audio coverage plan",
  "Engine binding plan",
  "Gamification mapping plan",
  "Verifier submission packet",
  "Review queue item",
] as const;

export const AI_GENERATED_PACKAGE_MANIFEST_REQUIRED_RECORD_TYPES = [
  "ai_generated_package_manifest",
  "teacher_draft_package",
  "teacher_draft_verifier_submission",
  "package_game_audio_coverage",
  "engine_mode_config_binding",
  "collection_unlock_binding",
  "activity_compatibility_snapshot",
  "media_rights_manifest",
  "teacher_approval_packet",
] as const;

export const AI_GENERATED_PACKAGE_MANIFEST_REQUIRED_RELEASE_LOCKS = [
  "No package assembly write",
  "No route registry write",
  "No media playlist write",
  "No assignment write",
  "No local bundle write",
  "No student-ready marker",
  "No support-language-only package assembly",
] as const;

export const AI_GENERATED_PACKAGE_MANIFEST_REQUIRED_BLOCKED_ACTIONS = [
  "Assemble generated package blocked",
  "Submit package manifest to verifier blocked",
  "Create launch route from manifest blocked",
  "Create media playlist from manifest blocked",
  "Create local package bundle from manifest blocked",
  "Assign generated package from manifest blocked",
  "support-language-only package",
] as const;

export const AI_GENERATED_PACKAGE_MANIFEST_NEXT_REQUIREMENT_TOPICS = [
  "Durable generated package manifest storage",
  "queue adapter",
  "Verifier submission workflow",
  "approval workflow",
  "Media rights evidence attachment storage",
  "Release-control and approval ledger binding",
] as const;

export function validateAiGeneratedPackageManifest(manifest: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(manifest)) {
    return ["AI generated package manifest must be a JSON object."];
  }

  const manifestId = readString(manifest, "manifestId");
  const tenantId = readString(manifest, "tenantId");
  const requestId = readString(manifest, "requestId");
  const label = readString(manifest, "label");
  const summary = readString(manifest, "summary");
  const status = readString(manifest, "status");
  const assemblyState = readString(manifest, "assemblyState");
  const links = readLinks(manifest, "links");
  const records = readRecords(manifest, "records");
  const assemblySteps = readStringArray(manifest, "assemblySteps");
  const releaseLocks = readStringArray(manifest, "releaseLocks");
  const blockedActions = readStringArray(manifest, "blockedActions");
  const nextRequirements = readStringArray(manifest, "nextRequirements");

  if (!manifestId || !tenantId || !requestId || !label) {
    errors.push("AI generated package manifest must include manifestId, tenantId, requestId, and label.");
  }

  if (!label.toLowerCase().includes("generated package manifest")) {
    errors.push("AI generated package manifest label must name the manifest.");
  }

  if (status !== "manifest-preview" && status !== "blocked") {
    errors.push("AI generated package manifest must use a supported review-only status.");
  }

  if (!summary.toLowerCase().includes("review-only")) {
    errors.push("AI generated package manifest summary must describe the review-only package boundary.");
  }

  if (!assemblyState.toLowerCase().includes("package assembly blocked")) {
    errors.push("AI generated package manifest must keep package assembly blocked.");
  }

  for (const linkLabel of AI_GENERATED_PACKAGE_MANIFEST_REQUIRED_LINK_LABELS) {
    if (!links.some((link) => link.label.toLowerCase().includes(linkLabel.toLowerCase()))) {
      errors.push(`AI generated package manifest must include link: ${linkLabel}.`);
    }
  }

  for (const link of links) {
    if (!link.recordId || !link.purpose) {
      errors.push(`AI generated package manifest link must include recordId and purpose: ${link.label}.`);
    }
  }

  for (const recordType of AI_GENERATED_PACKAGE_MANIFEST_REQUIRED_RECORD_TYPES) {
    if (!records.some((record) => record.recordType === recordType)) {
      errors.push(`AI generated package manifest must include record type: ${recordType}.`);
    }
  }

  for (const record of records) {
    if (!record.label || !record.source || !record.blocker) {
      errors.push(`AI generated package manifest record must include label, source, and blocker: ${record.recordType}.`);
    }

    if (record.status !== "ready-preview" && record.status !== "blocked-preview" && record.status !== "missing") {
      errors.push(`AI generated package manifest record must use a supported preview status: ${record.recordType}.`);
    }
  }

  for (const releaseLock of AI_GENERATED_PACKAGE_MANIFEST_REQUIRED_RELEASE_LOCKS) {
    if (!textListIncludes(releaseLocks, releaseLock)) {
      errors.push(`AI generated package manifest must include release lock: ${releaseLock}.`);
    }
  }

  for (const blockedAction of AI_GENERATED_PACKAGE_MANIFEST_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI generated package manifest must block action: ${blockedAction}.`);
    }
  }

  for (const topic of AI_GENERATED_PACKAGE_MANIFEST_NEXT_REQUIREMENT_TOPICS) {
    if (!textListIncludes(nextRequirements, topic)) {
      errors.push(`AI generated package manifest must include next requirement topic: ${topic}.`);
    }
  }

  if (tenantId === "ministar") {
    const combinedText = [...links.map((link) => link.purpose), ...assemblySteps, ...releaseLocks, ...blockedActions];

    if (
      !textListIncludes(combinedText, "English target-language") ||
      !textListIncludes(combinedText, "hiragana") ||
      !textListIncludes(combinedText, "support-only") ||
      !textListIncludes([...releaseLocks, ...blockedActions], "support-language-only")
    ) {
      errors.push("MiniStar generated package manifest must preserve English and hiragana support-only package boundaries.");
    }
  }

  return errors;
}

export function getAiGeneratedPackageManifestWarnings(manifest: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(manifest)) {
    return warnings;
  }

  const records = readRecords(manifest, "records");
  const releaseLocks = readStringArray(manifest, "releaseLocks");
  const blockedActions = readStringArray(manifest, "blockedActions");

  if (!records.some((record) => record.status === "missing")) {
    warnings.push("Generated package manifests should keep missing media-rights or teacher-approval records visible until production gates exist.");
  }

  if (!textListIncludes([...releaseLocks, ...blockedActions], "support-language-only")) {
    warnings.push("Generated package manifests should block support-language-only package assembly explicitly.");
  }

  return warnings;
}

export function validateAiGeneratedPackageManifests(manifests: unknown[]): string[] {
  return manifests.flatMap((manifest) => validateAiGeneratedPackageManifest(manifest));
}

export function getAiGeneratedPackageManifestCollectionWarnings(manifests: unknown[]): string[] {
  return manifests.flatMap((manifest) => getAiGeneratedPackageManifestWarnings(manifest));
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

function readLinks(source: Record<string, unknown>, key: string): AiGeneratedPackageManifestLink[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    label: readString(item, "label"),
    recordId: readString(item, "recordId"),
    purpose: readString(item, "purpose"),
  }));
}

function readRecords(source: Record<string, unknown>, key: string): AiGeneratedPackageManifestRecord[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    recordType: readString(item, "recordType"),
    label: readString(item, "label"),
    status: readString(item, "status") as AiGeneratedPackageManifestRecordStatus,
    source: readString(item, "source"),
    blocker: readString(item, "blocker"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  const normalizedExpected = expected.toLowerCase();
  return items.some((item) => item.toLowerCase().includes(normalizedExpected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
