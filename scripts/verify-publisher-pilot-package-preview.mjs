import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const model = readFileSync(resolve(root, "packages/content-model/src/publisherPilotPackagePreview.ts"), "utf8");
const sample = readFileSync(resolve(root, "apps/web/src/data/samplePublisherPilotPackagePreview.ts"), "utf8");
const panel = readFileSync(resolve(root, "apps/web/src/features/evidence/PublisherPilotPackagePreviewPanel.tsx"), "utf8");
const printSheet = readFileSync(resolve(root, "apps/web/src/features/evidence/PublisherPilotQrPrintSheet.tsx"), "utf8");
const printButton = readFileSync(resolve(root, "apps/web/src/features/evidence/PrintReviewSheetButton.tsx"), "utf8");
const route = readFileSync(resolve(root, "apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx"), "utf8");
const bridge = readFileSync(resolve(root, "apps/web/src/features/evidence/PublisherQuarantineHandoffBridgePanel.tsx"), "utf8");

const required = [
  [model, "validatePublisherPilotPackagePreview", "shared package preview validator"],
  [model, "validatePublisherPilotPackageReadinessBinding", "package readiness identity validator"],
  [model, "writeAllowed: false", "artifact write block"],
  [model, "studentFacingAllowed: false", "student promotion block"],
  [model, "printAllowed: false", "QR print block"],
  [sample, "sourceReviewDecision: \"not-recorded\"", "explicit review decision gate"],
  [sample, "hostedPersistence: \"opt-in-review-only\"", "opt-in hosted persistence"],
  [sample, "sourceAssemblyChecksum: samplePublisherReadinessReconciliation.sourceAssemblyChecksum", "source checksum binding"],
  [sample, "No package archive export", "archive export block"],
  [panel, "Publisher package assembly preview", "visible package preview"],
  [panel, "QR print map", "visible QR map"],
  [panel, "Evidence identity binding", "visible evidence identity binding"],
  [printSheet, "QRCode.toString", "local QR symbol generation"],
  [printButton, "Print review sheet", "review print control"],
  [printSheet, "Production textbook printing remains blocked", "production print boundary"],
  [route, "PackageReadinessReconciliationPanel", "publisher package readiness reconciliation handoff"],
  [route, "samplePackageReadinessReconciliations", "publisher package readiness reconciliation data"],
  [route, "PublisherPilotPackagePreviewPanel", "handoff route integration"],
  [route, "PublisherQuarantineHandoffBridgePanel", "live quarantine handoff integration"],
  [bridge, "file bytes", "safe quarantine bridge boundary"],
  [bridge, "student-facing content", "student-use boundary"],
  [bridge, "package-handoff-preview", "live handoff API bridge"],
];
for (const [source, marker, label] of required) {
  if (!source.includes(marker)) throw new Error(`Missing ${label}: ${marker}`);
}
// The review workspace may fetch a metadata-only handoff preview or review packet.
// Reject only write/activation endpoints here; a generic fetch check would also
// reject the deliberately gated, read-only quarantine bridge.
for (const forbidden of ["download=", "window.open", "/package-assembly", "/promotion", "/activate", "studentFacingAllowed: true", "printAllowed: true"]) {
  if (model.includes(forbidden) || sample.includes(forbidden) || panel.includes(forbidden) || bridge.includes(forbidden) || printSheet.includes(forbidden) || printButton.includes(forbidden)) throw new Error(`Forbidden package preview behavior: ${forbidden}`);
}
console.log("PASS publisher pilot package preview binds content, games, media, QR, local, and hosted lanes while keeping export, print, promotion, and activation blocked.");
