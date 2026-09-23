import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-browser-observation-adjudication-"));
const model = readFileSync(join(root, "packages", "content-model", "src", "browserRehearsalObservationAdjudication.ts"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "release", "BrowserEvidenceAdjudicationPanel.tsx"), "utf8");
const store = readFileSync(join(root, "apps", "web", "src", "features", "persistence", "browserRehearsalObservationAdjudicationStore.ts"), "utf8");
writeFileSync(join(output, "browserRehearsalObservationAdjudication.js"), transpile(model), "utf8");

try {
  const { createBrowserRehearsalObservationAdjudication, validateBrowserRehearsalObservationAdjudication } = await import(pathToFile(join(output, "browserRehearsalObservationAdjudication.js")));
  const handoff = {
    version: 1,
    handoffId: "browser-observation-handoff:observation-a",
    handoffKind: "browser-observation-review",
    sourceObservationId: "observation-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    launchCode: "launch-a",
    unitKey: "tenant-a:curriculum-a:L1:U1",
    studentSessionId: "launch-a:student-a",
    routePaths: ["/memory/launch-a", "/teacher/sessions/launch-a"],
    checkIds: ["memory-match", "teacher-report"],
    status: "review-only",
    reviewDestination: "adult-evidence-review",
    exportAllowed: false,
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
    blockedActions: ["No evidence export"],
    nextGate: ["Adult reviewer adjudication"],
  };
  const accepted = createBrowserRehearsalObservationAdjudication(handoff, {
    reviewerRole: "teacher",
    reviewerRef: "teacher-session:launch-a",
    decision: "accepted-for-next-gate",
    reviewerNote: "Observed the bound routes and recorded the remaining release gates.",
    adjudicatedAt: "2026-09-24T00:00:00.000Z",
  });
  assert(validateBrowserRehearsalObservationAdjudication(accepted, handoff).length === 0, "valid adjudication must pass");
  assert(validateBrowserRehearsalObservationAdjudication({ ...accepted, releasePromotionAllowed: true }, handoff).some((error) => error.includes("promotion must remain false")), "promotion drift must be rejected");
  assert(validateBrowserRehearsalObservationAdjudication({ ...accepted, tenantId: "tenant-b" }, handoff).some((error) => error.includes("preserve handoff tenantId")), "tenant drift must be rejected");
  assert(validateBrowserRehearsalObservationAdjudication({ ...accepted, reviewerNote: "" }, handoff).some((error) => error.includes("reviewerNote must be non-empty")), "blank reviewer note must be rejected");
  assert(store.includes("sameLookup") && store.includes("localStorage"), "adjudication store must use exact local browser scope");
  assert(panel.includes("Accept for next review gate") && panel.includes("Record blocked decision"), "release review panel must expose both bounded decisions");
  assert(panel.includes("does not write hosted persistence") && panel.includes("cannot launch students"), "release review panel must preserve side-effect boundary");
  console.log("PASS browser observation adjudication preserves exact handoff identity, explicit reviewer decisions, and review-only boundaries.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function transpile(source) {
  return ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
}

function pathToFile(path) {
  return `file:///${path.replaceAll("\\", "/")}`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
