import { TENANT_BOUND_PERSISTENCE_RECORD_CATEGORIES, type PersistenceRecordCategory } from "./persistenceRecords";

export type PersistenceHandoffCheckStatus = "passed" | "open" | "blocked";

export interface PersistenceHandoffCheck {
  checkId: string;
  label: string;
  status: PersistenceHandoffCheckStatus;
  detail: string;
}

export interface PersistenceHandoffCategoryCoverage {
  category: PersistenceRecordCategory;
  durableRecord: boolean;
  hostedIntent: boolean;
  localIntent: boolean;
}

export interface PersistenceHandoffPacket {
  packetId: string;
  label: string;
  mode: "review-only";
  summary: string;
  selectedProvider: null;
  checks: PersistenceHandoffCheck[];
  categoryCoverage: PersistenceHandoffCategoryCoverage[];
}

const REQUIRED_CHECKS = ["contract-alignment", "provider-selection", "side-effects"] as const;

export function validatePersistenceHandoffPacket(packet: PersistenceHandoffPacket): string[] {
  const errors: string[] = [];

  if (packet.mode !== "review-only") {
    errors.push("Persistence handoff packet must remain review-only.");
  }

  if (packet.selectedProvider !== null) {
    errors.push("Persistence handoff packet must not select a provider.");
  }

  const checksById = new Map<string, PersistenceHandoffCheck>();
  for (const check of packet.checks) {
    if (checksById.has(check.checkId)) {
      errors.push(`Persistence handoff packet contains duplicate check ${check.checkId}.`);
    }
    checksById.set(check.checkId, check);
  }

  for (const checkId of REQUIRED_CHECKS) {
    const check = checksById.get(checkId);
    if (!check) {
      errors.push(`Persistence handoff packet is missing required check ${checkId}.`);
    }
  }

  if (checksById.get("provider-selection")?.status !== "passed") {
    errors.push("Persistence handoff packet must prove provider selection remains uncommitted.");
  }

  if (checksById.get("side-effects")?.status !== "passed") {
    errors.push("Persistence handoff packet must prove live side effects remain disabled.");
  }

  const coverageByCategory = new Map<PersistenceRecordCategory, PersistenceHandoffCategoryCoverage>();
  for (const coverage of packet.categoryCoverage) {
    if (coverageByCategory.has(coverage.category)) {
      errors.push(`Persistence handoff packet contains duplicate category coverage for ${coverage.category}.`);
    }
    coverageByCategory.set(coverage.category, coverage);
  }

  for (const category of TENANT_BOUND_PERSISTENCE_RECORD_CATEGORIES) {
    if (!coverageByCategory.has(category)) {
      errors.push(`Persistence handoff packet is missing tenant-bound category coverage for ${category}.`);
    }
  }

  return errors;
}
