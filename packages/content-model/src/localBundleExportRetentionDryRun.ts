export type LocalBundleExportRetentionDryRunStatus = "blocked" | "review-only";
export type LocalBundleExportRetentionItemDisposition = "include" | "exclude" | "requires-policy";
export type LocalBundleExportRetentionItemCategory =
  | "content-package"
  | "route-registry"
  | "game-route-manifest"
  | "reviewed-media-manifest"
  | "learner-progress"
  | "raw-learner-audio"
  | "learner-transcripts"
  | "credentials";

export interface LocalBundleExportRetentionDryRunItem {
  itemId: string;
  label: string;
  category: LocalBundleExportRetentionItemCategory;
  disposition: LocalBundleExportRetentionItemDisposition;
  sourceRef: string;
  reason: string;
}

export interface LocalBundleExportRetentionDryRun {
  dryRunId: string;
  reconciliationId: string;
  tenantId: string;
  bundleId: string;
  packageId: string;
  mode: "review-only";
  status: "blocked";
  format: "review-json" | "bundle-manifest";
  items: LocalBundleExportRetentionDryRunItem[];
  retention: {
    policyRef: string;
    deletionScope: "tenant-package-session";
    retentionDays: number | null;
    deletionRequiresPolicy: true;
    deletionAction: "blocked";
  };
  exportExecutionAllowed: false;
  retentionDeletionAllowed: false;
  fileCopyAllowed: false;
  learnerDataExportAllowed: false;
  packageWriteAllowed: false;
  routeMutationAllowed: false;
  blockedActions: string[];
  sideEffect: "none";
}

const REQUIRED_BLOCKED_ACTIONS = [
  "export-execution",
  "retention-deletion",
  "file-copy",
  "learner-data-export",
  "package-write",
  "route-mutation",
] as const;

const REQUIRED_CATEGORIES: Record<LocalBundleExportRetentionItemCategory, LocalBundleExportRetentionItemDisposition> = {
  "content-package": "include",
  "route-registry": "include",
  "game-route-manifest": "include",
  "reviewed-media-manifest": "include",
  "learner-progress": "requires-policy",
  "raw-learner-audio": "exclude",
  "learner-transcripts": "exclude",
  credentials: "exclude",
};

export function validateLocalBundleExportRetentionDryRun(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Local bundle export/retention dry run must be a JSON object."];

  const dryRunId = readString(value, "dryRunId");
  const reconciliationId = readString(value, "reconciliationId");
  const tenantId = readString(value, "tenantId");
  const bundleId = readString(value, "bundleId");
  const packageId = readString(value, "packageId");
  if (!dryRunId || !reconciliationId || !tenantId || !bundleId || !packageId) {
    errors.push("Local bundle export/retention dry run requires identity fields.");
  }
  if (readString(value, "mode") !== "review-only") errors.push("Local bundle export/retention dry run must remain review-only.");
  if (readString(value, "status") !== "blocked") errors.push("Local bundle export/retention dry run must remain blocked.");
  if (readString(value, "sideEffect") !== "none") errors.push("Local bundle export/retention dry run must have no side effect.");

  for (const field of ["exportExecutionAllowed", "retentionDeletionAllowed", "fileCopyAllowed", "learnerDataExportAllowed", "packageWriteAllowed", "routeMutationAllowed"] as const) {
    if (value[field] !== false) errors.push(`Local bundle export/retention dry run must keep ${field}: false.`);
  }

  const items = readArray(value, "items");
  const categories = new Set<string>();
  const itemIds = new Set<string>();
  for (const item of items) {
    if (!isRecord(item)) {
      errors.push("Local bundle export/retention dry run items must be objects.");
      continue;
    }
    const itemId = readString(item, "itemId");
    const category = readString(item, "category") as LocalBundleExportRetentionItemCategory;
    const disposition = readString(item, "disposition");
    if (!itemId || itemIds.has(itemId)) errors.push(`Local bundle export/retention dry run item id must be unique: ${itemId || "(missing)"}.`);
    itemIds.add(itemId);
    if (!readString(item, "label") || !readString(item, "sourceRef") || !readString(item, "reason")) {
      errors.push(`Local bundle export/retention dry run item ${itemId || "(missing)"} requires label, sourceRef, and reason.`);
    }
    if (!(category in REQUIRED_CATEGORIES)) errors.push(`Local bundle export/retention dry run item ${itemId || "(missing)"} has an unsupported category.`);
    if (REQUIRED_CATEGORIES[category] && disposition !== REQUIRED_CATEGORIES[category]) {
      errors.push(`Local bundle export/retention category ${category} must use disposition ${REQUIRED_CATEGORIES[category]}.`);
    }
    categories.add(category);
  }
  for (const [category, disposition] of Object.entries(REQUIRED_CATEGORIES)) {
    if (!categories.has(category)) errors.push(`Local bundle export/retention dry run must classify ${category} as ${disposition}.`);
  }

  if (!isRecord(value.retention)) {
    errors.push("Local bundle export/retention dry run requires retention evidence.");
  } else {
    if (!readString(value.retention, "policyRef")) errors.push("Local bundle export/retention dry run requires retention.policyRef.");
    if (readString(value.retention, "deletionScope") !== "tenant-package-session") errors.push("Local bundle retention must use tenant-package-session scope.");
    if (value.retention.deletionRequiresPolicy !== true) errors.push("Local bundle retention deletion must require policy.");
    if (readString(value.retention, "deletionAction") !== "blocked") errors.push("Local bundle retention deletion must remain blocked.");
    const retentionDays = value.retention.retentionDays;
    if (retentionDays !== null && (!Number.isInteger(retentionDays) || retentionDays <= 0)) errors.push("Local bundle retentionDays must be null or a positive integer.");
  }

  const blockedActions = readStringArray(value, "blockedActions");
  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(action)) errors.push(`Local bundle export/retention dry run must block ${action}.`);
  }
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
