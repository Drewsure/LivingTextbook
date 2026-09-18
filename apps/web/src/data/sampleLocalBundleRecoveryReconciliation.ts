import {
  reconcileLocalBundleRecoveryEvidence,
  type LocalBundleRecoveryReconciliation,
} from "@living-textbook/content-model";
import { sampleLocalBundleProviderApproval } from "./sampleLocalBundleProviderApproval";
import { sampleLocalBundleRecoveryPacket } from "./sampleLocalBundleRecoveryPacket";

export const sampleLocalBundleRecoveryReconciliation: LocalBundleRecoveryReconciliation =
  reconcileLocalBundleRecoveryEvidence(sampleLocalBundleProviderApproval, sampleLocalBundleRecoveryPacket);
