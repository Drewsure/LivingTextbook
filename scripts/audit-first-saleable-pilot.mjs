import { mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const options = parseArguments(process.argv.slice(2));
if (options.selfTest) runSelfTest();
const checks = [];

const productionBuildVerification = runNodeScript("verify-production-build-proof.mjs", ["--json"]);
const productionBuildReport = parseJsonOutput(productionBuildVerification.stdout);
record(
  "production-build",
  productionBuildVerification.passed && productionBuildReport?.status === "proved" ? "proved" : "blocked",
  productionBuildReport?.proofPath ?? "apps/web/.next/living-textbook-build-proof.json",
  "Run the current webpack production build before browser rehearsal; stale build output cannot prove pilot readiness.",
);
record("operator-handoff", exists(join(root, "scripts", "verify-local-package-operator-behavior.mjs")) ? "proved" : "blocked", "scripts/verify-local-package-operator-behavior.mjs", "Restore the closed-local operator behavior check.");
record("foundation-contracts", exists(join(root, "docs", "PILOT_ACCEPTANCE_MATRIX.md")) && exists(join(root, "docs", "PILOT_EXECUTION_RUNBOOK.md")) ? "proved" : "blocked", "pilot acceptance matrix and execution runbook", "Restore the pilot operating contracts.");

const publisherRoot = options.publisherRoot;
if (!publisherRoot) {
  record("publisher-source-package", "waiting-human", "no --publisher-root supplied", "Provide the real publisher Unit 1 folder, rights owner, and evidence lanes.");
} else {
  const publisherPath = resolve(publisherRoot);
  if (isWithinRepository(publisherPath)) {
    record(
      "publisher-source-package",
      "blocked",
      publisherPath,
      "Keep the real publisher handoff outside the LivingTextbook repository; sample/reference files cannot prove saleability.",
    );
  } else {
    const hasIntake = exists(join(publisherPath, "publisher-pilot-intake.json"));
    const hasEvidence = exists(join(publisherPath, "evidence"));
    const preflightEvidencePath = join(publisherPath, "evidence", "publisher-intake-preflight.json");
    if (!hasIntake || !hasEvidence) {
      record("publisher-source-package", "blocked", publisherPath, "Complete the publisher intake brief and evidence folder before source preflight.");
    } else if (!exists(preflightEvidencePath)) {
      record(
        "publisher-source-package",
        "blocked",
        preflightEvidencePath,
        "Run the canonical intake preflight with --output evidence/publisher-intake-preflight.json and preserve the create-once report with the publisher handoff.",
      );
    } else {
      const verification = runNodeScript("publisher-pilot-intake-preflight.mjs", ["--root", publisherPath]);
      const evidenceErrors = validatePublisherPreflightEvidence(publisherPath, preflightEvidencePath);
      record(
        "publisher-source-package",
        verification.passed && evidenceErrors.length === 0 ? "proved" : "blocked",
        `${publisherPath} (canonical preflight: ${verification.passed ? "passed" : "failed"}; durable evidence: ${evidenceErrors.length === 0 ? "bound" : "invalid"})`,
        evidenceErrors.length > 0 ? evidenceErrors[0] : "Fix the publisher intake preflight findings before source review can advance.",
      );
    }
  }
}

const candidateRoot = options.candidateRoot;
if (!candidateRoot) {
  record("zai-game-candidate", "waiting-human", "no --candidate-root supplied", "Request an isolated Z.ai candidate containing evidence/return-package.json.");
} else {
  const candidateInputPath = resolve(candidateRoot);
  const candidateResolution = resolveCandidateRoot(candidateInputPath);
  if (!candidateResolution.root) {
    record("zai-game-candidate", "blocked", candidateResolution.evidence, candidateResolution.nextAction);
  } else {
    const candidatePath = candidateResolution.root;
    const returnPackage = join(candidatePath, "evidence", "return-package.json");
    const verification = runNodeScript("verify-phaser-candidate-package.mjs", [], {
      LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT: candidatePath,
    });
    record(
      "zai-game-candidate",
      verification.passed ? "proved" : "blocked",
      `${returnPackage}${candidateResolution.discovered ? ` (discovered from ${candidateInputPath})` : ""} (canonical evidence verifier: ${verification.passed ? "passed" : "failed"})`,
      "Fix the Z.ai evidence return package findings before any mapping or integration review.",
    );
  }
}

const humanEvidenceRoot = options.humanEvidenceRoot;
if (!humanEvidenceRoot) {
  record("delivery-policy", "waiting-human", "no --human-evidence-root supplied", "Choose hosted PWA, closed-local companion, or hybrid and record retention, backup, and cost policy.");
  record("release-authorization", "waiting-human", "no --human-evidence-root supplied", "Attach named human release approval, QR print authorization, rollback evidence, and final checksums.");
} else {
  const humanEvidencePath = resolve(humanEvidenceRoot);
  if (!exists(humanEvidencePath)) {
    record("delivery-policy", "blocked", humanEvidencePath, "Provide the external human evidence folder with delivery-policy.json and release-authorization.json.");
    record("release-authorization", "blocked", humanEvidencePath, "Provide the external human evidence folder with delivery-policy.json and release-authorization.json.");
  } else {
    const verifierArgs = ["--root", humanEvidencePath, "--json"];
    if (publisherRoot) verifierArgs.push("--publisher-root", resolve(publisherRoot));
    const verification = runNodeScript("verify-pilot-human-evidence.mjs", verifierArgs);
    const report = parseJsonOutput(verification.stdout);
    const identityValid = report?.checks?.identityBinding === "proved";
    record(
      "delivery-policy",
      report?.checks?.deliveryPolicy === "proved" && identityValid ? "proved" : "blocked",
      `${humanEvidencePath} (human evidence verifier: ${report?.checks?.deliveryPolicy === "proved" && identityValid ? "passed" : "failed"})`,
      "Fix the delivery policy and tenant/package/unit identity binding before the selected delivery path can advance.",
    );
    record(
      "release-authorization",
      report?.checks?.releaseAuthorization === "proved" && identityValid ? "proved" : "blocked",
      `${humanEvidencePath} (human evidence verifier: ${report?.checks?.releaseAuthorization === "proved" && identityValid ? "passed" : "failed"})`,
      "Fix the release authorization, QR print, rehearsal, rollback, checksum, and identity evidence before release.",
    );
  }
}

const summary = {
  reportVersion: 1,
  auditTool: "first-saleable-pilot",
  generatedAt: new Date().toISOString(),
  sourceRevision: productionBuildReport?.sourceRevision ?? null,
  status: checks.some((check) => check.status === "blocked") ? "blocked" : checks.some((check) => check.status === "waiting-human") ? "waiting-human" : "saleable-pilot-ready",
  saleable: checks.every((check) => check.status === "proved"),
  checks,
  nextActions: checks.filter((check) => check.status !== "proved").map((check) => check.nextAction),
};

if (options.output) writeAuditReport(options.output, summary);

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

function isWithinRepository(path) {
  const repositoryPath = safeRealPath(root);
  const candidatePath = safeRealPath(path);
  const pathRelative = relative(repositoryPath, candidatePath);
  return pathRelative === "" || (pathRelative !== ".." && !pathRelative.startsWith("..\\") && !pathRelative.startsWith("../") && !pathRelative.includes(":"));
}

function safeRealPath(path) {
  try { return realpathSync(path); } catch { return resolve(path); }
}

function validatePublisherPreflightEvidence(publisherPath, evidencePath) {
  let evidence;
  let briefSource;
  try {
    evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    briefSource = readFileSync(join(publisherPath, "publisher-pilot-intake.json"), "utf8");
  } catch (error) {
    return [`Cannot read durable publisher preflight evidence: ${error.message}`];
  }
  const errors = [];
  if (evidence.reportVersion !== 1) errors.push("Durable publisher preflight evidence must use reportVersion 1.");
  if (evidence.inventoryStatus !== "complete") errors.push("Durable publisher preflight evidence must record inventoryStatus complete.");
  if (evidence.briefChecksumSha256 !== sha256(briefSource)) errors.push("Durable publisher preflight evidence does not match the current intake brief checksum.");
  for (const key of ["missingFiles", "unsafePaths", "placeholderFields", "structuralErrors"]) {
    if (!Array.isArray(evidence[key]) || evidence[key].length > 0) errors.push(`Durable publisher preflight evidence has unresolved ${key}.`);
  }
  if (evidence.reviewOnly !== true || evidence.packageAssemblyAllowed !== false || evidence.studentFacingUseAllowed !== false) {
    errors.push("Durable publisher preflight evidence must preserve review-only protected actions.");
  }
  return errors;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function resolveCandidateRoot(inputPath) {
  const directReturnPackage = join(inputPath, "evidence", "return-package.json");
  if (exists(directReturnPackage)) return { root: inputPath, discovered: false, evidence: directReturnPackage };
  if (!exists(inputPath)) {
    return {
      root: "",
      evidence: inputPath,
      nextAction: "Provide an extracted Z.ai candidate folder containing evidence/return-package.json.",
    };
  }

  const matches = [];
  collectReturnPackages(inputPath, matches);
  if (matches.length === 1) {
    return { root: matches[0], discovered: true, evidence: join(matches[0], "evidence", "return-package.json") };
  }
  if (matches.length > 1) {
    return {
      root: "",
      evidence: `${inputPath} (${matches.length} nested evidence/return-package.json files)`,
      nextAction: "Pass the exact isolated candidate folder; the audit will not guess between multiple returned packages.",
    };
  }
  return {
    root: "",
    evidence: join(inputPath, "evidence", "return-package.json"),
    nextAction: "Do not integrate the frozen snapshot; obtain the complete evidence return package.",
  };
}

function collectReturnPackages(directory, matches) {
  let entries;
  try { entries = readdirSync(directory, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "evidence" && exists(join(entryPath, "return-package.json"))) matches.push(directory);
      else collectReturnPackages(entryPath, matches);
    }
  }
}

function formatStatus(status) {
  return status === "proved" ? "PASS" : status === "waiting-human" ? "WAIT" : "BLOCK";
}

function runNodeScript(scriptName, args, environment = {}) {
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(new URL(`./${scriptName}`, import.meta.url)), ...args],
    {
      encoding: "utf8",
      env: { ...process.env, ...environment },
      maxBuffer: 2 * 1024 * 1024,
    },
  );
  return { passed: result.status === 0 && !result.error, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function parseJsonOutput(value) {
  try { return JSON.parse(String(value).trim()); } catch { return undefined; }
}

function parseArguments(args) {
  const result = {
    json: false,
    output: "",
    selfTest: false,
    publisherRoot: process.env.LIVING_TEXTBOOOK_PUBLISHER_ROOT?.trim() || "",
    candidateRoot: process.env.LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT?.trim() || "",
    humanEvidenceRoot: process.env.LIVING_TEXTBOOOK_PILOT_HUMAN_EVIDENCE_ROOT?.trim() || "",
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json") result.json = true;
    else if (arg === "--output") result.output = args[++index] ?? "";
    else if (arg === "--self-test") result.selfTest = true;
    else if (arg === "--publisher-root") result.publisherRoot = args[++index] ?? "";
    else if (arg === "--candidate-root") result.candidateRoot = args[++index] ?? "";
    else if (arg === "--human-evidence-root") result.humanEvidenceRoot = args[++index] ?? "";
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/audit-first-saleable-pilot.mjs [--json] [--output <external-report.json>] [--self-test] [--publisher-root <folder>] [--candidate-root <folder>] [--human-evidence-root <folder>]\n\nAudits platform proof separately from real publisher, Z.ai, delivery-policy, and human-release evidence. Exit code 2 means the pilot is not yet saleable.");
      process.exit(0);
    } else {
      console.error(`ERROR Unknown argument: ${arg}`);
      process.exit(2);
    }
  }
  return result;
}

function writeAuditReport(output, report) {
  const outputPath = resolve(output);
  if (isWithinRepository(outputPath)) {
    console.error("ERROR Audit reports must be written outside the LivingTextbook repository.");
    process.exit(2);
  }
  try {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  } catch (error) {
    console.error(`ERROR Cannot write create-once audit report: ${error.message}`);
    process.exit(2);
  }
  console.error(`Audit report written once to ${outputPath}`);
}

function runSelfTest() {
  const outerRoot = mkdtempSync(join(tmpdir(), "living-textbook-pilot-audit-"));
  try {
    const candidateRoot = join(outerRoot, "single-candidate");
    mkdirSync(join(candidateRoot, "evidence"), { recursive: true });
    writeFileSync(join(candidateRoot, "evidence", "return-package.json"), "{}", { encoding: "utf8" });
    const discovered = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--json", "--candidate-root", outerRoot], { encoding: "utf8" });
    const discoveredReport = parseJsonOutput(discovered.stdout);
    const discoveredCheck = discoveredReport?.checks?.find((check) => check.id === "zai-game-candidate");
    if (!discoveredCheck?.evidence?.includes("discovered from")) failSelfTest("single nested candidate was not discovered");

    const secondCandidateRoot = join(outerRoot, "second-candidate");
    mkdirSync(join(secondCandidateRoot, "evidence"), { recursive: true });
    writeFileSync(join(secondCandidateRoot, "evidence", "return-package.json"), "{}", { encoding: "utf8" });
    const ambiguous = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--json", "--candidate-root", outerRoot], { encoding: "utf8" });
    const ambiguousReport = parseJsonOutput(ambiguous.stdout);
    const ambiguousCheck = ambiguousReport?.checks?.find((check) => check.id === "zai-game-candidate");
    if (ambiguousCheck?.status !== "blocked" || !ambiguousCheck.nextAction?.includes("exact isolated candidate folder")) failSelfTest("ambiguous candidates were not blocked");
    const inRepository = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--json", "--publisher-root", root], { encoding: "utf8" });
    const inRepositoryReport = parseJsonOutput(inRepository.stdout);
    const publisherCheck = inRepositoryReport?.checks?.find((check) => check.id === "publisher-source-package");
    if (publisherCheck?.status !== "blocked" || !publisherCheck.nextAction?.includes("outside the LivingTextbook repository")) failSelfTest("in-repository publisher roots were not blocked");

    const publisherRoot = join(outerRoot, "publisher-input");
    const generated = spawnSync(process.execPath, [fileURLToPath(new URL("./create-publisher-pilot-intake-kit.mjs", import.meta.url)), "--root", publisherRoot, "--tenant-id", "self-test-publisher", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1"], { encoding: "utf8" });
    if (generated.status !== 0) failSelfTest(`publisher kit generation failed: ${generated.stderr}`);
    const briefPath = join(publisherRoot, "publisher-pilot-intake.json");
    const brief = JSON.parse(readFileSync(briefPath, "utf8"));
    for (const key of ["seriesName", "edition", "version", "sourceOwner", "retentionPolicy", "reportingPolicy"]) brief[key] = `confirmed-${key}`;
    brief.qrPageReferences = ["page-1"];
    brief.qrReferences = [{ referenceId: "unit-1-entry", pageReference: "page-1", unitId: "unit-1", activitySlug: "unit-1-entry", targetType: "unit-launch", language: "en" }];
    writeFileSync(briefPath, `${JSON.stringify(brief, null, 2)}\n`, { encoding: "utf8" });
    const declaredFiles = [...brief.sourceFiles, ...brief.mediaRequests.map((request) => request.relativePath), ...brief.evidenceRequests.map((request) => request.relativePath)];
    for (const relativePath of declaredFiles) {
      mkdirSync(join(publisherRoot, relativePath, ".."), { recursive: true });
      writeFileSync(join(publisherRoot, relativePath), "self-test", { encoding: "utf8" });
    }
    const preflightOutput = join(publisherRoot, "evidence", "publisher-intake-preflight.json");
    const preflight = spawnSync(process.execPath, [fileURLToPath(new URL("./publisher-pilot-intake-preflight.mjs", import.meta.url)), "--root", publisherRoot, "--output", preflightOutput], { encoding: "utf8" });
    if (preflight.status !== 0) failSelfTest(`publisher preflight evidence generation failed: ${preflight.stderr || preflight.stdout}`);
    const validPublisherReport = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--json", "--publisher-root", publisherRoot], { encoding: "utf8" });
    const validPublisherCheck = parseJsonOutput(validPublisherReport.stdout)?.checks?.find((check) => check.id === "publisher-source-package");
    if (validPublisherCheck?.status !== "proved") failSelfTest("checksum-bound publisher preflight evidence was not accepted");
    writeFileSync(briefPath, `${JSON.stringify({ ...brief, edition: "changed-after-preflight" }, null, 2)}\n`, { encoding: "utf8" });
    const stalePublisherReport = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--json", "--publisher-root", publisherRoot], { encoding: "utf8" });
    const stalePublisherCheck = parseJsonOutput(stalePublisherReport.stdout)?.checks?.find((check) => check.id === "publisher-source-package");
    if (stalePublisherCheck?.status !== "blocked" || !stalePublisherCheck.nextAction?.includes("checksum")) failSelfTest("stale publisher preflight evidence was not blocked");

    const auditOutput = join(outerRoot, "operator-review", "first-pilot-audit.json");
    const exportedAudit = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--json", "--output", auditOutput], { encoding: "utf8" });
    const exportedReport = parseJsonOutput(exportedAudit.stdout);
    if (exportedAudit.status !== 2 || exportedReport?.reportVersion !== 1 || exportedReport?.auditTool !== "first-saleable-pilot" || !exists(auditOutput)) failSelfTest("external create-once audit report was not written with identity metadata");
    const overwriteAudit = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--json", "--output", auditOutput], { encoding: "utf8" });
    if (overwriteAudit.status === 0) failSelfTest("audit report export allowed an overwrite");
    const inRepositoryOutput = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--json", "--output", join(root, "audit-self-test.json")], { encoding: "utf8" });
    if (inRepositoryOutput.status === 0 || !inRepositoryOutput.stderr.includes("outside the LivingTextbook repository")) failSelfTest("in-repository audit report output was not blocked");
    console.log("PASS pilot saleability audit discovers one nested candidate, rejects ambiguity, blocks in-repository publisher roots, requires checksum-bound publisher preflight evidence, and exports a create-once external report.");
  } finally {
    rmSync(outerRoot, { recursive: true, force: true });
  }
  process.exit(0);
}

function failSelfTest(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}
