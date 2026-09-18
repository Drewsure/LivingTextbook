export type LocalBundleHandoffReviewAccessMode = "teacher-review";

export interface LocalBundleHandoffReviewRequest {
  tenantId: string;
  bundleId: string;
  packetId: string;
  accessMode: LocalBundleHandoffReviewAccessMode;
  studentFacing: false;
}

export function validateLocalBundleHandoffReviewRequest(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Local bundle handoff review request must be a JSON object."];

  for (const field of ["tenantId", "bundleId", "packetId"] as const) {
    if (typeof value[field] !== "string" || !value[field].trim()) {
      errors.push(`Local bundle handoff review request requires ${field}.`);
    }
  }
  if (value.accessMode !== "teacher-review") {
    errors.push("Local bundle handoff review request must use teacher-review access.");
  }
  if (value.studentFacing !== false) {
    errors.push("Local bundle handoff review request must remain non-student-facing.");
  }

  return errors;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
