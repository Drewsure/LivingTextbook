export type AiPrototypePatchAuthorizationReleaseLockStatus =
  | "locked"
  | "review-only"
  | "ready-for-release-control-review";

export interface AiPrototypePatchAuthorizationReleaseLock {
  lockId: string;
  tenantId: string;
  requestId: string;
  preflightId: string;
  label: string;
  status: AiPrototypePatchAuthorizationReleaseLockStatus;
  summary: string;
  requiredReleaseLocks: string[];
  authorizationScope: string[];
  forbiddenUntilUnlocked: string[];
  releaseEvidence: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_REQUIRED_LOCKS = [
  "Signed approval preflight accepted",
  "Release-control binding accepted",
  "Patch file scope accepted",
  "Patch test evidence accepted",
  "Route safety release gate accepted",
  "Rollback drill accepted",
  "Storage contract verification accepted",
  "Reviewer identity signature gate accepted",
] as const;

export const AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_SCOPE = [
  "Specific request id only",
  "Specific tenant id only",
  "Specific proposed file scope only",
  "Specific route registry scope only",
  "Specific rollback snapshot only",
  "Specific test evidence packet only",
  "Support-language evidence cannot authorize progress",
] as const;

export const AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_FORBIDDEN_UNTIL_UNLOCKED = [
  "No release-control acceptance",
  "No signed approval record",
  "No accepted patch test evidence",
  "No accepted rollback drill",
  "No accepted route safety gate",
  "No accepted storage verification",
  "No approved app file scope",
] as const;

export const AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_EVIDENCE = [
  "Release-control state before patch",
  "Release-control state after patch",
  "Patch scope checksum",
  "Fixture replay evidence",
  "Route smoke evidence",
  "Rollback rehearsal evidence",
  "Storage verification evidence",
  "Reviewer identity evidence",
] as const;

export const AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_BLOCKED_ACTIONS = [
  "No patch authorization",
  "No app file write",
  "No app patch generation",
  "No test execution",
  "No Playwright run",
  "No route mutation",
  "No student-facing route",
  "No scoring or reward mutation",
  "No audio manifest mutation",
  "No package promotion",
  "No assignment",
  "No support-language progress trigger",
] as const;

export const AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_NEXT_RECORDS = [
  "Patch authorization release lock storage contract",
  "Signed approval acceptance record",
  "Release-control binding",
  "Accepted patch test evidence packet",
  "Accepted rollback drill record",
  "Accepted route safety release gate",
] as const;

export function validateAiPrototypePatchAuthorizationReleaseLock(lock: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(lock)) {
    return ["AI prototype patch authorization release lock must be a JSON object."];
  }

  const lockId = readString(lock, "lockId");
  const tenantId = readString(lock, "tenantId");
  const requestId = readString(lock, "requestId");
  const preflightId = readString(lock, "preflightId");
  const label = readString(lock, "label");
  const status = readString(lock, "status");
  const summary = readString(lock, "summary");
  const requiredReleaseLocks = readStringArray(lock, "requiredReleaseLocks");
  const authorizationScope = readStringArray(lock, "authorizationScope");
  const forbiddenUntilUnlocked = readStringArray(lock, "forbiddenUntilUnlocked");
  const releaseEvidence = readStringArray(lock, "releaseEvidence");
  const blockedActions = readStringArray(lock, "blockedActions");
  const nextRequiredRecords = readStringArray(lock, "nextRequiredRecords");

  if (!lockId || !tenantId || !requestId || !preflightId) {
    errors.push(
      "AI prototype patch authorization release lock must include lockId, tenantId, requestId, and preflightId.",
    );
  }

  if (!label.toLowerCase().includes("patch authorization release lock")) {
    errors.push("AI prototype patch authorization release lock label must name the release lock.");
  }

  if (status !== "locked" && status !== "review-only" && status !== "ready-for-release-control-review") {
    errors.push("AI prototype patch authorization release lock must use a supported review-only status.");
  }

  if (!summary.toLowerCase().includes("locked")) {
    errors.push("AI prototype patch authorization release lock summary must keep authorization locked.");
  }

  for (const requiredLock of AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_REQUIRED_LOCKS) {
    if (!requiredReleaseLocks.includes(requiredLock)) {
      errors.push(`AI prototype patch authorization release lock must include required lock: ${requiredLock}.`);
    }
  }

  for (const scopeItem of AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_SCOPE) {
    if (!authorizationScope.includes(scopeItem)) {
      errors.push(`AI prototype patch authorization release lock must include authorization scope: ${scopeItem}.`);
    }
  }

  for (const forbiddenItem of AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_FORBIDDEN_UNTIL_UNLOCKED) {
    if (!forbiddenUntilUnlocked.includes(forbiddenItem)) {
      errors.push(
        `AI prototype patch authorization release lock must include forbidden-until-unlocked item: ${forbiddenItem}.`,
      );
    }
  }

  for (const evidence of AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_EVIDENCE) {
    if (!releaseEvidence.includes(evidence)) {
      errors.push(`AI prototype patch authorization release lock must include release evidence: ${evidence}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype patch authorization release lock must block action: ${blockedAction}.`);
    }
  }

  for (const nextRecord of AI_PROTOTYPE_PATCH_AUTHORIZATION_RELEASE_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(nextRecord)) {
      errors.push(`AI prototype patch authorization release lock must include next required record: ${nextRecord}.`);
    }
  }

  if (
    tenantId === "ministar" &&
    (!textListIncludes([summary], "hiragana") ||
      !textListIncludes([summary], "support-only") ||
      !forbiddenUntilUnlocked.includes("No accepted hiragana support boundary"))
  ) {
    errors.push("MiniStar AI prototype patch authorization release lock must include hiragana support-only evidence.");
  }

  return errors;
}

export function getAiPrototypePatchAuthorizationReleaseLockWarnings(lock: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(lock)) {
    return warnings;
  }

  const status = readString(lock, "status");
  const blockedActions = readStringArray(lock, "blockedActions");
  const authorizationScope = readStringArray(lock, "authorizationScope");

  if (status === "ready-for-release-control-review" && textListIncludes(blockedActions, "No patch authorization")) {
    warnings.push("A ready-for-release-control-review lock still cannot authorize patches.");
  }

  if (!textListIncludes(authorizationScope, "Specific proposed file scope only")) {
    warnings.push("Patch authorization release locks should scope file work to a specific reviewed proposal.");
  }

  if (!textListIncludes(blockedActions, "No support-language progress trigger")) {
    warnings.push("Patch authorization release locks should block support-language progress triggers.");
  }

  return warnings;
}

export function validateAiPrototypePatchAuthorizationReleaseLocks(locks: unknown[]): string[] {
  return locks.flatMap((lock) => validateAiPrototypePatchAuthorizationReleaseLock(lock));
}

export function getAiPrototypePatchAuthorizationReleaseLockCollectionWarnings(locks: unknown[]): string[] {
  return locks.flatMap((lock) => getAiPrototypePatchAuthorizationReleaseLockWarnings(lock));
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

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
