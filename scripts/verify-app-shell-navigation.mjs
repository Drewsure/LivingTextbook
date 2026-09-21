import { readFileSync } from "node:fs";

const navigation = readSource("../apps/web/src/components/layout/AppShellNavigation.tsx");
const appShell = readSource("../apps/web/src/components/layout/AppShell.tsx");
const principles = readSource("../docs/PRINCIPLES_AND_STANDARDS.md");
const decisionRegister = readSource("../docs/DECISION_REGISTER.md");
const decisionRecord = readSource("../docs/decision-register/DR-968-app-shell-current-route.md");
const adr = readSource("../docs/adr/0896-app-shell-current-route.md");
const buildSession = readSource("../docs/build-session-notes/2026-09-21-app-shell-current-route.md");

for (const marker of [
  '"use client"',
  'import { useEffect, useState } from "react";',
  "usePathname",
  "const [isMounted, setIsMounted] = useState(false);",
  "setIsMounted(true);",
  "const activeHref = isMounted ? getMostSpecificActiveHref(pathname, items) : undefined;",
  "getMostSpecificActiveHref",
  'aria-current={isCurrent ? "page" : undefined}',
  'data-nav-current={isCurrent ? "page" : "false"}',
  "right.href.length - left.href.length",
  "focus-visible:outline",
]) {
  requireText(navigation, marker, `AppShell navigation marker missing: ${marker}`);
}

requireText(appShell, "AppShellNavigation", "AppShell must use the shared navigation component.");
requireText(principles, "Shared App Shell Current Route Standard", "Principles document must include the current-route standard.");
requireText(decisionRegister, "DR-968", "Decision register must include DR-968.");
requireText(decisionRecord, "DR-968", "Decision record file must exist.");
requireText(adr, "ADR 0896", "ADR file must exist.");
requireText(buildSession, "App Shell Current Route", "Build session note must exist.");

console.log("PASS shared AppShell navigation exposes one most-specific current route to assistive technology.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
