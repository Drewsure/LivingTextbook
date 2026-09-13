import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reviewPacketPath = join(root, "apps", "web", "src", "data", "samplePhaserCandidateContractReview.ts");
const snapshotRoot = process.env.LIVING_TEXTBOOK_ZAI_REVIEW_ROOT
  ? resolve(process.env.LIVING_TEXTBOOK_ZAI_REVIEW_ROOT)
  : resolve(root, "..", "zai-review", "ministar-lab-frozen-2026-09-12");
const packet = readFileSync(reviewPacketPath, "utf8");
const sourceSnapshotId = packet.match(/const sourceSnapshotId = "([^"]+)"/)?.[1];
const sourceCommitSha = packet.match(/const sourceCommitSha = "([^"]+)"/)?.[1];
const manifest = Array.from(
  packet.matchAll(/path:\s*"([^"]+)",\s*\n\s*sha256:\s*"([0-9a-f]{64})"/gi),
  (match) => ({ path: match[1], sha256: match[2].toLowerCase() }),
);

if (!sourceSnapshotId || !sourceCommitSha || !/^[0-9a-f]{40}$/i.test(sourceCommitSha)) {
  fail("Review packet is missing a valid source snapshot or 40-character commit SHA.");
}
if (manifest.length === 0) fail("Review packet contains no hashed source-file manifest.");
if (!existsSync(snapshotRoot)) {
  fail(`Frozen snapshot not found at ${snapshotRoot}. Set LIVING_TEXTBOOK_ZAI_REVIEW_ROOT to the isolated snapshot folder.`);
}

const mismatches = [];
const seenPaths = new Set();
for (const evidence of manifest) {
  if (seenPaths.has(evidence.path)) {
    mismatches.push(`${evidence.path}: source manifest path is repeated`);
    continue;
  }
  seenPaths.add(evidence.path);
  if (!isSafeReviewRelativePath(evidence.path)) {
    mismatches.push(`${evidence.path}: path must be a unique repository-relative POSIX path`);
    continue;
  }
  const filePath = resolve(snapshotRoot, evidence.path);
  const relativePath = relative(snapshotRoot, filePath);
  if (isAbsolute(evidence.path) || relativePath === ".." || relativePath.startsWith(".." + sep)) {
    mismatches.push(`${evidence.path}: path escapes the isolated snapshot`);
    continue;
  }
  if (!existsSync(filePath)) {
    mismatches.push(`${evidence.path}: file is missing`);
    continue;
  }
  const actual = createHash("sha256").update(readFileSync(filePath)).digest("hex");
  if (actual !== evidence.sha256) mismatches.push(`${evidence.path}: expected ${evidence.sha256}, found ${actual}`);
}

if (mismatches.length > 0) {
  fail(`Frozen Phaser source evidence does not match ${sourceSnapshotId}:\n${mismatches.map((item) => `- ${item}`).join("\n")}`);
}

console.log(`PASS ${manifest.length}/${manifest.length} frozen Phaser evidence hashes match ${sourceSnapshotId} (${sourceCommitSha}).`);

function isSafeReviewRelativePath(value) {
  return (
    typeof value === "string" &&
    value.trim() === value &&
    value.length > 0 &&
    !isAbsolute(value) &&
    !value.startsWith("\\") &&
    !value.includes("\\") &&
    !value.includes(":") &&
    !value.split("/").some((segment) => segment.length === 0 || segment === "." || segment === "..")
  );
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}
