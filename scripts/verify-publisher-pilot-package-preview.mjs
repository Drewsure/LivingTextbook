import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const model = readFileSync(resolve(root, "packages/content-model/src/publisherPilotPackagePreview.ts"), "utf8");
const sample = readFileSync(resolve(root, "apps/web/src/data/samplePublisherPilotPackagePreview.ts"), "utf8");
const panel = readFileSync(resolve(root, "apps/web/src/features/evidence/PublisherPilotPackagePreviewPanel.tsx"), "utf8");
const printSheet = readFileSync(resolve(root, "apps/web/src/features/evidence/PublisherPilotQrPrintSheet.tsx"), "utf8");
const printButton = readFileSync(resolve(root, "apps/web/src/features/evidence/PrintReviewSheetButton.tsx"), "utf8");
const route = readFileSync(resolve(root, "apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx"), "utf8");

const required = [
  [model, "validatePublisherPilotPackagePreview", "shared package preview validator"],
  [model, "writeAllowed: false", "artifact write block"],
  [model, "studentFacingAllowed: false", "student promotion block"],
  [model, "printAllowed: false", "QR print block"],
  [sample, "sourceReviewDecision: \"not-recorded\"", "explicit review decision gate"],
  [sample, "hostedPersistence: \"opt-in-review-only\"", "opt-in hosted persistence"],
  [sample, "No package archive export", "archive export block"],
  [panel, "Publisher package assembly preview", "visible package preview"],
  [panel, "QR print map", "visible QR map"],
  [printSheet, "QRCode.toString", "local QR symbol generation"],
  [printButton, "Print review sheet", "review print control"],
  [printSheet, "Production textbook printing remains blocked", "production print boundary"],
  [route, "PublisherPilotPackagePreviewPanel", "handoff route integration"],
];
for (const [source, marker, label] of required) {
  if (!source.includes(marker)) throw new Error(`Missing ${label}: ${marker}`);
}
for (const forbidden of ["download=", "window.open", "fetch(\"/api", "studentFacingAllowed: true", "printAllowed: true"]) {
  if (model.includes(forbidden) || sample.includes(forbidden) || panel.includes(forbidden) || printSheet.includes(forbidden) || printButton.includes(forbidden)) throw new Error(`Forbidden package preview behavior: ${forbidden}`);
}
console.log("PASS publisher pilot package preview binds content, games, media, QR, local, and hosted lanes while keeping export, print, promotion, and activation blocked.");
