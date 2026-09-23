import {
  isUploadQuarantineSafeTenantId,
  type UploadQuarantineChannel,
  type UploadQuarantineIntakeRecord,
} from "./uploadQuarantineIntake";

export type UploadQuarantineEvidenceDecision = "blocked" | "needs-review" | "evidence-ready";
export type UploadQuarantineScanStatus = "pending" | "passed" | "failed";
export type UploadQuarantineRightsStatus = "owned" | "licensed" | "partner-provided" | "unknown";
export type UploadQuarantineSourceReviewStatus = "unreviewed" | "reviewed" | "approved" | "rejected";

export interface UploadQuarantineEvidenceInput {
  scanStatus: UploadQuarantineScanStatus;
  rightsStatus: UploadQuarantineRightsStatus;
  sourceReviewStatus: UploadQuarantineSourceReviewStatus;
  targetMappingReviewed: boolean;
  accessibilityReviewed: boolean;
  releaseApproved: boolean;
  evidencePacketId: string;
}

export interface UploadQuarantineAdmissionPreview {
  admissionId: string;
  tenantId: string;
  quarantineId: string;
  channelId: UploadQuarantineChannel;
  evidencePacketId: string;
  decision: UploadQuarantineEvidenceDecision;
  evidenceComplete: boolean;
  requiredEvidence: string[];
  blockers: string[];
  allowedPreviewActions: string[];
  blockedActions: string[];
  promotionAllowed: false;
  studentFacingAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const requiredBlockedActions = [
  "No quarantine record mutation",
  "No scan or rights status mutation",
  "No target mapping promotion",
  "No package, playlist, game, assignment, QR, or local bundle write",
  "No student-facing use",
] as const;

export function deriveUploadQuarantineAdmissionPreview(
  intake: UploadQuarantineIntakeRecord,
  evidence: UploadQuarantineEvidenceInput,
): UploadQuarantineAdmissionPreview {
  const validationErrors = validateUploadQuarantineEvidenceInput(intake, evidence);
  if (validationErrors.length > 0) {
    return blockedPreview(intake, evidence, validationErrors);
  }

  const blockers = [
    ...(evidence.scanStatus === "passed" ? [] : ["Security scan must pass."]),
    ...(evidence.rightsStatus === "unknown" ? ["Rights proof is required."] : []),
    ...(evidence.sourceReviewStatus !== "approved" ? ["Source review approval is required."] : []),
    ...(evidence.targetMappingReviewed ? [] : ["Target mapping review is required."]),
    ...(evidence.accessibilityReviewed ? [] : ["Accessibility review is required."]),
    ...(evidence.releaseApproved ? [] : ["Release-control approval is required."]),
    "Promotion adapter selection is still a separate deployment gate.",
  ];
  const evidenceComplete = blockers.length === 1;

  return {
    admissionId: `${intake.intakeId}:${evidence.evidencePacketId}`,
    tenantId: intake.tenantId,
    quarantineId: intake.intakeId,
    channelId: intake.channelId,
    evidencePacketId: evidence.evidencePacketId,
    decision: evidenceComplete ? "evidence-ready" : "needs-review",
    evidenceComplete,
    requiredEvidence: [
      "Validated quarantine intake record",
      "Checksum and MIME policy evidence",
      "Security scan result",
      "Rights proof",
      "Source review decision",
      "Target mapping review",
      "Accessibility review",
      "Release-control decision",
    ],
    blockers: [...new Set(blockers)],
    allowedPreviewActions: [
      "Inspect evidence completeness",
      "Compare target-specific requirements",
      "Prepare a human review handoff",
    ],
    blockedActions: [...requiredBlockedActions],
    promotionAllowed: false,
    studentFacingAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validateUploadQuarantineEvidenceInput(
  intake: UploadQuarantineIntakeRecord,
  evidence: UploadQuarantineEvidenceInput,
): string[] {
  const errors: string[] = [];
  if (!isUploadQuarantineSafeTenantId(intake?.tenantId)) errors.push("Quarantine admission tenant identity is unsafe.");
  if (!/^q-[0-9a-f-]{36}$/.test(intake?.intakeId ?? "")) errors.push("Quarantine admission identity is not an opaque quarantine id.");
  if (!evidence || typeof evidence !== "object") return [...new Set([...errors, "Quarantine admission evidence must be an object."])];
  if (!isNonEmptyString(evidence.evidencePacketId) || evidence.evidencePacketId.length > 200) errors.push("Quarantine admission evidencePacketId must be bounded and non-empty.");
  if (!["pending", "passed", "failed"].includes(evidence.scanStatus)) errors.push("Quarantine admission scan status is unsupported.");
  if (!["owned", "licensed", "partner-provided", "unknown"].includes(evidence.rightsStatus)) errors.push("Quarantine admission rights status is unsupported.");
  if (!["unreviewed", "reviewed", "approved", "rejected"].includes(evidence.sourceReviewStatus)) errors.push("Quarantine admission source review status is unsupported.");
  for (const field of ["targetMappingReviewed", "accessibilityReviewed", "releaseApproved"] as const) {
    if (typeof evidence[field] !== "boolean") errors.push(`Quarantine admission ${field} must be boolean.`);
  }
  return [...new Set(errors)];
}

function blockedPreview(intake: UploadQuarantineIntakeRecord, evidence: UploadQuarantineEvidenceInput, errors: string[]): UploadQuarantineAdmissionPreview {
  return {
    admissionId: `${intake?.intakeId ?? "invalid"}:${evidence?.evidencePacketId ?? "invalid"}`,
    tenantId: intake?.tenantId ?? "invalid",
    quarantineId: intake?.intakeId ?? "invalid",
    channelId: intake?.channelId ?? "source-pdf-text-upload",
    evidencePacketId: evidence?.evidencePacketId ?? "invalid",
    decision: "blocked",
    evidenceComplete: false,
    requiredEvidence: ["Valid quarantine intake identity", "Valid evidence packet identity"],
    blockers: [...new Set(errors)],
    allowedPreviewActions: ["Correct the review packet before inspection"],
    blockedActions: [...requiredBlockedActions],
    promotionAllowed: false,
    studentFacingAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
