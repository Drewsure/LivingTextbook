"use client";

import { useEffect, useMemo, useState } from "react";
import type { ContentPackage, GameProgressEvent, LaunchSession, StudentProgressionState } from "@living-textbook/content-model";
import { UnitMediaEngagementPanel } from "./UnitMediaEngagementPanel";
import { getLocalPilotPackageMediaPath } from "@/features/routes/routeContracts";
import { appendLocalSessionEvidence } from "@/features/persistence/localSessionEvidenceStore";

interface LocalPackageMediaFlowProps {
  tenantId: string;
  packageId: string;
  version: string;
  contentPackage: ContentPackage;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
}

export function LocalPackageMediaFlow({
  tenantId,
  packageId,
  version,
  contentPackage,
  launchSession,
  progression,
}: LocalPackageMediaFlowProps) {
  const [events, setEvents] = useState<GameProgressEvent[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const localContentPackage = useMemo(
    () => mapLocalMediaSources(contentPackage, tenantId, packageId, version),
    [contentPackage, tenantId, packageId, version],
  );

  useEffect(() => {
    if (events.length === 0) return;
    const result = appendLocalSessionEvidence({
      packageId,
      launchSession,
      progression,
      events,
      savedAt: new Date().toISOString(),
    });
    setErrors(result.errors);
  }, [events, launchSession, packageId, progression]);

  return (
    <div className="grid gap-3">
      <UnitMediaEngagementPanel
        contentPackage={localContentPackage}
        launchSession={launchSession}
        progression={progression}
        targetLanguage={localContentPackage.meta.targetLanguage ?? "en"}
        onEvent={(event) => setEvents((current) => [...current, event])}
        mediaResolutionMode="hosted-first"
      />
      {errors.length > 0 ? (
        <aside className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950" aria-live="polite">
          <p className="font-bold">Local media evidence was not updated</p>
          <ul className="mt-2 grid gap-1">{errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}</ul>
        </aside>
      ) : null}
    </div>
  );
}

function mapLocalMediaSources(contentPackage: ContentPackage, tenantId: string, packageId: string, version: string): ContentPackage {
  return {
    ...contentPackage,
    mediaAssets: contentPackage.mediaAssets?.map((asset) => ({
      ...asset,
      sourceUri: getLocalPilotPackageMediaPath(tenantId, packageId, version, asset.mediaAssetId),
      posterImageUri: asset.posterImageUri
        ? getLocalPilotPackageMediaPath(tenantId, packageId, version, asset.mediaAssetId, "poster")
        : undefined,
      transcriptUri: asset.transcriptUri
        ? getLocalPilotPackageMediaPath(tenantId, packageId, version, asset.mediaAssetId, "transcript")
        : undefined,
      localBundlePath: undefined,
    })),
  };
}
