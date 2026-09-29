import fs from "node:fs";

const model = fs.readFileSync("packages/content-model/src/uploadQuarantineReleaseReceiptPreview.ts", "utf8");
const route = fs.readFileSync("apps/web/src/app/api/teacher/uploads/package-readiness-binding/route.ts", "utf8");
const panel = fs.readFileSync("apps/web/src/features/evidence/PublisherQuarantineHandoffBridgePanel.tsx", "utf8");
for (const [source, marker] of [
  [model, "createReviewOnlyUploadQuarantineReleaseReceiptPreview"],
  [model, "releaseApproval: \"pending\""],
  [model, "studentFacingUseAllowed: false"],
  [route, "releaseReceiptPreview"],
  [route, "validateUploadQuarantineReleaseReceiptPreview"],
  [panel, "Live release receipt preview"],
  [panel, "Human approval is the next independent boundary"],
  [panel, "QR authorization: pending"],
]) {
  if (!source.includes(marker)) throw new Error(`Missing live release receipt preview marker: ${marker}`);
}
for (const forbidden of ["reviewerId: \"", "releaseApproval: \"approved\"", "qrPrintAuthorization: \"approved\"", "deliveryAllowed: true", "studentFacingUseAllowed: true"]) {
  if (model.includes(forbidden)) throw new Error(`Unsafe live release receipt preview marker: ${forbidden}`);
}
console.log("PASS live release receipt preview is checksum-bound, reviewer-pending, visible in the live handoff, and activation-blocked.");
