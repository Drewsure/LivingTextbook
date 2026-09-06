export type TenantId = string;
export type CurriculumId = string;
export type LaunchCode = string;
export type SeriesId = string;
export type BookId = string;
export type TextbookUnitId = string;
export type ActivityId = string;
export type ContentPackageId = string;
export type MediaAssetId = string;
export type AudioCueId = string;
export type PermanentQrId = string;
export type LocaleCode = string;

export type FeaturePackageTier = "core" | "multimedia" | "games" | "premium" | "enterprise";
export type FeatureEntitlementId = "ai-tutor";

export type AiTutorModeId =
  | "speak-with-me"
  | "fix-my-sentence"
  | "explain-my-mistake"
  | "role-play"
  | "writing-coach"
  | "review-coach"
  | "teacher-prompt";

export type AiTutorSourceScope =
  | "current-unit-only"
  | "current-module"
  | "approved-curriculum-window"
  | "teacher-selected-sources";

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
  | "label-it"
  | "match-up"
  | "memory-match"
  | "balloon-pop"
  | "true-false"
  | "speak-it"
  | "quiz"
  | "type-answer"
  | "spelling-practice"
  | "fill-in-the-blank"
  | "sentence-builder";

export type LaunchAccessMode = "teacher-qr" | "permanent-qr" | "front-door-code" | "teacher-preview" | "student-return";
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
export type MediaAssetType =
  | "song"
  | "chant"
  | "listening-track"
  | "voiceover"
  | "sound-effect"
  | "lesson-video"
  | "music-video"
  | "karaoke-video"
  | "animation"
  | "other-audio"
  | "other-video";
export type MediaKind = "audio" | "video";
export type MediaRightsStatus = "owned" | "licensed" | "partner-provided" | "unknown";
export type MediaUsageRole = "primary" | "background" | "prompt" | "review" | "celebration" | "teacher-reference";
export type MediaPlaybackContext = "unit-home" | "game-background" | "teacher-preview" | "student-practice" | "completion-review";
export type AudioCueKind = "term" | "sentence" | "instruction" | "feedback" | "ui-label" | "story-line";
export type AudioCueSource = "recorded" | "text-to-speech" | "teacher-recorded" | "partner-provided" | "placeholder";
export type AssistLanguageSource = "human-reviewed" | "teacher-provided" | "publisher-provided" | "ai-draft";
export type AssistLanguageVisibility = "teacher-only" | "student-toggle" | "student-default";
export type AssistLanguageScriptPolicy = "hiragana-only" | "reviewed-mixed-script" | "tenant-defined";
export type AssistLanguageLevelBand = "foundation" | "bronze" | "plus" | "silver-or-later";
export type QrTargetType =
  | "front-door"
  | "unit-launch"
  | "game-mode"
  | "media-playlist"
  | "media-asset"
  | "teacher-preview";

export interface AiTutorEntitlement {
  enabled: boolean;
  packageTier: FeaturePackageTier;
  allowedLevels: number[];
  allowedModes: AiTutorModeId[];
  monthlyUsageLimit?: number;
  teacherEnabled?: boolean;
  schoolEnabled?: boolean;
}

export interface TenantFeatureEntitlements {
  aiTutor?: AiTutorEntitlement;
}

export interface TenantLanguageSettings {
  targetLanguage: LocaleCode;
  defaultUiLanguage: LocaleCode;
  assistLanguages: LocaleCode[];
  studentAssistEnabledByDefault?: boolean;
  liveAiAssistAllowed?: boolean;
}

export interface UnitAiTutorPlan {
  unitKey: string;
  enabled: boolean;
  entitlementRequired: FeaturePackageTier;
  minimumLevel?: number;
  allowedModes: AiTutorModeId[];
  sourceScope: AiTutorSourceScope;
  approvedTerms?: string[];
  approvedSentencePatterns?: string[];
  teacherReviewRequired?: boolean;
  studentAudioInput?: boolean;
  studentAudioOutput?: boolean;
  maxResponseSentences?: number;
}

export interface UnitAssistLanguagePlan {
  unitKey: string;
  targetLanguage: LocaleCode;
  assistLanguage: LocaleCode;
  scriptPolicy?: AssistLanguageScriptPolicy;
  levelBand?: AssistLanguageLevelBand;
  source: AssistLanguageSource;
  reviewStatus: ContentReviewStatus;
  studentVisibility: AssistLanguageVisibility;
  vocabularyGlosses: Record<string, string>;
  sentenceGlosses: [string, string];
  instructionGlosses?: Record<string, string>;
  teacherNotes?: string[];
  allowLiveAiFallback?: boolean;
}

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
  kind: MediaKind;
  rightsStatus: MediaRightsStatus;
  sourceUri?: string;
  localBundlePath?: string;
  posterImageUri?: string;
  transcriptUri?: string;
  durationSeconds?: number;
  ownerName?: string;
  language?: string;
  unitKey?: string;
  textbookReference?: TextbookReference;
}

export interface AudioCue {
  audioCueId: AudioCueId;
  tenantId: TenantId;
  kind: AudioCueKind;
  text: string;
  language: string;
  source: AudioCueSource;
  mediaAssetId?: MediaAssetId;
  sourceUri?: string;
  localBundlePath?: string;
  transcript?: string;
  unitKey?: string;
  gameMode?: GameModeId;
  textbookReference?: TextbookReference;
}

export interface UnitAudioSupportPlan {
  unitKey: string;
  required: boolean;
  vocabularyAudioCueIds: AudioCueId[];
  sentenceAudioCueIds: AudioCueId[];
  instructionAudioCueIds?: AudioCueId[];
  feedbackAudioCueIds?: AudioCueId[];
  gameModeAudioCueIds?: Partial<Record<GameModeId, AudioCueId[]>>;
  fallbackVoice?: string;
}

export interface UnitMediaPlaylist {
  playlistId: string;
  tenantId: TenantId;
  title: string;
  unitKey: string;
  mediaAssetIds: MediaAssetId[];
  usageRole?: MediaUsageRole;
  playbackContext?: MediaPlaybackContext;
  textbookReference?: TextbookReference;
}

export interface UnitMultimediaPlan {
  unitKey: string;
  primaryPlaylistId?: string;
  backgroundMediaAssetId?: MediaAssetId;
  allowedBackgroundGameModes?: GameModeId[];
  backgroundEnabledByDefault?: boolean;
  defaultVolumePercent?: number;
  requiresTeacherEnablement?: boolean;
}

export interface ContentPackage {
  meta: ContentPackageMeta;
  units: UnitPayload[];
  mediaAssets?: MediaAsset[];
  audioCues?: AudioCue[];
  audioSupportPlans?: UnitAudioSupportPlan[];
  assistLanguagePlans?: UnitAssistLanguagePlan[];
  playlists?: UnitMediaPlaylist[];
  multimediaPlans?: UnitMultimediaPlan[];
  aiTutorPlans?: UnitAiTutorPlan[];
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

export interface FrontDoorAccessPolicy {
  tenantId: TenantId;
  entryCodeRequired: boolean;
  userCodeRequired: boolean;
  reportProgressToTeacher: boolean;
  allowAnonymousPractice: boolean;
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
  | "audio_requested"
  | "game_started"
  | "round_shown"
  | "answer_submitted"
  | "answer_result"
  | "powerup_used"
  | "entry_practice_completed"
  | "game_unlocked"
  | "training_recommended"
  | "media_started"
  | "media_playlist_opened"
  | "media_paused"
  | "media_completed"
  | "background_media_enabled"
  | "background_media_disabled"
  | "route_guidance_listened"
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

function isVideoAsset(type: MediaAssetType): boolean {
  return type === "lesson-video" || type === "music-video" || type === "karaoke-video" || type === "animation" || type === "other-video";
}

function collectAudioCueIds(plan: UnitAudioSupportPlan): AudioCueId[] {
  return [
    ...plan.vocabularyAudioCueIds,
    ...plan.sentenceAudioCueIds,
    ...(plan.instructionAudioCueIds ?? []),
    ...(plan.feedbackAudioCueIds ?? []),
    ...Object.values(plan.gameModeAudioCueIds ?? {}).flat(),
  ];
}

function isPremiumAiTutorTier(tier: FeaturePackageTier): boolean {
  return tier === "premium" || tier === "enterprise";
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

export function validateAiTutorEntitlement(entitlement: AiTutorEntitlement): string[] {
  const errors: string[] = [];

  if (entitlement.enabled && !isPremiumAiTutorTier(entitlement.packageTier)) {
    errors.push("AI Tutor entitlement must use premium or enterprise package tier when enabled.");
  }

  if (entitlement.enabled && entitlement.allowedLevels.length === 0) {
    errors.push("Enabled AI Tutor entitlement must list allowed levels.");
  }

  if (entitlement.enabled && entitlement.allowedModes.length === 0) {
    errors.push("Enabled AI Tutor entitlement must list allowed tutor modes.");
  }

  if (entitlement.allowedLevels.some((level) => level < 1 || level > 12)) {
    errors.push("AI Tutor allowed levels must be between 1 and 12.");
  }

  if (entitlement.monthlyUsageLimit !== undefined && entitlement.monthlyUsageLimit < 0) {
    errors.push("AI Tutor monthly usage limit cannot be negative.");
  }

  return errors;
}

export function validateUnitAiTutorPlan(plan: UnitAiTutorPlan): string[] {
  const errors: string[] = [];

  if (plan.unitKey.trim().length === 0) {
    errors.push("AI Tutor plan must include a unit key.");
  }

  if (plan.enabled && !isPremiumAiTutorTier(plan.entitlementRequired)) {
    errors.push("Enabled AI Tutor plan must require premium or enterprise entitlement.");
  }

  if (plan.enabled && plan.allowedModes.length === 0) {
    errors.push("Enabled AI Tutor plan must list at least one allowed tutor mode.");
  }

  if (plan.minimumLevel !== undefined && (plan.minimumLevel < 1 || plan.minimumLevel > 12)) {
    errors.push("AI Tutor minimum level must be between 1 and 12.");
  }

  if (plan.maxResponseSentences !== undefined && (plan.maxResponseSentences < 1 || plan.maxResponseSentences > 8)) {
    errors.push("AI Tutor max response sentences must be between 1 and 8.");
  }

  return errors;
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

export function validateAssistLanguageScriptPolicy(plan: UnitAssistLanguagePlan): string[] {
  const errors: string[] = [];

  if (plan.studentVisibility === "teacher-only") {
    return errors;
  }

  const assistLanguage = plan.assistLanguage.toLowerCase();
  const isJapanese = assistLanguage === "ja" || assistLanguage.startsWith("ja-");
  const glosses = [
    ...Object.values(plan.vocabularyGlosses),
    ...plan.sentenceGlosses,
    ...Object.values(plan.instructionGlosses ?? {}),
  ];
  const hasKatakana = glosses.some((gloss) => /[\u30a0-\u30ff\u31f0-\u31ff\uff66-\uff9f]/u.test(gloss));
  const hasKanji = glosses.some((gloss) => /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u.test(gloss));
  const hasMixedJapaneseScript = hasKatakana || hasKanji;

  if (isJapanese && !plan.scriptPolicy) {
    errors.push(`Student-visible Japanese assist language plan for ${plan.unitKey} must declare a script policy.`);
  }

  if (isJapanese && plan.levelBand && ["foundation", "bronze", "plus"].includes(plan.levelBand) && plan.scriptPolicy !== "hiragana-only") {
    errors.push(`Japanese assist language plan for ${plan.unitKey} must use hiragana-only policy for ${plan.levelBand} level bands.`);
  }

  if (plan.scriptPolicy === "hiragana-only" && hasMixedJapaneseScript) {
    errors.push(`Hiragana-only assist language plan for ${plan.unitKey} must not include katakana or kanji.`);
  }

  if (plan.scriptPolicy === "hiragana-only" && !isJapanese) {
    errors.push(`Hiragana-only script policy for ${plan.unitKey} is only valid for Japanese assist language.`);
  }

  if (plan.scriptPolicy === "reviewed-mixed-script" && (plan.reviewStatus === "draft" || plan.reviewStatus === "rejected")) {
    errors.push(`Mixed-script assist language plan for ${plan.unitKey} must be reviewed before student use.`);
  }

  if (plan.levelBand === "silver-or-later" && hasMixedJapaneseScript && plan.scriptPolicy !== "reviewed-mixed-script" && plan.scriptPolicy !== "tenant-defined") {
    errors.push(`Silver-or-later Japanese assist language plan for ${plan.unitKey} must declare reviewed-mixed-script or tenant-defined policy when using katakana or kanji.`);
  }

  return errors;
}

export function validateContentPackage(contentPackage: ContentPackage): string[] {
  const errors: string[] = [];
  const audioCueIds = new Set((contentPackage.audioCues ?? []).map((cue) => cue.audioCueId));
  const unitKeys = new Set<string>();
  const mediaAssetIds = new Set<string>();
  const playlistIds = new Set<string>();
  const audioPlanUnitKeys = new Set<string>();
  const assistPlanUnitKeys = new Set<string>();

  if (contentPackage.meta.packageId.trim().length === 0 || contentPackage.meta.tenantId.trim().length === 0) {
    errors.push("Content package metadata must include package and tenant identifiers.");
  }

  if (contentPackage.meta.curriculumId.trim().length === 0) {
    errors.push("Content package metadata must include a curriculum identifier.");
  }

  if (contentPackage.units.length === 0) {
    errors.push("Content package must include at least one unit payload.");
  }

  for (const unit of contentPackage.units) {
    errors.push(...validateUnitPayload(unit));

    const unitKey = getUnitKey(unit.unitMeta);

    if (unitKeys.has(unitKey)) {
      errors.push(`Content package must not contain duplicate unit ${unitKey}.`);
    }

    unitKeys.add(unitKey);

    if (unit.unitMeta.tenantId !== contentPackage.meta.tenantId) {
      errors.push(`Unit ${unitKey} must use the content package tenant ${contentPackage.meta.tenantId}.`);
    }

    if (unit.unitMeta.curriculumId !== contentPackage.meta.curriculumId) {
      errors.push(`Unit ${unitKey} must use the content package curriculum ${contentPackage.meta.curriculumId}.`);
    }

    if (unit.unitMeta.contentPackageId && unit.unitMeta.contentPackageId !== contentPackage.meta.packageId) {
      errors.push(`Unit ${unitKey} must reference content package ${contentPackage.meta.packageId}.`);
    }

    const audioPlan = contentPackage.audioSupportPlans?.find((plan) => plan.unitKey === unitKey);

    if (!audioPlan) {
      errors.push(`Unit ${unitKey} must include an audio support plan for learner-facing text.`);
      continue;
    }

    if (audioPlan.required) {
      if (audioPlan.vocabularyAudioCueIds.length < unit.pedagogicalPayload.vocabularyTerms.length) {
        errors.push(`Audio support plan for ${unitKey} must include a cue for every vocabulary term.`);
      }

      if (audioPlan.sentenceAudioCueIds.length < unit.pedagogicalPayload.targetSentences.length) {
        errors.push(`Audio support plan for ${unitKey} must include a cue for every target sentence.`);
      }
    }

    for (const audioCueId of collectAudioCueIds(audioPlan)) {
      if (!audioCueIds.has(audioCueId)) {
        errors.push(`Audio support plan for ${unitKey} references missing audio cue ${audioCueId}.`);
      }
    }
  }

  for (const audioPlan of contentPackage.audioSupportPlans ?? []) {
    if (audioPlanUnitKeys.has(audioPlan.unitKey)) {
      errors.push(`Content package must not contain duplicate audio support plan for ${audioPlan.unitKey}.`);
    }

    audioPlanUnitKeys.add(audioPlan.unitKey);

    if (!unitKeys.has(audioPlan.unitKey)) {
      errors.push(`Audio support plan references missing unit ${audioPlan.unitKey}.`);
    }
  }

  if (contentPackage.meta.sourceType === "pdf" && !contentPackage.meta.sourceDocumentName) {
    errors.push("PDF-derived content packages should record the source document name.");
  }

  if (contentPackage.meta.reviewStatus === "approved" && contentPackage.units.some((unit) => validateUnitPayload(unit).length > 0)) {
    errors.push("Approved content packages cannot include invalid unit payloads.");
  }

  for (const mediaAsset of contentPackage.mediaAssets ?? []) {
    if (mediaAssetIds.has(mediaAsset.mediaAssetId)) {
      errors.push(`Content package must not contain duplicate media asset ${mediaAsset.mediaAssetId}.`);
    }

    mediaAssetIds.add(mediaAsset.mediaAssetId);

    if (mediaAsset.tenantId !== contentPackage.meta.tenantId) {
      errors.push(`Media asset ${mediaAsset.mediaAssetId} must use the content package tenant ${contentPackage.meta.tenantId}.`);
    }

    if (mediaAsset.unitKey && !unitKeys.has(mediaAsset.unitKey)) {
      errors.push(`Media asset ${mediaAsset.mediaAssetId} references missing unit ${mediaAsset.unitKey}.`);
    }

    if (mediaAsset.kind === "video" && !isVideoAsset(mediaAsset.type)) {
      errors.push(`Video media asset ${mediaAsset.mediaAssetId} must use a video asset type.`);
    }

    if (mediaAsset.kind === "audio" && isVideoAsset(mediaAsset.type)) {
      errors.push(`Audio media asset ${mediaAsset.mediaAssetId} must not use a video asset type.`);
    }
  }

  for (const audioCue of contentPackage.audioCues ?? []) {
    if (audioCue.tenantId !== contentPackage.meta.tenantId) {
      errors.push(`Audio cue ${audioCue.audioCueId} must use the content package tenant ${contentPackage.meta.tenantId}.`);
    }

    if (audioCue.unitKey && !unitKeys.has(audioCue.unitKey)) {
      errors.push(`Audio cue ${audioCue.audioCueId} references missing unit ${audioCue.unitKey}.`);
    }

    if (audioCue.text.trim().length === 0) {
      errors.push(`Audio cue ${audioCue.audioCueId} must include the learner-facing text it supports.`);
    }

    if (audioCue.language.trim().length === 0) {
      errors.push(`Audio cue ${audioCue.audioCueId} must include a language code.`);
    }
  }

  for (const playlist of contentPackage.playlists ?? []) {
    if (playlistIds.has(playlist.playlistId)) {
      errors.push(`Content package must not contain duplicate playlist ${playlist.playlistId}.`);
    }

    playlistIds.add(playlist.playlistId);

    if (playlist.tenantId !== contentPackage.meta.tenantId) {
      errors.push(`Playlist ${playlist.playlistId} must use the content package tenant ${contentPackage.meta.tenantId}.`);
    }

    if (!unitKeys.has(playlist.unitKey)) {
      errors.push(`Playlist ${playlist.playlistId} references missing unit ${playlist.unitKey}.`);
    }

    for (const mediaAssetId of playlist.mediaAssetIds) {
      const mediaAsset = contentPackage.mediaAssets?.find((asset) => asset.mediaAssetId === mediaAssetId);

      if (!mediaAsset) {
        errors.push(`Playlist ${playlist.playlistId} references missing media asset ${mediaAssetId}.`);
        continue;
      }

      if (mediaAsset.tenantId !== playlist.tenantId) {
        errors.push(`Playlist ${playlist.playlistId} must not reference media asset ${mediaAssetId} from another tenant.`);
      }

      if (mediaAsset.unitKey && mediaAsset.unitKey !== playlist.unitKey) {
        errors.push(`Playlist ${playlist.playlistId} must not reference media asset ${mediaAssetId} from another unit.`);
      }
    }
  }

  for (const plan of contentPackage.multimediaPlans ?? []) {
    if (!unitKeys.has(plan.unitKey)) {
      errors.push(`Multimedia plan references missing unit ${plan.unitKey}.`);
    }

    if (plan.primaryPlaylistId) {
      const playlist = contentPackage.playlists?.find((candidate) => candidate.playlistId === plan.primaryPlaylistId);

      if (!playlist) {
        errors.push(`Multimedia plan for ${plan.unitKey} references missing playlist ${plan.primaryPlaylistId}.`);
      } else if (playlist.unitKey !== plan.unitKey) {
        errors.push(`Multimedia plan for ${plan.unitKey} must use a playlist from the same unit.`);
      }
    }

    if (plan.backgroundMediaAssetId) {
      const backgroundAsset = contentPackage.mediaAssets?.find(
        (asset) => asset.mediaAssetId === plan.backgroundMediaAssetId,
      );

      if (!backgroundAsset) {
        errors.push(`Multimedia plan for ${plan.unitKey} references missing background media asset ${plan.backgroundMediaAssetId}.`);
      } else if (backgroundAsset.unitKey && backgroundAsset.unitKey !== plan.unitKey) {
        errors.push(`Multimedia plan for ${plan.unitKey} must use background media from the same unit.`);
      }
    }

    if (plan.defaultVolumePercent !== undefined && (plan.defaultVolumePercent < 0 || plan.defaultVolumePercent > 100)) {
      errors.push(`Multimedia plan for ${plan.unitKey} must use a default volume from 0 to 100.`);
    }
  }

  for (const plan of contentPackage.aiTutorPlans ?? []) {
    errors.push(...validateUnitAiTutorPlan(plan));

    if (!unitKeys.has(plan.unitKey)) {
      errors.push(`AI Tutor plan references missing unit ${plan.unitKey}.`);
    }
  }

  for (const plan of contentPackage.assistLanguagePlans ?? []) {
    if (assistPlanUnitKeys.has(plan.unitKey)) {
      errors.push(`Content package must not contain duplicate assist language plan for ${plan.unitKey}.`);
    }

    assistPlanUnitKeys.add(plan.unitKey);

    const unit = contentPackage.units.find((packageUnit) => getUnitKey(packageUnit.unitMeta) === plan.unitKey);

    if (!unit) {
      errors.push(`Assist language plan references missing unit ${plan.unitKey}.`);
      continue;
    }

    if (plan.targetLanguage.trim().length === 0 || plan.assistLanguage.trim().length === 0) {
      errors.push(`Assist language plan for ${plan.unitKey} must include target and assist language codes.`);
    }

    if (plan.targetLanguage === plan.assistLanguage) {
      errors.push(`Assist language plan for ${plan.unitKey} must use a different assist language from the target language.`);
    }

    if (plan.studentVisibility !== "teacher-only" && (plan.reviewStatus === "draft" || plan.reviewStatus === "rejected")) {
      errors.push(`Student-visible assist language plan for ${plan.unitKey} must be reviewed, verified, or approved.`);
    }

    for (const term of unit.pedagogicalPayload.vocabularyTerms) {
      if (!plan.vocabularyGlosses[term]) {
        errors.push(`Assist language plan for ${plan.unitKey} is missing a vocabulary gloss for ${term}.`);
      }
    }

    if (plan.sentenceGlosses.length !== unit.pedagogicalPayload.targetSentences.length) {
      errors.push(`Assist language plan for ${plan.unitKey} must include exactly two sentence glosses.`);
    }

    errors.push(...validateAssistLanguageScriptPolicy(plan));
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

export * from "./sessionSettings";
export * from "./persistenceAdapter";
export * from "./persistenceRuntime";
export * from "./reportRuntime";
export * from "./assetRuntime";
export * from "./contentPackageRuntime";
export * from "./launchRuntime";
export * from "./assignmentRuntime";
export * from "./sourceRuntime";
export * from "./aiGeneratedGameBuildBrief";
export * from "./aiExternalPrototypeTaskPacket";
export * from "./aiExternalPrototypeTaskExportReadinessGate";
export * from "./aiPrototypeReturnReview";
export * from "./aiPrototypeIntegrationPlan";
export * from "./aiPrototypeWrapperAdapterReview";
export * from "./aiPrototypeFixtureReplayReport";
export * from "./aiPrototypeEventReplayReport";
export * from "./aiPrototypeAudioCoverageReport";
export * from "./aiPrototypeMobileAccessibilityReport";
export * from "./aiPrototypeScoringReplayReport";
export * from "./aiPrototypeCodexIntegrationDecision";
export * from "./aiPrototypeIntegrationReadinessGate";
export * from "./aiPrototypeAppPatchProposal";
export * from "./aiPrototypePatchTestReadinessGate";
export * from "./aiPrototypePatchTestHarnessPlan";
export * from "./aiPrototypePatchHarnessImplementationProposal";
export * from "./aiPrototypeCodexPatchApprovalDecision";
export * from "./aiPrototypeSignedApprovalPreflight";
export * from "./aiPrototypePatchAuthorizationReleaseLock";
export * from "./aiPrototypePatchImplementationWorkOrder";
export * from "./aiPrototypePatchChangeSetPreview";
export * from "./aiTargetLanguageAudioApprovalPacket";
export * from "./aiGeneratedPackageTeacherReviewPacket";
export * from "./aiGeneratedPackageManifest";
export * from "./aiGeneratedPackagePromotionChecklist";
export * from "./aiGeneratedPublishReadinessGate";
export * from "./aiGeneratedPackageReleaseCandidate";
export * from "./aiGeneratedPackageAssemblyReadiness";
export * from "./aiGeneratorTenantCoverage";
export * from "./aiGeneratorLineageMap";
export * from "./aiGeneratorReviewSummary";
export * from "./aiGeneratorReviewerRunbook";
export * from "./aiGeneratorResponsibilityMatrix";
export * from "./aiGeneratedDraftPayload";
export * from "./aiGenerationRequestToDraftHandoff";
export * from "./aiDraftCorrectionQueue";
export * from "./aiDraftRepairEvidencePacket";
export * from "./aiVerifierSubmissionPacket";
export * from "./aiVerifierSubmissionStorageGuard";
export * from "./aiVerifierResultEvidencePacket";
export * from "./aiGamificationMapping";
export * from "./progressEventTaxonomy";
export * from "./publisherMaintenance";
export * from "./aiPackageAssemblyDryRun";
export * from "./aiPackageWriterPreflight";
export * from "./aiPackageWriterRollbackDrill";
export * from "./aiPackageWriterImplementationReadiness";
export * from "./aiPackageWriterModuleTestPlan";
export * from "./aiPackageWriterTestEvidencePacket";
export * from "./aiPackageWriterTestHarnessPlan";
export * from "./aiPackageWriterTestHarnessImplementationProposal";
export * from "./aiPackageWriterHarnessImplementationDecision";
export * from "./aiPackageWriterRoutePlaylistWriteGuard";
export * from "./aiPackageWriterLocalCompanionPackageGuard";
export * from "./aiPackageWriterAssignmentShellGuard";
export * from "./aiPackageWriterAssignmentHandoffEvidencePacket";
