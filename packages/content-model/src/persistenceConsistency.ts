import type { PersistenceAdapterPlan, PersistenceWriteIntent } from "./persistenceAdapter";
import {
  TENANT_BOUND_PERSISTENCE_RECORD_CATEGORIES,
  type DurableRecordContract,
  type PersistenceRecordCategory,
} from "./persistenceRecords";

const ADAPTER_COVERAGE_REQUIRED_CATEGORIES = new Set<PersistenceRecordCategory>(
  TENANT_BOUND_PERSISTENCE_RECORD_CATEGORIES,
);

export interface PersistenceContractAlignmentInput {
  durableRecords: DurableRecordContract[];
  adapterPlans: PersistenceAdapterPlan[];
  requiredCategories?: Iterable<PersistenceRecordCategory>;
}

function validateCompletionIdempotencyAlignment(
  records: DurableRecordContract[],
  intents: PersistenceWriteIntent[],
  errors: string[],
): void {
  if (records.length === 0 || intents.length === 0) {
    return;
  }

  const record = records.find((candidate) => candidate.preservesCompletionIdempotency);
  if (!record) {
    return;
  }

  const recordFields = new Set(record.completionIdempotencyKeyFields ?? []);
  for (const intent of intents) {
    if (!intent.preservesCompletionIdempotency) {
      continue;
    }

    const intentFields = new Set(intent.completionIdempotencyKeyFields ?? []);
    for (const field of recordFields) {
      if (!intentFields.has(field)) {
        errors.push(
          `Persistence alignment requires progress-event-stream adapter intent ${intent.intentId} to preserve completion idempotency key field ${field}.`,
        );
      }
    }
    for (const field of intentFields) {
      if (!recordFields.has(field)) {
        errors.push(
          `Persistence alignment requires progress-event-stream durable record ${record.recordId} to declare completion idempotency key field ${field}.`,
        );
      }
    }

    if (record.rejectsDuplicateCompletionWrites !== intent.rejectsDuplicateCompletionWrites) {
      errors.push(
        `Persistence alignment requires progress-event-stream adapter intent ${intent.intentId} to match durable duplicate-completion rejection.`,
      );
    }
    if (record.requiresAtomicCompletionWrite !== intent.requiresAtomicCompletionWrite) {
      errors.push(
        `Persistence alignment requires progress-event-stream adapter intent ${intent.intentId} to match durable atomic completion writes.`,
      );
    }
  }
}

/**
 * Checks the cross-layer invariants that cannot be proven by either validator
 * in isolation.
 */
export function validatePersistenceContractAlignment({
  durableRecords,
  adapterPlans,
  requiredCategories = ADAPTER_COVERAGE_REQUIRED_CATEGORIES,
}: PersistenceContractAlignmentInput): string[] {
  const errors: string[] = [];
  const recordsByCategory = new Map<PersistenceRecordCategory, DurableRecordContract[]>();
  const intentsByCategory = new Map<PersistenceRecordCategory, PersistenceWriteIntent[]>();

  for (const record of durableRecords) {
    const records = recordsByCategory.get(record.category) ?? [];
    records.push(record);
    recordsByCategory.set(record.category, records);
  }

  for (const plan of adapterPlans) {
    for (const intent of plan.writeIntents) {
      const intents = intentsByCategory.get(intent.category) ?? [];
      intents.push(intent);
      intentsByCategory.set(intent.category, intents);
    }
  }

  for (const category of requiredCategories) {
    const records = recordsByCategory.get(category) ?? [];
    const intents = intentsByCategory.get(category) ?? [];

    if (records.length === 0) {
      errors.push(`Persistence alignment requires a durable record contract for ${category}.`);
      continue;
    }

    if (intents.length === 0) {
      errors.push(`Persistence alignment requires an adapter write intent for ${category}.`);
      continue;
    }

    const recordKeys = new Set(
      records
        .map((record) => record.tenantBoundaryKey?.trim())
        .filter((key): key is string => Boolean(key)),
    );

    for (const record of records) {
      if (!record.preservesTenantBoundary || !record.tenantBoundaryKey?.trim()) {
        errors.push(`Persistence alignment requires ${category} durable records to preserve a named tenant boundary.`);
      }
    }

    for (const intent of intents) {
      if (!intent.preservesTenantBoundary || !intent.tenantBoundaryKey?.trim()) {
        errors.push(`Persistence alignment requires ${category} adapter intents to preserve a named tenant boundary.`);
      } else if (recordKeys.size > 0 && !recordKeys.has(intent.tenantBoundaryKey.trim())) {
        errors.push(
          `Persistence alignment requires ${category} adapter intent ${intent.intentId} to use a durable-record tenant boundary key.`,
        );
      }

      if (category === "evidence-packet" || category === "evidence-attachment") {
        if (records.some((record) => record.scopeKind !== intent.scopeKind)) {
          const expectedScope = records.find((record) => record.scopeKind)?.scopeKind ?? "(missing)";
          errors.push(
            `Persistence alignment requires ${category} adapter intent ${intent.intentId} to preserve durable-record scope_kind ${expectedScope}.`,
          );
        }
      }
    }
  }

  validateCompletionIdempotencyAlignment(
    recordsByCategory.get("progress-event-stream") ?? [],
    intentsByCategory.get("progress-event-stream") ?? [],
    errors,
  );

  for (const [category, records] of recordsByCategory) {
    const intents = intentsByCategory.get(category);

    if (!intents) {
      continue;
    }

    for (const record of records) {
      if (!record.storesRawAudio) {
        continue;
      }

      for (const intent of intents) {
        if (intent.rejectsRawAudio) {
          errors.push(
            `Persistence alignment cannot reject raw audio in adapter intent ${intent.intentId} when durable record ${record.recordId} stores raw audio.`,
          );
        }
      }
    }
  }

  return errors;
}
