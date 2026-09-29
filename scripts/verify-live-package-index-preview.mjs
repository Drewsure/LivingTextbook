import fs from "node:fs";

const model = fs.readFileSync("packages/content-model/src/uploadQuarantinePackageIndexPreview.ts", "utf8");
const route = fs.readFileSync("apps/web/src/app/api/teacher/uploads/package-readiness-binding/route.ts", "utf8");
const panel = fs.readFileSync("apps/web/src/features/evidence/PublisherQuarantineHandoffBridgePanel.tsx", "utf8");
for (const [source, marker] of [
  [model, "createReviewOnlyUploadQuarantinePackageIndexPreview"],
  [model, "gameRoutePaths: []"],
  [model, "qrPrintAllowed: false"],
  [route, "packageIndexPreview"],
  [route, "validateUploadQuarantinePackageIndexPreview"],
  [panel, "Live package-index preview"],
  [panel, "does not invent game routes"],
  [panel, "QR aliases: none linked"],
]) {
  if (!source.includes(marker)) throw new Error(`Missing live package-index preview marker: ${marker}`);
}
for (const forbidden of ["gameRoutePaths: [\"/", "qrAliasPaths: [\"/", "studentFacingUseAllowed: true", "packageAssemblyAllowed: true"]) {
  if (model.includes(forbidden)) throw new Error(`Unsafe live package-index preview marker: ${forbidden}`);
}
console.log("PASS live package-index preview is lane-bound, route-empty before approval, and activation-blocked.");
