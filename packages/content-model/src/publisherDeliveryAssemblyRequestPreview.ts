export type PublisherDeliveryAssemblyInputStatus = "present" | "missing" | "blocked";

export interface PublisherDeliveryAssemblyInput {
  inputId: string;
  label: string;
  status: PublisherDeliveryAssemblyInputStatus;
  evidence: string;
  nextAction: string;
}

export interface PublisherDeliveryAssemblyRequestPreview {
  recordVersion: 1;
  previewId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceChecksumSha256: string;
  selectedMode: "unselected" | "closed-local" | "hosted-pwa" | "hybrid";
  status: "blocked";
  inputs: PublisherDeliveryAssemblyInput[];
  unresolvedRequirements: string[];
  blockedActions: string[];
  packageAssemblyAllowed: false;
  qrPrintArtifactIncluded: false;
  studentFacingActivationAllowed: false;
  hostedPersistenceActivated: false;
  mode: "review-only";
  sideEffect: "none";
}

const requiredInputIds = [
  "source-preflight-evidence",
  "approved-delivery-manifest",
  "manual-release-receipt",
  "approved-qr-registry",
  "delivery-package-index",
  "offline-bundle-manifest",
  "reviewed-bundle-manifest",
  "review-packet-binding",
  "operator-and-write-time",
] as const;

const blockedActions = [
  "No package writer execution from this preview",
  "No QR print artifact is created from this preview",
  "No hosted persistence activation from this preview",
  "No student-facing activation from this preview",
] as const;

export function createPublisherDeliveryAssemblyRequestPreview(input: {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceChecksumSha256: string;
  selectedMode: PublisherDeliveryAssemblyRequestPreview["selectedMode"];
  sourcePreflightEvidencePresent: boolean;
  deliveryManifestPresent: boolean;
  releaseReceiptPresent: boolean;
  qrRegistryPresent: boolean;
  packageIndexPresent: boolean;
  bundleManifestPresent: boolean;
  reviewedBundleManifestPresent: boolean;
  reviewPacketBound: boolean;
  operatorAndWriteTimePresent: boolean;
}): PublisherDeliveryAssemblyRequestPreview {
  const entry = (inputId: string, label: string, present: boolean, evidence: string, nextAction: string): PublisherDeliveryAssemblyInput => ({
    inputId,
    label,
    status: present ? "present" : "blocked",
    evidence,
    nextAction,
  });
  const inputs = [
    entry("source-preflight-evidence", "Publisher source preflight evidence", input.sourcePreflightEvidencePresent, "The durable publisher source inventory and aggregate fingerprints are linked to the exact quarantine and checksum.", "Attach and reconcile the complete publisher source preflight evidence before package assembly."),
    entry("approved-delivery-manifest", "Approved delivery manifest", input.deliveryManifestPresent, "An approved manifest identity is linked to the assembly request.", "Link the approved tenant/package/version manifest and source checksum."),
    entry("manual-release-receipt", "Manual release receipt", input.releaseReceiptPresent, "A named release receipt is linked to the exact delivery identity.", "Record the named release approval and rollback reference."),
    entry("approved-qr-registry", "Approved QR registry", input.qrRegistryPresent, "The stable QR alias registry is linked to the approved release.", "Reconcile stable aliases, local fallbacks, and print authorization."),
    entry("delivery-package-index", "Delivery package index", input.packageIndexPresent, "The package index is linked to the approved manifest and receipt.", "Create and read back the metadata-only package index after release approval."),
    entry("offline-bundle-manifest", "Offline bundle manifest", input.bundleManifestPresent, "The offline-ready bundle manifest is present for closed-local assembly.", "Provide the tenant-owned bundle manifest and verify its asset paths and checksums."),
    entry("reviewed-bundle-manifest", "Reviewed bundle manifest custody record", input.reviewedBundleManifestPresent, "The exact tenant/package/version bundle manifest has been reviewed and persisted against the package review packet and source preflight evidence.", "Capture the immutable reviewed bundle-manifest record before package assembly."),
    entry("review-packet-binding", "Quarantine review packet binding", input.reviewPacketBound, "The immutable review packet matches tenant, package, quarantine, and source checksum.", "Record an accepted package review packet and bind it to the exact source checksum."),
    entry("operator-and-write-time", "Operator and write timestamp", input.operatorAndWriteTimePresent, "A bounded operator identity and write timestamp are present.", "Provide the authorized operator identity and an auditable write timestamp."),
  ];
  const unresolvedRequirements = inputs.filter((item) => item.status !== "present").map((item) => `${item.label}: ${item.nextAction}`);
  return {
    recordVersion: 1,
    previewId: `${input.packageId}:${input.quarantineId}:assembly-request-preview`,
    tenantId: input.tenantId,
    quarantineId: input.quarantineId,
    packageId: input.packageId,
    sourceChecksumSha256: input.sourceChecksumSha256,
    selectedMode: input.selectedMode,
    status: "blocked",
    inputs,
    unresolvedRequirements,
    blockedActions: [...blockedActions],
    packageAssemblyAllowed: false,
    qrPrintArtifactIncluded: false,
    studentFacingActivationAllowed: false,
    hostedPersistenceActivated: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validatePublisherDeliveryAssemblyRequestPreview(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher delivery assembly request preview must be an object."];
  if (value.recordVersion !== 1) errors.push("Publisher delivery assembly request preview recordVersion must be 1.");
  for (const field of ["previewId", "tenantId", "quarantineId", "packageId"] as const) if (!isNonEmptyString(value[field])) errors.push(`Publisher delivery assembly request preview ${field} must be non-empty.`);
  if (!/^[a-f0-9]{64}$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Publisher delivery assembly request preview checksum must be lowercase SHA-256.");
  if (!["unselected", "closed-local", "hosted-pwa", "hybrid"].includes(String(value.selectedMode))) errors.push("Publisher delivery assembly request preview selectedMode is unsupported.");
  if (value.status !== "blocked" || value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Publisher delivery assembly request preview must remain blocked, review-only, and side-effect-free.");
  if (!Array.isArray(value.inputs) || value.inputs.length !== requiredInputIds.length) errors.push("Publisher delivery assembly request preview must contain all required writer inputs.");
  const seen = new Set<string>();
  for (const input of Array.isArray(value.inputs) ? value.inputs : []) {
    if (!isRecord(input)) { errors.push("Publisher delivery assembly inputs must be objects."); continue; }
    if (!isNonEmptyString(input.inputId) || seen.has(String(input.inputId))) errors.push("Publisher delivery assembly input ids must be unique and non-empty.");
    seen.add(String(input.inputId));
    if (!isNonEmptyString(input.label) || !isNonEmptyString(input.evidence) || !isNonEmptyString(input.nextAction)) errors.push("Publisher delivery assembly inputs require label, evidence, and nextAction.");
    if (!["present", "missing", "blocked"].includes(String(input.status))) errors.push("Publisher delivery assembly input status is unsupported.");
  }
  for (const inputId of requiredInputIds) if (!seen.has(inputId)) errors.push(`Publisher delivery assembly request preview is missing input ${inputId}.`);
  if (!Array.isArray(value.unresolvedRequirements)) errors.push("Publisher delivery assembly request preview unresolvedRequirements must be an array.");
  if (!Array.isArray(value.blockedActions)) errors.push("Publisher delivery assembly request preview blockedActions must be an array.");
  else for (const action of blockedActions) if (!value.blockedActions.includes(action)) errors.push(`Publisher delivery assembly request preview must block action: ${action}.`);
  for (const field of ["packageAssemblyAllowed", "qrPrintArtifactIncluded", "studentFacingActivationAllowed", "hostedPersistenceActivated"] as const) if (value[field] !== false) errors.push(`${field} must remain false.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
