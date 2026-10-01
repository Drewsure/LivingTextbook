import { statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const options = parseArguments(process.argv.slice(2));
const checks = [];

record("production-build", exists(join(root, "apps", "web", ".next", "BUILD_ID")) ? "proved" : "blocked", "apps/web/.next/BUILD_ID", "Run the production build before browser rehearsal.");
record("operator-handoff", exists(join(root, "scripts", "verify-local-package-operator-behavior.mjs")) ? "proved" : "blocked", "scripts/verify-local-package-operator-behavior.mjs", "Restore the closed-local operator behavior check.");
record("foundation-contracts", exists(join(root, "docs", "PILOT_ACCEPTANCE_MATRIX.md")) && exists(join(root, "docs", "PILOT_EXECUTION_RUNBOOK.md")) ? "proved" : "blocked", "pilot acceptance matrix and execution runbook", "Restore the pilot operating contracts.");

const publisherRoot = options.publisherRoot;
if (!publisherRoot) {
  record("publisher-source-package", "waiting-human", "no --publisher-root supplied", "Provide the real publisher Unit 1 folder, rights owner, and evidence lanes.");
} else {
  const publisherPath = resolve(publisherRoot);
  const hasIntake = exists(join(publisherPath, "publisher-pilot-intake.json"));
  const hasEvidence = exists(join(publisherPath, "evidence"));
  record("publisher-source-package", hasIntake && hasEvidence ? "proved" : "blocked", publisherPath, "Complete the publisher intake brief and evidence folder before source preflight.");
}

const candidateRoot = options.candidateRoot;
if (!candidateRoot) {
  record("zai-game-candidate", "waiting-human", "no --candidate-root supplied", "Request an isolated Z.ai candidate containing evidence/return-package.json.");
} else {
  const candidatePath = resolve(candidateRoot);
  const returnPackage = join(candidatePath, "evidence", "return-package.json");
  record("zai-game-candidate", exists(returnPackage) ? "proved" : "blocked", returnPackage, "Do not integrate the frozen snapshot; obtain the complete evidence return package.");
}

record("delivery-policy", "waiting-human", "not inferred from sample tenants", "Choose hosted PWA, closed-local companion, or hybrid and record retention, backup, and cost policy.");
record("release-authorization", "waiting-human", "not inferred from review previews", "Attach named human release approval, QR print authorization, rollback evidence, and final checksums.");

const summary = {
  status: checks.some((check) => check.status === "blocked") ? "blocked" : checks.some((check) => check.status === "waiting-human") ? "waiting-human" : "saleable-pilot-ready",
  saleable: checks.every((check) => check.status === "proved"),
  checks,
  nextActions: checks.filter((check) => check.status !== "proved").map((check) => check.nextAction),
};

if (options.json) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`First saleable white-label pilot audit: ${summary.status}`);
  for (const check of checks) console.log(`${formatStatus(check.status)} ${check.id}: ${check.evidence}`);
  if (summary.nextActions.length > 0) {
    console.log("Next human actions:");
    for (const action of summary.nextActions) console.log(`- ${action}`);
  }
}

if (!summary.saleable) process.exitCode = 2;

function record(id, status, evidence, nextAction) {
  checks.push({ id, status, evidence, nextAction });
}

function exists(path) {
  try { return statSync(path).isFile() || statSync(path).isDirectory(); } catch { return false; }
}

function formatStatus(status) {
  return status === "proved" ? "PASS" : status === "waiting-human" ? "WAIT" : "BLOCK";
}

function parseArguments(args) {
  const result = {
    json: false,
    publisherRoot: process.env.LIVING_TEXTBOOOK_PUBLISHER_ROOT?.trim() || "",
    candidateRoot: process.env.LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT?.trim() || "",
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json") result.json = true;
    else if (arg === "--publisher-root") result.publisherRoot = args[++index] ?? "";
    else if (arg === "--candidate-root") result.candidateRoot = args[++index] ?? "";
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/audit-first-saleable-pilot.mjs [--json] [--publisher-root <folder>] [--candidate-root <folder>]\n\nAudits platform proof separately from real publisher, Z.ai, delivery-policy, and human-release evidence. Exit code 2 means the pilot is not yet saleable.");
      process.exit(0);
    } else {
      console.error(`ERROR Unknown argument: ${arg}`);
      process.exit(2);
    }
  }
  return result;
}
