import { readFileSync } from "node:fs";

const appShell = readSource("../apps/web/src/components/layout/AppShell.tsx");
const principles = readSource("../docs/PRINCIPLES_AND_STANDARDS.md");
const decisionRegister = readSource("../docs/DECISION_REGISTER.md");
const decisionRecord = readSource("../docs/decision-register/DR-966-shared-app-shell-skip-navigation.md");
const adr = readSource("../docs/adr/0894-shared-app-shell-skip-navigation.md");
const buildSession = readSource("../docs/build-session-notes/2026-09-21-shared-app-shell-skip-navigation.md");

const requiredMarkers = [
  'href="#main-content"',
  "Skip to content",
  'id="main-content"',
  "tabIndex={-1}",
  "focus:not-sr-only",
  "focus:bg-[var(--tenant-primary)]",
];

for (const marker of requiredMarkers) {
  requireText(appShell, marker, `AppShell accessibility marker missing: ${marker}`);
}

requireText(principles, "Shared App Shell Skip Navigation Standard", "Principles document must include the shared skip-navigation standard.");
requireText(decisionRegister, "DR-966", "Decision register must include DR-966.");
requireText(decisionRecord, "DR-966", "Decision record file must exist.");
requireText(adr, "ADR 0894", "ADR file must exist.");
requireText(buildSession, "Shared App Shell Skip Navigation", "Build session note must exist.");

console.log("PASS shared AppShell exposes tenant-themed skip navigation and a focusable main-content target.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
