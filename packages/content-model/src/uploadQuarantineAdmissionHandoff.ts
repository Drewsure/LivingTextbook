import type { UploadQuarantineAdmissionPreview } from "./uploadQuarantineAdmission";

export interface UploadQuarantineAdmissionHandoffBinding {
  bindingId: string;
  sourceId: string;
  packageId: string;
  tenantId: string;
  quarantineId: string;
  admissionId: string;
  evidencePacketId: string;
  decision: UploadQuarantineAdmissionPreview["decision"];
  blockers: string[];
  promotionAllowed: false;
  studentFacingAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createUploadQuarantineAdmissionHandoffBinding(
  preview: UploadQuarantineAdmissionPreview,
  input: { sourceId: string; packageId: string },
): UploadQuarantineAdmissionHandoffBinding {
  const binding: UploadQuarantineAdmissionHandoffBinding = {
    bindingId: `${input.packageId}:${preview.admissionId}`,
    sourceId: input.sourceId,
    packageId: input.packageId,
    tenantId: preview.tenantId,
    quarantineId: preview.quarantineId,
    admissionId: preview.admissionId,
    evidencePacketId: preview.evidencePacketId,
    decision: preview.decision,
    blockers: [...preview.blockers],
    promotionAllowed: false,
    studentFacingAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const errors = validateUploadQuarantineAdmissionHandoffBinding(binding);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return binding;
}

export function validateUploadQuarantineAdmissionHandoffBinding(
  value: unknown,
): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine admission handoff binding must be an object."];
  for (const field of ["bindingId", "sourceId", "packageId", "tenantId", "quarantineId", "admissionId", "evidencePacketId"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Upload quarantine admission handoff ${field} must be non-empty.`);
  }
  if (!["blocked", "needs-review", "evidence-ready"].includes(String(value.decision))) errors.push("Upload quarantine admission handoff decision is unsupported.");
  if (!Array.isArray(value.blockers) || value.blockers.length === 0 || value.blockers.some((item) => !isNonEmptyString(item))) {
    errors.push("Upload quarantine admission handoff blockers must be non-empty strings.");
  }
  if (value.promotionAllowed !== false) errors.push("Upload quarantine admission handoff promotion must remain blocked.");
  if (value.studentFacingAllowed !== false) errors.push("Upload quarantine admission handoff student use must remain blocked.");
  if (value.mode !== "review-only") errors.push("Upload quarantine admission handoff must remain review-only.");
  if (value.sideEffect !== "none") errors.push("Upload quarantine admission handoff must remain side-effect-free.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
