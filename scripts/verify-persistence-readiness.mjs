import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-persistence-readiness-"));
const failures = [];

try {
  const source = readFileSync(join(root, "apps", "web", "src", "server", "persistence", "persistenceReadiness.ts"), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const modulePath = join(output, "persistenceReadiness.cjs");
  writeFileSync(modulePath, compiled, "utf8");
  const { derivePersistenceReadiness } = require(modulePath);

  const base = {
    providerConfigurationValid: true,
    providerConfigurationErrors: [],
    durable: true,
    health: { healthy: true, operationEvidenceIntegrityHealthy: true, errors: [] },
    studentSessionBoundaryConfigured: true,
    policyErrors: [],
  };
  assertEqual(derivePersistenceReadiness(base), { status: "healthy", healthy: true, errors: [] }, "healthy durable readiness");
  assertEqual(
    derivePersistenceReadiness({ ...base, policyErrors: ["Release approval is required."] }),
    { status: "blocked", healthy: false, errors: ["Release approval is required."] },
    "durable policy failure",
  );
  assertEqual(
    derivePersistenceReadiness({ ...base, durable: false, policyErrors: ["Durable policy is not configured."] }),
    { status: "healthy", healthy: true, errors: [] },
    "non-durable rehearsal ignores durable-only policy errors",
  );
  const invalid = derivePersistenceReadiness({ ...base, providerConfigurationValid: false, providerConfigurationErrors: ["Unsupported provider."] });
  assertEqual(invalid.status, "blocked", "invalid provider status");
  assertEqual(invalid.healthy, false, "invalid provider health");
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS persistence readiness keeps durable policy failures out of healthy status and preserves rehearsal semantics.");
}

function assertEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}
