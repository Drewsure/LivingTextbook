import type {
  HostedProgressionPersistenceRecord,
  ProgressEventStreamPersistenceRecord,
} from "@living-textbook/content-model";
import {
  getDurableProgressionStore,
  type DurableProgressEventStreamIdentity,
  type DurableProgressEventStreamWriteResult,
  type DurableProgressionIdentity,
  type DurableProgressionWriteResult,
} from "./sqliteProgressionStore";
import { createProgressionRecordFingerprint } from "./progressionRecordFingerprint";

export type PersistenceProvider = "process-memory" | "sqlite";
export type PersistenceDurability = "non-durable-rehearsal" | "durable-managed";

export interface PersistenceProviderConfiguration {
  provider: PersistenceProvider;
  configuredValue: string;
  valid: boolean;
  errors: string[];
}

export interface ProgressionPersistenceAdapter {
  readonly provider: PersistenceProvider;
  readonly durability: PersistenceDurability;
  read(identity: DurableProgressionIdentity): HostedProgressionPersistenceRecord | undefined;
  write(record: HostedProgressionPersistenceRecord): DurableProgressionWriteResult;
}

export interface ProgressEventStreamPersistenceAdapter {
  readonly provider: PersistenceProvider;
  readonly durability: PersistenceDurability;
  readEventStream(identity: DurableProgressEventStreamIdentity): ProgressEventStreamPersistenceRecord | undefined;
  writeEventStream(record: ProgressEventStreamPersistenceRecord): DurableProgressEventStreamWriteResult;
}

const globalStore = globalThis as typeof globalThis & {
  __livingTextbookHostedProgressionRehearsal?: Map<string, HostedProgressionPersistenceRecord>;
  __livingTextbookHostedProgressEventStreamRehearsal?: Map<string, ProgressEventStreamPersistenceRecord>;
};
const rehearsalStore = globalStore.__livingTextbookHostedProgressionRehearsal ??= new Map();
const eventStreamRehearsalStore = globalStore.__livingTextbookHostedProgressEventStreamRehearsal ??= new Map();

const processMemoryAdapter: ProgressionPersistenceAdapter = {
  provider: "process-memory",
  durability: "non-durable-rehearsal",
  read(identity) {
    return [...rehearsalStore.values()]
      .filter((candidate) =>
        candidate.tenantId === identity.tenantId
          && candidate.packageId === identity.packageId
          && candidate.launchCode === identity.launchCode
          && candidate.studentSessionId === identity.studentSessionId,
      )
      .sort((left, right) => compareProgressionOrder(left, right))[0];
  },
  write(record) {
    const existing = rehearsalStore.get(record.idempotencyKey);
    if (existing) {
      const sameIdentity = existing.tenantId === record.tenantId
        && existing.packageId === record.packageId
        && existing.launchCode === record.launchCode
        && existing.studentSessionId === record.studentSessionId;
      if (!sameIdentity) {
        return {
          status: "conflict",
          idempotent: false,
          errors: ["The idempotency key is already bound to a different tenant-scoped identity."],
        };
      }
      if (createProgressionRecordFingerprint(existing) !== createProgressionRecordFingerprint(record)) {
        return {
          status: "conflict",
          idempotent: false,
          errors: ["The idempotency key is already bound to a different progression payload."],
        };
      }
      return { status: "accepted", idempotent: true, record: existing, errors: [] };
    }
    rehearsalStore.set(record.idempotencyKey, record);
    return { status: "accepted", idempotent: false, record, errors: [] };
  },
};

const processMemoryEventStreamAdapter: ProgressEventStreamPersistenceAdapter = {
  provider: "process-memory",
  durability: "non-durable-rehearsal",
  readEventStream(identity) {
    return [...eventStreamRehearsalStore.values()]
      .filter((candidate) => candidate.tenantId === identity.tenantId
        && candidate.packageId === identity.packageId
        && candidate.launchCode === identity.launchCode
        && candidate.studentSessionId === identity.studentSessionId)
      .sort((left, right) => left.writtenAt === right.writtenAt
        ? (left.idempotencyKey > right.idempotencyKey ? -1 : 1)
        : (left.writtenAt > right.writtenAt ? -1 : 1))[0];
  },
  writeEventStream(record) {
    const storageErrors = validateEventStreamAdapterRecord(record);
    if (storageErrors.length > 0) return { status: "conflict", idempotent: false, errors: storageErrors };
    const existing = eventStreamRehearsalStore.get(record.idempotencyKey);
    if (existing) {
      const sameIdentity = existing.tenantId === record.tenantId
        && existing.packageId === record.packageId
        && existing.launchCode === record.launchCode
        && existing.studentSessionId === record.studentSessionId;
      if (!sameIdentity) return { status: "conflict", idempotent: false, errors: ["The event stream idempotency key is already bound to a different tenant-scoped identity."] };
      if (stableJson(existing) !== stableJson(record)) return { status: "conflict", idempotent: false, errors: ["The event stream idempotency key is already bound to a different event payload."] };
      return { status: "accepted", idempotent: true, record: existing, errors: [] };
    }
    eventStreamRehearsalStore.set(record.idempotencyKey, record);
    return { status: "accepted", idempotent: false, record, errors: [] };
  },
};

function compareProgressionOrder(left: HostedProgressionPersistenceRecord, right: HostedProgressionPersistenceRecord): number {
  if (left.writtenAt !== right.writtenAt) return left.writtenAt > right.writtenAt ? -1 : 1;
  if (left.idempotencyKey === right.idempotencyKey) return 0;
  return left.idempotencyKey > right.idempotencyKey ? -1 : 1;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
}

function validateEventStreamAdapterRecord(record: ProgressEventStreamPersistenceRecord): string[] {
  const errors: string[] = [];
  if (record.rawLearnerAudioIncluded !== false) errors.push("The event stream adapter rejects raw learner audio fields.");
  if (record.learnerTranscriptIncluded !== false) errors.push("The event stream adapter rejects learner transcript fields.");
  if (!Array.isArray(record.events) || record.events.length === 0) errors.push("The event stream adapter requires events.");
  const expectedKey = createEventStreamIdempotencyKey({
    tenantId: record.tenantId,
    unitKey: record.unitKey,
    launchCode: record.launchCode,
    studentSessionId: record.studentSessionId,
    gameMode: record.gameMode,
  });
  if (record.idempotencyKey !== expectedKey) errors.push("The event stream adapter idempotency key does not match canonical completion identity.");
  return errors;
}

function createEventStreamIdempotencyKey(args: { tenantId: string; unitKey: string; launchCode: string; studentSessionId: string; gameMode: string }): string {
  return ["completion-v1", args.tenantId, args.unitKey, args.launchCode, args.studentSessionId, args.gameMode]
    .map((value) => encodeURIComponent(value.trim()))
    .join(":");
}

export function getConfiguredPersistenceProvider(): PersistenceProvider {
  return getPersistenceProviderConfiguration().provider;
}

export function getPersistenceProviderConfiguration(): PersistenceProviderConfiguration {
  const configuredValue = process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER?.trim() || "process-memory";
  if (configuredValue === "process-memory" || configuredValue === "sqlite") {
    return { provider: configuredValue, configuredValue, valid: true, errors: [] };
  }
  return {
    provider: "process-memory",
    configuredValue,
    valid: false,
    errors: [`Unsupported persistence provider configuration: ${configuredValue}. Use process-memory or sqlite.`],
  };
}

export function getProgressionPersistenceAdapter(): ProgressionPersistenceAdapter {
  const configuration = getPersistenceProviderConfiguration();
  if (!configuration.valid) {
    throw new Error(configuration.errors.join(" "));
  }
  if (configuration.provider === "sqlite") {
    const store = getDurableProgressionStore();
    return {
      provider: "sqlite",
      durability: "durable-managed",
      read: (identity) => store.read(identity),
      write: (record) => store.write(record),
    };
  }
  return processMemoryAdapter;
}

export function getProgressEventStreamPersistenceAdapter(): ProgressEventStreamPersistenceAdapter {
  const configuration = getPersistenceProviderConfiguration();
  if (!configuration.valid) throw new Error(configuration.errors.join(" "));
  if (configuration.provider === "sqlite") {
    const store = getDurableProgressionStore();
    return {
      provider: "sqlite",
      durability: "durable-managed",
      readEventStream: (identity) => store.readEventStream(identity),
      writeEventStream: (record) => store.writeEventStream(record),
    };
  }
  return processMemoryEventStreamAdapter;
}
