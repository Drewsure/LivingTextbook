import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  filterAiGeneratedDraftPayloadPreviewsByTenant,
  sampleAiGeneratedDraftPayloadPreviews,
} from "@/data/sampleAiGeneratedDraftPayloadPreview";
import {
  filterAiGeneratedPackageManifestsByTenant,
  sampleAiGeneratedPackageManifests,
} from "@/data/sampleAiGeneratedPackageManifest";
import { filterAiEngineBindingPlansByTenant, sampleAiEngineBindingPlans } from "@/data/sampleAiEngineBindingPlan";
import {
  filterAiGenerationRequestBuildersByTenant,
  sampleAiGenerationRequestBuilders,
} from "@/data/sampleAiGenerationRequestBuilder";
import {
  filterAiGeneratorCostEntitlementGatesByTenant,
  sampleAiGeneratorCostEntitlementGates,
} from "@/data/sampleAiGeneratorCostEntitlementGate";
import { sampleAiGameGeneratorPlan } from "@/data/sampleAiGameGeneratorPlan";
import {
  filterAiGeneratorAudioCoveragePlansByTenant,
  sampleAiGeneratorAudioCoveragePlans,
} from "@/data/sampleAiGeneratorAudioCoveragePlan";
import {
  filterAiGamificationMappingPlansByTenant,
  sampleAiGamificationMappingPlans,
} from "@/data/sampleAiGamificationMappingPlan";
import { filterAiPromptPackagePlansByTenant, sampleAiPromptPackagePlans } from "@/data/sampleAiPromptPackagePlan";
import {
  filterAiVerifierSubmissionPacketsByTenant,
  sampleAiVerifierSubmissionPackets,
} from "@/data/sampleAiVerifierSubmissionPacket";
import { sampleActivityPathwayCompatibilityMatrix } from "@/data/sampleActivityPathwayCompatibility";
import { AiGenerationRequestBuilderPanel } from "@/features/content-intake/AiGenerationRequestBuilderPanel";
import { AiGeneratorCostEntitlementGatePanel } from "@/features/content-intake/AiGeneratorCostEntitlementGatePanel";
import { AiGeneratedDraftPayloadPreviewPanel } from "@/features/content-intake/AiGeneratedDraftPayloadPreviewPanel";
import { AiGeneratedPackageManifestPanel } from "@/features/content-intake/AiGeneratedPackageManifestPanel";
import { AiEngineBindingPlanPanel } from "@/features/content-intake/AiEngineBindingPlanPanel";
import { AiGamificationMappingPanel } from "@/features/content-intake/AiGamificationMappingPanel";
import { AiGeneratorAudioCoveragePlanPanel } from "@/features/content-intake/AiGeneratorAudioCoveragePlanPanel";
import { AiGameGeneratorPlanPanel } from "@/features/content-intake/AiGameGeneratorPlanPanel";
import { AiModeRecommendationPanel } from "@/features/content-intake/AiModeRecommendationPanel";
import { AiPromptPackagePlanPanel } from "@/features/content-intake/AiPromptPackagePlanPanel";
import { AiVerifierSubmissionPacketPanel } from "@/features/content-intake/AiVerifierSubmissionPacketPanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherAiGameGeneratorPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const tenant =
    tenantId === samplePublisherTenant.id ? samplePublisherTenant : tenantId === ministarTenant.id ? ministarTenant : null;

  if (!tenant) {
    notFound();
  }

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        <AiGameGeneratorPlanPanel plan={sampleAiGameGeneratorPlan} tenantId={tenantId} />
        <AiPromptPackagePlanPanel plans={filterAiPromptPackagePlansByTenant(sampleAiPromptPackagePlans, tenantId)} />
        <AiGeneratorCostEntitlementGatePanel
          gates={filterAiGeneratorCostEntitlementGatesByTenant(sampleAiGeneratorCostEntitlementGates, tenantId)}
        />
        <AiGenerationRequestBuilderPanel
          builders={filterAiGenerationRequestBuildersByTenant(sampleAiGenerationRequestBuilders, tenantId)}
        />
        <AiGeneratorAudioCoveragePlanPanel
          plans={filterAiGeneratorAudioCoveragePlansByTenant(sampleAiGeneratorAudioCoveragePlans, tenantId)}
        />
        <AiGamificationMappingPanel
          plans={filterAiGamificationMappingPlansByTenant(sampleAiGamificationMappingPlans, tenantId)}
        />
        <AiEngineBindingPlanPanel plans={filterAiEngineBindingPlansByTenant(sampleAiEngineBindingPlans, tenantId)} />
        <AiVerifierSubmissionPacketPanel
          packets={filterAiVerifierSubmissionPacketsByTenant(sampleAiVerifierSubmissionPackets, tenantId)}
        />
        <AiModeRecommendationPanel matrix={sampleActivityPathwayCompatibilityMatrix} />
        <AiGeneratedPackageManifestPanel
          manifests={filterAiGeneratedPackageManifestsByTenant(sampleAiGeneratedPackageManifests, tenantId)}
        />
        <AiGeneratedDraftPayloadPreviewPanel
          previews={filterAiGeneratedDraftPayloadPreviewsByTenant(sampleAiGeneratedDraftPayloadPreviews, tenantId)}
        />
      </div>
    </AppShell>
  );
}
