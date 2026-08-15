export type LocalBundleReadiness = "planning" | "media-missing" | "offline-ready";
export type LocalCompanionHandoffStatus = "provided" | "needed" | "blocked";
export type LocalCompanionGameStatus = "included" | "planned" | "blocked";
export type LocalCompanionArtifactStatus = "ready" | "pending" | "blocked";

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
  targetType: "front-door" | "unit-launch" | "activity-hub" | "media-playlist" | "game-mode";
  targetId: string;
  localFallbackPath: string;
}

export interface LocalCompanionGameSummary {
  gameId: string;
  label: string;
  gameMode: string;
  engineId: string;
  localPath: string;
  status: LocalCompanionGameStatus;
  audioCovered: boolean;
  reportsProgress: boolean;
  note: string;
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

export interface LocalCompanionPackageArtifact {
  artifactId: string;
  label: string;
  kind: "content" | "media" | "route" | "game" | "reporting" | "release-control" | "installer";
  path: string;
  status: LocalCompanionArtifactStatus;
  requiredFor: "preview" | "closed-handoff" | "offline-ready";
  source: "generated" | "publisher-provided" | "school-policy" | "future-build";
  blockedBy: string;
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
  games: LocalCompanionGameSummary[];
  artifacts: LocalCompanionPackageArtifact[];
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
      {
        qrId: "qr-ministar-l1-u1-launch",
        targetType: "unit-launch",
        targetId: "launch:demo-unit-1",
        localFallbackPath: "/launch/demo-unit-1",
      },
      {
        qrId: "qr-ministar-l1-u1-activity-hub",
        targetType: "activity-hub",
        targetId: "activities:demo-unit-1",
        localFallbackPath: "/activities/demo-unit-1",
      },
      {
        qrId: "qr-ministar-l1-u1-media-playlist",
        targetType: "media-playlist",
        targetId: "playlist-ministar-l1-u1-greetings",
        localFallbackPath: "/media/playlist-ministar-l1-u1-greetings",
      },
    ],
    games: [
      {
        gameId: "ministar-local-flashcards",
        label: "Entry flashcards",
        gameMode: "flashcards",
        engineId: "entry",
        localPath: "/flashcards/demo-unit-1",
        status: "included",
        audioCovered: true,
        reportsProgress: true,
        note: "Entry practice keeps target-language audio as the progression trigger.",
      },
      {
        gameId: "ministar-local-match-up",
        label: "Match Up",
        gameMode: "match-up",
        engineId: "pairing",
        localPath: "/match/demo-unit-1",
        status: "planned",
        audioCovered: true,
        reportsProgress: true,
        note: "Visible pairing bridge before hidden Memory Match recall; local package must preserve target-language audio.",
      },
      {
        gameId: "ministar-local-memory",
        label: "Memory Match",
        gameMode: "memory-match",
        engineId: "pairing",
        localPath: "/memory/demo-unit-1",
        status: "planned",
        audioCovered: true,
        reportsProgress: true,
        note: "Unlocked after entry practice; local package must preserve the same event stream.",
      },
      {
        gameId: "ministar-local-type-answer",
        label: "Type Answer",
        gameMode: "type-answer",
        engineId: "text-spelling",
        localPath: "/type-answer/demo-unit-1",
        status: "planned",
        audioCovered: true,
        reportsProgress: true,
        note: "Typing route keeps target-language prompt audio as the progress trigger.",
      },
    ],
    artifacts: [
      {
        artifactId: "ministar-content-package-artifact",
        label: "Reviewed content package",
        kind: "content",
        path: "content-package.json",
        status: "ready",
        requiredFor: "preview",
        source: "generated",
        blockedBy: "None for demo preview.",
        nextStep: "Keep package data aligned with the hosted MiniStar sample route.",
      },
      {
        artifactId: "ministar-media-artifact",
        label: "Media folder",
        kind: "media",
        path: "media/",
        status: "pending",
        requiredFor: "closed-handoff",
        source: "publisher-provided",
        blockedBy: "Final rights-safe files and checksums are not bundled.",
        nextStep: "Attach final audio/video files and generate checksum manifest.",
      },
      {
        artifactId: "ministar-release-gate-artifact",
        label: "Release gate snapshot",
        kind: "release-control",
        path: "release/local-release-gate.json",
        status: "blocked",
        requiredFor: "offline-ready",
        source: "generated",
        blockedBy: "Installer/update, backup/export, and school policy are unresolved.",
        nextStep: "Generate only after release gate blockers are closed.",
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
      {
        qrId: "qr-sample-publisher-u1-launch",
        targetType: "unit-launch",
        targetId: "launch:partner-demo-unit-1",
        localFallbackPath: "/launch/partner-demo-unit-1",
      },
      {
        qrId: "qr-sample-publisher-u1-activity-hub",
        targetType: "activity-hub",
        targetId: "activities:partner-demo-unit-1",
        localFallbackPath: "/activities/partner-demo-unit-1",
      },
      {
        qrId: "qr-sample-publisher-u1-media-playlist",
        targetType: "media-playlist",
        targetId: "playlist-sample-publisher-l1-u1-routines",
        localFallbackPath: "/media/playlist-sample-publisher-l1-u1-routines",
      },
    ],
    games: [
      {
        gameId: "partner-local-flashcards",
        label: "Entry flashcards",
        gameMode: "flashcards",
        engineId: "entry",
        localPath: "/flashcards/partner-demo-unit-1",
        status: "included",
        audioCovered: true,
        reportsProgress: true,
        note: "Entry practice is the first student route after teacher/front-door access.",
      },
      {
        gameId: "partner-local-match-up",
        label: "Match Up",
        gameMode: "match-up",
        engineId: "pairing",
        localPath: "/match/partner-demo-unit-1",
        status: "included",
        audioCovered: true,
        reportsProgress: true,
        note: "Visible pairing route is part of the local companion route surface before Memory Match.",
      },
      {
        gameId: "partner-local-memory",
        label: "Memory Match",
        gameMode: "memory-match",
        engineId: "pairing",
        localPath: "/memory/partner-demo-unit-1",
        status: "included",
        audioCovered: true,
        reportsProgress: true,
        note: "Pairing-engine game stays inside the standard progress event stream.",
      },
      {
        gameId: "partner-local-quiz",
        label: "Quiz",
        gameMode: "quiz",
        engineId: "selection",
        localPath: "/quiz/partner-demo-unit-1",
        status: "included",
        audioCovered: true,
        reportsProgress: true,
        note: "Selection-engine assessment route is part of the local companion route surface.",
      },
      {
        gameId: "partner-local-true-false",
        label: "True or False",
        gameMode: "true-false",
        engineId: "selection",
        localPath: "/true-false/partner-demo-unit-1",
        status: "included",
        audioCovered: true,
        reportsProgress: true,
        note: "Selection-engine true/false route uses reviewed vocabulary prompts and standard progress events.",
      },
      {
        gameId: "partner-local-type-answer",
        label: "Type Answer",
        gameMode: "type-answer",
        engineId: "text-spelling",
        localPath: "/type-answer/partner-demo-unit-1",
        status: "included",
        audioCovered: true,
        reportsProgress: true,
        note: "Text-spelling typing route uses reviewed vocabulary prompts and deterministic scoring.",
      },
      {
        gameId: "partner-local-sentence",
        label: "Sentence Builder",
        gameMode: "sentence-builder",
        engineId: "text-spelling",
        localPath: "/sentence/partner-demo-unit-1",
        status: "included",
        audioCovered: true,
        reportsProgress: true,
        note: "Text-spelling route uses reviewed target sentences and tap-to-speak controls.",
      },
      {
        gameId: "partner-local-speak",
        label: "Speak It",
        gameMode: "speak-it",
        engineId: "speaking-listening",
        localPath: "/speak/partner-demo-unit-1",
        status: "planned",
        audioCovered: true,
        reportsProgress: true,
        note: "Microphone behavior remains teacher/school policy gated in the local package.",
      },
    ],
    artifacts: [
      {
        artifactId: "partner-content-package-artifact",
        label: "Reviewed content package",
        kind: "content",
        path: "content-package.json",
        status: "ready",
        requiredFor: "preview",
        source: "generated",
        blockedBy: "None for static planning preview.",
        nextStep: "Freeze after publisher source review and game/audio coverage review.",
      },
      {
        artifactId: "partner-media-folder-artifact",
        label: "Media folder",
        kind: "media",
        path: "media/audio, media/video",
        status: "blocked",
        requiredFor: "closed-handoff",
        source: "publisher-provided",
        blockedBy: "Real audio/video files, rights proof, and checksums are missing.",
        nextStep: "Collect partner media files, rights notes, and checksums.",
      },
      {
        artifactId: "partner-route-registry-artifact",
        label: "Route registry snapshot",
        kind: "route",
        path: "routes/qr-registry.json",
        status: "pending",
        requiredFor: "closed-handoff",
        source: "generated",
        blockedBy: "Local deep-link and hosted redirect behavior still need device testing.",
        nextStep: "Test printed QR flow against hosted redirect, local browser, and packaged companion fallback.",
      },
      {
        artifactId: "partner-game-routes-artifact",
        label: "Game route manifest",
        kind: "game",
        path: "games/game-routes.json",
        status: "pending",
        requiredFor: "closed-handoff",
        source: "generated",
        blockedBy: "Speak It remains teacher/school microphone-policy gated.",
        nextStep: "Keep included games audio-covered and reportable before package export.",
      },
      {
        artifactId: "partner-report-policy-artifact",
        label: "Local report policy",
        kind: "reporting",
        path: "policy/report-policy.json",
        status: "blocked",
        requiredFor: "offline-ready",
        source: "school-policy",
        blockedBy: "Backup, restore, retention, and teacher export policy are not approved.",
        nextStep: "Choose local-only export, hosted sync, or no retained reporting for the pilot.",
      },
      {
        artifactId: "partner-release-gate-artifact",
        label: "Release gate snapshot",
        kind: "release-control",
        path: "release/local-release-gate.json",
        status: "blocked",
        requiredFor: "closed-handoff",
        source: "generated",
        blockedBy: "Local release gate blockers are still open.",
        nextStep: "Generate snapshot only after media, installer, backup, QR, game/audio, and school policy gates are closed.",
      },
      {
        artifactId: "partner-installer-artifact",
        label: "Installer/update package",
        kind: "installer",
        path: "installer/",
        status: "blocked",
        requiredFor: "offline-ready",
        source: "future-build",
        blockedBy: "Local companion shell, update channel, rollback, and yearly edition migration are not designed.",
        nextStep: "Choose the local shell strategy after hosted pilot requirements are stable.",
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
