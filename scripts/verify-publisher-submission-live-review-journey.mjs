import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const output = join(root, ".tmp-publisher-submission-live-review-journey.cjs");
const sourcePath = join(root, "packages", "content-model", "src", "publisherSubmissionLiveReviewJourney.ts");
writeFileSync(output, ts.transpileModule(readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, "utf8");

try {
  const model = await import(`file://${output}`);
  const input = {
    tenantId: "publisher-a",
    quarantineId: "q-00000000-0000-4000-8000-000000000001",
    packageId: "publisher-a-l1-u1-package",
    sourceId: "quarantine-record:q-00000000-0000-4000-8000-000000000001",
    unitKey: "publisher-a:textbook:L1:U1",
    checksumSha256: "a".repeat(64),
    sourceReviewDecision: "accepted-for-package-review",
    packageEvidenceReviewed: true,
    reviewPacketRecorded: true,
    deliveryModeSelected: true,
    promotionAdapterSelected: true,
    releaseBlockers: ["Release approval is not recorded."],
  };
  const journey = model.createPublisherSubmissionLiveReviewJourney(input);
  if (model.validatePublisherSubmissionLiveReviewJourney(journey).length !== 0) failures.push("complete live review journey must satisfy the contract");
  if (journey.gates.length !== 8 || journey.gates.at(-1)?.status !== "blocked") failures.push("live review journey must retain all eight gates and block teacher rehearsal until release");
  if (journey.nextGateIds[0] !== "release-and-qr" || !journey.nextGates[0]?.includes("Release and QR authorization")) failures.push("complete live review journey must identify release and QR as the next unresolved gate");
  if (journey.packageAssemblyAllowed || journey.promotionAllowed || journey.qrPrintAllowed || journey.persistenceActivationAllowed || journey.studentFacingUseAllowed) failures.push("live review journey must keep all protected actions blocked");
  const changed = model.createPublisherSubmissionLiveReviewJourney({ ...input, sourceReviewDecision: "changes-required" });
  if (changed.gates.find((gate) => gate.gateId === "source-review-decision")?.status !== "blocked") failures.push("changes-required source decisions must block the live journey");
  if (changed.nextGateIds[0] !== "source-review-decision") failures.push("changes-required source decisions must become the first unresolved next gate");
  const initial = model.createPublisherSubmissionLiveReviewJourney({ ...input, sourceReviewDecision: null, packageEvidenceReviewed: false, reviewPacketRecorded: false, deliveryModeSelected: false, promotionAdapterSelected: false });
  if (initial.nextGateIds[0] !== "source-review-decision") failures.push("an unreviewed source must become the first unresolved next gate");
  const unsafe = { ...journey, checksumSha256: "https://example.test/source" };
  if (!model.validatePublisherSubmissionLiveReviewJourney(unsafe).some((error) => error.includes("checksum"))) failures.push("unsafe checksum identity must be rejected");
} finally {
  rmSync(output, { force: true });
}

const bridge = readFileSync(join(root, "apps", "web", "src", "features", "evidence", "PublisherQuarantineHandoffBridgePanel.tsx"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "evidence", "LivePublisherSubmissionReviewJourneyPanel.tsx"), "utf8");
for (const marker of ["createPublisherSubmissionLiveReviewJourney", "LivePublisherSubmissionReviewJourneyPanel", "releaseBlockers"]) if (!bridge.includes(marker)) failures.push(`live handoff bridge is missing marker: ${marker}`);
for (const marker of ["Live publisher review journey", "One tenant-bound path from quarantine to teacher rehearsal", "Release blocked", "Teacher-led student rehearsal", "No student-facing use"]) if (!panel.includes(marker)) failures.push(`live review panel is missing marker: ${marker}`);
if (panel.includes("type=\"file\"") || panel.includes("fetch(") || panel.includes("navigator.mediaDevices")) failures.push("live review panel must remain read-only");
if (failures.length > 0) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
console.log("PASS live publisher submission review journey maps real quarantine state into eight bounded gates while keeping release, QR, persistence, and student use blocked.");
