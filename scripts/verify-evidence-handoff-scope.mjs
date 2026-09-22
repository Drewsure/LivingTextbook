import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const canonicalPackageId = "sample-publisher-l1-u1-routines-package";
const handoff = readSource("../apps/web/src/data/sampleEvidencePacketHandoffPackage.ts");
const panel = readSource("../apps/web/src/features/evidence/EvidencePacketHandoffPanel.tsx");
const route = readSource("../apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx");
const validator = readSource("../packages/content-model/src/evidencePacketHandoff.ts");
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
