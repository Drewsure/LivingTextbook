import {
  deriveDeploymentContinuityHandoff,
  validateDeploymentContinuityHandoff,
  type DeploymentContinuityHandoff,
} from "@living-textbook/content-model";
import { sampleDeploymentContinuityDecision } from "./sampleDeploymentContinuityDecision";
import { samplePersistenceActivationPreflight } from "./samplePersistenceActivationPreflight";

export const sampleDeploymentContinuityHandoff: DeploymentContinuityHandoff = deriveDeploymentContinuityHandoff({
  handoffId: "sample-publisher-deployment-continuity-handoff",
  activationPreflightId: samplePersistenceActivationPreflight.packetId,
  decision: sampleDeploymentContinuityDecision,
  activationPreflightStatus: samplePersistenceActivationPreflight.status,
  activationPreflightBlockers: samplePersistenceActivationPreflight.blockedReasons,
});

export const sampleDeploymentContinuityHandoffErrors = validateDeploymentContinuityHandoff(
  sampleDeploymentContinuityHandoff,
);
