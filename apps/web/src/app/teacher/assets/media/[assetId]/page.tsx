import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { findMediaAssetWorkspace } from "@/data/sampleMediaAssetWorkspace";
import { MediaAssetWorkspacePanel } from "@/features/multimedia/MediaAssetWorkspacePanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherMediaAssetWorkspacePage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const workspace = findMediaAssetWorkspace(assetId);

  if (!workspace) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <MediaAssetWorkspacePanel workspace={workspace} />
    </AppShell>
  );
}
