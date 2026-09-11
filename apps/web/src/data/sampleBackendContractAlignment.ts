import { sampleBackendMigrationPlan } from "./sampleBackendMigrationCandidates";
import { sampleBackendMigrationSpecPlan } from "./sampleBackendMigrationSpecs";
import { sampleBackendSchemaDraft } from "./sampleBackendSchemaDraft";
import { validateBackendContractAlignment } from "./backendContractAlignment";

export const sampleBackendContractAlignmentErrors = validateBackendContractAlignment({
  schema: sampleBackendSchemaDraft,
  migrationPlan: sampleBackendMigrationPlan,
  migrationSpecPlan: sampleBackendMigrationSpecPlan,
});

