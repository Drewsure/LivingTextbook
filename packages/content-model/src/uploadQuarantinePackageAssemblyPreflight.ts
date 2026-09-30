import { isUploadQuarantineSafeTenantId } from "./uploadQuarantineIntake";
import type { UploadQuarantinePackageReviewPacket } from "./uploadQuarantinePackageReviewPacket";

export type UploadQuarantinePackageAssemblyPreflightStatus = "blocked" | "ready-for-manual-assembly";

export interface UploadQuarantinePackageAssemblyPreflight {
  recordVersion: 1;
  preflightId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  packetId: string;
  sourceChecksumSha256: string;
  packetStatus: UploadQuarantinePackageReviewPacket["status"];
  status: UploadQuarantinePackageAssemblyPreflightStatus;
  requiredInputs: string[];
  blockers: string[];
  nextGate: string[];
  blockedActions: string[];
  assemblyWriteAllowed: false;
  promotionAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createUploadQuarantinePackageAssemblyPreflight(input: {
  packet: UploadQuarantinePackageReviewPacket;
  additionalBlockers?: string[];
}): UploadQuarantinePackageAssemblyPreflight {
  const packet = input.packet;
  const blockers = [...new Set([
    ...packet.blockers,
    ...(input.additionalBlockers ?? []),
  ])];
  const preflight: UploadQuarantinePackageAssemblyPreflight = {
    recordVersion: 1,
    preflightId: `${packet.packetId}:assembly-preflight`,
    tenantId: packet.tenantId,
    quarantineId: packet.quarantineId,
    packageId: packet.packageId,
    packetId: packet.packetId,
    sourceChecksumSha256: packet.checksumSha256,
    packetStatus: packet.status,
    status: blockers.length === 0 ? "ready-for-manual-assembly" : "blocked",
    requiredInputs: [
      "Approved publisher source and textbook unit mapping",
      "Checksum-bound approval for exactly two English target sentences",
      "Reviewed content, game, audio, image, video, and font records",
      "Approved delivery manifest and release candidate",
      "Manual release receipt and QR print authorization",
      "Approved local bundle or hosted deployment handoff",
      "Teacher policy, privacy, retention, rollback, and support evidence",
    ],
    blockers,
    nextGate: [
      "Resolve every blocker and reconcile the source checksum again.",
      "A human release operator confirms the delivery mode and package inputs.",
      "Only the separately gated package writer may assemble files after approval.",
    ],
    blockedActions: [
      "No package JSON write",
      "No route or playlist write",
      "No local bundle write",
      "No QR print authorization",
      "No hosted persistence activation",
      "No student-facing use",
    ],
    assemblyWriteAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const errors = validateUploadQuarantinePackageAssemblyPreflight(preflight);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return preflight;
}

export function validateUploadQuarantinePackageAssemblyPreflight(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine package assembly preflight must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine package assembly preflight recordVersion must be 1.");
  for (const field of ["preflightId", "tenantId", "quarantineId", "packageId", "packetId", "sourceChecksumSha256"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Upload quarantine package assembly preflight ${field} must be non-empty.`);
  }
  if (!isUploadQuarantineSafeTenantId(value.tenantId)) errors.push("Upload quarantine package assembly preflight tenant identity is unsafe.");
  if (!/^q-[0-9a-f-]{36}$/.test(String(value.quarantineId ?? ""))) errors.push("Upload quarantine package assembly preflight quarantine identity is not opaque.");
  if (!/^[a-f0-9]{64}$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Upload quarantine package assembly preflight checksum must be lowercase SHA-256.");
  if (value.status !== "blocked" && value.status !== "ready-for-manual-assembly") errors.push("Upload quarantine package assembly preflight status is unsupported.");
  if (value.packetStatus !== "blocked" && value.packetStatus !== "ready-for-next-gate") errors.push("Upload quarantine package assembly preflight packet status is unsupported.");
  for (const [field, label] of [["requiredInputs", "required inputs"], ["blockers", "blockers"], ["nextGate", "next gate"], ["blockedActions", "blocked actions"]] as const) {
    if (!Array.isArray(value[field]) || value[field].length === 0 || value[field].some((item) => !isNonEmptyString(item))) errors.push(`Upload quarantine package assembly preflight ${label} must contain non-empty strings.`);
  }
  if (value.status === "ready-for-manual-assembly" && Array.isArray(value.blockers) && value.blockers.length > 0) errors.push("A ready package assembly preflight cannot contain blockers.");
  if (value.assemblyWriteAllowed !== false) errors.push("Upload quarantine package assembly preflight assembly write must remain blocked.");
  if (value.promotionAllowed !== false) errors.push("Upload quarantine package assembly preflight promotion must remain blocked.");
  if (value.studentFacingUseAllowed !== false) errors.push("Upload quarantine package assembly preflight student use must remain blocked.");
  if (value.mode !== "review-only") errors.push("Upload quarantine package assembly preflight must remain review-only.");
  if (value.sideEffect !== "none") errors.push("Upload quarantine package assembly preflight must remain side-effect-free.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
