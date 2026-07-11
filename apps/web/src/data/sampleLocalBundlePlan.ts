export type LocalBundleReadiness = "planning" | "media-missing" | "offline-ready";
export type LocalCompanionHandoffStatus = "provided" | "needed" | "blocked";

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

export interface LocalCompanionHandoffItem {
  itemId: string;
  label: string;
  owner: "publisher" | "platform" | "school";
  status: LocalCompanionHandoffStatus;
  artifact: string;
  whyNeeded: string;
  nextStep: string;
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
  handoffItems: LocalCompanionHandoffItem[];
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
    handoffItems: [
      {
        itemId: "ministar-content-package-json",
        label: "Reviewed content package",
        owner: "platform",
        status: "provided",
        artifact: "content-package.json",
        whyNeeded: "The local package needs reviewed vocabulary, sentence, game, audio, and teacher protocol metadata.",
        nextStep: "Keep aligned with the hosted sample package.",
      },
      {
        itemId: "ministar-media-files",
        label: "Audio/video files",
        owner: "publisher",
        status: "needed",
        artifact: "media/audio and media/video folders",
        whyNeeded: "A closed package cannot rely on missing hosted demo media.",
        nextStep: "Attach rights-safe files and generate checksums.",
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
    handoffItems: [
      {
        itemId: "partner-source-pdf",
        label: "Publisher source unit",
        owner: "publisher",
        status: "needed",
        artifact: "unit-1-source.pdf plus review notes",
        whyNeeded: "The platform must review source pages before building a student-facing package.",
        nextStep: "Attach page range, unit title, target words, and any teacher notes.",
      },
      {
        itemId: "partner-content-package-json",
        label: "Reviewed content package",
        owner: "platform",
        status: "provided",
        artifact: "content-package.json",
        whyNeeded: "The local app needs the same reviewed package vocabulary as hosted routes.",
        nextStep: "Freeze the package only after source review and game/audio coverage pass.",
      },
      {
        itemId: "partner-media-rights",
        label: "Audio/video rights proof",
        owner: "publisher",
        status: "blocked",
        artifact: "media-rights.csv or signed rights notes",
        whyNeeded: "Closed distribution still needs rights, ownership, and version records for every asset.",
        nextStep: "Provide ownership/license notes for the morning song and routine video.",
      },
      {
        itemId: "partner-checksum-manifest",
        label: "Checksum manifest",
        owner: "platform",
        status: "blocked",
        artifact: "checksums.json",
        whyNeeded: "The installer or local server must detect missing or replaced media files.",
        nextStep: "Generate checksums after final media files are attached.",
      },
      {
        itemId: "partner-local-report-policy",
        label: "Local report export policy",
        owner: "school",
        status: "needed",
        artifact: "report-policy.json",
        whyNeeded: "Teacher reports, backup, restore, and export cannot store student data without school policy.",
        nextStep: "Choose local-only export, hosted sync, or no retained reporting for the pilot.",
      },
    ],
  },
];
