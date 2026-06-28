import {
  getPermanentQrPath,
  getUnitKey,
  validateContentPackage,
  validatePermanentQrRoute,
} from "@living-textbook/content-model";
import type {
  ContentPackage,
  FrontDoorAccessPolicy,
  GameProgressEvent,
  PermanentQrRoute,
} from "@living-textbook/content-model";
import { levelOneUnitOne } from "./levelOneUnitOne";

const contentPackageId = "ministar-l1-u1-greetings-package";
const sampleUnitKey = getUnitKey(levelOneUnitOne.unitMeta);
const sampleTextbookReference = {
  seriesId: "ministar-english",
  bookId: "level-1",
  unitId: "unit-1",
  activityId: "greetings-entry",
  pageStart: 1,
  pageEnd: 4,
  language: "en",
  edition: "demo-2026",
  version: "0.1",
};

export const sampleMultimediaContentPackage: ContentPackage = {
  meta: {
    packageId: contentPackageId,
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    curriculumId: levelOneUnitOne.unitMeta.curriculumId,
    sourceType: "manual",
    reviewStatus: "reviewed",
    createdAt: "2026-06-28T00:00:00.000Z",
    sourceDocumentName: "MiniStar Level 1 Unit 1 sample package",
    textbookReference: sampleTextbookReference,
  },
  units: [
    {
      ...levelOneUnitOne,
      unitMeta: {
        ...levelOneUnitOne.unitMeta,
        contentPackageId,
        textbookReference: sampleTextbookReference,
      },
    },
  ],
  mediaAssets: [
    {
      mediaAssetId: "media-ministar-l1-u1-greetings-chant",
      tenantId: levelOneUnitOne.unitMeta.tenantId,
      title: "Greetings Chant",
      type: "chant",
      kind: "audio",
      rightsStatus: "partner-provided",
      sourceUri: "/media/demo/ministar/l1-u1/greetings-chant.mp3",
      localBundlePath: "content/ministar/level-1/unit-1/audio/greetings-chant.mp3",
      durationSeconds: 48,
      ownerName: "MiniStar sample tenant",
      language: "en",
      unitKey: sampleUnitKey,
      textbookReference: {
        ...sampleTextbookReference,
        activityId: "greetings-chant",
      },
    },
    {
      mediaAssetId: "media-ministar-l1-u1-greetings-video",
      tenantId: levelOneUnitOne.unitMeta.tenantId,
      title: "Hello Friends Video",
      type: "lesson-video",
      kind: "video",
      rightsStatus: "partner-provided",
      sourceUri: "/media/demo/ministar/l1-u1/hello-friends.mp4",
      localBundlePath: "content/ministar/level-1/unit-1/video/hello-friends.mp4",
      posterImageUri: "/media/demo/ministar/l1-u1/hello-friends-poster.jpg",
      transcriptUri: "/media/demo/ministar/l1-u1/hello-friends-transcript.vtt",
      durationSeconds: 92,
      ownerName: "MiniStar sample tenant",
      language: "en",
      unitKey: sampleUnitKey,
      textbookReference: {
        ...sampleTextbookReference,
        activityId: "hello-friends-video",
      },
    },
  ],
  playlists: [
    {
      playlistId: "playlist-ministar-l1-u1-greetings",
      tenantId: levelOneUnitOne.unitMeta.tenantId,
      title: "Unit 1 Greetings Media",
      unitKey: sampleUnitKey,
      mediaAssetIds: ["media-ministar-l1-u1-greetings-chant", "media-ministar-l1-u1-greetings-video"],
      usageRole: "primary",
      playbackContext: "student-practice",
      textbookReference: sampleTextbookReference,
    },
  ],
  multimediaPlans: [
    {
      unitKey: sampleUnitKey,
      primaryPlaylistId: "playlist-ministar-l1-u1-greetings",
      backgroundMediaAssetId: "media-ministar-l1-u1-greetings-chant",
      allowedBackgroundGameModes: ["memory-match"],
      backgroundEnabledByDefault: false,
      defaultVolumePercent: 35,
      requiresTeacherEnablement: true,
    },
  ],
};

export const samplePermanentQrRoute: PermanentQrRoute = {
  qrId: "qr-ministar-l1-u1-front-door",
  identifier: {
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    seriesId: "ministar-english",
    bookId: "level-1",
    unitId: "unit-1",
    activityId: "front-door",
    language: "en",
    edition: "demo-2026",
    version: "0.1",
  },
  targetType: "front-door",
  targetId: "enter:ministar:greetings-demo",
  preferredDeployment: "hosted-web",
  fallbackPath: "/enter/ministar",
  updatedAt: "2026-06-28T00:00:00.000Z",
};

export const sampleFrontDoorAccessPolicy: FrontDoorAccessPolicy = {
  tenantId: levelOneUnitOne.unitMeta.tenantId,
  entryCodeRequired: true,
  userCodeRequired: true,
  reportProgressToTeacher: true,
  allowAnonymousPractice: false,
};

export interface TeacherProgressSummaryConcept {
  unitKey: string;
  launchCode: string;
  entryCode: string;
  studentCount: number;
  flashcardCompletions: number;
  memoryMatchStarts: number;
  mediaStarts: number;
  mediaCompletions: number;
  backgroundMediaOptIns: number;
  averageStarDust: number;
  teacherReportStreams: string[];
  sampleEvents: GameProgressEvent[];
}

export const sampleTeacherProgressSummaryConcept: TeacherProgressSummaryConcept = {
  unitKey: sampleUnitKey,
  launchCode: "demo-unit-1",
  entryCode: "HELLO-101",
  studentCount: 12,
  flashcardCompletions: 10,
  memoryMatchStarts: 8,
  mediaStarts: 9,
  mediaCompletions: 6,
  backgroundMediaOptIns: 4,
  averageStarDust: 325,
  teacherReportStreams: [
    "Entry practice completion",
    "Memory Match starts",
    "Playlist/media engagement",
    "Optional background media use",
    "Star Dust progress",
  ],
  sampleEvents: [
    {
      type: "entry_practice_completed",
      unitKey: sampleUnitKey,
      gameMode: "flashcards",
      launchCode: "demo-unit-1",
      studentSessionId: "demo-unit-1:student-04",
      occurredAt: "2026-06-28T00:05:00.000Z",
    },
    {
      type: "media_started",
      unitKey: sampleUnitKey,
      gameMode: "flashcards",
      launchCode: "demo-unit-1",
      studentSessionId: "demo-unit-1:student-04",
      occurredAt: "2026-06-28T00:06:00.000Z",
      metadata: {
        mediaAssetId: "media-ministar-l1-u1-greetings-chant",
      },
    },
    {
      type: "background_media_enabled",
      unitKey: sampleUnitKey,
      gameMode: "memory-match",
      launchCode: "demo-unit-1",
      studentSessionId: "demo-unit-1:student-04",
      occurredAt: "2026-06-28T00:08:00.000Z",
      metadata: {
        mediaAssetId: "media-ministar-l1-u1-greetings-chant",
        volumePercent: 35,
      },
    },
  ],
};

export const samplePermanentQrPath = getPermanentQrPath(samplePermanentQrRoute.identifier);
export const sampleFrontDoorPath = "/enter/ministar";
export const samplePackageValidationErrors = [
  ...validateContentPackage(sampleMultimediaContentPackage),
  ...validatePermanentQrRoute(samplePermanentQrRoute),
];
