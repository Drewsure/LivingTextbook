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

export function validateTeacherAnswerKeyEvidence(value, options = {}) {
  const errors = [];
  const expectedPaths = Array.isArray(options.expectedPaths) ? options.expectedPaths : [];
  if (!Array.isArray(value)) return ["Teacher answer-key evidence must be an array when teacher answer files are declared."];
  if (value.length !== expectedPaths.length) errors.push("Teacher answer-key evidence must contain exactly one record per declared teacher answer file.");
  const seenPaths = new Set();
  for (const record of value) {
    if (!isRecord(record)) {
      errors.push("Teacher answer-key evidence records must be objects.");
      continue;
    }
    for (const [field, label] of [["evidenceId", "evidence id"], ["tenantId", "tenant id"], ["packageId", "package id"], ["unitKey", "unit key"], ["relativePath", "relative path"], ["checksumSha256", "checksum"], ["reviewerId", "reviewer id"], ["reviewedAt", "review timestamp"], ["rightsEvidenceRef", "rights evidence reference"], ["answerMappingEvidenceRef", "answer mapping evidence reference"]]) {
      if (!isBoundedText(record[field])) errors.push(`Teacher answer-key evidence ${label} is required.`);
    }
    if (!isSafeTeacherAnswerPath(record.relativePath)) errors.push(`Teacher answer-key evidence path must remain under teacher/answers/: ${record.relativePath ?? "(missing)"}.`);
    if (seenPaths.has(record.relativePath)) errors.push(`Teacher answer-key evidence path is repeated: ${record.relativePath}.`);
    seenPaths.add(record.relativePath);
    if (record.tenantId !== options.tenantId) errors.push(`Teacher answer-key evidence ${record.relativePath} must match the publisher tenant.`);
    if (record.packageId !== options.packageId) errors.push(`Teacher answer-key evidence ${record.relativePath} must match the reviewed package.`);
    if (record.unitKey !== options.unitKey) errors.push(`Teacher answer-key evidence ${record.relativePath} must match the reviewed unit.`);
    if (!/^sha256:[0-9a-f]{64}$/i.test(record.checksumSha256 ?? "")) errors.push(`Teacher answer-key evidence ${record.relativePath ?? "(unnamed)"} must use sha256:<64 hexadecimal characters>.`);
    if (record.teacherOnly !== true) errors.push(`Teacher answer-key evidence ${record.relativePath ?? "(unnamed)"} must be teacher-only.`);
    if (record.studentFacing !== false) errors.push(`Teacher answer-key evidence ${record.relativePath ?? "(unnamed)"} must not be student-facing.`);
    if (record.contentIncluded !== false) errors.push(`Teacher answer-key evidence ${record.relativePath ?? "(unnamed)"} must not include answer content.`);
    if (record.status !== "review-only") errors.push(`Teacher answer-key evidence ${record.relativePath ?? "(unnamed)"} must remain review-only.`);
    for (const forbiddenKey of ["content", "answerText", "rawText", "extractedText", "bytes", "base64"]) {
      if (Object.prototype.hasOwnProperty.call(record, forbiddenKey)) errors.push(`Teacher answer-key evidence ${record.relativePath ?? "(unnamed)"} must not contain ${forbiddenKey}.`);
    }
    if (typeof options.readFileChecksum === "function" && isSafeTeacherAnswerPath(record.relativePath)) {
      const actualChecksum = options.readFileChecksum(record.relativePath);
      if (!actualChecksum) errors.push(`Teacher answer-key evidence file is missing or unreadable: ${record.relativePath}.`);
      else if (record.checksumSha256.toLowerCase() !== actualChecksum.toLowerCase()) errors.push(`Teacher answer-key evidence checksum does not match the external file: ${record.relativePath}.`);
    }
  }
  for (const expectedPath of expectedPaths) if (!seenPaths.has(expectedPath)) errors.push(`Teacher answer-key evidence is missing declared file: ${expectedPath}.`);
  return [...new Set(errors)];
}

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
function isSafeTeacherAnswerPath(value) {
  const normalized = String(value ?? "").replaceAll("\\", "/");
  return normalized.startsWith("teacher/answers/")
    && !normalized.includes("//")
    && !normalized.split("/").includes("..")
    && !/[<>:\"|?*]/.test(normalized)
    && /\.(pdf|docx|txt|md|csv)$/i.test(normalized);
}
