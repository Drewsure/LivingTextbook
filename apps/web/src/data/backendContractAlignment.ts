import type { BackendSchemaDraft } from "./sampleBackendSchemaDraft";
import type { BackendMigrationPlan } from "./sampleBackendMigrationCandidates";
import type { BackendMigrationSpecPlan } from "./sampleBackendMigrationSpecs";

export interface BackendContractAlignmentInput {
  schema: BackendSchemaDraft;
  migrationPlan: BackendMigrationPlan;
  migrationSpecPlan: BackendMigrationSpecPlan;
}

const REQUIRED_MIGRATION_FIELDS_BY_ENTITY: Record<string, string[]> = {
  evidence_packet: ["evidence_packet_id", "scope_kind", "tenant_id"],
  evidence_attachment: ["attachment_id", "scope_kind", "tenant_id"],
};

const SUPPORTED_SCHEMA_ENTITY_STATUSES = new Set(["draft", "required-before-pilot", "policy-required"]);
const SUPPORTED_SCHEMA_DEPLOYMENT_FITS = new Set(["hosted", "local", "hybrid"]);
const SUPPORTED_MIGRATION_TRACKS = new Set(["hosted-pilot", "local-classroom", "shared"]);
const SUPPORTED_MIGRATION_CANDIDATE_STATUSES = new Set(["ready-to-design", "needs-policy", "defer"]);
const SUPPORTED_MIGRATION_CANDIDATE_RISKS = new Set(["low", "medium", "high"]);
const SUPPORTED_MIGRATION_SPEC_STATUSES = new Set(["draft", "ready-for-review", "blocked-by-policy"]);
const SUPPORTED_MIGRATION_STORE_KINDS = new Set([
  "admin-record",
  "release-record",
  "session-record",
  "event-record",
  "collection-record",
]);
const SUPPORTED_BACKEND_FIELD_TYPES = new Set([
  "boolean",
  "coded string",
  "datetime",
  "enum",
  "enum/string",
  "foreign key/string",
  "integer",
  "json",
  "json[]",
  "json/child records",
  "json/object",
  "json/object array",
  "json/string array",
  "number",
  "role/id",
  "role/id or label",
  "role/string",
  "route/string",
  "semver/string",
  "stable id",
  "string",
  "string array/json",
  "string enum",
  "string[]",
  "string/json",
  "string/null",
  "timestamp",
]);

/**
 * Checks the relationships between the vendor-neutral schema, migration
 * candidates, and migration specifications before any vendor implementation.
 */
export function validateBackendContractAlignment({
  schema,
  migrationPlan,
  migrationSpecPlan,
}: BackendContractAlignmentInput): string[] {
  const errors: string[] = [];
  const schemaEntityIds = new Set<string>();
  const schemaFieldsByEntity = new Map<string, Set<string>>();
  const schemaFieldTypesByEntity = new Map<string, Map<string, string>>();
  const schemaRequiredFieldsByEntity = new Map<string, Set<string>>();
  const schemaDeploymentFitByEntity = new Map<string, string>();
  const migrationIds = new Set<string>();
  const specIds = new Set<string>();

  if (schema.draftId.trim().length === 0 || schema.label.trim().length === 0 || schema.summary.trim().length === 0 || schema.decisionRule.trim().length === 0) {
    errors.push("Backend schema draft must declare draftId, label, summary, and decisionRule.");
  }
  if (schema.crossCuttingRules.length === 0 || schema.crossCuttingRules.some((rule) => rule.trim().length === 0)) {
    errors.push("Backend schema draft must declare non-empty cross-cutting rules.");
  }
  if (!schema.migrationFieldExtensions || typeof schema.migrationFieldExtensions !== "object") {
    errors.push("Backend schema draft must declare migration field extensions explicitly.");
  }
  if (migrationPlan.planId.trim().length === 0 || migrationPlan.label.trim().length === 0 || migrationPlan.summary.trim().length === 0 || migrationPlan.sequencingRule.trim().length === 0) {
    errors.push("Backend migration plan must declare planId, label, summary, and sequencingRule.");
  }
  if (migrationPlan.standingRules.length === 0 || migrationPlan.standingRules.some((rule) => rule.trim().length === 0)) {
    errors.push("Backend migration plan must declare non-empty standing rules.");
  }
  if (migrationSpecPlan.planId.trim().length === 0 || migrationSpecPlan.label.trim().length === 0 || migrationSpecPlan.summary.trim().length === 0 || migrationSpecPlan.implementationRule.trim().length === 0) {
    errors.push("Backend migration spec plan must declare planId, label, summary, and implementationRule.");
  }

  for (const entity of schema.entities) {
    if (schemaEntityIds.has(entity.entityId)) {
      errors.push(`Backend schema contains duplicate entity ${entity.entityId}.`);
    }
    schemaEntityIds.add(entity.entityId);
    schemaDeploymentFitByEntity.set(entity.entityId, entity.deploymentFit);

    if (entity.entityId.trim().length === 0 || entity.label.trim().length === 0 || entity.purpose.trim().length === 0 || entity.migrationNote.trim().length === 0) {
      errors.push(`Backend schema entity ${entity.entityId || "<unnamed>"} must declare identity, label, purpose, and migration note.`);
    }
    if (!SUPPORTED_SCHEMA_ENTITY_STATUSES.has(entity.status)) {
      errors.push(`Backend schema entity ${entity.entityId || "<unnamed>"} has an unsupported status.`);
    }
    if (!SUPPORTED_SCHEMA_DEPLOYMENT_FITS.has(entity.deploymentFit)) {
      errors.push(`Backend schema entity ${entity.entityId || "<unnamed>"} has an unsupported deployment fit.`);
    }
    if (entity.relationships.length === 0 || entity.relationships.some((relationship) => relationship.trim().length === 0)) {
      errors.push(`Backend schema entity ${entity.entityId || "<unnamed>"} must declare non-empty relationship notes.`);
    }

    if (entity.fields.length === 0) {
      errors.push(`Backend schema entity ${entity.entityId} must declare at least one field.`);
    }

    const fieldNames = new Set<string>();
    const fieldTypes = new Map<string, string>();
    const requiredFieldNames = new Set<string>();
    for (const field of entity.fields) {
      if (field.name.trim().length === 0) {
        errors.push(`Backend schema entity ${entity.entityId} contains a field with an empty name.`);
      }
      if (field.type.trim().length === 0) {
        errors.push(`Backend schema entity ${entity.entityId} field ${field.name || "<unnamed>"} must name its type.`);
      } else if (!SUPPORTED_BACKEND_FIELD_TYPES.has(field.type)) {
        errors.push(`Backend schema entity ${entity.entityId} field ${field.name || "<unnamed>"} has an unsupported field type ${field.type}.`);
      }
      if (typeof field.required !== "boolean") {
        errors.push(`Backend schema entity ${entity.entityId} field ${field.name || "<unnamed>"} must declare required as a boolean.`);
      }
      if (field.note.trim().length === 0) {
        errors.push(`Backend schema entity ${entity.entityId} field ${field.name || "<unnamed>"} must declare a field note.`);
      }
      if (fieldNames.has(field.name)) {
        errors.push(`Backend schema entity ${entity.entityId} contains duplicate field ${field.name}.`);
      }
      fieldNames.add(field.name);
      fieldTypes.set(field.name, field.type);
      if (field.required) requiredFieldNames.add(field.name);
    }
    schemaFieldsByEntity.set(entity.entityId, fieldNames);
    schemaFieldTypesByEntity.set(entity.entityId, fieldTypes);
    schemaRequiredFieldsByEntity.set(entity.entityId, requiredFieldNames);
    const indexNames = new Set<string>();
    for (const index of entity.indexes) {
      if (index.trim().length === 0) {
        errors.push(`Backend schema entity ${entity.entityId} contains an empty index.`);
      }
      if (indexNames.has(index)) {
        errors.push(`Backend schema entity ${entity.entityId} contains duplicate index ${index}.`);
      }
      indexNames.add(index);
    }
    if (entity.fields.some((field) => field.name === "tenant_id") && !entity.indexes.some((index) => index.includes("tenant_id"))) {
      errors.push(`Backend schema entity ${entity.entityId} must declare a tenant-aware index when it has tenant_id.`);
    }
  }

  for (const [entityId, extensionFields] of Object.entries(schema.migrationFieldExtensions ?? {})) {
    if (!schemaEntityIds.has(entityId)) {
      errors.push(`Backend schema migration field extensions target missing schema entity ${entityId}.`);
      continue;
    }

    if (!Array.isArray(extensionFields)) {
      errors.push(`Backend schema migration field extensions for ${entityId} must be an array.`);
      continue;
    }

    const baseFieldNames = schemaFieldsByEntity.get(entityId) ?? new Set<string>();
    const baseFieldTypes = schemaFieldTypesByEntity.get(entityId) ?? new Map<string, string>();
    const baseRequiredFieldNames = schemaRequiredFieldsByEntity.get(entityId) ?? new Set<string>();
    const extensionFieldNames = new Set<string>();
    for (const field of extensionFields) {
      if (field.name.trim().length === 0) {
        errors.push(`Backend schema migration field extension for ${entityId} contains a field with an empty name.`);
      }
      if (field.type.trim().length === 0) {
        errors.push(`Backend schema migration field extension ${entityId}.${field.name || "<unnamed>"} must name its type.`);
      } else if (!SUPPORTED_BACKEND_FIELD_TYPES.has(field.type)) {
        errors.push(`Backend schema migration field extension ${entityId}.${field.name || "<unnamed>"} has an unsupported field type ${field.type}.`);
      }
      if (typeof field.required !== "boolean") {
        errors.push(`Backend schema migration field extension ${entityId}.${field.name || "<unnamed>"} must declare required as a boolean.`);
      }
      if (field.note.trim().length === 0) {
        errors.push(`Backend schema migration field extension ${entityId}.${field.name || "<unnamed>"} must declare a field note.`);
      }
      if (baseFieldNames.has(field.name) || extensionFieldNames.has(field.name)) {
        errors.push(`Backend schema migration field extensions for ${entityId} contain duplicate field ${field.name}.`);
      }
      extensionFieldNames.add(field.name);
      baseFieldNames.add(field.name);
      baseFieldTypes.set(field.name, field.type);
      if (field.required) baseRequiredFieldNames.add(field.name);
    }
  }

  for (const candidate of migrationPlan.candidates) {
    if (migrationIds.has(candidate.migrationId)) {
      errors.push(`Backend migration plan contains duplicate migration ${candidate.migrationId}.`);
    }
    migrationIds.add(candidate.migrationId);

    if (candidate.migrationId.trim().length === 0 || candidate.label.trim().length === 0) {
      errors.push(`Backend migration ${candidate.migrationId || "<unnamed>"} must declare identity and label.`);
    }
    if (!SUPPORTED_MIGRATION_TRACKS.has(candidate.track)) {
      errors.push(`Backend migration ${candidate.migrationId || "<unnamed>"} has an unsupported track.`);
    }
    if (!SUPPORTED_MIGRATION_CANDIDATE_STATUSES.has(candidate.status)) {
      errors.push(`Backend migration ${candidate.migrationId || "<unnamed>"} has an unsupported status.`);
    }
    if (!SUPPORTED_MIGRATION_CANDIDATE_RISKS.has(candidate.risk)) {
      errors.push(`Backend migration ${candidate.migrationId || "<unnamed>"} has an unsupported risk.`);
    }

    if (candidate.purpose.trim().length === 0) {
      errors.push(`Backend migration ${candidate.migrationId} must describe its purpose.`);
    }
    if (candidate.rollbackOrExportNeeds.length === 0) {
      errors.push(`Backend migration ${candidate.migrationId} must declare rollback or export needs.`);
    }
    if (candidate.status === "needs-policy" && candidate.prerequisites.length === 0) {
      errors.push(`Backend migration ${candidate.migrationId} needs policy and must declare prerequisites.`);
    }

    if (candidate.targetEntities.length === 0) {
      errors.push(`Backend migration ${candidate.migrationId} must target at least one schema entity.`);
    }

    if (new Set(candidate.targetEntities).size !== candidate.targetEntities.length) {
      errors.push(`Backend migration ${candidate.migrationId} must not repeat a schema entity target.`);
    }

    for (const entityId of candidate.targetEntities) {
      if (!schemaEntityIds.has(entityId)) {
        errors.push(`Backend migration ${candidate.migrationId} targets missing schema entity ${entityId}.`);
      }
    }

    if (candidate.targetEntities.every((entityId) => schemaDeploymentFitByEntity.has(entityId))) {
      const incompatibleEntity = candidate.targetEntities.find((entityId) =>
        !isMigrationTrackCompatible(candidate.track, schemaDeploymentFitByEntity.get(entityId) ?? ""),
      );
      if (incompatibleEntity) {
        errors.push(
          `Backend migration ${candidate.migrationId} track ${candidate.track} is incompatible with schema entity ${incompatibleEntity} deployment fit ${schemaDeploymentFitByEntity.get(incompatibleEntity)}.`,
        );
      }
    }
  }

  for (const spec of migrationSpecPlan.specs) {
    if (specIds.has(spec.specId)) {
      errors.push(`Backend migration specs contain duplicate spec ${spec.specId}.`);
    }
    specIds.add(spec.specId);

    if (spec.specId.trim().length === 0 || spec.label.trim().length === 0 || spec.purpose.trim().length === 0) {
      errors.push(`Backend migration spec ${spec.specId || "<unnamed>"} must declare identity, label, and purpose.`);
    }
    if (!SUPPORTED_MIGRATION_SPEC_STATUSES.has(spec.status)) {
      errors.push(`Backend migration spec ${spec.specId || "<unnamed>"} has an unsupported status.`);
    }
    if (!SUPPORTED_MIGRATION_STORE_KINDS.has(spec.storeKind)) {
      errors.push(`Backend migration spec ${spec.specId || "<unnamed>"} has an unsupported store kind.`);
    }

    const candidate = migrationPlan.candidates.find((item) => item.migrationId === spec.candidateId);
    if (!candidate) {
      errors.push(`Backend migration spec ${spec.specId} references missing candidate ${spec.candidateId}.`);
    } else if (candidate.targetEntities.length === 0) {
      errors.push(`Backend migration spec ${spec.specId} references a candidate without schema targets.`);
    }

    if (spec.primaryKey.trim().length === 0) {
      errors.push(`Backend migration spec ${spec.specId} must name a primary key.`);
    }

    if (spec.tenantScope.trim().length === 0) {
      errors.push(`Backend migration spec ${spec.specId} must name its tenant scope.`);
    }
    if (spec.retentionRule.trim().length === 0) {
      errors.push(`Backend migration spec ${spec.specId} must declare a retention rule.`);
    }
    if (spec.exportRule.trim().length === 0) {
      errors.push(`Backend migration spec ${spec.specId} must declare an export rule.`);
    }
    if (spec.localFallback.trim().length === 0) {
      errors.push(`Backend migration spec ${spec.specId} must declare a local fallback.`);
    }
    if (spec.status === "blocked-by-policy" && spec.policyBlockers.length === 0) {
      errors.push(`Backend migration spec ${spec.specId} is blocked-by-policy and must declare policy blockers.`);
    }

    const fieldNames = new Set<string>();
    for (const field of spec.fields) {
      if (field.name.trim().length === 0) {
        errors.push(`Backend migration spec ${spec.specId} contains a field with an empty name.`);
      }
      if (field.type.trim().length === 0) {
        errors.push(`Backend migration spec ${spec.specId} field ${field.name || "<unnamed>"} must name its type.`);
      } else if (!SUPPORTED_BACKEND_FIELD_TYPES.has(field.type)) {
        errors.push(`Backend migration spec ${spec.specId} field ${field.name || "<unnamed>"} has an unsupported field type ${field.type}.`);
      }
      if (typeof field.required !== "boolean") {
        errors.push(`Backend migration spec ${spec.specId} field ${field.name || "<unnamed>"} must declare required as a boolean.`);
      }
      if (field.note.trim().length === 0) {
        errors.push(`Backend migration spec ${spec.specId} field ${field.name || "<unnamed>"} must declare a field note.`);
      }
      if (fieldNames.has(field.name)) {
        errors.push(`Backend migration spec ${spec.specId} contains duplicate field ${field.name}.`);
      }
      fieldNames.add(field.name);
    }

    if (candidate && candidate.targetEntities.every((entityId) => schemaFieldsByEntity.has(entityId))) {
      const targetFieldNames = new Set(
        candidate.targetEntities.flatMap((entityId) => [...(schemaFieldsByEntity.get(entityId) ?? [])]),
      );
      for (const fieldName of fieldNames) {
        const targetEntityWithField = candidate.targetEntities.find((entityId) =>
          schemaFieldsByEntity.get(entityId)?.has(fieldName),
        );
        if (!targetFieldNames.has(fieldName) || !targetEntityWithField) {
          errors.push(
            `Backend migration spec ${spec.specId} field ${fieldName} must exist on one of its target schema entities.`,
          );
        } else {
          const expectedType = schemaFieldTypesByEntity.get(targetEntityWithField)?.get(fieldName);
          const actualType = spec.fields.find((field) => field.name === fieldName)?.type;
          if (expectedType && actualType && !isMigrationFieldTypeCompatible(expectedType, actualType)) {
            errors.push(
              `Backend migration spec ${spec.specId} field ${fieldName} type ${actualType} must be compatible with target schema type ${expectedType}.`,
            );
          }
          if (candidate.targetEntities.length === 1 && schemaRequiredFieldsByEntity.get(targetEntityWithField)?.has(fieldName) && !spec.fields.find((field) => field.name === fieldName)?.required) {
            errors.push(
              `Backend migration spec ${spec.specId} field ${fieldName} must remain required because its target schema field is required.`,
            );
          }
        }
      }
    }

    const indexNames = new Set<string>();
    for (const index of spec.indexes) {
      if (index.trim().length === 0) {
        errors.push(`Backend migration spec ${spec.specId} contains an empty index.`);
      }
      if (indexNames.has(index)) {
        errors.push(`Backend migration spec ${spec.specId} contains duplicate index ${index}.`);
      }
      indexNames.add(index);
    }

    if (spec.primaryKey.trim().length > 0 && !fieldNames.has(spec.primaryKey)) {
      errors.push(
        `Backend migration spec ${spec.specId} must declare its primary key ${spec.primaryKey} in its fields.`,
      );
    }

    if (spec.tenantScope.includes("tenant_id") && !fieldNames.has("tenant_id")) {
      errors.push(
        `Backend migration spec ${spec.specId} must declare tenant_id in its fields when tenantScope requires tenant_id.`,
      );
    }
    if (spec.tenantScope.includes("tenant_id") && !spec.indexes.some((index) => index.includes("tenant_id"))) {
      errors.push(
        `Backend migration spec ${spec.specId} must declare a tenant-aware index when tenantScope requires tenant_id.`,
      );
    }

    const primaryKeyField = spec.fields.find((field) => field.name === spec.primaryKey);
    if (primaryKeyField && primaryKeyField.required !== true) {
      errors.push(
        `Backend migration spec ${spec.specId} must mark its primary key ${spec.primaryKey} as required.`,
      );
    }

    if (candidate) {
      if (candidate.status === "needs-policy" && spec.status !== "blocked-by-policy") {
        errors.push(
          `Backend migration spec ${spec.specId} must be blocked-by-policy while candidate ${candidate.migrationId} needs policy.`,
        );
      }
      for (const entityId of candidate.targetEntities) {
        for (const requiredField of REQUIRED_MIGRATION_FIELDS_BY_ENTITY[entityId] ?? []) {
          if (!fieldNames.has(requiredField)) {
            errors.push(
              `Backend migration spec ${spec.specId} must preserve required field ${requiredField} for schema entity ${entityId}.`,
            );
          }
        }
      }
    }
  }

  const specsByCandidate = new Map<string, number>();
  for (const spec of migrationSpecPlan.specs) {
    specsByCandidate.set(spec.candidateId, (specsByCandidate.get(spec.candidateId) ?? 0) + 1);
  }
  for (const candidate of migrationPlan.candidates) {
    const specCount = specsByCandidate.get(candidate.migrationId) ?? 0;
    if (candidate.status === "defer" && specCount > 0) {
      errors.push(
        `Backend migration candidate ${candidate.migrationId} is deferred and must not have implementation specs yet.`,
      );
    }
    if (candidate.status !== "defer" && specCount === 0) {
      errors.push(
        `Backend migration candidate ${candidate.migrationId} must have at least one migration spec before it is actionable.`,
      );
    }
  }

  return errors;
}

function isMigrationTrackCompatible(track: string, deploymentFit: string): boolean {
  if (track === "shared") {
    return true;
  }
  if (track === "hosted-pilot") {
    return deploymentFit === "hosted" || deploymentFit === "hybrid";
  }
  if (track === "local-classroom") {
    return deploymentFit === "local" || deploymentFit === "hybrid";
  }
  return false;
}

function isMigrationFieldTypeCompatible(schemaType: string, migrationType: string): boolean {
  if (schemaType === migrationType) return true;

  const stringSerializableTypes = new Set([
    "coded string",
    "enum",
    "enum/string",
    "foreign key/string",
    "role/id",
    "role/id or label",
    "role/string",
    "route/string",
    "semver/string",
    "stable id",
  ]);
  if (stringSerializableTypes.has(schemaType) && migrationType === "string") return true;
  if ((schemaType === "enum" || schemaType === "enum/string") && migrationType === "string enum") return true;
  if (schemaType === "string[]" && migrationType === "json/string array") return true;
  if (schemaType === "json/string array" && (migrationType === "string[]" || migrationType === "json")) return true;
  if (schemaType === "string array/json" && (migrationType === "string[]" || migrationType === "json")) return true;
  if (schemaType === "json/object" && migrationType === "json") return true;
  if (schemaType === "json/object array" && (migrationType === "json" || migrationType === "json[]")) return true;
  if (schemaType === "json/child records" && migrationType === "json") return true;
  if (schemaType === "json[]" && migrationType === "json") return true;
  if (schemaType === "timestamp" && migrationType === "datetime") return true;
  if (schemaType === "datetime" && migrationType === "timestamp") return true;

  return false;
}
