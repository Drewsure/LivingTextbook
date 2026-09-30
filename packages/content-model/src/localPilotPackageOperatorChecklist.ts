export type LocalPilotPackageOperatorChecklistStatus = "verified";

export interface LocalPilotPackageOperatorChecklistItem {
  checkId: string;
  label: string;
  status: LocalPilotPackageOperatorChecklistStatus;
  evidence: string;
}

export interface LocalPilotPackageOperatorChecklist {
  checklistVersion: 1;
  checklistId: string;
  tenantId: string;
  packageId: string;
  version: string;
  bundleId: string;
  manifestId: string;
  receiptId: string;
  sourceAssemblyChecksum: string;
  status: LocalPilotPackageOperatorChecklistStatus;
  checks: LocalPilotPackageOperatorChecklistItem[];
  operatorActions: string[];
  blockedActions: string[];
  rawPayloadIncluded: false;
  learnerRecordsIncluded: false;
  writesAllowed: false;
  hostedPersistenceActivated: false;
  qrAliasesMutated: false;
  sideEffect: "none";
}

const requiredCheckIds = [
  "release-lineage",
  "approved-asset-custody",
  "qr-print-artifact",
  "route-fallback-map",
  "game-route-map",
  "integrity-ledger",
  "privacy-boundary",
  "hosted-persistence-policy",
] as const;

const operatorActions = [
  "Review the verified package handoff receipt.",
  "Open and print the verified QR sheet using the approved school workflow.",
  "Rehearse the teacher front door and one student game route before classroom use.",
  "Record any hosted-persistence opt-in separately; local package verification does not activate it.",
] as const;

const blockedActions = [
  "No raw payload export from this checklist",
  "No learner-record export",
  "No QR alias mutation",
  "No hosted persistence activation",
  "No student launch authorization",
] as const;

export function createLocalPilotPackageOperatorChecklist(input: {
  tenantId: string;
  packageId: string;
  version: string;
  bundleId: string;
  manifestId: string;
  receiptId: string;
  sourceAssemblyChecksum: string;
  approvedAssetSourceScope: "package-scoped-promotion" | "legacy-flat-root";
  copiedAssetCount: number;
  qrPrintArtifactId: string;
  qrAliasRegistryRecordId: string;
  integrityManifestId: string;
  integrityFileCount: number;
  routeCount: number;
  gameRouteCount: number;
  hostedPersistence: string;
}): LocalPilotPackageOperatorChecklist {
  const check = (checkId: string, label: string, evidence: string): LocalPilotPackageOperatorChecklistItem => ({ checkId, label, status: "verified", evidence });
  return {
    checklistVersion: 1,
    checklistId: `${input.packageId}:${input.version}:operator-checklist`,
    tenantId: input.tenantId,
    packageId: input.packageId,
    version: input.version,
    bundleId: input.bundleId,
    manifestId: input.manifestId,
    receiptId: input.receiptId,
    sourceAssemblyChecksum: input.sourceAssemblyChecksum,
    status: "verified",
    checks: [
      check("release-lineage", "Release lineage", `${input.manifestId} / ${input.receiptId}`),
      check("approved-asset-custody", "Approved asset custody", `${input.approvedAssetSourceScope}; ${input.copiedAssetCount} copied asset(s)`),
      check("qr-print-artifact", "QR print artifact", `${input.qrPrintArtifactId}; registry ${input.qrAliasRegistryRecordId}`),
      check("route-fallback-map", "QR route and local fallback map", `${input.routeCount} route(s) verified`),
      check("game-route-map", "Curated game route map", `${input.gameRouteCount} game route(s) verified`),
      check("integrity-ledger", "Package integrity ledger", `${input.integrityManifestId}; ${input.integrityFileCount} file(s) verified`),
      check("privacy-boundary", "Privacy boundary", "No learner records, raw payload response, or student activation in this checklist"),
      check("hosted-persistence-policy", "Hosted persistence policy", `${input.hostedPersistence}; activation remains separate`),
    ],
    operatorActions: [...operatorActions],
    blockedActions: [...blockedActions],
    rawPayloadIncluded: false,
    learnerRecordsIncluded: false,
    writesAllowed: false,
    hostedPersistenceActivated: false,
    qrAliasesMutated: false,
    sideEffect: "none",
  };
}

export function validateLocalPilotPackageOperatorChecklist(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Local pilot package operator checklist must be an object."];
  if (value.checklistVersion !== 1) errors.push("Local pilot package operator checklist checklistVersion must be 1.");
  for (const field of ["checklistId", "tenantId", "packageId", "version", "bundleId", "manifestId", "receiptId", "sourceAssemblyChecksum"] as const) if (!isNonEmptyString(value[field])) errors.push(`Local pilot package operator checklist ${field} must be non-empty.`);
  if (!isSha256(value.sourceAssemblyChecksum)) errors.push("Local pilot package operator checklist sourceAssemblyChecksum must be sha256:<64 hexadecimal characters>.");
  if (value.status !== "verified") errors.push("Local pilot package operator checklist status must be verified.");
  if (!Array.isArray(value.checks) || value.checks.length !== requiredCheckIds.length) errors.push("Local pilot package operator checklist must contain all required checks.");
  const seen = new Set<string>();
  for (const check of Array.isArray(value.checks) ? value.checks : []) {
    if (!isRecord(check)) { errors.push("Local pilot package operator checklist checks must be objects."); continue; }
    const checkId = String(check.checkId ?? "");
    if (!isNonEmptyString(check.checkId) || seen.has(checkId)) errors.push("Local pilot package operator checklist check ids must be unique and non-empty.");
    seen.add(checkId);
    if (!isNonEmptyString(check.label) || !isNonEmptyString(check.evidence) || check.status !== "verified") errors.push("Local pilot package operator checklist checks must be verified and evidence-bound.");
  }
  for (const checkId of requiredCheckIds) if (!seen.has(checkId)) errors.push(`Local pilot package operator checklist is missing check ${checkId}.`);
  if (!sameStringArray(value.operatorActions, operatorActions) || !sameStringArray(value.blockedActions, blockedActions)) errors.push("Local pilot package operator checklist action lists are invalid.");
  for (const field of ["rawPayloadIncluded", "learnerRecordsIncluded", "writesAllowed", "hostedPersistenceActivated", "qrAliasesMutated"] as const) if (value[field] !== false) errors.push(`${field} must remain false in the operator checklist.`);
  if (value.sideEffect !== "none") errors.push("Local pilot package operator checklist must be side-effect-free.");
  if (isNonEmptyString(value.packageId) && isNonEmptyString(value.version) && value.checklistId !== `${value.packageId}:${value.version}:operator-checklist`) errors.push("Local pilot package operator checklist id must bind package and version.");
  return [...new Set(errors)];
}

function sameStringArray(value: unknown, expected: readonly string[]): boolean { return Array.isArray(value) && value.length === expected.length && value.every((item, index) => item === expected[index]); }
function isRecord(value: unknown): value is Record<string, any> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSha256(value: unknown): boolean { return typeof value === "string" && /^sha256:[0-9a-f]{64}$/i.test(value); }
