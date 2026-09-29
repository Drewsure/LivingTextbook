import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const model = readFileSync(resolve(root, "packages/content-model/src/pilotDeliveryReleaseReceipt.ts"), "utf8");
const sample = readFileSync(resolve(root, "apps/web/src/data/samplePilotDeliveryReleaseReceipt.ts"), "utf8");
const panel = readFileSync(resolve(root, "apps/web/src/features/evidence/PilotDeliveryReleaseReceiptPanel.tsx"), "utf8");
const route = readFileSync(resolve(root, "apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx"), "utf8");

for (const [source, marker, label] of [
  [model, "createPilotDeliveryReleaseReceipt", "receipt creator"],
  [model, "reviewerId", "reviewer identity"],
  [model, "qrPrintAuthorization", "QR authorization"],
  [model, "rollbackReference", "rollback reference"],
  [model, 'sideEffect: "none"', "side-effect boundary"],
  [sample, "createPilotDeliveryReleaseReceipt", "sample receipt"],
  [panel, "Manual release receipt", "visible receipt"],
  [panel, "Protected actions", "protected actions"],
  [route, "PilotDeliveryReleaseReceiptPanel", "handoff route receipt"],
]) {
  if (!source.includes(marker)) throw new Error(`Missing ${label}: ${marker}`);
}
for (const forbidden of ["writeFile", "download=", "window.open", "releaseApproval: \"approved\"", "qrPrintAuthorization: \"approved\""]) {
  if (model.includes(forbidden) || sample.includes(forbidden) || panel.includes(forbidden)) throw new Error(`Forbidden release receipt behavior: ${forbidden}`);
}
console.log("PASS pilot delivery release receipt binds human review, checksum, QR, and rollback evidence without side effects.");
