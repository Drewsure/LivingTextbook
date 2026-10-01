import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const webRoot = resolve(process.cwd());
const nextRoot = join(webRoot, ".next");
const buildIdPath = join(nextRoot, "BUILD_ID");
const proofPath = join(nextRoot, "living-textbook-build-proof.json");

const buildId = readFileSync(buildIdPath, "utf8").trim();
if (!buildId) {
  console.error("FAIL Cannot write production build proof: .next/BUILD_ID is empty.");
  process.exit(1);
}

const sourceRevision = resolveSourceRevision(webRoot);
if (!sourceRevision) {
  console.error("FAIL Cannot write production build proof: source revision is unavailable.");
  process.exit(1);
}

const proof = {
  proofVersion: 1,
  sourceRevision,
  buildId,
  builtAt: new Date().toISOString(),
  command: "next build --webpack",
};

mkdirSync(dirname(proofPath), { recursive: true });
writeFileSync(proofPath, `${JSON.stringify(proof, null, 2)}\n`, "utf8");
console.log(`PASS wrote source-bound production build proof for ${sourceRevision}.`);

function resolveSourceRevision(cwd) {
  for (const variable of ["LIVING_TEXTBOOOK_BUILD_REVISION", "GITHUB_SHA", "VERCEL_GIT_COMMIT_SHA"]) {
    const value = process.env[variable]?.trim();
    if (value) return value;
  }

  try {
    return execFileSync("git", ["-C", cwd, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}
