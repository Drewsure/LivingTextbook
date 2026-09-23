import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-browser-observation-"));
const tsc = join(root, "node_modules", "typescript", "bin", "tsc");

try {
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--skipLibCheck",
    "--rootDir", join(root, "packages", "content-model", "src"),
    "--outDir", output,
    "packages/content-model/src/browserRehearsalObservation.ts",
  ], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const { validateBrowserRehearsalObservation } = require(join(output, "browserRehearsalObservation.js"));
  const valid = {
    version: 1,
    observationId: "observation-1",
    tenantId: "sample-publisher",
    packageId: "sample-publisher-package",
    launchCode: "demo-unit-1",
    unitKey: "sample-publisher:starter:L1:U1",
    studentSessionId: "demo-unit-1:student",
    mode: "human-observed",
    reviewerRole: "teacher",
    reviewerRef: "teacher-reviewer-ref",
    observedAt: "2026-09-23T00:00:00.000Z",
    routePaths: ["/launch/demo-unit-1", "/memory/demo-unit-1", "/teacher/sessions/demo-unit-1"],
    checkIds: ["front-door", "memory-match", "teacher-report"],
    status: "review-only",
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
  };
  assertEmpty(validateBrowserRehearsalObservation(valid), "valid observation");

  const roleMismatch = structuredClone(valid);
  roleMismatch.reviewerRole = "automation";
  assertIncludes(validateBrowserRehearsalObservation(roleMismatch), "must identify a teacher reviewer", "human reviewer role");

  const tenantDrift = structuredClone(valid);
  tenantDrift.unitKey = "other-tenant:starter:L1:U1";
  assertIncludes(validateBrowserRehearsalObservation(tenantDrift), "must remain tenant-scoped", "tenant scope");

  const promotion = structuredClone(valid);
  promotion.releasePromotionAllowed = true;
  assertIncludes(validateBrowserRehearsalObservation(promotion), "promotion must remain false", "promotion boundary");

  const duplicateRoute = structuredClone(valid);
  duplicateRoute.routePaths = ["/memory/demo-unit-1", "/memory/demo-unit-1"];
  assertIncludes(validateBrowserRehearsalObservation(duplicateRoute), "routes must be unique", "route uniqueness");

  console.log("PASS browser rehearsal observation contract accepts teacher review receipts and rejects role, tenant, route, and promotion drift.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assertEmpty(errors, label) {
  if (errors.length > 0) throw new Error(`${label} unexpectedly failed: ${errors.join(" | ")}`);
}

function assertIncludes(errors, expected, label) {
  if (!errors.some((error) => error.includes(expected))) throw new Error(`${label} did not include ${expected}: ${errors.join(" | ")}`);
}
