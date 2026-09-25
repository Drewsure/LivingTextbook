import {
  assessLocalBundleReadiness,
  evaluateLocalBundleAssetEvidenceSet,
  type LocalBundleReadinessAssessment,
  type PersistenceHandoffPacket,
} from "@living-textbook/content-model";
import type { LocalBundleManifestSummary } from "./sampleLocalBundlePlan";
import type { LocalDeploymentPreflightPlan, LocalCompanionReleaseGate } from "./sampleLocalDeploymentPreflight";
import { buildLocalBundleHandoffPacket } from "./localBundleHandoff";
import { buildLocalBundleHandoffPersistencePreview } from "./localBundleHandoffPersistence";
import { createLocalBundleRuntimeManifest } from "./localBundleRuntimeManifest";

export function buildLocalBundleReadinessAssessment({
  manifest,
  tenantId,
  preflight,
  releaseGate,
  persistencePacket,
}: {
  manifest: LocalBundleManifestSummary;
  tenantId: string;
  preflight: LocalDeploymentPreflightPlan;
  releaseGate: LocalCompanionReleaseGate;
  persistencePacket: PersistenceHandoffPacket;
}): {
  assessment: LocalBundleReadinessAssessment;
  handoff: ReturnType<typeof buildLocalBundleHandoffPacket>;
  persistenceAdmission: ReturnType<typeof buildLocalBundleHandoffPersistencePreview>;
} {
  const runtimeManifest = createLocalBundleRuntimeManifest(manifest, tenantId);
  const assetEvidenceBlockedCount = evaluateLocalBundleAssetEvidenceSet(runtimeManifest.assets).blockers.length;
  const handoff = buildLocalBundleHandoffPacket({
    manifest,
    assetEvidenceBlockedCount,
    routeResolutionReady: runtimeManifest.routes.length > 0,
    releaseBlockedCount: releaseGate.items.filter((item) => item.status === "blocked").length,
    preflightBlockedCount: preflight.checks.filter((check) => check.status === "blocked").length,
  });
  const persistenceAdmission = buildLocalBundleHandoffPersistencePreview({
    handoffPacket: handoff.packet,
    persistencePacket,
  });
  const assessment = assessLocalBundleReadiness({
    manifest: runtimeManifest,
    expectedTenantId: tenantId,
    handoffPacket: handoff.packet,
    persistencePreview: persistenceAdmission.preview,
    persistencePacket,
    deploymentChecks: preflight.checks.map((check) => ({ checkId: check.checkId, status: check.status })),
    releaseChecks: releaseGate.items.map((item) => ({ checkId: item.gateId, status: item.status })),
  });

  return { assessment, handoff, persistenceAdmission };
}
