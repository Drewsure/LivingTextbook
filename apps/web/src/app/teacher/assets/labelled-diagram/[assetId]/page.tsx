import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sampleLabelledDiagramEvidencePacketFlow } from "@/data/sampleEvidencePacketFlows";
import { findLabelledDiagramAssetWorkspace } from "@/data/sampleLabelledDiagramAssetWorkspace";
import { LabelledDiagramAssetWorkspacePanel } from "@/features/game-assets/LabelledDiagramAssetWorkspacePanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherLabelledDiagramAssetWorkspacePage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const workspace = findLabelledDiagramAssetWorkspace(assetId);

  if (!workspace) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <LabelledDiagramAssetWorkspacePanel workspace={workspace} evidenceFlow={sampleLabelledDiagramEvidencePacketFlow} />
    </AppShell>
  );
}
