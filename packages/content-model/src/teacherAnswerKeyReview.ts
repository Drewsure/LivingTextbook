export type TeacherAnswerKeyReviewAccessMode = "teacher-review";

export interface TeacherAnswerKeyReviewRequest {
  tenantId: string;
  packageId: string;
  version: string;
  assetId: string;
  accessMode: TeacherAnswerKeyReviewAccessMode;
  studentFacing: false;
}

export interface TeacherAnswerKeyReviewRecord {
  recordVersion: 1;
  recordId: string;
  tenantId: string;
  packageId: string;
  version: string;
  assetId: string;
  relativePath: string;
  checksumSha256: string;
  teacherOnly: true;
  studentFacing: false;
  contentIncluded: false;
  accessMode: TeacherAnswerKeyReviewAccessMode;
  status: "review-only";
  sideEffect: "none";
}

export interface TeacherAnswerKeyReviewProvider {
  provider: string | null;
  read(request: TeacherAnswerKeyReviewRequest): TeacherAnswerKeyReviewResult;
}

export interface TeacherAnswerKeyReviewResult {
  status: "available" | "blocked" | "not-found";
  provider: string | null;
  record: TeacherAnswerKeyReviewRecord | null;
  errors: string[];
}

export function validateTeacherAnswerKeyReviewRequest(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Teacher answer-key review request must be an object."];
  for (const field of ["tenantId", "packageId", "version", "assetId"] as const) {
    if (!isSafeIdentity(value[field])) errors.push(`Teacher answer-key review request requires a safe ${field}.`);
  }
  if (value.accessMode !== "teacher-review") errors.push("Teacher answer-key review must use teacher-review access.");
  if (value.studentFacing !== false) errors.push("Teacher answer-key review must remain non-student-facing.");
  return errors;
}

export function validateTeacherAnswerKeyReviewRecord(value: unknown): string[] {
  const errors = [...validateTeacherAnswerKeyReviewRequest(value)];
  if (!isRecord(value)) return errors;
  if (value.recordVersion !== 1) errors.push("Teacher answer-key review recordVersion must be 1.");
  if (!isSafeIdentity(value.recordId)) errors.push("Teacher answer-key review record requires a safe recordId.");
  if (!isSafeTeacherAnswerPath(value.relativePath)) errors.push("Teacher answer-key review relativePath must remain under teacher/answers/.");
  if (!/^sha256:[a-f0-9]{64}$/i.test(String(value.checksumSha256 ?? ""))) errors.push("Teacher answer-key review requires a SHA-256 checksum.");
  if (value.teacherOnly !== true) errors.push("Teacher answer-key review must remain teacher-only.");
  if (value.contentIncluded !== false) errors.push("Teacher answer-key review metadata must not include answer content.");
  if (value.status !== "review-only") errors.push("Teacher answer-key review must remain review-only.");
  if (value.sideEffect !== "none") errors.push("Teacher answer-key review must remain side-effect-free.");
  return [...new Set(errors)];
}

export function validateStudentBundleTeacherAnswerExclusion(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Student bundle manifest must be an object before teacher answer-key exclusion can be proven."];
  const contentPath = String(value.content_package_path ?? "").replaceAll("\\", "/");
  if (isTeacherAnswerPath(contentPath)) errors.push("Student bundle content package cannot be a teacher answer-key path.");
  const assets = Array.isArray(value.assets) ? value.assets : [];
  for (const asset of assets) {
    if (!isRecord(asset)) continue;
    const localPath = String(asset.local_path ?? "").replaceAll("\\", "/");
    if (asset.kind === "teacher-answer-key") errors.push("Student bundle cannot contain a teacher-answer-key asset.");
    if (asset.teacherOnly === true) errors.push("Student bundle cannot contain a teacher-only asset.");
    if (isTeacherAnswerPath(localPath)) errors.push(`Student bundle cannot contain teacher answer-key path ${localPath}.`);
  }
  return [...new Set(errors)];
}

function isSafeTeacherAnswerPath(value: unknown): boolean {
  const normalized = String(value ?? "").replaceAll("\\", "/");
  return normalized.startsWith("teacher/answers/")
    && !normalized.includes("//")
    && !normalized.split("/").includes("..")
    && !/[<>:"|?*]/.test(normalized)
    && /\.(pdf|docx|txt|md|csv)$/i.test(normalized);
}

function isTeacherAnswerPath(value: string): boolean {
  return value === "teacher/answers" || value.startsWith("teacher/answers/");
}

function isSafeIdentity(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/.test(value.trim());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
