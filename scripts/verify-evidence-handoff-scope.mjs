import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const canonicalPackageId = "sample-publisher-l1-u1-routines-package";
const handoff = readSource("../apps/web/src/data/sampleEvidencePacketHandoffPackage.ts");
const panel = readSource("../apps/web/src/features/evidence/EvidencePacketHandoffPanel.tsx");
const route = readSource("../apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx");
const validator = readSource("../packages/content-model/src/evidencePacketHandoff.ts");
const storageBinding = readSource("../packages/content-model/src/evidenceAttachmentStorageHandoff.ts");
const failures = [];

requireText(handoff, "samplePilotHandoffPackage.packageId", "Evidence handoff must bind to the canonical pilot package id.");
requireText(handoff, 'routeKey: "sample-publisher-evidence-packet-handoff"', "Evidence handoff must keep a stable route key.");
requireText(handoff, "samplePublisherEvidencePacketHandoffPackageErrors", "Evidence handoff must expose validator results.");
requireText(validator, "Evidence packet handoff must block evidence packet export.", "Evidence handoff validator must block packet export.");
requireText(validator, "Evidence packet handoff must block signed approval capture.", "Evidence handoff validator must block signed approval capture.");
requireText(validator, "Evidence packet handoff must block package publish.", "Evidence handoff validator must block package publish.");
requireText(route, "validationErrors={samplePublisherEvidencePacketHandoffPackageErrors}", "Evidence handoff route must pass validation errors to the panel.");
requireText(panel, "Canonical package binding", "Evidence handoff panel must show canonical package binding.");
requireText(panel, "Contract valid", "Evidence handoff panel must show contract validity.");
requireText(handoff, "storageReadinessBinding", "Evidence handoff must carry storage readiness identity.");
requireText(handoff, "assetEvidencePackets", "Evidence handoff must carry per-asset evidence packets.");
requireText(handoff, "sampleLabelledDiagramAssetEvidencePacket", "Evidence handoff must include the Labelled Diagram evidence packet.");
requireText(handoff, "sampleMediaAssetEvidencePacket", "Evidence handoff must include the media evidence packet.");
requireText(handoff, "storageReconciliation", "Evidence handoff must carry attachment-to-storage reconciliation.");
requireText(handoff, "storageSelectionPreflight", "Evidence handoff must carry the policy-gated storage selection review packet.");
requireText(panel, "Attachment storage readiness lineage", "Evidence handoff panel must show storage readiness lineage.");
requireText(panel, "Asset evidence lineage", "Evidence handoff panel must show per-asset evidence lineage.");
requireText(panel, "Every image, audio, and video candidate keeps its own evidence packet", "Evidence handoff panel must show attachment-level evidence boundaries.");
requireText(panel, "Attachment-to-storage reconciliation", "Evidence handoff panel must show storage reconciliation.");
requireText(panel, "Every attachment has a storage policy gate, not a storage destination", "Evidence handoff panel must keep storage selection provider-neutral.");
requireText(panel, "Storage candidates travel with the handoff, not the files", "Evidence handoff panel must preserve storage attachment boundaries.");
requireText(panel, "Storage selection review packet", "Evidence handoff panel must show the storage selection review packet.");
requireText(panel, "No provider selected", "Evidence handoff panel must show that provider selection remains blocked.");
requireText(panel, "Human policy review required", "Evidence handoff panel must show the human policy review gate.");
requireText(storageBinding, "storageActivationAllowed: false", "Storage handoff binding must block activation.");
requireText(storageBinding, "uploadAllowed: false", "Storage handoff binding must block upload.");
requireText(storageBinding, "downloadAllowed: false", "Storage handoff binding must block download.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log(`PASS evidence handoff is contract-bound to canonical package scope ${canonicalPackageId} with export and promotion blocked.`);

function readSource(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) failures.push(message);
}
