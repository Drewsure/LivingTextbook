import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-package-evidence-review-"));
const tsc = join(root, "node_modules", "typescript", "bin", "tsc");

try {
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--skipLibCheck",
    "--rootDir", join(root, "packages", "content-model", "src"),
    "--outDir", output,
    "packages/content-model/src/uploadQuarantinePackageEvidenceReview.ts",
  ], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const model = require(join(output, "uploadQuarantinePackageEvidenceReview.js"));
  const lanes = ["content", "game", "audio", "video", "image", "font", "accessibility", "rights"];
  const complete = model.createUploadQuarantinePackageEvidenceReview({
    tenantId: "sample-publisher",
    quarantineId: "q-123e4567-e89b-12d3-a456-426614174000",
    packageId: "sample-publisher-unit-1-package",
    sourceChecksumSha256: "a".repeat(64),
    reviewerId: "reviewer-1",
    reviewerNote: "Every pilot package lane was checked against a bounded review record.",
    reviewedLanes: lanes,
    evidenceReferences: lanes.map((lane) => ({ lane, referenceId: `review-${lane}-1`, origin: lane === "game" ? "platform-derived" : "publisher-asset" })),
    reviewedAt: "2026-09-30T00:00:00.000Z",
  });
  assertEmpty(model.validateUploadQuarantinePackageEvidenceReview(complete), "complete evidence with references");
  if (complete.status !== "reviewed-package-evidence") throw new Error("Complete evidence references must produce reviewed-package-evidence.");

  const missingReference = { ...complete, evidenceReferences: complete.evidenceReferences.filter((reference) => reference.lane !== "audio") };
  assertIncludes(model.validateUploadQuarantinePackageEvidenceReview(missingReference), "status does not match", "missing audio reference status");
  if (model.createUploadQuarantinePackageEvidenceReview({ ...complete, evidenceReferences: missingReference.evidenceReferences }).status !== "incomplete") {
    throw new Error("A missing evidence reference must keep the package review incomplete.");
  }
  if (complete.evidenceReferences.find((reference) => reference.lane === "game")?.origin !== "platform-derived") throw new Error("Game evidence must be marked platform-derived.");
  if (complete.evidenceReferences.find((reference) => reference.lane === "content")?.origin !== "publisher-asset") throw new Error("Content evidence must be marked publisher-asset.");
  assertIncludes(model.validateUploadQuarantinePackageEvidenceReview({ ...complete, evidenceReferences: complete.evidenceReferences.map((reference) => reference.lane === "game" ? { ...reference, origin: "unknown" } : reference) }), "safe lane and referenceId pairs", "unsupported evidence origin");
  assertIncludes(model.validateUploadQuarantinePackageEvidenceReview({ ...complete, evidenceReferences: complete.evidenceReferences.map((reference) => reference.lane === "game" ? { ...reference, origin: "publisher-asset" } : reference) }), "game evidence must be platform-derived", "publisher-owned game evidence");
  assertIncludes(model.validateUploadQuarantinePackageEvidenceReview({ ...complete, evidenceReferences: complete.evidenceReferences.map((reference) => reference.lane === "audio" ? { ...reference, origin: "platform-derived" } : reference) }), "audio evidence must be publisher-asset", "derived audio evidence");

  const unsafeReference = { ...complete, evidenceReferences: complete.evidenceReferences.map((reference) => reference.lane === "game" ? { ...reference, referenceId: "../game-record" } : reference) };
  assertIncludes(model.validateUploadQuarantinePackageEvidenceReview(unsafeReference), "safe lane and referenceId pairs", "unsafe evidence reference");

  const enabled = { ...complete, packageAssemblyAllowed: true };
  assertIncludes(model.validateUploadQuarantinePackageEvidenceReview(enabled), "packageAssemblyAllowed must remain false", "package assembly enablement");
  console.log("PASS package evidence references are lane-complete, bounded, deterministic, and remain release-blocked.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assertEmpty(errors, label) {
  if (errors.length > 0) throw new Error(`${label} failed: ${errors.join(" | ")}`);
}

function assertIncludes(errors, expected, label) {
  if (!errors.some((error) => error.includes(expected))) throw new Error(`${label} did not reject with ${expected}: ${errors.join(" | ")}`);
}
