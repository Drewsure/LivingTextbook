import {
  TENANT_BOUND_PERSISTENCE_RECORD_CATEGORIES,
  type DurableRecordContract,
  type PersistenceAdapterPlan,
  type PersistenceRecordCategory,
  type PersistenceHandoffCategoryCoverage,
  type PersistenceHandoffCheck,
  type PersistenceHandoffCheckStatus,
  type PersistenceHandoffPacket,
} from "@living-textbook/content-model";
import type { PilotBackendSelectionGate } from "./samplePilotBackendSelectionGate";
import { validatePersistenceHandoffPacket } from "@living-textbook/content-model";
import { samplePersistenceAdapterPlans } from "./samplePersistenceAdapterPlan";
import { samplePersistenceContractAlignmentErrors } from "./samplePersistenceContractAlignment";
import { sampleDurableRecordContracts } from "./samplePersistencePlan";
import { samplePilotBackendSelectionGate } from "./samplePilotBackendSelectionGate";

export type {
  PersistenceHandoffCategoryCoverage,
  PersistenceHandoffCheck,
  PersistenceHandoffCheckStatus,
  PersistenceHandoffPacket,
} from "@living-textbook/content-model";

export function buildPersistenceHandoffPacket({
  durableRecords,
  adapterPlans,
  alignmentErrors,
  backendGate,
}: {
  durableRecords: DurableRecordContract[];
  adapterPlans: PersistenceAdapterPlan[];
  alignmentErrors: string[];
  backendGate: PilotBackendSelectionGate;
}): PersistenceHandoffPacket {
  const hostedPlan = adapterPlans.find((plan) => plan.mode === "hosted-managed");
  const localPlan = adapterPlans.find((plan) => plan.mode === "local-classroom");
  const durableCategories = new Set(durableRecords.map((record) => record.category));
  const hostedCategories = new Set(hostedPlan?.writeIntents.map((intent) => intent.category));
  const localCategories = new Set(localPlan?.writeIntents.map((intent) => intent.category));
  const openGateCount = backendGate.criteria.filter((criterion) => criterion.status === "open").length;
  const blockedGateCount = backendGate.criteria.filter((criterion) => criterion.status === "blocked").length;

  return {
    packetId: "persistence-implementation-handoff-review",
    label: "Provider-neutral implementation handoff",
    mode: "review-only",
    summary:
      "This packet is the implementation brief for a future persistence adapter. It proves the shared contract shape without selecting a vendor, opening a storage bucket, or enabling student-data writes.",
    selectedProvider: null,
    checks: [
      {
        checkId: "contract-alignment",
        label: "Durable records and adapter intents align",
        status: alignmentErrors.length === 0 ? "passed" : "blocked",
        detail:
          alignmentErrors.length === 0
            ? "Required tenant-bound categories have matching durable-record and adapter contracts."
            : `${alignmentErrors.length} alignment issue(s) still require review before implementation.`,
      },
      {
        checkId: "hosted-local-parity",
        label: "Hosted and local channels are mapped",
        status: hostedPlan && localPlan ? "passed" : "open",
        detail: hostedPlan && localPlan ? "Both deployment channels have named adapter plans; their implementations remain interchangeable." : "A hosted or local adapter plan is still missing.",
      },
      {
        checkId: "provider-selection",
        label: "Provider selection remains uncommitted",
        status: "passed",
        detail: "No database, object store, signed URL service, or local storage provider is selected by this packet.",
      },
      {
        checkId: "policy-and-cost",
        label: "Policy and cost gates remain open",
        status: blockedGateCount > 0 ? "blocked" : openGateCount > 0 ? "open" : "passed",
        detail:
          blockedGateCount > 0
            ? `${blockedGateCount} backend gate criterion is blocked; premium or live storage choices cannot proceed.`
            : openGateCount > 0
              ? `${openGateCount} backend gate criterion remains open for tenant and school review.`
              : "The backend gate has no outstanding policy or cost criteria.",
      },
      {
        checkId: "side-effects",
        label: "Live side effects are disabled",
        status: "passed",
        detail: "This surface has no write, export, provider activation, migration, backup, or restore action.",
      },
    ],
    categoryCoverage: TENANT_BOUND_PERSISTENCE_RECORD_CATEGORIES.map((category) => ({
      category,
      durableRecord: durableCategories.has(category),
      hostedIntent: hostedCategories.has(category),
      localIntent: localCategories.has(category),
    })),
  };
}

export const samplePersistenceHandoffPacket = buildPersistenceHandoffPacket({
  durableRecords: sampleDurableRecordContracts,
  adapterPlans: samplePersistenceAdapterPlans,
  alignmentErrors: samplePersistenceContractAlignmentErrors,
  backendGate: samplePilotBackendSelectionGate,
});

export const samplePersistenceHandoffPacketErrors = validatePersistenceHandoffPacket(samplePersistenceHandoffPacket);
