export type AiGeneratedPackageReleaseCandidateStatus = "blocked" | "ready-for-review";
export type AiGeneratedPackageReleaseCandidateSignalStatus = "ready-preview" | "blocked" | "missing";

export interface AiGeneratedPackageReleaseCandidateSignal {
  signalId: string;
  label: string;
  status: AiGeneratedPackageReleaseCandidateSignalStatus;
  sourceRecord: string;
  evidence: string;
  releaseEffect: string;
}

export interface AiGeneratedPackageReleaseCandidate {
  candidateId: string;
  tenantId: string;
  requestId: string;
  manifestId: string;
  promotionChecklistId: string;
  publishReadinessGateId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageReleaseCandidateStatus;
  candidateState: string;
  packageTarget: string;
  privateLibraryTarget: string;
  routePreview: string;
  signals: AiGeneratedPackageReleaseCandidateSignal[];
  candidateRecords: string[];
  allowedNow: string[];
  blockedActions: string[];
  nextRecords: string[];
}

export const AI_GENERATED_PACKAGE_RELEASE_CANDIDATE_REQUIRED_SIGNAL_IDS = [
  "manifest-captured",
  "promotion-checklist-reviewed",
  "publish-readiness-attached",
  "private-library-target-reserved",
  "release-candidate-write-reserved",
  "student-facing-release-blocked",
] as const;

export const AI_GENERATED_PACKAGE_RELEASE_CANDIDATE_REQUIRED_RECORDS = [
  "ai_generated_package_manifest",
  "ai_generated_package_promotion_checklist",
  "ai_generated_publish_readiness_gate",
  "package_release_candidate",
  "tenant_library_item",
  "package_publish_gate",
  "package_approval_ledger",
  "teacher_assignment_rollout_gate",
] as const;

export const AI_GENERATED_PACKAGE_RELEASE_CANDIDATE_BLOCKED_ACTIONS = [
  "No generated package library publish",
  "No release candidate write",
  "No tenant library item write",
  "No student-facing release",
  "No generated assignment from release candidate",
  "No generated local bundle release",
  "No support-language-only release",
] as const;

export function validateAiGeneratedPackageReleaseCandidate(candidate: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(candidate)) {
    return ["AI generated package release candidate must be a JSON object."];
  }

  const candidateId = readString(candidate, "candidateId");
  const tenantId = readString(candidate, "tenantId");
  const requestId = readString(candidate, "requestId");
  const manifestId = readString(candidate, "manifestId");
  const promotionChecklistId = readString(candidate, "promotionChecklistId");
  const publishReadinessGateId = readString(candidate, "publishReadinessGateId");
  const label = readString(candidate, "label");
  const summary = readString(candidate, "summary");
  const status = readString(candidate, "status");
  const candidateState = readString(candidate, "candidateState");
  const packageTarget = readString(candidate, "packageTarget");
  const privateLibraryTarget = readString(candidate, "privateLibraryTarget");
  const routePreview = readString(candidate, "routePreview");
  const signals = readSignals(candidate, "signals");
  const candidateRecords = readStringArray(candidate, "candidateRecords");
  const allowedNow = readStringArray(candidate, "allowedNow");
  const blockedActions = readStringArray(candidate, "blockedActions");
  const nextRecords = readStringArray(candidate, "nextRecords");

  if (!candidateId || !tenantId || !requestId || !manifestId || !promotionChecklistId || !publishReadinessGateId) {
    errors.push("AI generated package release candidate must include candidate, tenant, request, manifest, promotion, and publish readiness ids.");
  }

  if (!label.toLowerCase().includes("generated package release candidate")) {
    errors.push("AI generated package release candidate label must name the release candidate.");
  }

  if (!summary.toLowerCase().includes("review-only")) {
    errors.push("AI generated package release candidate summary must describe the review-only handoff.");
  }

  if (status !== "blocked" && status !== "ready-for-review") {
    errors.push("AI generated package release candidate must use a supported review-only status.");
  }

  if (!candidateState.toLowerCase().includes("private tenant library handoff blocked")) {
    errors.push("AI generated package release candidate must keep private tenant library handoff blocked.");
  }

  if (!packageTarget || !privateLibraryTarget.toLowerCase().includes("blocked") || !routePreview.toLowerCase().includes("blocked")) {
    errors.push("AI generated package release candidate must keep package, private library, and route targets review-only.");
  }

  for (const signalId of AI_GENERATED_PACKAGE_RELEASE_CANDIDATE_REQUIRED_SIGNAL_IDS) {
    if (!signals.some((signal) => signal.signalId === signalId)) {
      errors.push(`AI generated package release candidate must include signal: ${signalId}.`);
    }
  }

  for (const signal of signals) {
    if (!signal.label || !signal.sourceRecord || !signal.evidence || !signal.releaseEffect) {
      errors.push(`AI generated package release candidate signal must include full evidence: ${signal.signalId}.`);
    }

    if (signal.status !== "ready-preview" && signal.status !== "blocked" && signal.status !== "missing") {
      errors.push(`AI generated package release candidate signal must use a supported preview status: ${signal.signalId}.`);
    }
  }

  for (const record of AI_GENERATED_PACKAGE_RELEASE_CANDIDATE_REQUIRED_RECORDS) {
    if (!candidateRecords.includes(record)) {
      errors.push(`AI generated package release candidate must include candidate record: ${record}.`);
    }
  }

  if (!textListIncludes(allowedNow, "Review generated release candidate evidence")) {
    errors.push("AI generated package release candidate must allow review work only.");
  }

  for (const blockedAction of AI_GENERATED_PACKAGE_RELEASE_CANDIDATE_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI generated package release candidate must block action: ${blockedAction}.`);
    }
  }

  for (const record of ["tenant_library_item", "package_release_candidate", "package_publish_gate", "package_approval_ledger"]) {
    if (!nextRecords.includes(record)) {
      errors.push(`AI generated package release candidate must include next record: ${record}.`);
    }
  }

  if (tenantId === "ministar") {
    const combinedText = [...signals.map((signal) => `${signal.label} ${signal.evidence} ${signal.releaseEffect}`), summary, ...blockedActions];

    if (
      !textListIncludes(combinedText, "English remains the target-language trigger") ||
      !textListIncludes(combinedText, "hiragana") ||
      !textListIncludes(combinedText, "support-only") ||
      !textListIncludes(blockedActions, "No Japanese support-language release")
    ) {
      errors.push("MiniStar generated package release candidate must preserve English and hiragana support-only release boundaries.");
    }
  }

  return errors;
}

export function getAiGeneratedPackageReleaseCandidateWarnings(candidate: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(candidate)) {
    return warnings;
  }

  const signals = readSignals(candidate, "signals");
  const blockedActions = readStringArray(candidate, "blockedActions");

  if (!signals.some((signal) => signal.status === "blocked" || signal.status === "missing")) {
    warnings.push("Generated package release candidates should keep at least one blocker visible until private-library release gates exist.");
  }

  if (!textListIncludes(blockedActions, "No support-language-only release")) {
    warnings.push("Generated package release candidates should block support-language-only release explicitly.");
  }

  return warnings;
}

export function validateAiGeneratedPackageReleaseCandidates(candidates: unknown[]): string[] {
  return candidates.flatMap((candidate) => validateAiGeneratedPackageReleaseCandidate(candidate));
}

export function getAiGeneratedPackageReleaseCandidateCollectionWarnings(candidates: unknown[]): string[] {
  return candidates.flatMap((candidate) => getAiGeneratedPackageReleaseCandidateWarnings(candidate));
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

function readSignals(source: Record<string, unknown>, key: string): AiGeneratedPackageReleaseCandidateSignal[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    signalId: readString(item, "signalId"),
    label: readString(item, "label"),
    status: readString(item, "status") as AiGeneratedPackageReleaseCandidateSignalStatus,
    sourceRecord: readString(item, "sourceRecord"),
    evidence: readString(item, "evidence"),
    releaseEffect: readString(item, "releaseEffect"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  const normalizedExpected = expected.toLowerCase();
  return items.some((item) => item.toLowerCase().includes(normalizedExpected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
