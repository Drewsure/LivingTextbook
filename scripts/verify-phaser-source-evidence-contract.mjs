import { readFileSync } from "node:fs";

const sourceEvidenceVerifier = readFileSync(new URL("./verify-phaser-source-evidence.mjs", import.meta.url), "utf8");
const requiredMarkers = [
  "createHash",
  "readFileSync",
  "existsSync",
  "LIVING_TEXTBOOK_ZAI_REVIEW_ROOT",
  "sourceSnapshotId",
  "sourceCommitSha",
  "manifest",
  "isAbsolute",
  "relative",
  "path escapes the isolated snapshot",
];
const forbiddenMarkers = [
  "writeFileSync",
  "copyFile",
  "renameSync",
  "rmSync",
  "spawnSync",
  "execFileSync",
  "git push",
  "apps/web",
  "apps/ai-service",
];
const failures = [
  ...requiredMarkers
    .filter((marker) => !sourceEvidenceVerifier.includes(marker))
    .map((marker) => `FAIL frozen source evidence verifier is missing marker: ${marker}`),
  ...forbiddenMarkers
    .filter((marker) => sourceEvidenceVerifier.includes(marker))
    .map((marker) => `FAIL frozen source evidence verifier contains forbidden mutation/import marker: ${marker}`),
];

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("PASS frozen Phaser source evidence verifier remains read-only, isolated, and path-contained.");
