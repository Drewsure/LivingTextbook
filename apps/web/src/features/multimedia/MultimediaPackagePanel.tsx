import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AudioCue,
  ContentPackage,
  MediaAsset,
  UnitAiTutorPlan,
  UnitAssistLanguagePlan,
  UnitAudioSupportPlan,
  UnitMultimediaPlan,
} from "@living-textbook/content-model";
import { formatLanguageName } from "@/features/language/languageLabels";

interface MultimediaPackagePanelProps {
  contentPackage: ContentPackage;
  permanentQrPath: string;
  frontDoorPath: string;
  validationErrors: string[];
}

export function MultimediaPackagePanel({
  contentPackage,
  permanentQrPath,
  frontDoorPath,
  validationErrors,
}: MultimediaPackagePanelProps) {
  const mediaAssets = contentPackage.mediaAssets ?? [];
  const audioCues = contentPackage.audioCues ?? [];
  const playlists = contentPackage.playlists ?? [];
  const assistLanguagePlans = contentPackage.assistLanguagePlans ?? [];
  const multimediaPlan = contentPackage.multimediaPlans?.[0];
  const audioSupportPlan = contentPackage.audioSupportPlans?.[0];
  const aiTutorPlan = contentPackage.aiTutorPlans?.[0];
  const audioCount = mediaAssets.filter((asset) => asset.kind === "audio").length;
  const videoCount = mediaAssets.filter((asset) => asset.kind === "video").length;
  const enabledAiTutorPlans = (contentPackage.aiTutorPlans ?? []).filter((plan) => plan.enabled).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Living textbook package</p>
          <h2 className="mt-1 text-lg font-bold">Games + multimedia + QR entry</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            A single reviewed unit package can carry the learning payload, games, audio, video, playlist, text-level audio cues, optional assist languages, optional game-background media, and permanent/front-door route concepts.
          </p>
        </div>
        <StatusPill label={validationErrors.length === 0 ? "Package valid" : "Needs review"} tone={validationErrors.length === 0 ? "success" : "warning