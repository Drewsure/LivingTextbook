import { validatePersistenceContractAlignment } from "@living-textbook/content-model";
import { samplePersistenceAdapterPlans } from "./samplePersistenceAdapterPlan";
import { sampleDurableRecordContracts } from "./samplePersistencePlan";

export const samplePersistenceContractAlignmentErrors = validatePersistenceContractAlignment({
  durableRecords: sampleDurableRecordContracts,
  adapterPlans: samplePersistenceAdapterPlans,
});
