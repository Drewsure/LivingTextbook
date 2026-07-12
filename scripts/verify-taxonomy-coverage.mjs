import { readFileSync } from "node:fs";

const contentModelPath = new URL("../packages/content-model/src/index.ts", import.meta.url);
const taxonomyPath = new URL("../apps/web/src/data/sampleProgressEventTaxonomy.ts", import.meta.url);

const contentModel = readFileSync(contentModelPath, "utf8");
const taxonomy = readFileSync(taxonomyPath, "utf8");

const gameEventTypeMatch = contentModel.match(/export type GameEventType =([\s\S]*?);/);

if (!gameEventTypeMatch) {
  console.error("FAIL Could not find GameEventType union in packages/content-model/src/index.ts.");
  process.exit(1);
}

const modelEvents = Array.from(gameEventTypeMatch[1].matchAll(/\|\s*"([^"]+)"/g), (match) => match[1]).sort();
const taxonomyEvents = Array.from(taxonomy.matchAll(/eventType:\s*"([^"]+)"/g), (match) => match[1]).sort();
const duplicateTaxonomyEvents = taxonomyEvents.filter((event, index) => taxonomyEvents.indexOf(event) !== index);
const missingFromTaxonomy = modelEvents.filter((event) => !taxonomyEvents.includes(event));
const extraInTaxonomy = taxonomyEvents.filter((event) => !modelEvents.includes(event));
const taxonomyVersion = taxonomy.match(/taxonomyVersion:\s*"([^"]+)"/)?.[1] ?? "";
const requiredFields = ["event_id", "event_type", "event_effect", "taxonomy_version", "event_acceptance_gate_id", "metadata", "occurred_at"];
const missingRequiredFields = requiredFields.filter((field) => !taxonomy.includes(`"${field}"`));

if (taxonomyVersion.trim().length === 0) {
  console.error("FAIL Progress event taxonomy registry must include taxonomyVersion.");
  process.exit(1);
}

if (duplicateTaxonomyEvents.length > 0) {
  console.error(`FAIL Duplicate taxonomy event(s): ${[...new Set(duplicateTaxonomyEvents)].join(", ")}`);
  process.exit(1);
}

if (missingFromTaxonomy.length > 0) {
  console.error(`FAIL GameEventType event(s) missing from taxonomy: ${missingFromTaxonomy.join(", ")}`);
  process.exit(1);
}

if (extraInTaxonomy.length > 0) {
  console.error(`FAIL Taxonomy event(s) not present in GameEventType: ${extraInTaxonomy.join(", ")}`);
  process.exit(1);
}

if (missingRequiredFields.length > 0) {
  console.error(`FAIL Required taxonomy storage field(s) missing: ${missingRequiredFields.join(", ")}`);
  process.exit(1);
}

console.log(`PASS ${taxonomyVersion} covers ${modelEvents.length} shared GameEventType event(s).`);
