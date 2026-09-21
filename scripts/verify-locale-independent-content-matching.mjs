import { readFileSync } from "node:fs";

const contentModel = readSource("../packages/content-model/src/index.ts");
const audioControl = readSource("../apps/web/src/features/audio/AudioCueButton.tsx");
const evidenceStore = readSource("../apps/web/src/features/persistence/localSessionEvidenceStore.ts");

requireText(contentModel, "term.trim().toLowerCase()", "Content-model term matching must use locale-independent casing.");
requireText(contentModel, "value.trim().replace(/\\s+/g, \" \").toLowerCase()", "Content-model audio matching must use locale-independent casing.");
requireText(audioControl, "text.trim().replace(/\\s+/g, \" \").toLowerCase()", "Audio controls must use locale-independent casing.");
requireText(evidenceStore, "left < right ? -1 : left > right ? 1 : 0", "Evidence fingerprints must use ordinal metadata ordering.");

for (const [label, source] of [
  ["content model", contentModel],
  ["audio control", audioControl],
  ["browser evidence", evidenceStore],
]) {
  if (source.includes("toLocaleLowerCase") || source.includes("localeCompare")) {
    console.error(`FAIL ${label} must not use locale-sensitive identity comparison.`);
    process.exit(1);
  }
}

console.log("PASS canonical content matching and browser evidence fingerprints are locale-independent.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
