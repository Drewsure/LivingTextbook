import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-provider-config-"));
const failures = [];

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const adapterDirectory = join(output, "adapter");
  mkdirSync(adapterDirectory, { recursive: true });
  const adapterPath = join(root, "apps", "web", "src", "server", "persistence", "progressionPersistenceAdapter.ts");
  writeFileSync(join(adapterDirectory, "package.json"), '{"type":"commonjs"}\n', "utf8");
  writeFileSync(join(adapterDirectory, "progressionPersistenceAdapter.js"), ts.transpileModule(
    readFileSync(adapterPath, "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  ).outputText, "utf8");
  writeFileSync(join(adapterDirectory, "sqliteProgressionStore.js"),
    'exports.getDurableProgressionStore = () => { throw new Error("durable store must not be instantiated by configuration checks"); };\n',
    "utf8");

  const adapter = require(join(adapterDirectory, "progressionPersistenceAdapter.js"));
  const original = process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER;

  try {
    delete process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER;
    assertConfig(adapter.getPersistenceProviderConfiguration(), {
      provider: "process-memory",
      configuredValue: "process-memory",
      valid: true,
      errors: [],
    }, "unset provider");

    process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER = " sqlite ";
    assertConfig(adapter.getPersistenceProviderConfiguration(), {
      provider: "sqlite",
      configuredValue: "sqlite",
      valid: true,
      errors: [],
    }, "trimmed sqlite provider");

    process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER = "cloud-postgres";
    const invalid = adapter.getPersistenceProviderConfiguration();
    assertConfig(invalid, {
      provider: "process-memory",
      configuredValue: "cloud-postgres",
      valid: false,
      errors: ["Unsupported persistence provider configuration: cloud-postgres. Use process-memory or sqlite."],
    }, "unsupported provider");
    if (adapter.getConfiguredPersistenceProvider() !== "process-memory") {
      failures.push("unsupported provider must not select a non-rehearsal provider");
    }
    assertThrows(
      () => adapter.getProgressionPersistenceAdapter(),
      "Unsupported persistence provider configuration: cloud-postgres. Use process-memory or sqlite.",
      "adapter factory fail-closed",
    );
  } finally {
    if (original === undefined) delete process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER;
    else process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER = original;
  }
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS persistence provider configuration defaults safely, trims supported values, and rejects unsupported values at runtime.");
}

function assertConfig(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

function assertThrows(callback, expectedMessage, label) {
  try {
    callback();
    failures.push(`${label}: expected an error`);
  } catch (error) {
    if (!(error instanceof Error) || error.message !== expectedMessage) {
      failures.push(`${label}: expected ${expectedMessage}, received ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
