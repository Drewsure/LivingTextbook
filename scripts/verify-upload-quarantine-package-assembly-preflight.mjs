import { readFileSync } from "node:fs";

const model = readSource("../packages/content-model/src/uploadQuarantinePackageAssemblyPreflight.ts");
const index = readSource("../packages/content-model/src/index.ts");
const route = readSource("../apps/web/src/app/api/teacher/uploads/package-assembly-preflight/route.ts");
const panel = readSource("../apps/web/src/features/evidence/PublisherQuarantineHandoffBridgePanel.tsx");
const failures = [];

for (const marker of [
  "UploadQuarantinePackageAssemblyPreflight",
  "createUploadQuarantinePackageAssemblyPreflight",
  "validateUploadQuarantinePackageAssemblyPreflight",
  "ready-for-manual-assembly",
  "assemblyWriteAllowed: false",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
  "mode: \"review-only\"",
  "sideEffect: \"none\"",
]) requireText(model, marker, `Package assembly preflight model missing marker: ${marker}.`);

requireText(index, "./uploadQuarantinePackageAssemblyPreflight", "Content model must export package assembly preflight.");
for (const marker of [
  "createUploadQuarantinePackageAssemblyPreflight",
  "readQuarantinePackageEvidenceReview",
  "complete reviewed multimedia and game evidence sidecar is not linked",
  "readQuarantinePackageReviewPacket",
  "An approved delivery manifest is not linked",
  "An approved delivery manifest is not linked",
  "assemblyWriteAllowed: false",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
]) requireText(route, marker, `Package assembly preflight route missing marker: ${marker}.`);

for (const marker of [
  "Assembly preflight",
  "/api/teacher/uploads/package-assembly-preflight",
  "Required package inputs",
  "Assembly blockers",
  "package writer",
]) requireText(panel, marker, `Package assembly preflight panel missing marker: ${marker}.`);

for (const source of [model, route, panel]) {
  for (const forbidden of ["assemblyWriteAllowed: true", "promotionAllowed: true", "studentFacingUseAllowed: true", "rawPayloadIncluded: true", "window.location"]) {
    if (source.includes(forbidden)) failures.push(`Package assembly preflight must not enable: ${forbidden}.`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS package assembly preflight joins the durable review packet to required delivery inputs without enabling writes, promotion, or student use.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) failures.push(message);
}
