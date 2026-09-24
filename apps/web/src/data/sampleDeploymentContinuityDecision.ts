import {
  deriveDeploymentContinuityDecision,
  validateDeploymentContinuityDecision,
  type DeploymentContinuityDecision,
} from "@living-textbook/content-model";
import { samplePilotDeploymentDecision } from "./samplePilotDeploymentDecision";
import { samplePersistenceRecoveryRehearsal } from "./samplePersistenceRecoveryRehearsal";
import { samplePersistenceProviderSelectionPreflight } from "./samplePersistenceProviderSelectionPreflight";

export const sampleDeploymentContinuityDecision: DeploymentContinuityDecision = deriveDeploymentContinuityDecision({
  decisionId: "sample-publisher-deployment-continuity-decision",
  pilotDeploymentDecision: samplePilotDeploymentDecision,
  recoveryRehearsal: samplePersistenceRecoveryRehearsal,
  storageSelectionPreflightId: samplePersistenceProviderSelectionPreflight.preflightId,
  storageSelectionGateId: samplePersistenceProviderSelectionPreflight.evidenceStorageGateId,
  storageSelectionStatus: "blocked",
  storageSelectionAllowed: false,
});

export const sampleDeploymentContinuityDecisionErrors = validateDeploymentContinuityDecision(
  sampleDeploymentContinuityDecision,
);
