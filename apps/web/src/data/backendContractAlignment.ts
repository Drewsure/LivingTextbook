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
  const migrationIds = new Set<string>();
  const specIds = new Set<string>();

  for (const entity of schema.entities) {
    if (schemaEntityIds.has(entity.entityId)) {
      errors.push(`Backend schema contains duplicate entity ${entity.entityId}.`);
    }
    schemaEntityIds.add(entity.entityId);

    const fieldNames = new Set<string>();
    for (const field of entity.fields) {
      if (fieldNames.has(field.name)) {
        errors.push(`Backend schema entity ${entity.entityId} contains duplicate field ${field.name}.`);
      }
      fieldNames.add(field.name);
    }
  }

  for (const candidate of migrationPlan.candidates) {
    if (migrationIds.has(candidate.migrationId)) {
      errors.push(`Backend migration plan contains duplicate migration ${candidate.migrationId}.`);
    }
    migrationIds.add(candidate.migrationId);

    if (candidate.targetEntities.length === 0) {
      errors.push(`Backend migration ${candidate.migrationId} must target at least one schema entity.`);
    }

    for (const entityId of candidate.targetEntities) {
      if (!schemaEntityIds.has(entityId)) {
        errors.push(`Backend migration ${candidate.migrationId} targets missing schema entity ${entityId}.`);
      }
    }
  }

  for (const spec of migrationSpecPlan.specs) {
    if (specIds.has(spec.specId)) {
      errors.push(`Backend migration specs contain duplicate spec ${spec.specId}.`);
    }
    specIds.add(spec.specId);

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

    const fieldNames = new Set<string>();
    for (const field of spec.fields) {
      if (field.name.trim().length === 0) {
        errors.push(`Backend migration spec ${spec.specId} contains a field with an empty name.`);
      }
      if (field.type.trim().length === 0) {
        errors.push(`Backend migration spec ${spec.specId} field ${field.name || "<unnamed>"} must name its type.`);
      }
      if (fieldNames.has(field.name)) {
        errors.push(`Backend migration spec ${spec.specId} contains duplicate field ${field.name}.`);
      }
      fieldNames.add(field.name);
    }

    if (spec.primaryKey.trim().length > 0 && !fieldNames.has(spec.primaryKey)) {
      errors.push(
        `Backend migration spec ${spec.specId} must declare its primary key ${spec.primaryKey} in its fields.`,
      );
    }

    const primaryKeyField = spec.fields.find((field) => field.name === spec.primaryKey);
    if (primaryKeyField && primaryKeyField.required !== true) {
      errors.push(
        `Backend migration spec ${spec.specId} must mark its primary key ${spec.primaryKey} as required.`,
      );
    }

    if (candidate) {
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

  return errors;
}
