import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const repositoryRoot = resolve(process.cwd());
const webRoot = resolve(repositoryRoot, "apps", "web");
const nextRoot = join(webRoot, ".next");
const buildIdPath = join(nextRoot, "BUILD_ID");
const proofPath = join(nextRoot, "living-textbook-build-proof.json");
const failures = [];

if (!existsSync(buildIdPath)) failures.push("missing apps/web/.next/BUILD_ID");
if (!existsSync(proofPath)) failures.push("missing apps/web/.next/living-textbook-build-proof.json");

const buildId = existsSync(buildIdPath) ? readFileSync(buildIdPath, "utf8").trim() : "";
let proof;
if (existsSync(proofPath)) {
  try {
    proof = JSON.parse(readFileSync(proofPath, "utf8"));
  } catch (error) {
    failures.push(`build proof is not valid JSON: ${error.message}`);
  }
}

const currentRevision = resolveCurrentRevision(repositoryRoot);
if (!proof || typeof proof !== "object" || Array.isArray(proof)) {
  failures.push("build proof must be a JSON object");
} else {
  if (proof.proofVersion !== 1) failures.push("build proof version must be 1");
  if (typeof proof.sourceRevision !== "string" || proof.sourceRevision.trim().length === 0) failures.push("build proof sourceRevision is required");
  if (currentRevision && proof.sourceRevision !== currentRevision) failures.push(`build proof sourceRevision ${proof.sourceRevision} does not match current HEAD ${currentRevision}`);
  if (typeof proof.buildId !== "string" || proof.buildId.trim().length === 0) failures.push("build proof buildId is required");
  if (proof.buildId !== buildId) failures.push("build proof buildId does not match .next/BUILD_ID");
  if (typeof proof.builtAt !== "string" || !Number.isFinite(Date.parse(proof.builtAt))) failures.push("build proof builtAt must be a valid timestamp");
  if (proof.command !== "next build --webpack") failures.push("build proof command must identify the webpack production build");
}

if (existsSync(proofPath) && existsSync(buildIdPath) && statSync(proofPath).mtimeMs < statSync(buildIdPath).mtimeMs) {
  failures.push("build proof must be written after .next/BUILD_ID");
}

const result = {
  status: failures.length === 0 ? "proved" : "blocked",
  buildId: buildId || undefined,
  sourceRevision: proof?.sourceRevision,
  currentRevision: currentRevision || undefined,
  proofPath: "apps/web/.next/living-textbook-build-proof.json",
  failures,
};

if (process.argv.includes("--json")) console.log(JSON.stringify(result, null, 2));
else if (failures.length === 0) console.log(`PASS production build proof matches current source revision ${proof.sourceRevision}.`);
else console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));

if (failures.length > 0) process.exitCode = 1;

function resolveCurrentRevision(root) {
  try {
    return execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}
