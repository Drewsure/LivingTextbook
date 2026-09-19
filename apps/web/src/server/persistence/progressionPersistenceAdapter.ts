import type {
  HostedProgressionPersistenceRecord,
} from "@living-textbook/content-model";
import {
  getDurableProgressionStore,
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

const globalStore = globalThis as typeof globalThis & {
  __livingTextbookHostedProgressionRehearsal?: Map<string, HostedProgressionPersistenceRecord>;
};
const rehearsalStore = globalStore.__livingTextbookHostedProgressionRehearsal ??= new Map();

const processMemoryAdapter: ProgressionPersistenceAdapter = {
  provider: "process-memory",
  durability: "non-durable-rehearsal",
  read(identity) {
    return [...rehearsalStore.values()].find((candidate) =>
      candidate.tenantId === identity.tenantId
        && candidate.packageId === identity.packageId
        && candidate.launchCode === identity.launchCode
        && candidate.studentSessionId === identity.studentSessionId,
    );
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
