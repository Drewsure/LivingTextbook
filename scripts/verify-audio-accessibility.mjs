import { readFileSync } from "node:fs";

const audioSource = readSource("../apps/web/src/features/audio/AudioCueButton.tsx");
const principles = readSource("../docs/PRINCIPLES_AND_STANDARDS.md");
const decisionRegister = readSource("../docs/DECISION_REGISTER.md");
const decisionRecord = readSource("../docs/decision-register/DR-967-audio-status-accessibility.md");
const adr = readSource("../docs/adr/0895-audio-status-accessibility.md");
const buildSession = readSource("../docs/build-session-notes/2026-09-21-audio-status-accessibility.md");

for (const marker of [
  "useId",
  "aria-describedby={statusId}",
  'role="status"',
  'aria-live="polite"',
  'aria-atomic="true"',
  "getAudioStatusMessage",
  "Audio ready. Activate to listen.",
  "Audio playing.",
  "Audio unavailable. Text-to-speech is not available.",
  ".toLowerCase()",
]) {
  requireText(audioSource, marker, `Shared audio accessibility marker missing: ${marker}`);
}

requireText(principles, "Shared Audio Status Accessibility Standard", "Principles document must include the audio status standard.");
requireText(decisionRegister, "DR-967", "Decision register must include DR-967.");
requireText(decisionRecord, "DR-967", "Decision record file must exist.");
requireText(adr, "ADR 0895", "ADR file must exist.");
requireText(buildSession, "Audio Status Accessibility", "Build session note must exist.");

console.log("PASS shared audio controls expose deterministic status feedback to assistive technology.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
