import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const route = fs.readFileSync(path.join(root, "apps/web/src/app/q/[...segments]/page.tsx"), "utf8");
const registryModel = fs.readFileSync(path.join(root, "packages/content-model/src/pilotQrAliasRegistry.ts"), "utf8");
const registrySample = fs.readFileSync(path.join(root, "apps/web/src/data/samplePilotQrAliasRegistry.ts"), "utf8");
const registryPanel = fs.readFileSync(path.join(root, "apps/web/src/features/evidence/PilotQrAliasRegistryPreviewPanel.tsx"), "utf8");
const handoffRoute = fs.readFileSync(path.join(root, "apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx"), "utf8");
const failures = [];

for (const fragment of [
  "createReviewOnlyQrAliasRuntimeAdapter",
  "sampleQrAliasRollbackEvidence",
  "rollbackPreview",
  "No live mutation",
  "cannot write a redirect",
]) {
  if (!route.includes(fragment)) failures.push(`QR preview route is missing ${fragment}`);
}

if (/window\.location\s*=|NextResponse\.redirect|redirect\(/.test(route)) {
  failures.push("QR preview route must not perform a redirect mutation");
}

for (const [source, checks] of [
  [registryModel, [
    "export interface PilotQrAliasRegistryPreview",
    "createPilotQrAliasRegistryPreview",
    "Durable QR alias registry persistence is not selected.",
    "productionPrintAllowed: false",
    "routeMutationAllowed: false",
    "studentFacingActivationAllowed: false",
    "Pilot QR alias registry alias paths must be unique.",
  ]],
  [registrySample, [
    "samplePilotDeliveryManifest",
    "samplePilotDeliveryReleaseReceipt",
    "samplePublisherPilotPackagePreview.qrPreviews.map",
    "validatePilotQrAliasRegistryPreview",
  ]],
  [registryPanel, [
    "QR alias registry preview",
    "Stable textbook aliases, bound before printing",
    "Production print blocked",
    "Rollback evidence pending",
  ]],
  [handoffRoute, [
    "PilotQrAliasRegistryPreviewPanel",
    "samplePilotQrAliasRegistry",
  ]],
]) {
  for (const check of checks) {
    if (!source.includes(check)) failures.push(`QR alias registry preview integration is missing ${check}`);
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS QR preview consumes the review-only alias adapter without redirect mutation.");
}
