import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-backend-contract-"));

try {
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--skipLibCheck",
    "--rootDir", join(root, "apps", "web", "src"),
    "--outDir", output,
    "apps/web/src/data/backendContractAlignment.ts",
    "apps/web/src/data/sampleBackendContractAlignment.ts",
  ], { cwd: root, encoding: "utf8" });

  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const sample = require(join(output, "data", "sampleBackendContractAlignment.js"));
  if (sample.sampleBackendContractAlignmentErrors.length > 0) {
    throw new Error(sample.sampleBackendContractAlignmentErrors.join("\n"));
  }

  const alignment = require(join(output, "data", "backendContractAlignment.js"));
  const schema = require(join(output, "data", "sampleBackendSchemaDraft.js")).sampleBackendSchemaDraft;
  const migrationPlan = require(join(output, "data", "sampleBackendMigrationCandidates.js")).sampleBackendMigrationPlan;
  const migrationSpecPlan = require(join(output, "data", "sampleBackendMigrationSpecs.js")).sampleBackendMigrationSpecPlan;
  const missingTenantFieldPlan = {
    ...migrationSpecPlan,
    specs: migrationSpecPlan.specs.map((spec) =>
      spec.specId === "spec-evidence-packet"
        ? { ...spec, fields: spec.fields.filter((field) => field.name !== "tenant_id") }
        : spec,
    ),
  };
  const missingTenantFieldErrors = alignment.validateBackendContractAlignment({
    schema,
    migrationPlan,
    migrationSpecPlan: missingTenantFieldPlan,
  });
  if (!missingTenantFieldErrors.includes("Backend migration spec spec-evidence-packet must preserve required field tenant_id for schema entity evidence_packet.")) {
    throw new Error("Backend contract alignment did not reject an evidence spec missing tenant_id.");
  }

  console.log("PASS backend contract alignment resolves all sample schema entities, migration candidates, and migration specs.");
} finally {
  rmSync(output, { recursive: true, force: true });
}
