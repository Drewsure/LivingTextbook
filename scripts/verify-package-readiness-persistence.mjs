import { readFileSync } from "node:fs";

const model = readSource("../packages/content-model/src/packageReadinessPersistence.ts");
const records = readSource("../packages/content-model/src/persistenceRecords.ts");
const adapter = readSource("../packages/content-model/src/persistenceAdapter.ts");
const sample = readSource("../apps/web/src/data/samplePackageReadinessPersistence.ts");
const panel = readSource("../apps/web/src/features/persistence/PackageReadinessPersistencePanel.tsx");
const route = readSource("../apps/web/src/app/teacher/persistence/page.tsx");
const routeVerifier = readSource("./verify-active-routes.mjs");
const checklist = readSource("../docs/verification/PACKAGE_READINESS_PERSISTENCE_CHECKS.md");
const failures = [];

for (const marker of [
  "PackageReadinessPersistenceIntent",
  "buildPackageReadinessPersistenceIntent",
  "evidenceLaneRefs",
  "sourceExtractionPreviewId",
  "writeAllowed: false",
  "promotionAllowed: false",
  "studentFacingActivationAllowed: false",
  "provider: null",
]) {
  requireText(model, marker, `Shared package readiness persistence model is missing ${marker}.`);
}

for (const marker of [
  "preservesPackageReadinessReconciliation",
  "blocksPackageReadinessPromotion",
]) {
  requireText(records, marker, `Durable record model is missing ${marker}.`);
  requireText(adapter, marker, `Adapter model is missing ${marker}.`);
}

for (const marker of [
  "samplePackageReadinessReconciliations.flatMap",
  '"hosted-database"',
  '"local-classroom-store"',
  "validatePackageReadinessPersistenceIntents",
]) {
  requireText(sample, marker, `Persistence sample is missing ${marker}.`);
}

for (const marker of [
  "Package evidence persistence",
  "Tenant-scoped reconciliation record shape",
  "Provider unselected",
  "Writes blocked",
  "Evidence refs",
  "Source assembly",
  "Extraction preview",
  "Source checksum",
]) {
  requireText(panel, marker, `Persistence panel is missing ${marker}.`);
}

for (const marker of [
  "PackageReadinessPersistencePanel",
  "samplePackageReadinessPersistenceIntents",
  "samplePackageReadinessPersistenceErrors",
]) {
  requireText(route, marker, `Persistence route is missing ${marker}.`);
}

for (const marker of [
  "package-readiness",
  "metadata",
  "blocked",
]) {
  requireText(routeVerifier, marker, `Active route verifier is missing ${marker}.`);
  requireText(checklist, marker, `Persistence checklist is missing ${marker}.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS package readiness persistence covers tenant-scoped hosted/local metadata previews and blocked activation guards.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) failures.push(message);
}
