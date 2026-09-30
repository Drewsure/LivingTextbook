import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const output = join(root, ".tmp-publisher-source-package-bridge.cjs");
const sourcePath = join(root, "packages", "content-model", "src", "publisherSourceToPackageEvidenceBridge.ts");
writeFileSync(output, ts.transpileModule(readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, "utf8");
try {
  const model = await import(`file://${output}`);
  const bridge = model.createPublisherSourceToPackageEvidenceBridge({
    tenantId: "publisher-a", unitKey: "publisher-a:book:L1:U1", sourceReviewId: "review-1", extractionPreviewId: "preview-1", extractionPacketId: "packet-1", authoringProposalId: "proposal-1", sourceChecksum: `sha256:${"a".repeat(64)}`, sourceTermsReviewed: false, sentenceApprovalRecorded: false, audioEvidenceReady: false,
  });
  const errors = model.validatePublisherSourceToPackageEvidenceBridge(bridge);
  if (errors.length > 0) failures.push(`valid bridge was rejected: ${errors.join(" ")}`);
  if (bridge.evidenceLanes.length !== 8) failures.push("bridge must contain eight evidence lanes");
  if (bridge.missingEvidence.length < 7) failures.push("blocked bridge must enumerate missing evidence");
  if (bridge.draftCreationAllowed || bridge.packageAssemblyAllowed || bridge.packagePromotionAllowed || bridge.qrPrintAllowed || bridge.studentFacingUseAllowed || bridge.storageWriteAllowed) failures.push("bridge must keep protected actions disabled");
  const reviewedLanesBridge = model.createPublisherSourceToPackageEvidenceBridge({
    tenantId: "publisher-a", unitKey: "publisher-a:book:L1:U1", sourceReviewId: "review-1", extractionPreviewId: "preview-1", extractionPacketId: "packet-1", authoringProposalId: "proposal-1", sourceChecksum: `sha256:${"a".repeat(64)}`, sourceTermsReviewed: true, sentenceApprovalRecorded: false, audioEvidenceReady: true, mediaRightsReady: true, gameVerificationReady: true,
  });
  if (reviewedLanesBridge.evidenceLanes.find((lane) => lane.laneId === "target-language-audio")?.status !== "present") failures.push("reviewed audio evidence must advance the target-language audio lane");
  if (reviewedLanesBridge.evidenceLanes.find((lane) => lane.laneId === "media-rights")?.status !== "present") failures.push("reviewed rights evidence must advance the media-rights lane");
  if (reviewedLanesBridge.evidenceLanes.find((lane) => lane.laneId === "game-verification")?.status !== "present") failures.push("reviewed game evidence must advance the game-verification lane");
  if (reviewedLanesBridge.status !== "blocked" || reviewedLanesBridge.packageAssemblyAllowed || reviewedLanesBridge.studentFacingUseAllowed) failures.push("reviewed evidence must not unlock release or student actions");
  const tampered = { ...bridge, status: "ready" };
  if (!model.validatePublisherSourceToPackageEvidenceBridge(tampered).some((error) => error.includes("blocked, review-only"))) failures.push("ready status must be rejected");
} finally { rmSync(output, { force: true }); }
const page = readFileSync(join(root, "apps", "web", "src", "app", "teacher", "sources", "[tenantId]", "page.tsx"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "content-intake", "PublisherSourceToPackageEvidenceBridgePanel.tsx"), "utf8");
const sample = readFileSync(join(root, "apps", "web", "src", "data", "sampleMinistarSourceToPackageEvidenceBridge.ts"), "utf8");
for (const marker of ["PublisherSourceToPackageEvidenceBridgePanel", "sampleMinistarSourceToPackageEvidenceBridge"]) if (!page.includes(marker)) failures.push(`source page is missing marker: ${marker}`);
for (const marker of ["Checksum-bound lineage", "Draft creation blocked", "Student use blocked"]) if (!panel.includes(marker)) failures.push(`bridge panel is missing marker: ${marker}`);
for (const marker of ["createPublisherSourceToPackageEvidenceBridge", "sampleMinistarSourceDerivedUnitReview", "sampleMinistarUnitAuthoringProposal"]) if (!sample.includes(marker)) failures.push(`sample bridge is missing marker: ${marker}`);
if (panel.includes("fetch(") || panel.includes('type="file"') || panel.includes("method: \"POST\"")) failures.push("bridge panel must remain read-only");
if (failures.length) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
console.log("PASS publisher source-to-package evidence bridge binds MiniStar source evidence and remains review-only.");
