import { notFound } from "next/navigation";
import { getUnitKey, resolveTargetLanguage } from "@living-textbook/content-model";
import { AppShell } from "@/components/layout/AppShell";
import { sampleLaunchSession, sampleStudentProgression } from "@/data/sampleLaunchSession";
import { sampleMultimediaContentPackage } from "@/data/sampleMultimediaPackage";
import {
  samplePartnerContentPackage,
  samplePartnerLaunchCode,
  samplePartnerLaunchSession,
  samplePartnerStudentProgression,
} from "@/data/samplePartnerPackage";
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
    {
      contentPackage: sampleMultimediaContentPackage,
      tenant: ministarTenant,
      launchSession: sampleLaunchSession,
      progression: sampleStudentProgression,
      returnPath: getStudentLaunchPath("demo-unit-1"),
    },
    {
      contentPackage: samplePartnerContentPackage,
      tenant: samplePublisherTenant,
      launchSession: samplePartnerLaunchSession,
      progression: samplePartnerStudentProgression,
      returnPath: getStudentLaunchPath(samplePartnerLaunchCode),
    },
  ];
  const resolved = packages
    .map((candidate) => ({
      ...candidate,
      playlist: candidate.contentPackage.playlists?.find((playlist) => playlist.playlistId === playlistId),
    }))
    .find((candidate) => candidate.playlist);

  const resolvedPlaylist = resolved?.playlist;

  if (!resolved || !resolvedPlaylist) {
    notFound();
  }

  const playlistUnit = resolved.contentPackage.units.find(
    (candidate) => getUnitKey(candidate.unitMeta) === resolvedPlaylist.unitKey,
  );

  return (
    <AppShell tenant={resolved.tenant} compact>
      <MediaPlaylistRoutePanel
        playlist={resolvedPlaylist}
        contentPackage={resolved.contentPackage}
        targetLanguage={resolveTargetLanguage({
          tenantTargetLanguage: resolved.tenant.languageSettings?.targetLanguage,
          unitLanguage: playlistUnit?.unitMeta.textbookReference?.language,
        })}
        launchSession={resolved.launchSession}
        progression={resolved.progression}
        mediaResolutionMode="hosted-first"
        returnPath={resolved.returnPath}
      />
    </AppShell>
  );
}
