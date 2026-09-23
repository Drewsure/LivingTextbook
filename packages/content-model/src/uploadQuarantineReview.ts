import type { UploadQuarantineIntakeRecord } from "./uploadQuarantineIntake";

export type UploadQuarantineReviewSummary = {
  quarantineId: string;
  record: UploadQuarantineIntakeRecord;
  payloadPresent: boolean;
  reviewState: "awaiting-scan-rights-source-review";
  blockedActions: readonly string[];
};

export function createUploadQuarantineReviewSummary(
  record: UploadQuarantineIntakeRecord,
  payloadPresent: boolean,
): UploadQuarantineReviewSummary {
  return {
    quarantineId: record.intakeId,
    record,
    payloadPresent,
    reviewState: "awaiting-scan-rights-source-review",
    blockedActions: [
      "No raw payload response",
      "No download URL",
      "No scan result mutation",
      "No rights approval mutation",
      "No source review mutation",
      "No target mapping promotion",
      "No playlist, game, assignment, QR, or local bundle activation",
      "No student-facing use",
    ],
  };
}
