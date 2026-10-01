import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { validatePilotPackageReviewEvidence } from "./pilot-package-review-evidence.mjs";

const args = parseArguments(process.argv.slice(2));
if (args.selfTest) {
  runSelfTest();
  process.exit(0);
}
if (!args.path) fail("Missing --path.");
let value;
try {
  if (!statSync(resolve(args.path)).isFile()) fail(`Package review evidence does not exist: ${resolve(args.path)}`);
  value = JSON.parse(readFileSync(resolve(args.path), "utf8"));
} catch (error) {
  fail(`Package review evidence must be readable JSON: ${error.message}`);
}
const errors = validatePilotPackageReviewEvidence(value);
if (args.json) console.log(JSON.stringify({ status: errors.length === 0 ? "passed" : "blocked", errors, sideEffect: "none", writesEnabled: false, studentActivationAllowed: false }, null, 2));
else console.log(errors.length === 0 ? "PASS pilot package review evidence is complete and review-only." : `BLOCK ${errors.join(" ")}`);
if (errors.length > 0) process.exit(1);

function parseArguments(values) {
  const result = { path: "", json: false, selfTest: false };
  for (let index = 0; index < values.length; index += 1) {
    if (values[index] === "--path") result.path = values[++index] ?? "";
    else if (values[index] === "--json") result.json = true;
    else if (values[index] === "--self-test") result.selfTest = true;
    else fail(`Unknown argument: ${values[index]}`);
  }
  return result;
}

function runSelfTest() {
  const valid = {
    recordVersion: 1, status: "reviewed", tenantId: "self-test", packageId: "self-test-package", unitKey: "series:book:L1:U1", reviewPacketId: "review-packet-1", reviewerId: "named-reviewer", reviewedAt: "2026-10-01T00:00:00.000Z", sourceInventoryChecksumSha256: `sha256:${"a".repeat(64)}`, packageChecksumSha256: `sha256:${"b".repeat(64)}`, gamePathwayIds: ["flashcards", "memory-match"], audioCoverage: "reviewed", accessibilityCoverage: "reviewed", rightsCoverage: "reviewed", reviewedLanes: ["content", "game", "audio", "video", "image", "font", "accessibility", "rights"].map((lane) => ({ lane, status: lane === "video" ? "not-applicable" : "reviewed", evidenceRefs: [`${lane}-review`] })), promotionAllowed: false, studentFacingActivationAllowed: false,
  };
  const validErrors = validatePilotPackageReviewEvidence(valid);
  if (validErrors.length > 0) fail(`valid fixture rejected: ${validErrors.join("; ")}`);
  const invalidErrors = validatePilotPackageReviewEvidence({ ...valid, promotionAllowed: true });
  if (!invalidErrors.some((error) => error.includes("promotionAllowed"))) fail("unsafe promotion fixture was accepted.");
  console.log("PASS pilot package review evidence validates all multimedia/game lanes and preserves review-only boundaries.");
}

function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }
