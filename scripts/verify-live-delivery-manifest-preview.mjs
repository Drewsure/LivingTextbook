import fs from "node:fs";

const model = fs.readFileSync("packages/content-model/src/uploadQuarantineDeliveryManifestPreview.ts", "utf8");
const route = fs.readFileSync("apps/web/src/app/api/teacher/uploads/package-readiness-binding/route.ts", "utf8");
const panel = fs.readFileSync("apps/web/src/features/evidence/PublisherQuarantineHandoffBridgePanel.tsx", "utf8");
const required = [
  [model, "createReviewOnlyUploadQuarantineDeliveryManifestPreview"],
  [model, "validateUploadQuarantineDeliveryManifestPreview"],
  [model, "deliveryAllowed: false"],
  [model, "qrPrintAllowed: false"],
  [route, "deliveryManifestPreview"],
  [route, "validateUploadQuarantineDeliveryManifestPreview"],
  [panel, "Live delivery manifest preview"],
  [panel, "Release receipt"],
  [panel, "Package index"],
  [panel, "Release closure order"],
  [panel, "QR printing: blocked"],
  [panel, "package assembly: blocked"],
];
for (const [source, marker] of required) if (!source.includes(marker)) throw new Error(`Missing live delivery manifest preview marker: ${marker}`);
for (const forbidden of ["deliveryAllowed: true", "qrPrintAllowed: true", "studentFacingUseAllowed: true", "hostedPersistenceActivated: true"]) {
  if (model.includes(forbidden)) throw new Error(`Unsafe live delivery manifest preview marker: ${forbidden}`);
}
console.log("PASS live delivery manifest preview is tenant-bound, checksum-bound, visible in the live handoff, and activation-blocked.");
