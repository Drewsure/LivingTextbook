import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (relativePath) => readFileSync(resolve(root, relativePath), "utf8");
const failures = [];

const contract = read("packages/content-model/src/teacherAnswerKeyReview.ts");
const bundleManifest = read("packages/content-model/src/localBundleManifest.ts");
const assembler = read("apps/web/src/server/delivery/localPilotPackageAssembler.ts");
const reviewRoute = read("apps/web/src/app/api/teacher/answer-key-review/route.ts");
const reviewAdapter = read("apps/web/src/server/persistence/teacherAnswerKeyReviewAdapter.ts");
const authorization = read("apps/web/src/server/persistence/teacherOperationsAuthorization.ts");
const studentRoutes = [
  read("apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/front-door/[unitId]/page.tsx"),
  read("apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/memory/[unitId]/page.tsx"),
  read("apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/media/[playlistId]/page.tsx"),
];

for (const [source, markers, label] of [
  [contract, ["TeacherAnswerKeyReviewRequest", "contentIncluded: false", "studentFacing: false", "teacher/answers/", "validateStudentBundleTeacherAnswerExclusion"], "answer-key contract"],
  [bundleManifest, ["validateStudentBundleTeacherAnswerExclusion(value)"], "student bundle manifest"],
  [assembler, ["validateStudentBundleTeacherAnswerExclusion", "buildSourceFilePlan(input.bundleManifest)", "Local pilot package assembly requires"], "local package assembler"],
  [reviewRoute, ["hasTeacherOperationsReadAuthorization(request, requestShape.tenantId)", "getTeacherAnswerKeyReviewProvider", 'accessMode: "teacher-review"', "contentIncluded: false", "studentFacing: false"], "teacher answer-key review route"],
  [reviewAdapter, ["TeacherAnswerKeyReviewProvider", "no answer content or synthetic record", "validateTeacherAnswerKeyReviewRequest"], "teacher answer-key review adapter"],
  [authorization, ['claims?.role === "teacher"', "claims.scope === TEACHER_PERSISTENCE_READ_SCOPE", "claims.tenantId === tenantId"], "teacher authorization"],
]) {
  for (const marker of markers) if (!source.includes(marker)) failures.push(`${label} is missing ${marker}.`);
}

for (const route of studentRoutes) {
  for (const forbidden of ["answer-key-review", "teacherAnswerKey", "teacher/answers/"]) {
    if (route.includes(forbidden)) failures.push(`student route must not reference teacher answer material: ${forbidden}`);
  }
}

if (reviewRoute.includes("contentIncluded: true") || reviewRoute.includes("studentFacing: true")) failures.push("teacher answer-key review route must never enable content or student-facing flags.");
if (assembler.includes('destinationPath: "teacher/answers/')) failures.push("local package assembler must not copy teacher answer-key paths into the student bundle.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS student bundle assembly rejects teacher answer-key paths and teacher review metadata is tenant-scoped, non-student-facing, and content-free until a provider is explicitly configured.");
