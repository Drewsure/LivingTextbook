import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { validateTeacherAnswerKeyEvidence } from "./pilot-package-review-evidence.mjs";

const root = mkdtempSync(join(tmpdir(), "living-textbook-answer-key-evidence-"));
try {
  const relativePath = "teacher/answers/unit-1-answers.pdf";
  const absolutePath = join(root, relativePath);
  const bytes = Buffer.from("teacher answer material stays external");
  const checksum = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
  mkdirSync(join(root, "teacher", "answers"), { recursive: true });
  writeFileSync(absolutePath, bytes);
  const readFileChecksum = (path) => `sha256:${createHash("sha256").update(readFileSync(join(root, path))).digest("hex")}`;
  const valid = {
    evidenceId: "teacher-answer-key-review-1",
    tenantId: "ministar",
    packageId: "ministar-l1-u1-package",
    unitKey: "ministar:english:foundation:L1:U1",
    relativePath,
    checksumSha256: checksum,
    reviewerId: "teacher-reviewer",
    reviewedAt: "2026-10-03T00:00:00.000Z",
    rightsEvidenceRef: "rights-evidence",
    answerMappingEvidenceRef: "answer-mapping-review",
    teacherOnly: true,
    studentFacing: false,
    contentIncluded: false,
    status: "review-only",
  };
  const options = {
    tenantId: valid.tenantId,
    packageId: valid.packageId,
    unitKey: valid.unitKey,
    expectedPaths: [relativePath],
    readFileChecksum,
  };
  const validErrors = validateTeacherAnswerKeyEvidence([valid], options);
  if (validErrors.length > 0) fail(`valid evidence was rejected: ${validErrors.join("; ")}`);

  const driftErrors = validateTeacherAnswerKeyEvidence([{ ...valid, checksumSha256: `sha256:${"0".repeat(64)}` }], options);
  if (!driftErrors.some((error) => error.includes("checksum does not match"))) fail("checksum drift was not rejected");

  const contentErrors = validateTeacherAnswerKeyEvidence([{ ...valid, answerText: "Hello, teacher." }], options);
  if (!contentErrors.some((error) => error.includes("must not contain answerText"))) fail("answer content field was not rejected");

  console.log("PASS teacher answer-key evidence binds the external checksum, rejects checksum drift, and rejects answer content fields.");
} finally {
  rmSync(root, { recursive: true, force: true });
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}
