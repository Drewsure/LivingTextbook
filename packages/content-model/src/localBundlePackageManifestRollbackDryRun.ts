export type LocalBundlePackageManifestRollbackStatus = "blocked" | "review-only";
export type LocalBundlePackageArtifactKind = "content" | "media" | "route" | "game" | "reporting";
export type LocalBundlePackageArtifactReadiness = "ready-preview" | "review-required" | "missing";
export type LocalBundlePackageRollbackDomain = "qr" | "content" | "media" | "games" | "reports" | "learner-progress";

export interface LocalBundlePackageManifestArtifact {
  artifactId: string;
  label: string;
  kind: LocalBundlePackageArtifactKind;
  relativePath: string;
  version: string;
  checksumStatus: "verified-preview" | "review-required" | "missing";
  readiness: LocalBundlePackageArtifactReadiness;
  sourceRef: string;
}

export interface LocalBundlePackageRollbackImpact {
  impactId: string;
  domain: LocalBundlePackageRollbackDomain;
  currentVersion: string;
  fallbackVersion: string;
  fallbackTarget: string;
  status: "review-required" | "blocked";
  learnerDataMutationAllowed: false;
  routeMutationAllowed: false;
  mediaReplacementAllowed: false;
  verificationRef: string;
}

export interface LocalBundlePackageManifestRollbackDryRun {
  manifestId: string;
  rollbackDryRunId: string;
  reconciliationId: string;
  tenantId: string;
  bundleId: string;
  packageId: string;
  currentVersion: string;
  previousVersion: string | null;
  mode: "review-only";
  status: "blocked";
  manifestState: "preview-only";
  artifacts: LocalBundlePackageManifestArtifact[];
  rollbackImpacts: LocalBundlePackageRollbackImpact[];
  qrFallbackRule: string;
  requiredApprovals: string[];
  blockedActions: string[];
  manifestWriteAllowed: false;
  bundleActivationAllowed: false;
  qrMutationAllowed: false;
  mediaReplacementAllowed: false;
  gameRouteMutationAllowed: false;
  reportSchemaMutationAllowed: false;
  learnerDataDeletionAllowed: false;
  rollbackExecutionAllowed: false;
  sideEffect: "none";
}

const REQUIRED_ARTIFACT_KINDS: LocalBundlePackageArtifactKind[] = ["content", "media", "route", "game", "reporting"];
const REQUIRED_ROLLBACK_DOMAINS: LocalBundlePackageRollbackDomain[] = ["qr", "content", "media", "games", "reports", "learner-progress"];
const REQUIRED_BLOCKED_ACTIONS = [
  "manifest-write",
  "bundle-activation",
  "qr-mutation",
  "media-replacement",
  "game-route-mutation",
  "report-schema-mutation",
  "learner-data-deletion",
  "rollback-execution",
] as const;

export function validateLocalBundlePackageManifestRollbackDryRun(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Local bundle package manifest rollback dry run must be a JSON object."];

  for (const field of ["manifestId", "rollbackDryRunId", "reconciliationId", "tenantId", "bundleId", "packageId", "currentVersion"] as const) {
    if (!readString(value, field)) errors.push(`Local bundle package manifest rollback dry run requires ${field}.`);
  }
  if (readString(value, "mode") !== "review-only") errors.push("Local bundle package manifest rollback dry run must remain review-only.");
  if (readString(value, "status") !== "blocked") errors.push("Local bundle package manifest rollback dry run must remain blocked.");
  if (readString(value, "manifestState") !== "preview-only") errors.push("Local bundle package manifest must remain preview-only.");
  if (!readString(value, "qrFallbackRule").toLowerCase().includes("stable")) errors.push("Local bundle package manifest must define a stable QR fallback rule.");
  if (readString(value, "sideEffect") !== "none") errors.push("Local bundle package manifest rollback dry run must have no side effect.");

  for (const field of ["manifestWriteAllowed", "bundleActivationAllowed", "qrMutationAllowed", "mediaReplacementAllowed", "gameRouteMutationAllowed", "reportSchemaMutationAllowed", "learnerDataDeletionAllowed", "rollbackExecutionAllowed"] as const) {
    if (value[field] !== false) errors.push(`Local bundle package manifest rollback dry run must keep ${field}: false.`);
  }

  const artifacts = readArray(value, "artifacts");
  const artifactIds = new Set<string>();
  const artifactKinds = new Set<string>();
  for (const artifact of artifacts) {
    if (!isRecord(artifact)) {
      errors.push("Local bundle package manifest artifacts must be objects.");
      continue;
    }
    const artifactId = readString(artifact, "artifactId");
    const kind = readString(artifact, "kind");
    if (!artifactId || artifactIds.has(artifactId)) errors.push(`Local bundle package manifest artifact id must be unique: ${artifactId || "(missing)"}.`);
    artifactIds.add(artifactId);
    artifactKinds.add(kind);
    if (!readString(artifact, "label") || !readString(artifact, "version") || !readString(artifact, "sourceRef")) errors.push(`Local bundle manifest artifact ${artifactId || "(missing)"} requires label, version, and sourceRef.`);
    const relativePath = readString(artifact, "relativePath");
    if (!relativePath || relativePath.startsWith("/") || relativePath.includes("..") || relativePath.startsWith("file:")) errors.push(`Local bundle manifest artifact ${artifactId || "(missing)"} must use a safe relative path.`);
    if (!["content", "media", "route", "game", "reporting"].includes(kind)) errors.push(`Local bundle manifest artifact ${artifactId || "(missing)"} has an unsupported kind.`);
    if (!["verified-preview", "review-required", "missing"].includes(readString(artifact, "checksumStatus"))) errors.push(`Local bundle manifest artifact ${artifactId || "(missing)"} requires checksum status.`);
  }
  for (const kind of REQUIRED_ARTIFACT_KINDS) if (!artifactKinds.has(kind)) errors.push(`Local bundle package manifest must include a ${kind} artifact.`);

  const impacts = readArray(value, "rollbackImpacts");
  const impactDomains = new Set<string>();
  for (const impact of impacts) {
    if (!isRecord(impact)) {
      errors.push("Local bundle rollback impacts must be objects.");
      continue;
    }
    const domain = readString(impact, "domain");
    impactDomains.add(domain);
    if (!readString(impact, "impactId") || !readString(impact, "currentVersion") || !readString(impact, "fallbackVersion") || !readString(impact, "fallbackTarget") || !readString(impact, "verificationRef")) errors.push(`Local bundle rollback impact ${domain || "(missing)"} requires version, target, and verification evidence.`);
    if (!["review-required", "blocked"].includes(readString(impact, "status"))) errors.push(`Local bundle rollback impact ${domain || "(missing)"} must remain review-required or blocked.`);
    for (const field of ["learnerDataMutationAllowed", "routeMutationAllowed", "mediaReplacementAllowed"] as const) if (impact[field] !== false) errors.push(`Local bundle rollback impact ${domain || "(missing)"} must keep ${field}: false.`);
  }
  for (const domain of REQUIRED_ROLLBACK_DOMAINS) if (!impactDomains.has(domain)) errors.push(`Local bundle rollback must cover ${domain} impact.`);

  const blockedActions = readStringArray(value, "blockedActions");
  for (const action of REQUIRED_BLOCKED_ACTIONS) if (!blockedActions.includes(action)) errors.push(`Local bundle package manifest rollback dry run must block ${action}.`);
  if (readStringArray(value, "requiredApprovals").length === 0) errors.push("Local bundle package manifest rollback dry run must list required approvals.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readString(source: Record<string, any>, key: string): string {
  return typeof source[key] === "string" ? source[key].trim() : "";
}
function readArray(source: Record<string, any>, key: string): unknown[] {
  return Array.isArray(source[key]) ? source[key] : [];
}
function readStringArray(source: Record<string, any>, key: string): string[] {
  return readArray(source, key).filter((value): value is string => typeof value === "string").map((value) => value.trim());
}
