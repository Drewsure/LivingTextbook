export type TenantId = string;
export type CurriculumId = string;
export type LaunchCode = string;
export type SeriesId = string;
export type BookId = string;
export type TextbookUnitId = string;
export type ActivityId = string;
export type ContentPackageId = string;
export type MediaAssetId = string;
export type PermanentQrId = string;

export type GameFamily =
  | "core-quiz"
  | "vocabulary-matching"
  | "memory-sorting"
  | "spelling-typing"
  | "syntax-construction"
  | "word-puzzles"
  | "arcade-action"
  | "speaking-listening";

export type ParentEngine = "pairing" | "selection" | "text-spelling" | "narrative";

export type GameModeId =
  | "flashcards"
  | "memory-match"
  | "balloon-pop"
  | "speak-it"
  | "quiz"
  | "sentence-builder";

export type LaunchAccessMode = "teacher-qr" | "permanent-qr" | "teacher-preview" | "student-return";
export type LaunchSessionStatus = "draft" | "open" | "locked" | "expired" | "completed";
export type LaunchStepId = "entry-practice" | "recommended-game" | "training-academy" | "completion-review";
export type MasteryStatus = "not-started" | "in-progress" | "mastered" | "needs-review";
export type SourceDocumentType = "pdf" | "docx" | "spreadsheet" | "manual" | "ai-draft";
export type ContentReviewStatus = "draft" | "reviewed" | "verified" | "approved" | "rejected";
export type DeploymentChannel =
  | "hosted-web"
  | "installed-pwa"
  | "desktop-app"
  | "local-classroom-server"
  | "custom-deep-link";
export type MediaAssetType = "song" | "chant" | "listening-track" | "voiceover" | "sound-effect" | "other-audio";
export type MediaRightsStatus = "owned" | "licensed" | "partner-provided" | "unknown";
export type QrTargetType = "unit-launch" | "game-mode" | "media-playlist" | "media-asset" | "teacher-preview";

export interface TextbookReference {
  seriesId?: SeriesId;
  bookId?: BookId;
  unitId?: TextbookUnitId;
  activityId?: ActivityId;
  pageStart?: number;
  pageEnd?: number;
  language?: string;
  edition?: string;
  version?: string;
}

export interface UnitMeta {
  tenantId: TenantId;
  curriculumId: CurriculumId;
  level: number;
  module: number;
  unit: number;
  theme: string;
  gameMode: GameModeId;
  gameFamily: GameFamily;
  engineId: ParentEngine;
  contentPackageId?: ContentPackageId;
  textbookReference?: TextbookReference;
}

export interface PedagogicalPayload {
  vocabularyTerms: string[];
  targetSentences: [string, string];
}

export interface TeacherLaunchProtocol {
  hook: string;
  activity: string;
  review: string;
}

export interface VisualRules {
  avatarFamily: string;
  characterFocus: string;
  blacklistCheck: {
    passed: boolean;
    notes: string;
  };
}

export interface UnitPayload {
  unitMeta: UnitMeta;
  pedagogicalPayload: PedagogicalPayload;
  visualRules: VisualRules;
  teacherLaunchProtocol: TeacherLaunchProtocol;
}

export interface ContentPackageMeta {
  packageId: ContentPackageId;
  tenantId: TenantId;
  curriculumId: CurriculumId;
  sourceType: SourceDocumentType;
  reviewStatus: ContentReviewStatus;
  createdAt: string;
  updatedAt?: string;
  sourceDocumentName?: string;
  sourceDocumentHash?: string;
  textbookReference?: TextbookReference;
}

export interface MediaAsset {
  mediaAssetId: MediaAssetId;
  tenantId: TenantId;
  title: string;
  type: MediaAssetType;
  rightsStatus: MediaRightsStatus;
  sourceUri?: string;
  localBundlePath?: string;
  durationSeconds?: number;
  ownerName?: string;
  language?: string;
  unitKey?: string;
  textbookReference?: TextbookReference;
}

export interface UnitMediaPlaylist {
  playlistId: string;
  tenantId: TenantId;
  title: string;
  unitKey: string;
  mediaAssetIds: MediaAssetId[];
  textbookReference?: TextbookReference;
}

export interface ContentPackage {
  meta: ContentPackageMeta;
  units: UnitPayload[];
  mediaAssets?: MediaAsset[];
  playlists?: UnitMediaPlaylist[];
}

export interface PermanentQrIdentifier {
  tenantId: TenantId;
  seriesId: SeriesId;
  bookId: BookId;
  unitId: TextbookUnitId;
  activityId: ActivityId;
  language?: string;
  edition?: string;
  version?: string;
}

export interface PermanentQrRoute {
  qrId: PermanentQrId;
  identifier: PermanentQrIdentifier;
  targetType: QrTargetType;
  targetId: string;
  preferredDeployment: DeploymentChannel;
  fallbackPath?: string;
  updatedAt: string;
}

export interface LaunchSession {
  launchCode: LaunchCode;
  tenantId: TenantId;
  curriculumId: CurriculumId;
  unitKey: string;
  status: LaunchSessionStatus;
  accessMode: LaunchAccessMode;
  entryMode: GameModeId;
  recommendedNextModes: GameModeId[];
  openedAt: string;
  expiresAt?: string;
}

export interface StudentProgressionState {
  studentSessionId: string;
  launchCode: LaunchCode;
  unitKey: string;
  currentStep: LaunchStepId;
  unlockedGameModes: GameModeId[];
  completedGameModes: GameModeId[];
  earnedStarDust: number;
  masteryStatus: MasteryStatus;
  lastEventAt?: string;
}

export type GameEventType =
  | "teacher_launch_created"
  | "launch_opened"
  | "game_started"
  | "round_shown"
  | "answer_submitted"
  | "answer_result"
  | "powerup_used"
  | "entry_practice_completed"
  | "game_unlocked"
  | "training_recommended"
  | "media_started"
  | "media_completed"
  | "game_completed"
  | "mastery_updated";

export interface GameProgressEvent {
  type: GameEventType;
  unitKey: string;
  gameMode: GameModeId;
  occurredAt: string;
  launchCode?: LaunchCode;
  studentSessionId?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface StarDustBreakdown {
  vocabulary: number;
  syntax: number;
  bonus: number;
  total: number;
}

function encodePathPart(value: string): string {
  return encodeURIComponent(value.trim());
}

export function getUnitKey(meta: Pick<UnitMeta, "tenantId" | "curriculumId" | "level" | "unit">): string {
  return `${meta.tenantId}:${meta.curriculumId}:L${meta.level}:U${meta.unit}`;
}

export function getLaunchPath(launchCode: LaunchCode): string {
  return `/launch/${encodeURIComponent(launchCode)}`;
}

export function getPermanentQrPath(identifier: PermanentQrIdentifier): string {
  const requiredSegments = [
    "tenant",
    identifier.tenantId,
    "series",
    identifier.seriesId,
    "book",
    identifier.bookId,
    "unit",
    identifier.unitId,
    "activity",
    identifier.activityId,
  ];

  const optionalSegments = [
    identifier.language ? ["language", identifier.language] : [],
    identifier.edition ? ["edition", identifier.edition] : [],
    identifier.version ? ["version", identifier.version] : [],
  ].flat();

  return `/q/${[...requiredSegments, ...optionalSegments].map(encodePathPart).join("/")}`;
}

export function createLaunchSession(args: {
  launchCode: LaunchCode;
  tenantId: TenantId;
  curriculumId: CurriculumId;
  unitKey: string;
  entryMode: GameModeId;
  recommendedNextModes: GameModeId[];
  openedAt: string;
  expiresAt?: string;
  status?: LaunchSessionStatus;
  accessMode?: LaunchAccessMode;
}): LaunchSession {
  const launchSession: LaunchSession = {
    launchCode: args.launchCode,
    tenantId: args.tenantId,
    curriculumId: args.curriculumId,
    unitKey: args.unitKey,
    status: args.status ?? "open",
    accessMode: args.accessMode ?? "teacher-qr",
    entryMode: args.entryMode,
    recommendedNextModes: args.recommendedNextModes,
    openedAt: args.openedAt,
  };

  if (args.expiresAt) {
    launchSession.expiresAt = args.expiresAt;
  }

  return launchSession;
}

export function getInitialStudentProgression(args: {
  studentSessionId: string;
  launchSession: LaunchSession;
}): StudentProgressionState {
  return {
    studentSessionId: args.studentSessionId,
    launchCode: args.launchSession.launchCode,
    unitKey: args.launchSession.unitKey,
    currentStep: "entry-practice",
    unlockedGameModes: [args.launchSession.entryMode],
    completedGameModes: [],
    earnedStarDust: 0,
    masteryStatus: "not-started",
  };
}

export function completeEntryPractice(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  occurredAt: string;
}): StudentProgressionState {
  const unlockedGameModes = Array.from(
    new Set([...args.progression.unlockedGameModes, ...args.launchSession.recommendedNextModes]),
  );

  return {
    ...args.progression,
    currentStep: "recommended-game",
    unlockedGameModes,
    completedGameModes: Array.from(new Set([...args.progression.completedGameModes, args.launchSession.entryMode])),
    masteryStatus: "in-progress",
    lastEventAt: args.occurredAt,
  };
}

export function validateUnitPayload(payload: UnitPayload): string[] {
  const errors: string[] = [];
  const termCount = payload.pedagogicalPayload.vocabularyTerms.length;

  if (termCount < 8 || termCount > 12) {
    errors.push("Vocabulary term count must be between 8 and 12.");
  }

  if (payload.pedagogicalPayload.targetSentences.length !== 2) {
    errors.push("Exactly 2 target sentence structures are required.");
  }

  if (!payload.visualRules.blacklistCheck.passed) {
    errors.push("Visual blacklist check must pass before student assignment.");
  }

  return errors;
}

export function validateContentPackage(contentPackage: ContentPackage): string[] {
  const errors: string[] = [];

  if (contentPackage.units.length === 0) {
    errors.push("Content package must include at least one unit payload.");
  }

  for (const unit of contentPackage.units) {
    errors.push(...validateUnitPayload(unit));
  }

  if (contentPackage.meta.sourceType === "pdf" && !contentPackage.meta.sourceDocumentName) {
    errors.push("PDF-derived content packages should record the source document name.");
  }

  if (contentPackage.meta.reviewStatus === "approved" && contentPackage.units.some((unit) => validateUnitPayload(unit).length > 0)) {
    errors.push("Approved content packages cannot include invalid unit payloads.");
  }

  return errors;
}

export function validatePermanentQrRoute(route: PermanentQrRoute): string[] {
  const errors: string[] = [];
  const requiredValues = [
    route.qrId,
    route.identifier.tenantId,
    route.identifier.seriesId,
    route.identifier.bookId,
    route.identifier.unitId,
    route.identifier.activityId,
    route.targetId,
  ];

  if (requiredValues.some((value) => value.trim().length === 0)) {
    errors.push("Permanent QR routes require tenant, series, book, unit, activity, QR id, and target id values.");
  }

  const fallbackPath = route.fallbackPath?.toLowerCase() ?? "";

  if (fallbackPath.startsWith("file:") || fallbackPath.includes("localhost") || fallbackPath.includes("127.0.0.1")) {
    errors.push("Printed QR fallbacks must not point to local files, localhost, or temporary development routes.");
  }

  return errors;
}

export function calculateStarDust(args: {
  masteredTerms: number;
  totalTerms: number;
  masteredSyntaxChecks: number;
  totalSyntaxChecks: number;
  bonusRatio: number;
}): StarDustBreakdown {
  const safeTermTotal = Math.max(args.totalTerms, 1);
  const safeSyntaxTotal = Math.max(args.totalSyntaxChecks, 1);
  const vocabulary = Math.round((Math.min(args.masteredTerms, safeTermTotal) / safeTermTotal) * 300);
  const syntax = Math.round((Math.min(args.masteredSyntaxChecks, safeSyntaxTotal) / safeSyntaxTotal) * 300);
  const bonus = Math.round(Math.max(0, Math.min(args.bonusRatio, 1)) * 400);

  return {
    vocabulary,
    syntax,
    bonus,
    total: vocabulary + syntax + bonus,
  };
}
