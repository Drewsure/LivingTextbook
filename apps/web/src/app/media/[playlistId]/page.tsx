import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sampleMultimediaContentPackage } from "@/data/sampleMultimediaPackage";
import { MediaPlaylistRoutePanel } from "@/features/multimedia/MediaPlaylistRoutePanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default async function MediaPlaylistPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;
  const playlist = sampleMultimediaContentPackage.playlists?.find((candidate) => candidate.playlistId === playlistId);

  if (!playlist) {
    notFound();
  }

  return (
    <AppShell tenant={ministarTenant} compact>
      <MediaPlaylistRoutePanel playlist={playlist} contentPackage={sampleMultimediaContentPackage} />
    </AppShell>
  );
}
