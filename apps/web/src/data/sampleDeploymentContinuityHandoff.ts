import {
  deriveDeploymentContinuityHandoff,
  validateDeploymentContinuityHandoff,
  type DeploymentContinuityHandoff,
} from "@living-textbook/content-model";
import { sampleDeploymentContinuityDecision } from "./sampleDeploymentContinuityDecision";
import { samplePersistenceActivationPreflight } from "./samplePersistenceActivationPreflight";
import { sampleWhiteLabelReleaseReadiness } from "./sampleWhiteLabelReleaseReadiness";

export const sampleDeploymentContinuityHandoff: DeploymentContinuityHandoff = deriveDeploymentContinuityHandoff({
  handoffId: "sample-publisher-deployment-continuity-handoff",
  activationPreflightId: samplePersistenceActivationPreflight.packetId,
  releaseReadinessId: sampleWhiteLabelReleaseReadiness.readinessId,
  releaseReadinessTenantId: sampleWhiteLabelReleaseReadiness.tenantId,
  releaseReadinessPackageId: sampleWhiteLabelReleaseReadiness.packageId,
  releaseReadinessStatus: sampleWhiteLabelReleaseReadiness.status,
  releaseReadinessBlockers: sampleWhiteLabelReleaseReadiness.phases.flatMap((phase) => phase.blockers),
  decision: sampleDeploymentContinuityDecision,
  activationPreflightStatus: samplePersistenceActivationPreflight.status,
  activationPreflightBlockers: samplePersistenceActivationPreflight.blockedReasons,
});

export const sampleDeploymentContinuityHandoffErrors = validateDeploymentContinuityHandoff(
  sampleDeploymentContinuityHandoff,
);
