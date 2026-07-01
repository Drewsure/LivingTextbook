export type LocalBundleReadiness = "planning" | "media-missing" | "offline-ready";

export interface LocalBundleAssetSummary {
  assetId: string;
  kind: "audio" | "video";
  label: string;
  localPath: string;
  rightsStatus: "owned" | "licensed" | "partner-provided" | "unknown";
  checksumReady: boolean;
}

export interface LocalBundleRouteSummary {
  qrId: string;
  targetType: "front-door" | "unit-launch" | "media-playlist" | "game-mode";
  targetId: string;
  localFallbackPath: string;
}

export interface LocalBundleManifestSummary {
  bundleId: string;
  tenantName: string;
  version: string;
  readiness: LocalBundleReadiness;
  contentPackagePath: string;
  mediaRoot: string;
  offlineReady: boolean;
  requiresHostedRedirect: boolean;
  aiTutorEnabled: boolean;
  notes: string;
  assets: LocalBundleAssetSummary[];
  routes: LocalBundleRouteSummary[];
}

export const sampleLocalBundleManifests: LocalBundleManifestSummary[] = [
  {
    bundleId: "ministar-level-1-unit-1-demo",
    tenantName: "MiniStar English Lab",
    version: "0.1.0",
    readiness: "media-missing",
    contentPackagePath: "content-package.json",
    mediaRoot: "media/",
    offlineReady: false,
    requiresHostedRedirect: false,
    aiTutorEnabled: false,
    notes: "Planning manifest only. Media files are not bundled yet.",
    assets: [
      {
        assetId: "media-ministar-l1-u1-greetings-chant",
        kind: "audio",
        label: "Greetings chant",
        localPath: "media/audio/greetings-chant.mp3",
        rightsStatus: "partner-provided",
        checksumReady: false,
      },
      {
        assetId: "media-ministar-l1-u1-greetings-video",
        kind: "video",
        label: "Hello friends video",
        localPath: "media/video/hello-friends.mp4",
        rightsStatus: "partner-provided",
        checksumReady: false,
      },
    ],
    routes: [
      {
        qrId: "qr-ministar-l1-u1-front-door",
        targetType: "front-door",
        targetId: "enter:ministar:greetings-demo",
        localFallbackPath: "/enter/ministar",
      },
    ],
  },
  {
    bundleId: "sample-publisher-unit-1-planning",
    tenantName: "Sample Publisher Lab",
    version: "0.1.0",
    readiness: "planning",
    contentPackagePath: "content-package.json",
    mediaRoot: "media/",
    offlineReady: false,
    requiresHostedRedirect: true,
    aiTutorEnabled: false,
    notes: "Partner planning bundle. Route registry, media rights, and local asset files must be finalized before QR activation.",
    assets: [
      {
        assetId: "media-sample-publisher-u1-morning-song",
        kind: "audio",
        label: "Morning song",
        localPath: "media/audio/morning-song.mp3",
        rightsStatus: "unknown",
        checksumReady: false,
      },
      {
        assetId: "media-sample-publisher-u1-routine-video",
        kind: "video",
        label: "Routine video",
        localPath: "media/video/routine-video.mp4",
        rightsStatus: "unknown",
        checksumReady: false,
      },
    ],
    routes: [
      {
        qrId: "qr-sample-publisher-u1-front-door",
        targetType: "front-door",
        targetId: "enter:sample-publisher:routines-demo",
        localFallbackPath: "/enter/sample-publisher",
      },
    ],
  },
];
