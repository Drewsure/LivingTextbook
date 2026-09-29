import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  createEmptyTeacherMediaLibraryPreview,
  findTeacherMediaLibraryPreview,
  getTeacherMediaRightsRecords,
} from "@/data/sampleTeacherMediaLibrary";
import { TeacherMediaLibraryPanel } from "@/features/multimedia/TeacherMediaLibraryPanel";
import { TeacherAssistLanguageAudioCatalogPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogPanel";
import { sampleAssistLanguageAudioCatalogRecords } from "@/data/sampleAssistLanguageAudioCatalog";
import { buildAssistLanguageAudioCatalogApprovalPackets } from "@/data/sampleAssistLanguageAudioCatalogApproval";
import { buildAssistLanguageAudioCatalogApprovalReconciliations } from "@/data/sampleAssistLanguageAudioCatalogApprovalReconciliation";
import { buildAssistLanguageAudioCatalogReviewerGateBindings } from "@/data/sampleAssistLanguageAudioCatalogReviewerGateBinding";
import { buildAssistLanguageAudioCatalogReleaseReviewBindings } from "@/data/sampleAssistLanguageAudioCatalogReleaseReviewBinding";
import { buildAssistLanguageAudioCatalogReleaseDecisionSnapshotBindings } from "@/data/sampleAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding";
import { TeacherAssistLanguageAudioCatalogApprovalPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogApprovalPanel";
import { TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel";
import { TeacherAssistLanguageAudioCatalogReviewerGateBindingPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogReviewerGateBindingPanel";
import { TeacherAssistLanguageAudioCatalogReleaseReviewBindingPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogReleaseReviewBindingPanel";
import { TeacherAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingPanel";
import { resolveTenantConfig } from "@/features/tenant/tenantResolver";
import { sampleReviewerIdentitySignatureGate } from "@/data/sampleReviewerIdentitySignatureGate";
import { sampleWhiteLabelReleaseReadiness } from "@/data/sampleWhiteLabelReleaseReadiness";
import { sampleControlledPilotHumanReviewPacket } from "@/data/sampleControlledPilotHumanReviewPacket";
import { samplePilotReviewDecisionSnapshots } from "@/data/samplePilotReviewDecisionSnapshots";
export default async function TeacherMediaLibraryPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const tenant = resolveTenantConfig(tenantId);

  if (!tenant) notFound();
  const preview = findTeacherMediaLibraryPreview(tenantId) ?? createEmptyTeacherMediaLibraryPreview(tenantId, tenant.displayName);

  const tenantCatalogRecords = sampleAssistLanguageAudioCatalogRecords.filter((record) => record.tenantId === tenantId);
  const approvalPackets = buildAssistLanguageAudioCatalogApprovalPackets(tenantCatalogRecords);
  const reconciliations = buildAssistLanguageAudioCatalogApprovalReconciliations(approvalPackets, tenantCatalogRecords);
  const reviewerGate = sampleReviewerIdentitySignatureGate.tenantId === tenantId ? sampleReviewerIdentitySignatureGate : undefined;
  const reviewerBindings = buildAssistLanguageAudioCatalogReviewerGateBindings(reconciliations, reviewerGate);
  const releaseReadiness = sampleWhiteLabelReleaseReadiness.tenantId === tenantId ? sampleWhiteLabelReleaseReadiness : undefined;
  const humanReviewPacket = sampleControlledPilotHumanReviewPacket.tenantId === tenantId ? sampleControlledPilotHumanReviewPacket : undefined;
  const releaseReviewBindings = buildAssistLanguageAudioCatalogReleaseReviewBindings(reconciliations, reviewerBindings, releaseReadiness, humanReviewPacket);

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        <TeacherMediaLibraryPanel preview={preview} rightsRecords={getTeacherMediaRightsRecords(tenantId)} />
        <TeacherAssistLanguageAudioCatalogPanel records={tenantCatalogRecords} />
        <TeacherAssistLanguageAudioCatalogApprovalPanel packets={approvalPackets} />
        <TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel reconciliations={reconciliations} />
        <TeacherAssistLanguageAudioCatalogReviewerGateBindingPanel bindings={reviewerBindings} />
        <TeacherAssistLanguageAudioCatalogReleaseReviewBindingPanel bindings={releaseReviewBindings} />
        <TeacherAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingPanel bindings={buildAssistLanguageAudioCatalogReleaseDecisionSnapshotBindings(releaseReviewBindings, samplePilotReviewDecisionSnapshots)} />
      </div>
    </AppShell>
  );
}
