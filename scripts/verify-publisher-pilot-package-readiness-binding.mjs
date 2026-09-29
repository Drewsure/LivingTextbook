import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const model = readFileSync(resolve(root, "packages/content-model/src/publisherPilotPackageReadinessBinding.ts"), "utf8");
const sample = readFileSync(resolve(root, "apps/web/src/data/samplePublisherPilotPackageReadinessBinding.ts"), "utf8");
const panel = readFileSync(resolve(root, "apps/web/src/features/evidence/PublisherPilotPackageReadinessBindingPanel.tsx"), "utf8");
const route = readFileSync(resolve(root, "apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx"), "utf8");
const index = readFileSync(resolve(root, "packages/content-model/src/index.ts"), "utf8");

for (const [source, markers, label] of [
  [model, ["PublisherPilotPackageReadinessBinding", "createReviewOnlyPublisherPilotPackageReadinessBinding", "validatePublisherPilotPackageReadinessBindingRecord", "validatePublisherPilotPackageReadinessBindingAgainstSources", "PUBLISHER_PILOT_PACKAGE_READINESS_CHECKS"], "shared binding model"],
  [sample, ["samplePublisherPilotPackageReadinessBinding", "quarantine-review", "assembly-preflight", "hosted-opt-in", "createReviewOnlyPublisherPilotPackageReadinessBinding"], "sample binding"],
  [panel, ["Publisher package readiness binding", "One auditable status", "Blocked reasons", "Package assembly", "Student use"], "binding panel"],
  [route, ["PublisherPilotPackageReadinessBindingPanel", "samplePublisherPilotPackageReadinessBinding"], "handoff route integration"],
  [index, ["./publisherPilotPackageReadinessBinding"], "content-model export"],
]) {
  for (const marker of markers) if (!source.includes(marker)) throw new Error(`Missing ${label} marker: ${marker}`);
}

for (const forbidden of [
  "packageAssemblyAllowed: true",
  "promotionAllowed: true",
  "studentFacingUseAllowed: true",
  "writeFile(",
  "download=",
  "window.open",
]) {
  if (model.includes(forbidden) || sample.includes(forbidden) || panel.includes(forbidden)) throw new Error(`Forbidden readiness binding behavior: ${forbidden}`);
}

console.log("PASS publisher pilot readiness binding joins review, assembly, delivery, release, and hosted opt-in lineage without enabling writes or student use.");
