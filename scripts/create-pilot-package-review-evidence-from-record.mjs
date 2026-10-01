import { access, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { validatePilotPackageReviewEvidence } from "./pilot-package-review-evidence.mjs";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  console.log("Usage: node scripts/create-pilot-package-review-evidence-from-record.mjs --source-preflight <path> --package-review <path> --output <path> --unit-key <key> --package-checksum <sha256:...> --game-pathway <id>");
  process.exit(0);
}
if (options.selfTest) {
  await runSelfTest();
  process.exit(0);
}
for (const name of ["sourcePreflight", "packageReview", "output", "unitKey", "packageChecksum"]) if (!options[name]) fail(`Missing --${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}.`);
if (options.gamePathways.length === 0) fail("Provide at least one --game-pathway.");

const sourcePreflight = await readJson(options.sourcePreflight, "publisher-source-preflight.json");
const packageReview = await readJson(options.packageReview, "package evidence review record");
if (sourcePreflight.inventoryStatus !== "complete") fail("Publisher source preflight must be complete before package review evidence can be derived.");
if (packageReview.status !== "reviewed-package-evidence") fail("Package evidence review must be complete before external package review evidence can be derived.");
if (packageReview.tenantId !== sourcePreflight.tenantId || packageReview.packageId !== sourcePreflight.packageId) fail("Package evidence review and source preflight identities must match.");
if (packageReview.sourceChecksumSha256 !== String(sourcePreflight.inventoryChecksumSha256).replace(/^sha256:/, "")) fail("Package evidence review source checksum must match source preflight inventory checksum.");
if (!/^sha256:[0-9a-f]{64}$/i.test(options.packageChecksum)) fail("Package checksum must use sha256:<64 hexadecimal characters> format.");

const review = {
  recordVersion: 1,
  status: "reviewed",
  tenantId: sourcePreflight.tenantId,
  packageId: sourcePreflight.packageId,
  unitKey: options.unitKey,
  reviewPacketId: packageReview.reviewId,
  reviewerId: packageReview.reviewerId,
  reviewedAt: packageReview.reviewedAt,
  sourceInventoryChecksumSha256: sourcePreflight.inventoryChecksumSha256,
  packageChecksumSha256: options.packageChecksum,
  gamePathwayIds: options.gamePathways,
  audioCoverage: packageReview.reviewedLanes.includes("audio") ? "reviewed" : "missing",
  accessibilityCoverage: packageReview.reviewedLanes.includes("accessibility") ? "reviewed" : "missing",
  rightsCoverage: packageReview.reviewedLanes.includes("rights") ? "reviewed" : "missing",
  reviewedLanes: packageReview.evidenceReferences.map((reference) => ({
    lane: reference.lane,
    status: "reviewed",
    evidenceRefs: [reference.referenceId],
  })),
  promotionAllowed: false,
  studentFacingActivationAllowed: false,
};
const errors = validatePilotPackageReviewEvidence(review);
if (errors.length > 0) fail(`Derived package review evidence is invalid: ${errors.join("; ")}`);
try {
  await writeFile(resolve(options.output), `${JSON.stringify(review, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
} catch (error) {
  fail(`Refusing to overwrite package review evidence at ${resolve(options.output)}: ${error.message}`);
}
console.log(JSON.stringify({ output: resolve(options.output), tenantId: review.tenantId, packageId: review.packageId, sourceInventoryChecksumSha256: review.sourceInventoryChecksumSha256, packageChecksumSha256: review.packageChecksumSha256, reviewOnly: true, writesEnabled: false, studentFacingActivationAllowed: false }, null, 2));

function parseArguments(args) {
  const result = { sourcePreflight: "", packageReview: "", output: "", unitKey: "", packageChecksum: "", gamePathways: [], help: false, selfTest: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--source-preflight") result.sourcePreflight = args[++index] ?? "";
    else if (arg === "--package-review") result.packageReview = args[++index] ?? "";
    else if (arg === "--output") result.output = args[++index] ?? "";
    else if (arg === "--unit-key") result.unitKey = args[++index] ?? "";
    else if (arg === "--package-checksum") result.packageChecksum = args[++index] ?? "";
    else if (arg === "--game-pathway") result.gamePathways.push(args[++index] ?? "");
    else if (arg === "--self-test") result.selfTest = true;
    else if (arg === "--help" || arg === "-h") result.help = true;
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

async function readJson(path, label) {
  try {
    await access(resolve(path));
    return JSON.parse(await readFile(resolve(path), "utf8"));
  } catch (error) {
    fail(`${label} must be readable JSON: ${error.message}`);
  }
}

function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }

async function runSelfTest() {
  const directory = await mkdtemp(join(tmpdir(), "living-textbook-package-review-bridge-"));
  try {
    const sourcePath = join(directory, "publisher-source-preflight.json");
    const reviewPath = join(directory, "package-evidence-review.json");
    const outputPath = join(directory, "package-review-evidence.json");
    await writeFile(sourcePath, JSON.stringify({ inventoryStatus: "complete", tenantId: "self-test", packageId: "self-test-package", unitKey: "series:book:L1:U1", inventoryChecksumSha256: `sha256:${"a".repeat(64)}` }));
    await writeFile(reviewPath, JSON.stringify({ status: "reviewed-package-evidence", tenantId: "self-test", packageId: "self-test-package", unitKey: "series:book:L1:U1", reviewId: "review-1", reviewerId: "reviewer-1", reviewedAt: "2026-10-01T00:00:00.000Z", sourceChecksumSha256: "a".repeat(64), reviewedLanes: ["content", "game", "audio", "video", "image", "font", "accessibility", "rights"], evidenceReferences: ["content", "game", "audio", "video", "image", "font", "accessibility", "rights"].map((lane) => ({ lane, referenceId: `${lane}-review` })) }));
    const result = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--source-preflight", sourcePath, "--package-review", reviewPath, "--output", outputPath, "--unit-key", "series:book:L1:U1", "--package-checksum", `sha256:${"b".repeat(64)}`, "--game-pathway", "flashcards", "--game-pathway", "memory-match"], { encoding: "utf8" });
    if (result.status !== 0 || !result.stdout.includes('"reviewOnly": true')) fail(`bridge self-test failed: ${result.stderr || result.stdout}`);
    const overwrite = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--source-preflight", sourcePath, "--package-review", reviewPath, "--output", outputPath, "--unit-key", "series:book:L1:U1", "--package-checksum", `sha256:${"b".repeat(64)}`, "--game-pathway", "flashcards"], { encoding: "utf8" });
    if (overwrite.status === 0 || !overwrite.stderr.includes("Refusing to overwrite")) fail("bridge self-test allowed an overwrite.");
    await writeFile(reviewPath, JSON.stringify({ status: "reviewed-package-evidence", tenantId: "self-test", packageId: "self-test-package", reviewId: "review-1", reviewerId: "reviewer-1", reviewedAt: "2026-10-01T00:00:00.000Z", sourceChecksumSha256: "c".repeat(64), reviewedLanes: ["content"], evidenceReferences: [{ lane: "content", referenceId: "content-review" }] }));
    const checksumDrift = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--source-preflight", sourcePath, "--package-review", reviewPath, "--output", join(directory, "checksum-drift.json"), "--unit-key", "series:book:L1:U1", "--package-checksum", `sha256:${"b".repeat(64)}`, "--game-pathway", "flashcards"], { encoding: "utf8" });
    if (checksumDrift.status === 0 || !checksumDrift.stderr.includes("source checksum must match")) fail("bridge self-test allowed source checksum drift.");
    const incomplete = JSON.parse(await readFile(reviewPath, "utf8"));
    incomplete.status = "incomplete";
    await writeFile(reviewPath, JSON.stringify(incomplete));
    const incompleteReview = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--source-preflight", sourcePath, "--package-review", reviewPath, "--output", join(directory, "incomplete-review.json"), "--unit-key", "series:book:L1:U1", "--package-checksum", `sha256:${"b".repeat(64)}`, "--game-pathway", "flashcards"], { encoding: "utf8" });
    if (incompleteReview.status === 0 || !incompleteReview.stderr.includes("must be complete")) fail("bridge self-test allowed an incomplete package review.");
    console.log("PASS package review evidence bridge derives checksum-bound external metadata without activation.");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
