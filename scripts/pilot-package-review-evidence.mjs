export const PILOT_PACKAGE_REVIEW_LANES = [
  "content",
  "game",
  "audio",
  "video",
  "image",
  "font",
  "accessibility",
  "rights",
];

export function validatePilotPackageReviewEvidence(value) {
  const errors = [];
  if (!isRecord(value)) return ["Package review evidence must be a JSON object."];
  if (value.recordVersion !== 1) errors.push("Package review evidence recordVersion must be 1.");
  if (value.status !== "reviewed") errors.push("Package review evidence status must be reviewed.");
  for (const [field, label] of [["tenantId", "tenantId"], ["packageId", "packageId"], ["unitKey", "unitKey"], ["reviewPacketId", "reviewPacketId"], ["reviewerId", "reviewerId"], ["sourceInventoryChecksumSha256", "source inventory checksum"], ["packageChecksumSha256", "package checksum"], ["audioCoverage", "audio coverage"], ["accessibilityCoverage", "accessibility coverage"], ["rightsCoverage", "rights coverage"]]) {
    if (!isBoundedText(value[field])) errors.push(`Package review evidence ${label} is required.`);
  }
  if (!/^sha256:[0-9a-f]{64}$/i.test(value.sourceInventoryChecksumSha256 ?? "")) errors.push("Package review evidence source inventory checksum must use sha256:<64 hexadecimal characters> format.");
  if (!/^sha256:[0-9a-f]{64}$/i.test(value.packageChecksumSha256 ?? "")) errors.push("Package review evidence package checksum must use sha256:<64 hexadecimal characters> format.");
  if (!isIsoTimestamp(value.reviewedAt)) errors.push("Package review evidence reviewedAt must be an ISO timestamp.");
  if (value.audioCoverage !== "reviewed") errors.push("Package review evidence audio coverage must be reviewed.");
  if (value.accessibilityCoverage !== "reviewed") errors.push("Package review evidence accessibility coverage must be reviewed.");
  if (value.rightsCoverage !== "reviewed") errors.push("Package review evidence rights coverage must be reviewed.");
  if (!Array.isArray(value.gamePathwayIds) || value.gamePathwayIds.length === 0 || value.gamePathwayIds.some((id) => !isBoundedText(id))) errors.push("Package review evidence gamePathwayIds must contain at least one bounded activity id.");
  if (!Array.isArray(value.reviewedLanes)) {
    errors.push("Package review evidence reviewedLanes must be an array.");
  } else {
    const seen = new Set();
    for (const lane of value.reviewedLanes) {
      if (!isRecord(lane)) {
        errors.push("Package review evidence lanes must be objects.");
        continue;
      }
      if (!PILOT_PACKAGE_REVIEW_LANES.includes(lane.lane)) errors.push(`Unsupported package review lane: ${lane.lane}.`);
      if (seen.has(lane.lane)) errors.push(`Duplicate package review lane: ${lane.lane}.`);
      seen.add(lane.lane);
      if (!["reviewed", "not-applicable"].includes(lane.status)) errors.push(`Package review lane ${lane.lane} status is unsupported.`);
      if (!Array.isArray(lane.evidenceRefs) || lane.evidenceRefs.length === 0 || lane.evidenceRefs.some((ref) => !isBoundedText(ref))) errors.push(`Package review lane ${lane.lane} must include evidence references.`);
    }
    for (const lane of PILOT_PACKAGE_REVIEW_LANES) if (!seen.has(lane)) errors.push(`Package review evidence is missing lane ${lane}.`);
  }
  if (value.promotionAllowed !== false) errors.push("Package review evidence promotionAllowed must remain false.");
  if (value.studentFacingActivationAllowed !== false) errors.push("Package review evidence studentFacingActivationAllowed must remain false.");
  return [...new Set(errors)];
}

function isRecord(value) { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isBoundedText(value) { return typeof value === "string" && value.trim().length > 0 && value.length <= 240 && !value.includes("REPLACE_WITH_"); }
function isIsoTimestamp(value) { return typeof value === "string" && Number.isFinite(Date.parse(value)); }
