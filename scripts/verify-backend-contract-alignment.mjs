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

  const missingScopedTenantFieldPlan = {
    ...migrationSpecPlan,
    specs: migrationSpecPlan.specs.map((spec) =>
      spec.specId === "spec-media-manifest"
        ? { ...spec, fields: spec.fields.filter((field) => field.name !== "tenant_id") }
        : spec,
    ),
  };
  const missingScopedTenantFieldErrors = alignment.validateBackendContractAlignment({
    schema,
    migrationPlan,
    migrationSpecPlan: missingScopedTenantFieldPlan,
  });
  if (!missingScopedTenantFieldErrors.includes("Backend migration spec spec-media-manifest must declare tenant_id in its fields when tenantScope requires tenant_id.")) {
    throw new Error("Backend contract alignment did not reject a tenant-scoped spec missing tenant_id.");
  }

  const missingPrimaryKeyPlan = {
    ...migrationSpecPlan,
    specs: migrationSpecPlan.specs.map((spec) =>
      spec.specId === "spec-media-manifest"
        ? { ...spec, fields: spec.fields.filter((field) => field.name !== spec.primaryKey) }
        : spec,
    ),
  };
  const missingPrimaryKeyErrors = alignment.validateBackendContractAlignment({
    schema,
    migrationPlan,
    migrationSpecPlan: missingPrimaryKeyPlan,
  });
  if (!missingPrimaryKeyErrors.includes("Backend migration spec spec-media-manifest must declare its primary key media_id in its fields.")) {
    throw new Error("Backend contract alignment did not reject a migration spec missing its primary key field.");
  }

  const optionalPrimaryKeyPlan = {
    ...migrationSpecPlan,
    specs: migrationSpecPlan.specs.map((spec) =>
      spec.specId === "spec-media-manifest"
        ? {
            ...spec,
            fields: spec.fields.map((field) =>
              field.name === spec.primaryKey ? { ...field, required: false } : field,
            ),
          }
        : spec,
    ),
  };
  const optionalPrimaryKeyErrors = alignment.validateBackendContractAlignment({
    schema,
    migrationPlan,
    migrationSpecPlan: optionalPrimaryKeyPlan,
  });
  if (!optionalPrimaryKeyErrors.includes("Backend migration spec spec-media-manifest must mark its primary key media_id as required.")) {
    throw new Error("Backend contract alignment did not reject an optional primary key field.");
  }

  const actionableWithoutSpecPlan = {
    ...migrationPlan,
    candidates: migrationPlan.candidates.map((candidate) =>
      candidate.migrationId === "m008-local-classroom-export-store"
        ? { ...candidate, status: "ready-to-design" }
        : candidate,
    ),
  };
  const actionableWithoutSpecErrors = alignment.validateBackendContractAlignment({
    schema,
    migrationPlan: actionableWithoutSpecPlan,
    migrationSpecPlan,
  });
  if (!actionableWithoutSpecErrors.includes("Backend migration candidate m008-local-classroom-export-store must have at least one migration spec before it is actionable.")) {
    throw new Error("Backend contract alignment did not reject an actionable candidate without a migration spec.");
  }

  const policyReadySpecPlan = {
    ...migrationSpecPlan,
    specs: migrationSpecPlan.specs.map((spec) =>
      spec.specId === "spec-package-release-candidate"
        ? { ...spec, status: "ready-for-review" }
        : spec,
    ),
  };
  const policyReadySpecErrors = alignment.validateBackendContractAlignment({
    schema,
    migrationPlan,
    migrationSpecPlan: policyReadySpecPlan,
  });
  if (!policyReadySpecErrors.includes("Backend migration spec spec-package-release-candidate must be blocked-by-policy while candidate m005-publish-gate-and-approval-ledger needs policy.")) {
    throw new Error("Backend contract alignment did not reject a ready spec for a policy-blocked candidate.");
  }

  const malformedSchema = {
    ...schema,
    entities: schema.entities.map((entity) =>
      entity.entityId === "tenant"
        ? {
            ...entity,
            fields: entity.fields.map((field) =>
              field.name === "display_name" ? { ...field, type: "" } : field,
            ),
          }
        : entity,
    ),
  };
  const malformedSchemaErrors = alignment.validateBackendContractAlignment({
    schema: malformedSchema,
    migrationPlan,
    migrationSpecPlan,
  });
  if (!malformedSchemaErrors.includes("Backend schema entity tenant field display_name must name its type.")) {
    throw new Error("Backend contract alignment did not reject a schema field without a type.");
  }

  const missingSchemaTenantIndex = {
    ...schema,
    entities: schema.entities.map((entity) =>
      entity.entityId === "media_manifest"
        ? { ...entity, indexes: entity.indexes.filter((index) => !index.includes("tenant_id")) }
        : entity,
    ),
  };
  const missingSchemaTenantIndexErrors = alignment.validateBackendContractAlignment({
    schema: missingSchemaTenantIndex,
    migrationPlan,
    migrationSpecPlan,
  });
  if (!missingSchemaTenantIndexErrors.includes("Backend schema entity media_manifest must declare a tenant-aware index when it has tenant_id.")) {
    throw new Error("Backend contract alignment did not reject a schema without a tenant-aware index.");
  }

  const missingMigrationTenantIndexPlan = {
    ...migrationSpecPlan,
    specs: migrationSpecPlan.specs.map((spec) =>
      spec.specId === "spec-media-manifest"
        ? { ...spec, indexes: spec.indexes.filter((index) => !index.includes("tenant_id")) }
        : spec,
    ),
  };
  const missingMigrationTenantIndexErrors = alignment.validateBackendContractAlignment({
    schema,
    migrationPlan,
    migrationSpecPlan: missingMigrationTenantIndexPlan,
  });
  if (!missingMigrationTenantIndexErrors.includes("Backend migration spec spec-media-manifest must declare a tenant-aware index when tenantScope requires tenant_id.")) {
    throw new Error("Backend contract alignment did not reject a migration spec without a tenant-aware index.");
  }

  const duplicateSchemaIndex = {
    ...schema,
    entities: schema.entities.map((entity) =>
      entity.entityId === "media_manifest"
        ? { ...entity, indexes: [...entity.indexes, entity.indexes[0]] }
        : entity,
    ),
  };
  const duplicateSchemaIndexErrors = alignment.validateBackendContractAlignment({
    schema: duplicateSchemaIndex,
    migrationPlan,
    migrationSpecPlan,
  });
  if (!duplicateSchemaIndexErrors.includes("Backend schema entity media_manifest contains duplicate index tenant_id + media_id.")) {
    throw new Error("Backend contract alignment did not reject a duplicate schema index.");
  }

  const duplicateTargetPlan = {
    ...migrationPlan,
    candidates: migrationPlan.candidates.map((candidate) =>
      candidate.migrationId === "m004-media-manifest-rights"
        ? { ...candidate, targetEntities: [...candidate.targetEntities, candidate.targetEntities[0]] }
        : candidate,
    ),
  };
  const duplicateTargetErrors = alignment.validateBackendContractAlignment({
    schema,
    migrationPlan: duplicateTargetPlan,
    migrationSpecPlan,
  });
  if (!duplicateTargetErrors.includes("Backend migration m004-media-manifest-rights must not repeat a schema entity target.")) {
    throw new Error("Backend contract alignment did not reject a duplicate migration target.");
  }

  const malformedMigrationFieldPlan = {
    ...migrationSpecPlan,
    specs: migrationSpecPlan.specs.map((spec) =>
      spec.specId === "spec-media-manifest"
        ? {
            ...spec,
            fields: spec.fields.map((field) =>
              field.name === "media_id" ? { ...field, required: "yes" } : field,
            ),
          }
        : spec,
    ),
  };
  const malformedMigrationFieldErrors = alignment.validateBackendContractAlignment({
    schema,
    migrationPlan,
    migrationSpecPlan: malformedMigrationFieldPlan,
  });
  if (!malformedMigrationFieldErrors.includes("Backend migration spec spec-media-manifest field media_id must declare required as a boolean.")) {
    throw new Error("Backend contract alignment did not reject a migration field with a non-boolean required flag.");
  }

  console.log("PASS backend contract alignment resolves all sample schema entities, migration candidates, and migration specs.");
} finally {
  rmSync(output, { recursive: true, force: true });
}
