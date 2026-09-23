import {
  derivePersistenceRecoveryRehearsal,
  validatePersistenceRecoveryRehearsal,
  type PersistenceRecoveryRehearsal,
} from "@living-textbook/content-model";
import { sampleLocalBundleRecoveryReconciliation } from "./sampleLocalBundleRecoveryReconciliation";
import { samplePersistenceHandoffPacket } from "./samplePersistenceHandoffPacket";
import { samplePersistenceProviderSelectionPreflight } from "./samplePersistenceProviderSelectionPreflight";

export const samplePersistenceRecoveryRehearsal: PersistenceRecoveryRehearsal = derivePersistenceRecoveryRehearsal({
  rehearsalId: "sample-publisher-cross-deployment-recovery-rehearsal",
  providerPreflight: samplePersistenceProviderSelectionPreflight,
  handoff: samplePersistenceHandoffPacket,
  localRecoveryReconciliation: sampleLocalBundleRecoveryReconciliation,
});

export const samplePersistenceRecoveryRehearsalErrors = validatePersistenceRecoveryRehearsal(
  samplePersistenceRecoveryRehearsal,
);
