import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const host = "127.0.0.1";
const token = "publisher-intake-rehearsal-token";
const rehearsalTenantId = "rehearsal-publisher";
const rehearsalUnitKey = `${rehearsalTenantId}:publisher-textbook:L1:U1`;
const rehearsalPackageId = `${rehearsalTenantId}-l1-u1-package`;
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
    LIVING_TEXTBOOOK_DELIVERY_MODE_DECISIONS_ENABLED: "true",
    LIVING_TEXTBOOOK_PACKAGE_EVIDENCE_REVIEWS_ENABLED: "true",
    LIVING_TEXTBOOOK_SENTENCE_APPROVALS_ENABLED: "true",
    LIVING_TEXTBOOOK_PROMOTION_ADAPTER_DECISIONS_ENABLED: "true",
    LIVING_TEXTBOOOK_SOURCE_PREFLIGHT_EVIDENCE_ENABLED: "true",
    LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN: token,
    LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ALLOWED_TENANTS: rehearsalTenantId,
    LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN: token,
    LIVING_TEXTBOOOK_PILOT_DELIVERY_ALLOWED_TENANTS: rehearsalTenantId,
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

  const genericUploadPage = await fetch(`${baseUrl}/teacher/uploads/${rehearsalTenantId}`, { cache: "no-store" });
  const genericUploadHtml = await genericUploadPage.text();
  assert(genericUploadPage.status === 200, "a fresh publisher tenant must reach the generic upload workspace");
  assert(genericUploadHtml.includes("No publisher files have been admitted yet"), "fresh publisher upload workspace must start empty");
  assert(genericUploadHtml.includes("No Sample Publisher or MiniStar review records are shown"), "fresh publisher upload workspace must disclose reference-record isolation");
  assert(!genericUploadHtml.includes("Sample Publisher / Starter English") && !genericUploadHtml.includes("MiniStar / Level 1"), "fresh publisher upload workspace must not render reference tenant records");

  const sourceReviewPage = await fetch(`${baseUrl}/teacher/sources/${rehearsalTenantId}`, { cache: "no-store" });
  const sourceReviewHtml = await sourceReviewPage.text();
  assert(sourceReviewPage.status === 200, "a fresh publisher tenant must reach the source review workspace");
  assert(sourceReviewHtml.includes("Review-only source intake") && sourceReviewHtml.includes("Authorized review contract"), "source review workspace must expose the quarantine review bridge");
  assert(sourceReviewHtml.includes("No source records yet") && !sourceReviewHtml.includes("Sample Publisher Lab"), "fresh publisher source review must start empty and tenant-isolated");

  const intakeStatus = await requestJson(`${baseUrl}/api/teacher/uploads/intake`);
  assert(intakeStatus.status === "review-only-quarantine-intake", "intake must expose the explicitly enabled review-only mode");

  const crossTenantForm = new FormData();
  crossTenantForm.set("tenantId", "other-publisher");
  crossTenantForm.set("channelId", "source-pdf-text-upload");
  crossTenantForm.set("unitKey", "other-publisher:publisher-textbook:L1:U1");
  crossTenantForm.set("file", new Blob(["Cross-tenant authorization probe"], { type: "application/pdf" }), "other-publisher.pdf");
  const crossTenantIntakeResponse = await fetch(`${baseUrl}/api/teacher/uploads/intake`, { method: "POST", headers, body: crossTenantForm });
  const crossTenantIntake = await readJson(crossTenantIntakeResponse);
  assert([401, 403].includes(crossTenantIntakeResponse.status), `the quarantine service token must not authorize intake for a tenant outside its explicit allowlist (status ${crossTenantIntakeResponse.status}; body ${JSON.stringify(crossTenantIntake)})`);

  const form = new FormData();
  form.set("tenantId", rehearsalTenantId);
  form.set("channelId", "source-pdf-text-upload");
  form.set("unitKey", rehearsalUnitKey);
  form.set("file", new Blob(["Publisher Unit 1 rehearsal source"], { type: "application/pdf" }), "partner-unit-1.pdf");
  const intakeResponse = await fetch(`${baseUrl}/api/teacher/uploads/intake`, { method: "POST", headers, body: form });
  const intake = await readJson(intakeResponse);
  assert(intakeResponse.status === 201 && intake.status === "accepted-quarantine", "publisher source must enter quarantine through the real intake route");
  assert(typeof intake.quarantineId === "string" && intake.record?.studentFacingUseAllowed === false, "quarantine intake must return an opaque id and block student use");

  const quarantineId = intake.quarantineId;
  const sourcePreflightReport = {
    recordVersion: 1,
    reportId: `${rehearsalTenantId}:${rehearsalPackageId}:source-preflight`,
    manifestId: `${rehearsalPackageId}:publisher-source-manifest`,
    manifestChecksumSha256: `sha256:${"b".repeat(64)}`,
    inventoryChecksumSha256: `sha256:${"c".repeat(64)}`,
    tenantId: rehearsalTenantId,
    packageId: rehearsalPackageId,
    version: "2026.10.01",
    status: "blocked",
    inventoryStatus: "complete",
    files: [{
      assetId: "unit-1-source",
      kind: "textbook-source",
      relativePath: "unit-1/source.pdf",
      unitKey: rehearsalUnitKey,
      required: true,
      status: "verified",
      sizeBytes: intake.record.sizeBytes,
      checksumSha256: `sha256:${intake.record.checksumSha256}`,
      detectedType: "application/pdf",
      details: "Synthetic publisher preflight evidence for the controlled rehearsal.",
    }],
    counts: { declared: 1, verified: 1, missing: 0, unsupported: 0, invalid: 0, unlisted: 0 },
    blockers: [],
    warnings: [],
    nextActions: ["Attach the preflight report to source review evidence."],
    reviewOnly: true,
    quarantineWriteAllowed: false,
    packageAssemblyAllowed: false,
    packagePromotionAllowed: false,
    qrPrintAllowed: false,
    hostedPersistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const sourcePreflightEvidenceResponse = await fetch(`${baseUrl}/api/teacher/uploads/source-preflight-evidence`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({ tenantId: rehearsalTenantId, quarantineId, packageId: rehearsalPackageId, report: sourcePreflightReport }),
  });
  const sourcePreflightEvidence = await readJson(sourcePreflightEvidenceResponse);
  assert(sourcePreflightEvidenceResponse.status === 200 && sourcePreflightEvidence.status === "recorded-review-only" && sourcePreflightEvidence.record?.studentFacingUseAllowed === false, "complete publisher preflight evidence must attach as review-only metadata before package review");
  const sourceBinding = await requestJson(`${baseUrl}/api/teacher/uploads/source-package-evidence-binding?tenantId=${rehearsalTenantId}&quarantineId=${encodeURIComponent(quarantineId)}&packageId=${rehearsalPackageId}`, headers);
  assert(sourceBinding.status === "review-only" && sourceBinding.bridge?.tenantId === rehearsalTenantId, `fresh publisher source must reach the tenant-scoped source-package evidence binding: ${JSON.stringify(sourceBinding)}`);
  assert(sourceBinding.bridge?.sourceChecksum === `sha256:${intake.record.checksumSha256}`, "source-package evidence binding must preserve the intake checksum in canonical form");
  assert(sourceBinding.bridge?.packageAssemblyAllowed === false && sourceBinding.bridge?.studentFacingUseAllowed === false, "source-package evidence binding must remain protected-action blocked");
  assert(sourceBinding.bridge?.preflightReference?.reportId === sourcePreflightReport.reportId, "source-package evidence binding must carry the durable preflight report reference");
  assert(!JSON.stringify(sourceBinding).includes("Publisher Unit 1 rehearsal source"), "source-package evidence binding must not expose raw source payload content");
  const crossTenantReviewResponse = await fetch(`${baseUrl}/api/teacher/uploads/review?tenantId=other-publisher&quarantineId=${encodeURIComponent(quarantineId)}`, { headers, cache: "no-store" });
  const crossTenantReview = await readJson(crossTenantReviewResponse);
  assert([401, 403].includes(crossTenantReviewResponse.status) && crossTenantReview.status === "unauthorized", "the quarantine service token must not authorize review reads for another tenant");
  const crossTenantMetadataResponse = await fetch(`${baseUrl}/api/teacher/delivery/metadata?tenantId=other-publisher&packageId=other-package&version=1.0.0`, { headers, cache: "no-store" });
  const crossTenantMetadata = await readJson(crossTenantMetadataResponse);
  assert(crossTenantMetadataResponse.status === 401 && crossTenantMetadata.status === "unauthorized", "the pilot delivery credential must not authorize metadata reads for another tenant");
  const submittedSourceReviewPage = await fetch(`${baseUrl}/teacher/sources/${rehearsalTenantId}?quarantineId=${encodeURIComponent(quarantineId)}`, { cache: "no-store" });
  const submittedSourceReviewHtml = await submittedSourceReviewPage.text();
  assert(submittedSourceReviewPage.status === 200, "the submitted publisher source must return to the tenant source review workspace");
  assert(submittedSourceReviewHtml.includes("Current publisher submission") && submittedSourceReviewHtml.includes(quarantineId), "source review must carry the opaque quarantine identity forward");
  assert(submittedSourceReviewHtml.includes("Open metadata review") && submittedSourceReviewHtml.includes("Open package handoff") && submittedSourceReviewHtml.includes("Load live binding"), "source review must expose the review-only next-step links and live binding panel");
  const query = `tenantId=${rehearsalTenantId}&quarantineId=${encodeURIComponent(quarantineId)}&packageId=${rehearsalPackageId}`;
  const handoff = await requestJson(`${baseUrl}/api/teacher/uploads/package-handoff-preview?${query}`, headers);
  assert(handoff.status === "review-only" && handoff.handoff?.writeAllowed === false, "handoff must remain metadata-only");
  assert(handoff.handoff?.checksumSha256 === intake.record.checksumSha256, "handoff must preserve the intake checksum");

  const firstBinding = await requestJson(`${baseUrl}/api/teacher/uploads/package-readiness-binding?${query}`, headers);
  assert(firstBinding.status === "review-only" && firstBinding.binding?.status === "blocked", "live readiness must begin blocked");
  assert(firstBinding.binding?.checks.some((check) => check.checkId === "package-preview" && check.status === "blocked"), "missing package preview must be explicit");
  assert(firstBinding.binding?.checks.some((check) => check.checkId === "source-review-decision" && check.status === "open"), "missing source review decision must be an explicit open gate");
  assert(firstBinding.binding?.packageAssemblyAllowed === false && firstBinding.binding?.studentFacingUseAllowed === false, "live readiness must block assembly and student use");

  const earlyHandoffPage = await fetch(`${baseUrl}/teacher/evidence/${rehearsalTenantId}/handoff?${query}`, { cache: "no-store" });
  const earlyHandoffHtml = await earlyHandoffPage.text();
  assert(earlyHandoffPage.status === 200, "a submitted publisher must reach the live handoff review page");
  assert(earlyHandoffHtml.includes("Live publisher submission") && earlyHandoffHtml.includes(quarantineId), "live handoff page must preserve the submitted quarantine identity");
  assert(earlyHandoffHtml.includes("The handoff below is derived from the submitted tenant and quarantine identity") && earlyHandoffHtml.includes("never prove that this publisher package is assembled"), "live handoff page must disclose its tenant-bound, reference-only review boundary");

  const evidenceReviewResponse = await fetch(`${baseUrl}/api/teacher/uploads/evidence-review`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({
      tenantId: rehearsalTenantId,
      quarantineId,
      packageId: rehearsalPackageId,
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
  assert(evidenceHandoff.handoff?.admissionDecision === "needs-review", "complete evidence review must remain in review until the promotion adapter is selected");
  assert(evidenceHandoff.handoff?.blockers.some((blocker) => blocker.includes("Promotion adapter selection")), "promotion adapter selection must remain a separate deployment blocker");

  const deliveryModeResponse = await fetch(`${baseUrl}/api/teacher/uploads/delivery-mode-decision`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({
      tenantId: rehearsalTenantId,
      quarantineId,
      packageId: rehearsalPackageId,
      selectedMode: "hybrid",
      reviewerId: "publisher-intake-reviewer",
      reviewerNote: "Synthetic hybrid choice for controlled pilot rehearsal.",
    }),
  });
  const deliveryMode = await readJson(deliveryModeResponse);
  assert(deliveryModeResponse.status === 200 && deliveryMode.status === "recorded-review-only" && deliveryMode.record?.persistenceActivationAllowed === false, "delivery mode selection must be review-only and activation-blocked");

  const blockedPackageEvidenceResponse = await fetch(`${baseUrl}/api/teacher/uploads/package-evidence-review`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({
      tenantId: rehearsalTenantId,
      quarantineId,
      packageId: rehearsalPackageId,
      reviewerId: "publisher-intake-reviewer",
      reviewerNote: "Synthetic complete multimedia and game evidence for controlled pilot rehearsal.",
      reviewedLanes: ["content", "game", "audio", "video", "image", "font", "accessibility", "rights"],
      evidenceReferences: ["content", "game", "audio", "video", "image", "font", "accessibility", "rights"].map((lane) => ({ lane, referenceId: `synthetic-${lane}-evidence` })),
    }),
  });
  const blockedPackageEvidence = await readJson(blockedPackageEvidenceResponse);
  assert(blockedPackageEvidenceResponse.status === 423 && blockedPackageEvidence.status === "blocked", "package evidence must remain blocked until the source decision is accepted");

  const blockedSentenceApprovalResponse = await fetch(`${baseUrl}/api/teacher/uploads/sentence-approval`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({
      tenantId: rehearsalTenantId,
      quarantineId,
      packageId: rehearsalPackageId,
      proposalId: `${rehearsalPackageId}:authoring-proposal:review-only`,
      reviewerId: "publisher-intake-reviewer",
      reviewerNote: "This must remain blocked before source review acceptance.",
      decision: "approved",
      targetSentences: ["Hello, teacher.", "Thank you, friend."],
    }),
  });
  const blockedSentenceApproval = await readJson(blockedSentenceApprovalResponse);
  assert(blockedSentenceApprovalResponse.status === 423 && blockedSentenceApproval.status === "blocked", "sentence approval must remain blocked until the source decision is accepted");

  const reviewDecisionResponse = await fetch(`${baseUrl}/api/teacher/uploads/review-decision`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({
      tenantId: rehearsalTenantId,
      quarantineId,
      packageId: rehearsalPackageId,
      reviewerId: "publisher-intake-reviewer",
      decision: "accepted-for-package-review",
      reviewerNote: "Synthetic source review decision for the controlled pilot rehearsal.",
      reviewedFields: ["Tenant and publisher source identity", "Candidate textbook unit and package mapping", "Filename, MIME type, size, and checksum", "Intended asset channel and classroom use"],
      unresolvedBlockers: ["Promotion adapter selection remains a separate gate.", "Package assembly remains separately authorized."],
    }),
  });
  const reviewDecision = await readJson(reviewDecisionResponse);
  assert(reviewDecisionResponse.status === 200 && reviewDecision.status === "recorded-review-only" && reviewDecision.approvalCaptured === false, "source review decision must remain review-only");

  const packageEvidenceResponse = await fetch(`${baseUrl}/api/teacher/uploads/package-evidence-review`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({
      tenantId: rehearsalTenantId,
      quarantineId,
      packageId: rehearsalPackageId,
      reviewerId: "publisher-intake-reviewer",
      reviewerNote: "Synthetic complete multimedia and game evidence for controlled pilot rehearsal.",
      reviewedLanes: ["content", "game", "audio", "video", "image", "font", "accessibility", "rights"],
      evidenceReferences: ["content", "game", "audio", "video", "image", "font", "accessibility", "rights"].map((lane) => ({ lane, referenceId: `synthetic-${lane}-evidence` })),
    }),
  });
  const packageEvidence = await readJson(packageEvidenceResponse);
  assert(packageEvidenceResponse.status === 200 && packageEvidence.status === "recorded-review-only" && packageEvidence.reviewedPackageEvidence === true, "complete package evidence must be recorded as review-only metadata");

  const sentenceApprovalResponse = await fetch(`${baseUrl}/api/teacher/uploads/sentence-approval`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({
      tenantId: rehearsalTenantId,
      quarantineId,
      packageId: rehearsalPackageId,
      proposalId: `${rehearsalPackageId}:authoring-proposal:review-only`,
      reviewerId: "publisher-intake-reviewer",
      reviewerNote: "Both English structures fit the reviewed vocabulary and level.",
      decision: "approved",
      targetSentences: ["Hello, teacher.", "Thank you, friend."],
    }),
  });
  const sentenceApproval = await readJson(sentenceApprovalResponse);
  assert(sentenceApprovalResponse.status === 200 && sentenceApproval.status === "recorded-review-only" && sentenceApproval.sentenceApprovalRecorded === true && sentenceApproval.record?.packageAssemblyAllowed === false, "approved English sentence targets must be recorded as review-only metadata");

  const packetResponse = await fetch(`${baseUrl}/api/teacher/uploads/package-review-packet`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({ tenantId: rehearsalTenantId, quarantineId, packageId: rehearsalPackageId }),
  });
  const packet = await readJson(packetResponse);
  assert(packetResponse.status === 200 && packet.status === "recorded-review-only" && packet.packet?.status === "blocked" && packet.packet?.reviewDecision === "accepted-for-package-review" && !packet.packet?.blockers.some((blocker) => blocker.includes("human review decision must be recorded")), "review packet capture must remain review-only, source-decision-bound, and blocked only by downstream gates");
  assert(packet.packet?.packetRevision === undefined && !packet.packet?.supersedesPacketId, "the first blocked packet must retain the canonical revision-one identity");

  const promotionAdapterResponse = await fetch(`${baseUrl}/api/teacher/uploads/promotion-adapter-decision`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({
      tenantId: rehearsalTenantId,
      quarantineId,
      packageId: rehearsalPackageId,
      selectedAdapter: "hybrid-package",
      reviewerId: "publisher-intake-reviewer",
      reviewerNote: "Synthetic hybrid adapter selection for the controlled pilot rehearsal.",
    }),
  });
  const promotionAdapter = await readJson(promotionAdapterResponse);
  assert(promotionAdapterResponse.status === 200 && promotionAdapter.status === "recorded-review-only" && promotionAdapter.record?.selectedAdapter === "hybrid-package" && promotionAdapter.record?.promotionAllowed === false, "promotion adapter selection must be recorded as review-only and remain promotion-blocked");

  const adapterBoundHandoff = await requestJson(`${baseUrl}/api/teacher/uploads/package-handoff-preview?${query}`, headers);
  assert(adapterBoundHandoff.handoff?.admissionDecision === "evidence-ready" && adapterBoundHandoff.handoff?.blockers?.length === 0, "complete evidence plus a checksum-bound adapter selection must advance the admission preview");

  const revisedPacketResponse = await fetch(`${baseUrl}/api/teacher/uploads/package-review-packet`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({ tenantId: rehearsalTenantId, quarantineId, packageId: rehearsalPackageId }),
  });
  const revisedPacket = await readJson(revisedPacketResponse);
  assert(revisedPacketResponse.status === 200 && revisedPacket.status === "recorded-review-only" && revisedPacket.packet?.packetRevision === 2, "a blocked packet with a newly reviewed adapter must receive an immutable revision-two packet");
  assert(revisedPacket.packet?.supersedesPacketId === packet.packet?.packetId, "revision two must identify the blocked revision-one packet it supersedes");
  assert(revisedPacket.packet?.includedRecords?.includes("upload_quarantine_promotion_adapter_decision"), "revision two must include the reviewed promotion adapter record");
  assert(revisedPacket.packet?.packageAssemblyAllowed === false && revisedPacket.packet?.promotionAllowed === false && revisedPacket.packet?.studentFacingUseAllowed === false, "packet revisioning must not authorize assembly, promotion, or student use");

  const packetReadback = await requestJson(`${baseUrl}/api/teacher/uploads/package-review-packet?${query}`, headers);
  assert(packetReadback.packet?.packetRevision === 2 && packetReadback.packet?.packetId === revisedPacket.packet?.packetId, "packet reads must return the highest valid immutable revision");

  const assemblyPreflight = await requestJson(`${baseUrl}/api/teacher/uploads/package-assembly-preflight?${query}`, headers);
  assert(assemblyPreflight.status === "review-only" && assemblyPreflight.preflight?.status === "blocked", "package assembly preflight must remain review-only and blocked");
  assert(assemblyPreflight.preflight?.blockers?.some((blocker) => blocker.includes("approved delivery manifest")), "assembly preflight must require an approved delivery manifest");
  assert(assemblyPreflight.sentenceApprovalRecorded === true, "assembly preflight must report the checksum-bound English sentence approval lane");
  assert(assemblyPreflight.preflight?.blockers?.some((blocker) => blocker.includes("manual release receipt")), "assembly preflight must require release and QR authorization");
  assert(assemblyPreflight.preflight?.blockers?.some((blocker) => blocker.includes("approved local bundle or hosted deployment handoff")), "assembly preflight must require an approved delivery handoff");
  assert(assemblyPreflight.preflight?.assemblyWriteAllowed === false && assemblyPreflight.preflight?.promotionAllowed === false && assemblyPreflight.preflight?.studentFacingUseAllowed === false, "assembly preflight must keep writes, promotion, and student use blocked");

  const secondBinding = await requestJson(`${baseUrl}/api/teacher/uploads/package-readiness-binding?${query}`, headers);
  assert(secondBinding.binding?.checks.some((check) => check.checkId === "review-packet" && check.status === "passed"), "the immutable adapter-bound packet revision must close the package review check without authorizing release");
  assert(secondBinding.binding?.checks.some((check) => check.checkId === "source-review-decision" && check.status === "passed"), "accepted source decision must close only its own live readiness gate");
  assert(secondBinding.deliveryModeDecision?.selectedMode === "hybrid", "hybrid delivery mode selection must flow into live readiness");
  assert(secondBinding.hostedPersistenceOptInPacket?.deliveryMode === "hybrid-registry-local-media", "hybrid delivery must derive the package-scoped hosted persistence preview");
  assert(secondBinding.hostedPersistenceOptInPacket?.reviewOnly === true && secondBinding.hostedPersistenceOptInPacket?.providerSelected === false && secondBinding.hostedPersistenceOptInPacket?.optInRecorded === false, "hosted persistence preview must remain review-only and unselected");
  assert(secondBinding.hostedPersistenceOptInPacket?.writesAllowed === false && secondBinding.hostedPersistenceOptInPacket?.activationAllowed === false && secondBinding.hostedPersistenceOptInPacket?.learnerRecordsIncluded === false, "hosted persistence preview must block writes, activation, and learner records");
  assert(secondBinding.packageEvidenceReview?.status === "reviewed-package-evidence", "complete package evidence must flow into live readiness");
  assert(secondBinding.sentenceApproval?.decision === "approved" && secondBinding.sourcePackageEvidenceBinding?.evidenceLanes?.some((lane) => lane.laneId === "sentence-approval" && lane.status === "present"), "approved English sentence targets must flow into live readiness without enabling release");
  assert(secondBinding.binding?.checks.some((check) => check.checkId === "package-preview" && check.status === "passed"), "complete package evidence must close only the reviewed package preview check");
  assert(secondBinding.deliveryManifestPreview?.selectedMode === "hybrid", "hybrid delivery mode selection must flow into live delivery manifest preview");
  assert(secondBinding.deliveryManifestPreview?.checks.some((check) => check.checkId === "package-preview" && check.status === "passed"), "complete package evidence must flow into the delivery manifest preview");
  assert(secondBinding.deliveryManifestPreview?.checks.some((check) => check.checkId === "delivery-mode" && check.status === "passed"), "selected delivery mode must close only the mode-selection check");
  assert(secondBinding.deliveryManifestPreview?.deliveryAllowed === false && secondBinding.deliveryManifestPreview?.qrPrintAllowed === false, "delivery mode selection must not enable delivery or QR printing");
  assert(secondBinding.preflight?.assemblyWriteAllowed === false && secondBinding.preflight?.promotionAllowed === false, "preflight must remain write and promotion blocked");
  const allowedPassedChecks = new Set(["quarantine-review", "source-review-decision", "review-packet", "sentence-approval", "delivery-mode", "promotion-adapter", "package-preview"]);
  assert(secondBinding.binding?.checks.every((check) => check.status !== "passed" || allowedPassedChecks.has(check.checkId)), "downstream readiness must not be inferred beyond explicit review, delivery-mode, and package-evidence records");
  assert(secondBinding.binding?.checks.some((check) => check.checkId === "release-receipt" && check.status === "blocked") && secondBinding.binding?.checks.some((check) => check.checkId === "delivery-manifest" && check.status === "blocked"), "release and delivery checks must remain blocked after package evidence review");

  const advancedHandoffPage = await fetch(`${baseUrl}/teacher/evidence/${rehearsalTenantId}/handoff?${query}`, { cache: "no-store" });
  const advancedHandoffHtml = await advancedHandoffPage.text();
  assert(advancedHandoffPage.status === 200, "the advanced publisher review state must remain browser-reachable");
  assert(advancedHandoffHtml.includes("Live publisher submission") && advancedHandoffHtml.includes(quarantineId), "advanced live handoff must retain the same submitted quarantine identity");
  assert(secondBinding.binding?.status === "blocked" && secondBinding.binding?.studentFacingUseAllowed === false, "advanced live readiness must remain blocked even when review evidence is complete");

  const releaseAttemptResponse = await fetch(`${baseUrl}/api/teacher/delivery/release`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({}),
  });
  const releaseAttempt = await readJson(releaseAttemptResponse);
  assert(releaseAttemptResponse.status === 423 && releaseAttempt.status === "blocked" && releaseAttempt.releaseReceiptWritten !== true && releaseAttempt.studentFacingActivationAllowed !== true, "delivery release must remain disabled even after a complete review-only readiness rehearsal");

  const metadataAttemptResponse = await fetch(`${baseUrl}/api/teacher/delivery/metadata`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({ manifest: {}, receipt: {}, operatorId: "publisher-intake-rehearsal", quarantineId, writtenAt: new Date().toISOString() }),
  });
  const metadataAttempt = await readJson(metadataAttemptResponse);
  assert(metadataAttemptResponse.status === 423 && metadataAttempt.status === "blocked" && metadataAttempt.deliveryMetadataWritten !== true, "delivery metadata writes must remain disabled after a review-only readiness rehearsal");

  const serialized = JSON.stringify({ handoff, firstBinding, earlyHandoffHtml, evidenceReview, evidenceHandoff, deliveryMode, packageEvidence, blockedSentenceApproval, sentenceApproval, reviewDecision, packet, promotionAdapter, revisedPacket, packetReadback, assemblyPreflight, secondBinding, advancedHandoffHtml, releaseAttempt, metadataAttempt });
  assert(!serialized.includes("Publisher Unit 1 rehearsal source"), "rehearsal responses must not return source payload bytes");
  assert(!serialized.includes("packageAssemblyAllowed:true") && !serialized.includes("studentFacingUseAllowed:true"), "rehearsal responses must not enable package or student use");

  console.log("PASS publisher intake rehearsal submits a source, records exact English sentence approval, advances a blocked packet through an immutable adapter-bound revision, follows live readiness, and never crosses the package-writer boundary.");
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
