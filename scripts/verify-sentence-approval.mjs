import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-sentence-approval-"));
const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
const require = createRequire(import.meta.url);

try {
  const compile = spawnSync(process.execPath, [tsc, "--module", "commonjs", "--target", "ES2022", "--moduleResolution", "node", "--skipLibCheck", "--rootDir", join(root, "packages", "content-model", "src"), "--outDir", output, "packages/content-model/src/publisherSentenceApprovalRecord.ts"], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) throw new Error(`${compile.stdout}\n${compile.stderr}`);
  const model = require(join(output, "publisherSentenceApprovalRecord.js"));
  const base = {
    tenantId: "sample-publisher",
    quarantineId: "q-123e4567-e89b-12d3-a456-426614174000",
    packageId: "sample-publisher-unit-1-package",
    proposalId: "sample-publisher-unit-1-package:authoring-proposal:review-only",
    sourceChecksumSha256: "a".repeat(64),
    targetSentences: ["Hello, teacher.", "Thank you, friend."],
    reviewerId: "reviewer-1",
    reviewerNote: "Both English structures fit the reviewed vocabulary and level.",
    decision: "approved",
    capturedAt: "2026-09-30T00:00:00.000Z",
  };
  const record = model.createPublisherSentenceApprovalRecord(base);
  assertEmpty(model.validatePublisherSentenceApprovalRecord(record), "approved sentence record");
  for (const invalid of [
    { ...record, targetSentences: ["Only one sentence"] },
    { ...record, targetSentences: ["Same sentence.", "same sentence."] },
    { ...record, targetLanguage: "ja" },
    { ...record, qrPrintAllowed: true },
  ]) assert(model.validatePublisherSentenceApprovalRecord(invalid).length > 0, "invalid sentence record must be rejected");
  console.log("PASS sentence approval requires exactly two distinct English targets, binds safe metadata, and remains release-blocked.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assertEmpty(errors, label) { if (errors.length > 0) throw new Error(`${label} failed: ${errors.join(" | ")}`); }
function assert(condition, message) { if (!condition) throw new Error(message); }
