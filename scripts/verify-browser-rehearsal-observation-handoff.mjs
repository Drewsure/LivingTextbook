import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-browser-observation-handoff-"));
const contract = readFileSync(join(root, "packages", "content-model", "src", "browserRehearsalObservation.ts"), "utf8");
const handoff = readFileSync(join(root, "packages", "content-model", "src", "browserRehearsalObservationHandoff.ts"), "utf8");
writeFileSync(join(output, "browserRehearsalObservation.js"), transpile(contract), "utf8");
writeFileSync(join(output, "browserRehearsalObservationHandoff.js"), transpile(handoff), "utf8");

try {
  const { createBrowserRehearsalObservationHandoff, validateBrowserRehearsalObservationHandoff } = await import(pathToFile(join(output, "browserRehearsalObservationHandoff.js")));
  const observation = {
    version: 1,
    observationId: "observation-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    launchCode: "launch-a",
    unitKey: "tenant-a:curriculum-a:L1:U1",
    studentSessionId: "launch-a:student-a",
    mode: "human-observed",
    reviewerRole: "teacher",
    reviewerRef: "teacher-session:launch-a",
    observedAt: "2026-09-23T00:00:00.000Z",
    routePaths: ["/memory/launch-a", "/teacher/sessions/launch-a"],
    checkIds: ["memory-match", "teacher-report"],
    status: "review-only",
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
  };
  const valid = createBrowserRehearsalObservationHandoff(observation);
  assert(validateBrowserRehearsalObservationHandoff(valid).length === 0, "valid observation handoff must pass");
  const promotion = { ...valid, releasePromotionAllowed: true };
  assert(validateBrowserRehearsalObservationHandoff(promotion).some((error) => error.includes("promotion must remain false")), "promotion drift must be rejected");
  const tenantDrift = { ...valid, unitKey: "tenant-b:curriculum-a:L1:U1" };
  assert(validateBrowserRehearsalObservationHandoff(tenantDrift).some((error) => error.includes("tenant-scoped")), "tenant drift must be rejected");
  console.log("PASS browser observation handoff preserves review-only destination, blocked actions, and tenant/promotion boundaries.");
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
