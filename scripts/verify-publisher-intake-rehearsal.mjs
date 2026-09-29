import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const host = "127.0.0.1";
const token = "publisher-intake-rehearsal-token";
const quarantineRoot = mkdtempSync(resolve(tmpdir(), "living-textbook-publisher-intake-"));
const port = await findFreePort();
const baseUrl = `http://${host}:${port}`;
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const previewCommand = process.platform === "win32" ? process.env.ComSpec ?? "cmd.exe" : npmCommand;
const previewArgs = process.platform === "win32"
  ? ["/d", "/s", "/c", `${npmCommand} run start --workspace @living-textbook/web -- --hostname ${host} --port ${port}`]
  : ["run", "start", "--workspace", "@living-textbook/web", "--", "--hostname", host, "--port", String(port)];

const preview = spawn(previewCommand, previewArgs, {
  cwd: repoRoot,
  env: {
    ...process.env,
    LIVING_TEXTBOOOK_REVIEW_UPLOADS_ENABLED: "true",
    LIVING_TEXTBOOOK_EVIDENCE_REVIEWS_ENABLED: "true",
    LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED: "true",
    LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED: "true",
    LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN: token,
    LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ROOT: quarantineRoot,
  },
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});

let previewOutput = "";
preview.stdout.on("data", (chunk) => { previewOutput += chunk.toString(); });
preview.stderr.on("data", (chunk) => { previewOutput += chunk.toString(); });

try {
  await waitForPreview(baseUrl, preview);
  const headers = { authorization: `Bearer ${token}` };

  const intakeStatus = await requestJson(`${baseUrl}/api/teacher/uploads/intake`);
  assert(intakeStatus.status === "review-only-quarantine-intake", "intake must expose the explicitly enabled review-only mode");

  const form = new FormData();
  form.set("tenantId", "sample-publisher");
  form.set("channelId", "source-pdf-text-upload");
  form.set("unitKey", "sample-publisher:partner-textbook-companion:L1:U1");
  form.set("file", new Blob(["Publisher Unit 1 rehearsal source"], { type: "application/pdf" }), "partner-unit-1.pdf");
  const intakeResponse = await fetch(`${baseUrl}/api/teacher/uploads/intake`, { method: "POST", headers, body: form });
  const intake = await readJson(intakeResponse);
  assert(intakeResponse.status === 201 && intake.status === "accepted-quarantine", "publisher source must enter quarantine through the real intake route");
  assert(typeof intake.quarantineId === "string" && intake.record?.studentFacingUseAllowed === false, "quarantine intake must return an opaque id and block student use");

  const quarantineId = intake.quarantineId;
  const query = `tenantId=sample-publisher&quarantineId=${encodeURIComponent(quarantineId)}&packageId=sample-publisher-l1-u1-routines-package`;
  const handoff = await requestJson(`${baseUrl}/api/teacher/uploads/package-handoff-preview?${query}`, headers);
  assert(handoff.status === "review-only" && handoff.handoff?.writeAllowed === false, "handoff must remain metadata-only");
  assert(handoff.handoff?.checksumSha256 === intake.record.checksumSha256, "handoff must preserve the intake checksum");

  const firstBinding = await requestJson(`${baseUrl}/api/teacher/uploads/package-readiness-binding?${query}`, headers);
  assert(firstBinding.status === "review-only" && firstBinding.binding?.status === "blocked", "live readiness must begin blocked");
  assert(firstBinding.binding?.checks.some((check) => check.checkId === "package-preview" && check.status === "blocked"), "missing package preview must be explicit");
  assert(firstBinding.binding?.packageAssemblyAllowed === false && firstBinding.binding?.studentFacingUseAllowed === false, "live readiness must block assembly and student use");

  const evidenceReviewResponse = await fetch(`${baseUrl}/api/teacher/uploads/evidence-review`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({
      tenantId: "sample-publisher",
      quarantineId,
      packageId: "sample-publisher-l1-u1-routines-package",
      reviewerId: "publisher-intake-reviewer",
      reviewerNote: "Synthetic evidence review for the controlled pilot rehearsal.",
      reviewedFields: ["Security scan evidence", "Publisher rights evidence", "Source and unit mapping", "Accessibility and transcript evidence", "Package readiness evidence", "Release-control evidence"],
      scanStatus: "passed",
      rightsStatus: "partner-provided",
      sourceReviewStatus: "approved",
      targetMappingReviewed: true,
      accessibilityReviewed: true,
      releaseApproved: true,
    }),
  });
  const evidenceReview = await readJson(evidenceReviewResponse);
  assert(evidenceReviewResponse.status === 200 && evidenceReview.status === "recorded-review-only" && evidenceReview.evidenceReady === true, "complete evidence review must be recorded as metadata-only and evidence-ready");

  const evidenceHandoff = await requestJson(`${baseUrl}/api/teacher/uploads/package-handoff-preview?${query}`, headers);
  assert(evidenceHandoff.handoff?.admissionDecision === "evidence-ready", "complete evidence review must advance admission decision");
  assert(evidenceHandoff.handoff?.blockers.some((blocker) => blocker.includes("Promotion adapter selection")), "promotion adapter selection must remain a separate deployment blocker");

  const reviewDecisionResponse = await fetch(`${baseUrl}/api/teacher/uploads/review-decision`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({
      tenantId: "sample-publisher",
      quarantineId,
      packageId: "sample-publisher-l1-u1-routines-package",
      reviewerId: "publisher-intake-reviewer",
      decision: "accepted-for-package-review",
      reviewerNote: "Synthetic source review decision for the controlled pilot rehearsal.",
      reviewedFields: ["Tenant and publisher source identity", "Candidate textbook unit and package mapping", "Filename, MIME type, size, and checksum", "Intended asset channel and classroom use"],
      unresolvedBlockers: ["Promotion adapter selection remains a separate gate.", "Package assembly remains separately authorized."],
    }),
  });
  const reviewDecision = await readJson(reviewDecisionResponse);
  assert(reviewDecisionResponse.status === 200 && reviewDecision.status === "recorded-review-only" && reviewDecision.approvalCaptured === false, "source review decision must remain review-only");

  const packetResponse = await fetch(`${baseUrl}/api/teacher/uploads/package-review-packet`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({ tenantId: "sample-publisher", quarantineId, packageId: "sample-publisher-l1-u1-routines-package" }),
  });
  const packet = await readJson(packetResponse);
  assert(packetResponse.status === 200 && packet.status === "recorded-review-only" && packet.packet?.status === "blocked", "review packet capture must remain review-only and blocked without a human decision");

  const secondBinding = await requestJson(`${baseUrl}/api/teacher/uploads/package-readiness-binding?${query}`, headers);
  assert(secondBinding.binding?.checks.some((check) => check.checkId === "review-packet" && check.status === "blocked"), "blocked packet state must flow into live readiness");
  assert(secondBinding.preflight?.assemblyWriteAllowed === false && secondBinding.preflight?.promotionAllowed === false, "preflight must remain write and promotion blocked");
  assert(secondBinding.binding?.checks.every((check) => check.status !== "passed" || check.checkId === "review-packet"), "downstream readiness must not be inferred from packet capture");

  const serialized = JSON.stringify({ handoff, firstBinding, evidenceReview, evidenceHandoff, reviewDecision, packet, secondBinding });
  assert(!serialized.includes("Publisher Unit 1 rehearsal source"), "rehearsal responses must not return source payload bytes");
  assert(!serialized.includes("packageAssemblyAllowed:true") && !serialized.includes("studentFacingUseAllowed:true"), "rehearsal responses must not enable package or student use");

  console.log("PASS publisher intake rehearsal submits a source, follows live readiness, captures blocked review metadata, and never crosses the package-writer boundary.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  if (previewOutput.trim()) console.error(previewOutput.trim());
  process.exitCode = 1;
} finally {
  stopPreview();
  rmSync(quarantineRoot, { recursive: true, force: true });
}

async function requestJson(url, headers = {}) {
  const response = await fetch(url, { headers, cache: "no-store" });
  const body = await readJson(response);
  assert(response.ok, `${url} returned ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

async function readJson(response) {
  return await response.json();
}

async function findFreePort() {
  return await new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, host, () => {
      const address = server.address();
      const selectedPort = typeof address === "object" && address ? address.port : undefined;
      server.close((error) => error ? reject(error) : resolvePort(selectedPort));
    });
  });
}

async function waitForPreview(url, child) {
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Preview server exited before rehearsal.\n${previewOutput.trim()}`);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch {
      // The production preview may still be binding its port.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error(`Preview server did not become ready.\n${previewOutput.trim()}`);
}

function stopPreview() {
  if (preview.exitCode !== null) return;
  if (process.platform === "win32" && preview.pid) {
    const killer = spawn("taskkill", ["/pid", String(preview.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true, detached: true });
    killer.unref();
  } else {
    preview.kill("SIGTERM");
  }
  preview.stdout?.destroy();
  preview.stderr?.destroy();
  preview.unref();
}

function assert(condition, message) {
  if (!condition) throw new Error(`FAIL ${message}`);
}
