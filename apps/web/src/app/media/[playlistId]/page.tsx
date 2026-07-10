import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sampleMultimediaContentPackage } from "@/data/sampleMultimediaPackage";
import { samplePartnerContentPackage, samplePartnerLaunchCode } from "@/data/samplePartnerPackage";
import { MediaPlaylistRoutePanel } from "@/features/multimedia/MediaPlaylistRoutePanel";
import { getStudentLaunchPath } from "@/features/routes/routeContracts";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function MediaPlaylistPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;
  const packages = [
    { contentPackage: sampleMultimediaContentPackage, tenant: ministarTenant, returnPath: getStudentLaunchPath("demo-unit-1") },
    { contentPackage: samplePartnerContentPackage, tenant: samplePublisherTenant, returnPath: getStudentLaunchPath(samplePartnerLaunchCode) },
  ];
  const resolved = packages
    .map((candidate) => ({
      ...candidate,
      playlist: candidate.contentPackage.playlists?.find((playlist) => playlist.playlistId === playlistId),
    }))
    .find((candidate) => candidate.playlist);

  if (!resolved?.playlist) {
    notFound();
  }

  return (
    <AppShell tenant={resolved.tenant} compact>
      <MediaPlaylistRoutePanel playlist={resolved.playlist} contentPackage={resolved.contentPackage} returnPath={resolved.returnPath} />
    </AppShell>
  );
}
