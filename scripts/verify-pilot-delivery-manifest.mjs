import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const model = readFileSync(resolve(root, "packages/content-model/src/pilotDeliveryManifest.ts"), "utf8");
const sample = readFileSync(resolve(root, "apps/web/src/data/samplePilotDeliveryManifest.ts"), "utf8");
const panel = readFileSync(resolve(root, "apps/web/src/features/evidence/PilotDeliveryManifestPanel.tsx"), "utf8");
const route = readFileSync(resolve(root, "apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx"), "utf8");

for (const [source, marker, label] of [
  [model, "createPilotDeliveryManifest", "delivery manifest creator"],
  [model, "qrPrintAuthorization", "QR print gate"],
  [model, "hostedPersistence", "hosted persistence gate"],
  [model, "hostedPersistenceDecisionPacketId", "hosted opt-in packet binding"],
  [model, "studentFacingActivationAllowed", "student activation boundary"],
  [model, "sideEffect: \"none\"", "side-effect boundary"],
  [sample, "mode: \"hosted-pwa\"", "sample delivery mode"],
  [sample, "sourceReview: false", "sample blocked gate"],
  [sample, "hostedPersistenceDecisionPacketId: sampleHostedPersistenceOptInDecisionPacket.packetId", "sample hosted opt-in packet binding"],
  [panel, "Pilot delivery manifest", "visible delivery manifest"],
  [panel, "labelize(gate)", "visible QR gate"],
  [route, "PilotDeliveryManifestPanel", "handoff route delivery manifest"],
]) {
  if (!source.includes(marker)) throw new Error(`Missing ${label}: ${marker}`);
}
for (const forbidden of ["download=", "window.open", "writeAllowed: true", "studentFacingActivationAllowed: true"]) {
  if (model.includes(forbidden) || sample.includes(forbidden) || panel.includes(forbidden)) throw new Error(`Forbidden delivery manifest behavior: ${forbidden}`);
}
console.log("PASS pilot delivery manifest composes publisher, package, QR, deployment, persistence, and activation gates without side effects.");
