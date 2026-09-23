import {
  deriveDeploymentContinuityDecision,
  validateDeploymentContinuityDecision,
  type DeploymentContinuityDecision,
} from "@living-textbook/content-model";
import { samplePilotDeploymentDecision } from "./samplePilotDeploymentDecision";
import { samplePersistenceRecoveryRehearsal } from "./samplePersistenceRecoveryRehearsal";

export const sampleDeploymentContinuityDecision: DeploymentContinuityDecision = deriveDeploymentContinuityDecision({
  decisionId: "sample-publisher-deployment-continuity-decision",
  pilotDeploymentDecision: samplePilotDeploymentDecision,
  recoveryRehearsal: samplePersistenceRecoveryRehearsal,
});

export const sampleDeploymentContinuityDecisionErrors = validateDeploymentContinuityDecision(
  sampleDeploymentContinuityDecision,
);
