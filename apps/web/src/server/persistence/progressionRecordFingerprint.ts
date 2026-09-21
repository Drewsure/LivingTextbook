import type { HostedProgressionPersistenceRecord } from "@living-textbook/content-model";

/**
 * Idempotency is about the complete progression result, not only its identity.
 * Sort object keys while preserving array order so equivalent server payloads
 * receive the same comparison value across rehearsal and SQLite adapters.
 */
export function createProgressionRecordFingerprint(record: HostedProgressionPersistenceRecord): string {
  return JSON.stringify(sortRecordValue(record));
}

function sortRecordValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortRecordValue);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
      .map(([key, child]) => [key, sortRecordValue(child)]),
  );
}
