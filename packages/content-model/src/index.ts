import phaserCandidateProfileData from "./phaserCandidateProfiles.json";
import type { GameEventType } from "./gameEventTypes";
import type { TargetLanguagePolicy } from "./targetLanguagePolicy";
import { validateTargetLanguagePolicy } from "./targetLanguagePolicy";

export { GAME_EVENT_TYPES, isGameEventType } from "./gameEventTypes";
export type { GameEventType } from "./gameEventTypes";

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

export interface PhaserCandidateProfile {
  targetMode: GameModeId;
  label: string;
  parentEngine: ParentEngine;
  requiredScenarios: readonly string[];
}

export const phaserCandidateProfiles = Array.isArray(phaserCandidateProfileData)
  ? (phaserCandidateProfileData as unknown as readonly PhaserCandidateProfile[])
  : [];

export function validatePhaserCandidateProfiles(profiles: readonly PhaserCandidateProfile[]): string[] {
  const errors: string[] = [];
  const seenModes = new Set<string>();
  const validParentEngines = new Set<ParentEngine>(["pairing", "selection", "text-spelling", "narrative"]);

  for (const profile of profiles) {
    if (!profile?.targetMode || seenModes.has(profile.targetMode)) {
      errors.push("Phaser candidate profiles must contain unique target modes.");
    }
    seenModes.add(profile?.targetMode);
    if (typeof profile?.label !== "string" || !profile.label.trim()) errors.push("Phaser candidate profiles require a label.");
    if (!validParentEngines.has(profile?.parentEngine)) {
      errors.push(`Phaser candidate profile ${profile?.targetMode || "(unnamed)"} requires a supported parent engine.`);
    }
    if (!Array.isArray(profile?.requiredScenarios) || profile.requiredScenarios.length < 4) {
      errors.push(`Phaser candidate profile ${profile?.targetMode || "(unnamed)"} requires at least four scoring scenarios.`);
    }
    const scenarioIds = profile?.requiredScenarios ?? [];
    if (
      new Set(scenarioIds).size !== scenarioIds.length ||
      scenarioIds.some((scenario) => typeof scenario !== "string" || !scenario.trim())
    ) {
      errors.push(`Phaser candidate profile ${profile?.targetMode || "(unnamed)"} requires unique, non-blank scoring scenarios.`);
    }
  }

  return errors;
}

export function getPhaserCandidateProfile(targetMode: string, parentEngine?: string): PhaserCandidateProfile | undefined {
  const profile = phaserCandidateProfiles.find((candidate) => candidate.targetMode === targetMode);
  return profile && (!parentEngine || profile.parentEngine === parentEngine) ? profile : undefined;
}

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
export type MediaLanguageRole = "target" | "assist" | "neutral";
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
  targetLanguagePolicy?: TargetLanguagePolicy;
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

export function validatePedagogicalTextFields(payload: PedagogicalPayload): string[] {
  const errors: string[] = [];
  const normalizedTerms = payload.vocabularyTerms.map((term) => term.trim().toLowerCase());
  const nonEmptyTerms = normalizedTerms.filter(Boolean);

  if (nonEmptyTerms.length !== normalizedTerms.length) {
    errors.push("Vocabulary terms must not be empty.");
  }

  if (new Set(nonEmptyTerms).size !== nonEmptyTerms.length) {
    errors.push("Vocabulary terms must be unique.");
  }

  if (payload.targetSentences.some((sentence) => sentence.trim().length === 0)) {
    errors.push("Target sentence structures must not be empty.");
  }

  return errors;
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
  targetLanguage?: LocaleCode;
  assistLanguages?: LocaleCode[];
  targetLanguagePolicy?: TargetLanguagePolicy;
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
  languageRole?: MediaLanguageRole;
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

export interface GameAudioCoverage {
  targetLanguage: LocaleCode;
  requiredTermCount: number;
  coveredTermCount: number;
  requiredSentenceCount: number;
  coveredSentenceCount: number;
  instructionCueCount: number;
  missingTerms: string[];
  missingSentences: string[];
  instructionReady: boolean;
  ready: boolean;
}

interface GameAudioCueQuery {
  unit: UnitPayload;
  audioCues?: readonly AudioCue[];
  audioSupportPlan?: UnitAudioSupportPlan;
  gameMode: GameModeId;
  targetLanguage: LocaleCode;
}

interface GameAudioCueScope {
  scopedCues: AudioCue[];
  modePlan?: AudioCueId[];
  targetCues: AudioCue[];
}

function resolveGameAudioCueScope({
  unit,
  audioCues = [],
  audioSupportPlan,
  gameMode,
  targetLanguage,
}: GameAudioCueQuery): GameAudioCueScope {
  const unitKey = getUnitKey(unit.unitMeta);
  const scopedCues = audioCues.filter(
    (cue) => cue.unitKey === unitKey && cue.tenantId === unit.unitMeta.tenantId,
  );
  const modePlan = audioSupportPlan?.unitKey === unitKey
    && languageMatches(audioSupportPlan.targetLanguage, targetLanguage)
    ? audioSupportPlan.gameModeAudioCueIds?.[gameMode]
    : undefined;
  const authorizedInstructionCueIds = modePlan
    ? new Set([
      ...(audioSupportPlan?.instructionAudioCueIds ?? []),
      ...modePlan.filter((audioCueId) => scopedCues.some((cue) => cue.audioCueId === audioCueId && cue.kind === "instruction")),
    ])
    : undefined;
  const targetCues = scopedCues.filter(
    (cue) => languageMatches(cue.language, targetLanguage)
      && (!cue.gameMode || cue.gameMode === gameMode || modePlan?.includes(cue.audioCueId))
      && (cue.kind !== "instruction"
        || !authorizedInstructionCueIds
        || authorizedInstructionCueIds.has(cue.audioCueId)),
  );

  return { scopedCues, modePlan, targetCues };
}

export function getGameAudioCues(query: GameAudioCueQuery): AudioCue[] {
  return resolveGameAudioCueScope(query).targetCues;
}

export function getGameAudioCoverage({
  unit,
  audioCues = [],
  audioSupportPlan,
  gameMode,
  targetLanguage,
}: GameAudioCueQuery): GameAudioCoverage {
  const { scopedCues, modePlan, targetCues } = resolveGameAudioCueScope({
    unit,
    audioCues,
    audioSupportPlan,
    gameMode,
    targetLanguage,
  });
  const termCues = targetCues.filter((cue) => cue.kind === "term");
  const sentenceCues = targetCues.filter((cue) => cue.kind === "sentence");
  const instructionCues = targetCues.filter((cue) => cue.kind === "instruction");
  const plannedTermCueIds = audioSupportPlan && modePlan
    ? new Set(audioSupportPlan.vocabularyAudioCueIds.filter((audioCueId) => modePlan.includes(audioCueId)))
    : undefined;
  const plannedSentenceCueIds = audioSupportPlan && modePlan
    ? new Set(audioSupportPlan.sentenceAudioCueIds.filter((audioCueId) => modePlan.includes(audioCueId)))
    : undefined;
  const requiredTerms = plannedTermCueIds
    ? unit.pedagogicalPayload.vocabularyTerms.filter((term) => scopedCues.some((cue) => plannedTermCueIds.has(cue.audioCueId) && cue.kind === "term" && normalizeAudioText(cue.text) === normalizeAudioText(term)))
    : unit.pedagogicalPayload.vocabularyTerms;
  const requiredSentences = plannedSentenceCueIds
    ? unit.pedagogicalPayload.targetSentences.filter((sentence) => scopedCues.some((cue) => plannedSentenceCueIds.has(cue.audioCueId) && cue.kind === "sentence" && normalizeAudioText(cue.text) === normalizeAudioText(sentence)))
    : unit.pedagogicalPayload.targetSentences;
  const hasCueForText = (cues: AudioCue[], text: string) =>
    cues.some((cue) => normalizeAudioText(cue.text) === normalizeAudioText(text));
  const missingTerms = requiredTerms.filter((term) => !hasCueForText(termCues, term));
  const missingSentences = requiredSentences.filter((sentence) => !hasCueForText(sentenceCues, sentence));
  const instructionCueCount = instructionCues.length;

  return {
    targetLanguage,
    requiredTermCount: requiredTerms.length,
    coveredTermCount: requiredTerms.length - missingTerms.length,
    requiredSentenceCount: requiredSentences.length,
    coveredSentenceCount: requiredSentences.length - missingSentences.length,
    instructionCueCount,
    missingTerms,
    missingSentences,
    instructionReady: instructionCueCount > 0,
    ready: missingTerms.length === 0 && missingSentences.length === 0 && instructionCueCount > 0,
  };
}

export interface UnitAudioSupportPlan {
  unitKey: string;
  targetLanguage: LocaleCode;
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

export * from "./economyPolicy";
export * from "./progressionIdentity";
export * from "./targetLanguagePolicy";

export function languageMatches(value: string, targetLanguage: string): boolean {
  const language = value.trim().toLowerCase();
  const target = targetLanguage.trim().toLowerCase();
  return Boolean(target) && (language === target || language.startsWith(`${target}-`) || target.startsWith(`${language}-`));
}

export function resolveTargetLanguage({
  tenantTargetLanguage,
  unitLanguage,
  fallback = "en",
}: {
  tenantTargetLanguage?: string;
  unitLanguage?: string;
  fallback?: string;
} = {}): string {
  return [tenantTargetLanguage, unitLanguage, fallback]
    .map((language) => language?.trim())
    .find((language): language is string => Boolean(language)) ?? "en";
}

function normalizeAudioText(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

const learnerFacingAudioCueKinds: AudioCueKind[] = ["term", "sentence", "instruction", "feedback"];
const supportedGameModeIds: GameModeId[] = [
  "flashcards", "label-it", "match-up", "memory-match", "balloon-pop", "true-false",
  "speak-it", "quiz", "type-answer", "spelling-practice", "fill-in-the-blank", "sentence-builder",
];
const supportedGameFamilies: GameFamily[] = [
  "core-quiz", "vocabulary-matching", "memory-sorting", "spelling-typing",
  "syntax-construction", "word-puzzles", "arcade-action", "speaking-listening",
];
const supportedParentEngines: ParentEngine[] = ["pairing", "selection", "text-spelling", "narrative"];
export interface GameModeContract {
  family: GameFamily;
  engineId: ParentEngine;
  supportedLevels: number[];
  allowsBackgroundMedia: boolean;
}

export interface CuratedGameOfferContractInput {
  offerId: string;
  unitKey: string;
  gameMode: string;
  family: string;
  engineId: string;
  readiness: string;
  launchRoute?: string;
  audioRequirement: string;
  reportingRequirement: string;
  nextStep: string;
}

export interface CuratedGameOfferMapContractInput {
  mapId: string;
  tenantId: string;
  contentPackageId: string;
  label: string;
  decisionRule: string;
  level?: number;
  offers: CuratedGameOfferContractInput[];
}

const supportedGameModeContracts: Record<GameModeId, GameModeContract> = {
  flashcards: { family: "vocabulary-matching", engineId: "selection", supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8], allowsBackgroundMedia: false },
  "memory-match": { family: "memory-sorting", engineId: "pairing", supportedLevels: [1, 2, 3, 4], allowsBackgroundMedia: true },
  "match-up": { family: "vocabulary-matching", engineId: "pairing", supportedLevels: [1, 2, 3, 4], allowsBackgroundMedia: true },
  "label-it": { family: "vocabulary-matching", engineId: "pairing", supportedLevels: [1, 2, 3, 4, 5, 6], allowsBackgroundMedia: false },
  quiz: { family: "core-quiz", engineId: "selection", supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8], allowsBackgroundMedia: false },
  "true-false": { family: "core-quiz", engineId: "selection", supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8], allowsBackgroundMedia: false },
  "sentence-builder": { family: "syntax-construction", engineId: "text-spelling", supportedLevels: [2, 3, 4, 5, 6, 7, 8], allowsBackgroundMedia: false },
  "type-answer": { family: "spelling-typing", engineId: "text-spelling", supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8], allowsBackgroundMedia: false },
  "spelling-practice": { family: "spelling-typing", engineId: "text-spelling", supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8], allowsBackgroundMedia: false },
  "fill-in-the-blank": { family: "syntax-construction", engineId: "text-spelling", supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8], allowsBackgroundMedia: false },
  "speak-it": { family: "speaking-listening", engineId: "selection", supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8], allowsBackgroundMedia: false },
  "balloon-pop": { family: "arcade-action", engineId: "selection", supportedLevels: [1, 2, 3], allowsBackgroundMedia: true },
};

export function isSupportedGameModeId(value: string): value is GameModeId {
  return supportedGameModeIds.includes(value as GameModeId);
}

export function isSupportedParentEngine(value: string): value is ParentEngine {
  return supportedParentEngines.includes(value as ParentEngine);
}

export function getGameModeContract(value: string): GameModeContract | undefined {
  return isSupportedGameModeId(value) ? supportedGameModeContracts[value] : undefined;
}

export function isGameModeSupportedAtLevel(value: string, level: number): value is GameModeId {
  const contract = getGameModeContract(value);
  return Boolean(contract?.supportedLevels.includes(level));
}

export function getLevelAwareRecommendedGameModes(
  launchSession: Pick<LaunchSession, "unitKey" | "recommendedNextModes">,
): GameModeId[] {
  const level = getCanonicalUnitKeyLevel(launchSession.unitKey);

  return Array.from(new Set(launchSession.recommendedNextModes.filter((mode) => {
    const contract = getGameModeContract(mode);
    return Boolean(contract && (level === undefined || contract.supportedLevels.includes(level)));
  })));
}

export function validateCuratedGameOfferMap(map: CuratedGameOfferMapContractInput): string[] {
  const errors: string[] = [];
  const offerIds = new Set<string>();
  const gameModes = new Set<string>();

  if (!map.mapId || !map.tenantId || !map.contentPackageId || !map.label || !map.decisionRule) {
    errors.push("Unit game offer maps require map, tenant, package, label, and decision-rule metadata.");
  }

  if (map.level !== undefined && (!Number.isInteger(map.level) || map.level < 1 || map.level > 8)) {
    errors.push(`Unit game offer map ${map.mapId || "(unnamed)"} must use a curriculum level from 1 to 8.`);
  }

  if (map.offers.length === 0) {
    errors.push(`Unit game offer map ${map.mapId || "(unnamed)"} must include at least one offer.`);
  }

  for (const offer of map.offers) {
    if (!offer.offerId || offerIds.has(offer.offerId)) {
      errors.push(`Unit game offer map ${map.mapId || "(unnamed)"} must use unique offer ids.`);
    }
    offerIds.add(offer.offerId);

    if (gameModes.has(offer.gameMode)) {
      errors.push(`Unit game offer map ${map.mapId || "(unnamed)"} must not repeat game mode ${offer.gameMode}.`);
    }
    gameModes.add(offer.gameMode);

    const contract = getGameModeContract(offer.gameMode);
    if (!contract) {
      errors.push(`Unit game offer ${offer.offerId || "(unnamed)"} uses an unsupported game mode.`);
      continue;
    }

    if (offer.family !== contract.family) {
      errors.push(`Unit game offer ${offer.offerId} must use family ${contract.family}; found ${offer.family}.`);
    }
    if (offer.engineId !== contract.engineId) {
      errors.push(`Unit game offer ${offer.offerId} must use engine ${contract.engineId}; found ${offer.engineId}.`);
    }
    if (!offer.unitKey || !offer.unitKey.startsWith(`${map.tenantId}:`)) {
      errors.push(`Unit game offer ${offer.offerId} must remain scoped to tenant ${map.tenantId}.`);
    }
    const offerLevel = map.level ?? getCanonicalUnitKeyLevel(offer.unitKey);
    if (offerLevel !== undefined && !contract.supportedLevels.includes(offerLevel) && offer.readiness !== "blocked") {
      errors.push(`Unit game offer ${offer.offerId} is not available for level ${offerLevel}; mark it blocked until the curriculum level is supported.`);
    }
    if (offer.readiness === "ready" && !offer.launchRoute) {
      errors.push(`Ready unit game offer ${offer.offerId} must include a launch route.`);
    }
    if (!offer.audioRequirement.trim() || !offer.reportingRequirement.trim() || !offer.nextStep.trim()) {
      errors.push(`Unit game offer ${offer.offerId} must declare audio, reporting, and next-step requirements.`);
    }
  }

  return errors;
}

const supportedMediaAssetTypes: MediaAssetType[] = [
  "song", "chant", "listening-track", "voiceover", "sound-effect", "lesson-video", "music-video",
  "karaoke-video", "animation", "other-audio", "other-video",
];
const supportedMediaKinds: MediaKind[] = ["audio", "video"];
const supportedMediaRightsStatuses: MediaRightsStatus[] = ["owned", "licensed", "partner-provided", "unknown"];
const supportedAudioCueKinds: AudioCueKind[] = ["term", "sentence", "instruction", "feedback", "ui-label", "story-line"];
const supportedAudioCueSources: AudioCueSource[] = ["recorded", "text-to-speech", "teacher-recorded", "partner-provided", "placeholder"];
const supportedMediaUsageRoles: MediaUsageRole[] = ["primary", "background", "prompt", "review", "celebration", "teacher-reference"];
const supportedMediaPlaybackContexts: MediaPlaybackContext[] = ["unit-home", "game-background", "teacher-preview", "student-practice", "completion-review"];

function isValidTimestamp(value: string | undefined): value is string {
  return Boolean(value && !Number.isNaN(Date.parse(value)));
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

const canonicalUnitKeyPattern = /^[^:\s]+:[^:\s]+:L([1-8]):U([1-9]\d*)$/;

export function isCanonicalUnitKey(value: string): boolean {
  return canonicalUnitKeyPattern.test(value.trim());
}

export function getCanonicalUnitKeyLevel(value: string): number | undefined {
  const match = canonicalUnitKeyPattern.exec(value.trim());
  return match ? Number(match[1]) : undefined;
}

export function getCanonicalUnitKeyTenant(value: string): string | undefined {
  const trimmedValue = value.trim();
  if (!canonicalUnitKeyPattern.test(trimmedValue)) {
    return undefined;
  }

  return trimmedValue.split(":")[0];
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
  const recommendedNextModes = getLevelAwareRecommendedGameModes(args.launchSession);
  const unlockedGameModes = Array.from(
    new Set([...args.progression.unlockedGameModes, ...recommendedNextModes]),
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

  errors.push(...validatePedagogicalTextFields(payload.pedagogicalPayload));

  if (termCount < 8 || termCount > 12) {
    errors.push("Vocabulary term count must be between 8 and 12.");
  }

  if (payload.pedagogicalPayload.targetSentences.length !== 2) {
    errors.push("Exactly 2 target sentence structures are required.");
  }

  if (!Number.isInteger(payload.unitMeta.level) || payload.unitMeta.level < 1 || payload.unitMeta.level > 8) {
    errors.push("Unit level must be an integer between 1 and 8.");
  }

  if (!Number.isInteger(payload.unitMeta.module) || payload.unitMeta.module < 1) {
    errors.push("Unit module must be a positive integer.");
  }

  if (!Number.isInteger(payload.unitMeta.unit) || payload.unitMeta.unit < 1) {
    errors.push("Unit number must be a positive integer.");
  }

  if (payload.unitMeta.theme.trim().length === 0) {
    errors.push("Unit theme is required.");
  }

  if (payload.unitMeta.gameMode.trim().length === 0 || payload.unitMeta.gameFamily.trim().length === 0 || payload.unitMeta.engineId.trim().length === 0) {
    errors.push("Unit game mode, game family, and parent engine identifiers are required.");
  }

  if (!supportedGameModeIds.includes(payload.unitMeta.gameMode as GameModeId)) {
    errors.push(`Unit game mode ${payload.unitMeta.gameMode} is not supported by the curated game catalog.`);
  }

  if (!supportedGameFamilies.includes(payload.unitMeta.gameFamily as GameFamily)) {
    errors.push(`Unit game family ${payload.unitMeta.gameFamily} is not supported by the curated game catalog.`);
  }

  if (!supportedParentEngines.includes(payload.unitMeta.engineId as ParentEngine)) {
    errors.push(`Unit parent engine ${payload.unitMeta.engineId} is not supported by the engine catalog.`);
  }

  const gameModeContract = supportedGameModeContracts[payload.unitMeta.gameMode as GameModeId];
  if (gameModeContract) {
    if (payload.unitMeta.gameFamily !== gameModeContract.family) {
      errors.push(`Unit game mode ${payload.unitMeta.gameMode} must use game family ${gameModeContract.family}.`);
    }

    if (payload.unitMeta.engineId !== gameModeContract.engineId) {
      errors.push(`Unit game mode ${payload.unitMeta.gameMode} must use parent engine ${gameModeContract.engineId}.`);
    }

    if (!gameModeContract.supportedLevels.includes(payload.unitMeta.level)) {
      errors.push(`Unit game mode ${payload.unitMeta.gameMode} is not available for level ${payload.unitMeta.level}.`);
    }
  }

  if (payload.visualRules.avatarFamily.trim().length === 0 || payload.visualRules.characterFocus.trim().length === 0) {
    errors.push("Unit visual rules must include an avatar family and character focus.");
  }

  if (!payload.visualRules.blacklistCheck.passed) {
    errors.push("Visual blacklist check must pass before student assignment.");
  }

  if ([payload.teacherLaunchProtocol.hook, payload.teacherLaunchProtocol.activity, payload.teacherLaunchProtocol.review]
    .some((value) => value.trim().length === 0)) {
    errors.push("Teacher launch protocol must include hook, activity, and review copy.");
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
  const seenAudioCueIds = new Set<string>();
  const unitKeys = new Set<string>();
  const mediaAssetIds = new Set<string>();
  const playlistIds = new Set<string>();
  const audioPlanUnitKeys = new Set<string>();
  const assistPlanUnitKeys = new Set<string>();
  const multimediaPlanUnitKeys = new Set<string>();

  if (contentPackage.meta.packageId.trim().length === 0 || contentPackage.meta.tenantId.trim().length === 0) {
    errors.push("Content package metadata must include package and tenant identifiers.");
  }

  if (contentPackage.meta.curriculumId.trim().length === 0) {
    errors.push("Content package metadata must include a curriculum identifier.");
  }

  if (contentPackage.meta.targetLanguagePolicy) {
    if (!contentPackage.meta.targetLanguage?.trim()) {
      errors.push("Content package target-language policy requires an explicit target language.");
    } else {
      errors.push(...validateTargetLanguagePolicy({
        tenantId: contentPackage.meta.tenantId,
        targetLanguage: contentPackage.meta.targetLanguage,
        assistLanguages: contentPackage.meta.assistLanguages ?? [],
        policy: contentPackage.meta.targetLanguagePolicy,
      }));
    }
  }

  if (!isValidTimestamp(contentPackage.meta.createdAt)) {
    errors.push("Content package metadata must include a valid created timestamp.");
  }

  if (contentPackage.meta.updatedAt !== undefined) {
    if (!isValidTimestamp(contentPackage.meta.updatedAt)) {
      errors.push("Content package metadata updated timestamp must be valid.");
    } else if (isValidTimestamp(contentPackage.meta.createdAt) && Date.parse(contentPackage.meta.updatedAt) < Date.parse(contentPackage.meta.createdAt)) {
      errors.push("Content package metadata updated timestamp must not precede creation.");
    }
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

    const audioCoverageGroups: Array<[string, AudioCueId[]]> = [
      ["vocabulary", audioPlan.vocabularyAudioCueIds],
      ["sentence", audioPlan.sentenceAudioCueIds],
      ["instruction", audioPlan.instructionAudioCueIds ?? []],
      ["feedback", audioPlan.feedbackAudioCueIds ?? []],
      ...Object.entries(audioPlan.gameModeAudioCueIds ?? {}).map(([gameMode, cueIds]) => [`game mode ${gameMode}`, cueIds ?? []] as [string, AudioCueId[]]),
    ];

    for (const [coverageLabel, cueIds] of audioCoverageGroups) {
      const seenCoverageCueIds = new Set<AudioCueId>();

      for (const audioCueId of cueIds) {
        if (seenCoverageCueIds.has(audioCueId)) {
          errors.push(`Audio support plan for ${unitKey} must not repeat cue ${audioCueId} within ${coverageLabel} coverage.`);
        }

        seenCoverageCueIds.add(audioCueId);
      }
    }

    if (!audioPlan.targetLanguage.trim()) {
      errors.push(`Audio support plan for ${unitKey} must declare a target language.`);
    }

    if (audioPlan.required) {
      const hasAudioForText = (text: string, cueIds: AudioCueId[], kind: AudioCueKind): boolean =>
        (contentPackage.audioCues ?? []).some((cue) =>
          cueIds.includes(cue.audioCueId)
          && cue.kind === kind
          && cue.unitKey === unitKey
          && cue.tenantId === contentPackage.meta.tenantId
          && languageMatches(cue.language, audioPlan.targetLanguage)
          && normalizeAudioText(cue.text) === normalizeAudioText(text));

      if (unit.pedagogicalPayload.vocabularyTerms.some((term) => !hasAudioForText(term, audioPlan.vocabularyAudioCueIds, "term"))) {
        errors.push(`Audio support plan for ${unitKey} must include a cue for every vocabulary term.`);
      }

      if (unit.pedagogicalPayload.targetSentences.some((sentence) => !hasAudioForText(sentence, audioPlan.sentenceAudioCueIds, "sentence"))) {
        errors.push(`Audio support plan for ${unitKey} must include a cue for every target sentence.`);
      }

      for (const audioCueId of audioPlan.vocabularyAudioCueIds) {
        const audioCue = contentPackage.audioCues?.find((cue) => cue.audioCueId === audioCueId);

        if (audioCue) {
          if (audioCue.kind !== "term") {
            errors.push(`Audio support plan for ${unitKey} must use term cues for vocabulary coverage.`);
          }

          if (audioCue.unitKey !== unitKey) {
            errors.push(`Audio support plan for ${unitKey} must use unit-bound cues for vocabulary coverage.`);
          }

          if (!unit.pedagogicalPayload.vocabularyTerms.some((term) => normalizeAudioText(term) === normalizeAudioText(audioCue.text))) {
            errors.push(`Audio support plan for ${unitKey} must match every vocabulary cue to a canonical vocabulary term.`);
          }
        }
      }

      for (const audioCueId of audioPlan.sentenceAudioCueIds) {
        const audioCue = contentPackage.audioCues?.find((cue) => cue.audioCueId === audioCueId);

        if (audioCue) {
          if (audioCue.kind !== "sentence") {
            errors.push(`Audio support plan for ${unitKey} must use sentence cues for sentence coverage.`);
          }

          if (audioCue.unitKey !== unitKey) {
            errors.push(`Audio support plan for ${unitKey} must use unit-bound cues for sentence coverage.`);
          }

          if (!unit.pedagogicalPayload.targetSentences.some((sentence) => normalizeAudioText(sentence) === normalizeAudioText(audioCue.text))) {
            errors.push(`Audio support plan for ${unitKey} must match every sentence cue to a canonical target sentence.`);
          }
        }
      }

      for (const [coverageLabel, cueIds] of [
        ["instruction", audioPlan.instructionAudioCueIds ?? []],
        ["feedback", audioPlan.feedbackAudioCueIds ?? []],
      ] as const) {
        for (const audioCueId of cueIds) {
          const audioCue = contentPackage.audioCues?.find((cue) => cue.audioCueId === audioCueId);

          if (audioCue && audioCue.kind !== coverageLabel) {
            errors.push(`Audio support plan for ${unitKey} must use ${coverageLabel} cues for ${coverageLabel} coverage.`);
          }
        }
      }
    }

    for (const audioCueId of collectAudioCueIds(audioPlan)) {
      const audioCue = contentPackage.audioCues?.find((cue) => cue.audioCueId === audioCueId);

      if (!audioCueIds.has(audioCueId)) {
        errors.push(`Audio support plan for ${unitKey} references missing audio cue ${audioCueId}.`);
      } else if (audioCue && !languageMatches(audioCue.language, audioPlan.targetLanguage)) {
        errors.push(`Audio support plan for ${unitKey} must keep every learner-facing cue in the target language ${audioPlan.targetLanguage}.`);
      } else if (audioCue && audioCue.unitKey !== unitKey) {
        errors.push(`Audio support plan for ${unitKey} must keep every learner-facing cue bound to the same unit.`);
      }
    }

    for (const [gameMode, cueIds] of Object.entries(audioPlan.gameModeAudioCueIds ?? {})) {
      if (!supportedGameModeIds.includes(gameMode as GameModeId)) {
        errors.push(`Audio support plan for ${unitKey} references unsupported game mode ${gameMode}.`);
      }

      for (const audioCueId of cueIds ?? []) {
        const audioCue = contentPackage.audioCues?.find((cue) => cue.audioCueId === audioCueId);

        if (!audioCue) {
          continue;
        }

        if (!learnerFacingAudioCueKinds.includes(audioCue.kind)) {
          errors.push(`Audio support plan for ${unitKey} must use learner-facing cue kinds for game mode coverage.`);
        }

        if (audioCue.gameMode && audioCue.gameMode !== gameMode) {
          errors.push(`Audio cue ${audioCue.audioCueId} declares game mode ${audioCue.gameMode} but is used for ${gameMode} coverage.`);
        }
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
    if (mediaAsset.mediaAssetId.trim().length === 0) {
      errors.push("Media assets must include a non-empty asset identifier.");
    }

    if (mediaAsset.title.trim().length === 0) {
      errors.push(`Media asset ${mediaAsset.mediaAssetId || "(unnamed)"} must include a title.`);
    }

    if (mediaAssetIds.has(mediaAsset.mediaAssetId)) {
      errors.push(`Content package must not contain duplicate media asset ${mediaAsset.mediaAssetId}.`);
    }

    mediaAssetIds.add(mediaAsset.mediaAssetId);

    if (!supportedMediaAssetTypes.includes(mediaAsset.type)) {
      errors.push(`Media asset ${mediaAsset.mediaAssetId} uses an unsupported media type ${mediaAsset.type}.`);
    }

    if (!supportedMediaKinds.includes(mediaAsset.kind)) {
      errors.push(`Media asset ${mediaAsset.mediaAssetId} uses an unsupported media kind ${mediaAsset.kind}.`);
    }

    if (!supportedMediaRightsStatuses.includes(mediaAsset.rightsStatus)) {
      errors.push(`Media asset ${mediaAsset.mediaAssetId} uses an unsupported rights status ${mediaAsset.rightsStatus}.`);
    }

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

    if (contentPackage.meta.targetLanguagePolicy && (mediaAsset.kind === "audio" || mediaAsset.kind === "video")) {
      const targetLanguage = contentPackage.meta.targetLanguage ?? "";
      const assistLanguages = contentPackage.meta.assistLanguages ?? [];

      if (!mediaAsset.languageRole) {
        errors.push(`Language-bound media asset ${mediaAsset.mediaAssetId} must declare target, assist, or neutral language role.`);
      } else if (mediaAsset.languageRole === "target") {
        if (!mediaAsset.language?.trim() || !languageMatches(mediaAsset.language, targetLanguage)) {
          errors.push(`Target-language media asset ${mediaAsset.mediaAssetId} must match package target language ${targetLanguage}.`);
        }
      } else if (mediaAsset.languageRole === "assist") {
        if (!mediaAsset.language?.trim() || !assistLanguages.some((language) => languageMatches(mediaAsset.language ?? "", language))) {
          errors.push(`Assist-language media asset ${mediaAsset.mediaAssetId} must match a configured assist language.`);
        }
      }
    }

    if (contentPackage.meta.reviewStatus === "approved" && mediaAsset.rightsStatus === "unknown") {
      errors.push(`Approved content packages cannot include media asset ${mediaAsset.mediaAssetId} with unknown rights.`);
    }

    if (contentPackage.meta.reviewStatus === "approved" && !mediaAsset.ownerName?.trim()) {
      errors.push(`Approved content packages must identify the owner of media asset ${mediaAsset.mediaAssetId}.`);
    }

    if (contentPackage.meta.reviewStatus === "approved" && !mediaAsset.sourceUri?.trim() && !mediaAsset.localBundlePath?.trim()) {
      errors.push(`Approved content packages must provide a hosted or local locator for media asset ${mediaAsset.mediaAssetId}.`);
    }

    if (contentPackage.meta.reviewStatus === "approved" && mediaAsset.kind === "video" && !mediaAsset.posterImageUri?.trim()) {
      errors.push(`Approved video media asset ${mediaAsset.mediaAssetId} must include a poster reference.`);
    }

    if (contentPackage.meta.reviewStatus === "approved" && mediaAsset.kind === "video" && !mediaAsset.transcriptUri?.trim()) {
      errors.push(`Approved video media asset ${mediaAsset.mediaAssetId} must include a transcript or caption reference.`);
    }

    if (mediaAsset.durationSeconds !== undefined && (!Number.isFinite(mediaAsset.durationSeconds) || mediaAsset.durationSeconds < 0)) {
      errors.push(`Media asset ${mediaAsset.mediaAssetId} must use a non-negative finite duration.`);
    }
  }

  for (const audioCue of contentPackage.audioCues ?? []) {
    if (seenAudioCueIds.has(audioCue.audioCueId)) {
      errors.push(`Content package must not contain duplicate audio cue ${audioCue.audioCueId}.`);
    }

    seenAudioCueIds.add(audioCue.audioCueId);

    if (!supportedAudioCueKinds.includes(audioCue.kind)) {
      errors.push(`Audio cue ${audioCue.audioCueId} uses an unsupported cue kind ${audioCue.kind}.`);
    }

    if (!supportedAudioCueSources.includes(audioCue.source)) {
      errors.push(`Audio cue ${audioCue.audioCueId} uses an unsupported cue source ${audioCue.source}.`);
    }

    if (audioCue.tenantId !== contentPackage.meta.tenantId) {
      errors.push(`Audio cue ${audioCue.audioCueId} must use the content package tenant ${contentPackage.meta.tenantId}.`);
    }

    if (audioCue.unitKey && !unitKeys.has(audioCue.unitKey)) {
      errors.push(`Audio cue ${audioCue.audioCueId} references missing unit ${audioCue.unitKey}.`);
    }

    if (audioCue.mediaAssetId) {
      const mediaAsset = contentPackage.mediaAssets?.find((asset) => asset.mediaAssetId === audioCue.mediaAssetId);

      if (!mediaAsset) {
        errors.push(`Audio cue ${audioCue.audioCueId} references missing media asset ${audioCue.mediaAssetId}.`);
      } else {
        if (mediaAsset.tenantId !== contentPackage.meta.tenantId) {
          errors.push(`Audio cue ${audioCue.audioCueId} must not reference media asset ${audioCue.mediaAssetId} from another tenant.`);
        }

        if (mediaAsset.kind !== "audio") {
          errors.push(`Audio cue ${audioCue.audioCueId} must reference an audio media asset.`);
        }

        if (audioCue.unitKey && mediaAsset.unitKey && audioCue.unitKey !== mediaAsset.unitKey) {
          errors.push(`Audio cue ${audioCue.audioCueId} must not reference media asset ${audioCue.mediaAssetId} from another unit.`);
        }
      }
    }

    if (audioCue.text.trim().length === 0) {
      errors.push(`Audio cue ${audioCue.audioCueId} must include the learner-facing text it supports.`);
    }

    if (audioCue.language.trim().length === 0) {
      errors.push(`Audio cue ${audioCue.audioCueId} must include a language code.`);
    }

    if (["recorded", "teacher-recorded", "partner-provided"].includes(audioCue.source)
      && !audioCue.mediaAssetId
      && !audioCue.sourceUri?.trim()
      && !audioCue.localBundlePath?.trim()) {
      errors.push(`Audio cue ${audioCue.audioCueId} with source ${audioCue.source} must include a media asset or delivery locator.`);
    }

    if (contentPackage.meta.reviewStatus === "approved" && audioCue.source === "placeholder") {
      errors.push(`Approved content packages cannot include placeholder audio cue ${audioCue.audioCueId}.`);
    }
  }

  for (const playlist of contentPackage.playlists ?? []) {
    if (playlist.playlistId.trim().length === 0) {
      errors.push("Playlists must include a non-empty playlist identifier.");
    }

    if (playlist.title.trim().length === 0) {
      errors.push(`Playlist ${playlist.playlistId || "(unnamed)"} must include a title.`);
    }

    if (playlist.usageRole && !supportedMediaUsageRoles.includes(playlist.usageRole)) {
      errors.push(`Playlist ${playlist.playlistId || "(unnamed)"} uses an unsupported usage role ${playlist.usageRole}.`);
    }

    if (playlist.playbackContext && !supportedMediaPlaybackContexts.includes(playlist.playbackContext)) {
      errors.push(`Playlist ${playlist.playlistId || "(unnamed)"} uses an unsupported playback context ${playlist.playbackContext}.`);
    }

    if (playlist.playbackContext === "game-background" && playlist.usageRole !== "background") {
      errors.push(`Playlist ${playlist.playlistId || "(unnamed)"} must use the background role for game-background playback.`);
    }

    if (playlistIds.has(playlist.playlistId)) {
      errors.push(`Content package must not contain duplicate playlist ${playlist.playlistId}.`);
    }

    playlistIds.add(playlist.playlistId);

    if (playlist.mediaAssetIds.length === 0) {
      errors.push(`Playlist ${playlist.playlistId || "(unnamed)"} must include at least one media asset.`);
    }

    const playlistMediaAssetIds = new Set<string>();

    if (playlist.tenantId !== contentPackage.meta.tenantId) {
      errors.push(`Playlist ${playlist.playlistId} must use the content package tenant ${contentPackage.meta.tenantId}.`);
    }

    if (!unitKeys.has(playlist.unitKey)) {
      errors.push(`Playlist ${playlist.playlistId} references missing unit ${playlist.unitKey}.`);
    }

    for (const mediaAssetId of playlist.mediaAssetIds) {
      if (playlistMediaAssetIds.has(mediaAssetId)) {
        errors.push(`Playlist ${playlist.playlistId} must not repeat media asset ${mediaAssetId}.`);
      }

      playlistMediaAssetIds.add(mediaAssetId);

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
    if (multimediaPlanUnitKeys.has(plan.unitKey)) {
      errors.push(`Content package must not contain duplicate multimedia plan for ${plan.unitKey}.`);
    }

    multimediaPlanUnitKeys.add(plan.unitKey);

    if (!unitKeys.has(plan.unitKey)) {
      errors.push(`Multimedia plan references missing unit ${plan.unitKey}.`);
    }

    if (plan.backgroundEnabledByDefault && !plan.backgroundMediaAssetId) {
      errors.push(`Multimedia plan for ${plan.unitKey} cannot enable background media by default without a background asset.`);
    }

    const seenBackgroundGameModes = new Set<string>();

    for (const gameMode of plan.allowedBackgroundGameModes ?? []) {
      if (seenBackgroundGameModes.has(gameMode)) {
        errors.push(`Multimedia plan for ${plan.unitKey} must not repeat allowed background game mode ${gameMode}.`);
      }

      seenBackgroundGameModes.add(gameMode);

      if (!supportedGameModeIds.includes(gameMode)) {
        errors.push(`Multimedia plan for ${plan.unitKey} references unsupported background game mode ${gameMode}.`);
      } else if (!supportedGameModeContracts[gameMode].allowsBackgroundMedia) {
        errors.push(`Multimedia plan for ${plan.unitKey} cannot use background media in game mode ${gameMode}.`);
      }
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
  const safeTermTotal = Math.max(toSafeNonNegativeInteger(args.totalTerms), 1);
  const safeSyntaxTotal = Math.max(toSafeNonNegativeInteger(args.totalSyntaxChecks), 1);
  const vocabulary = Math.round((Math.min(toSafeNonNegativeInteger(args.masteredTerms), safeTermTotal) / safeTermTotal) * 300);
  const syntax = Math.round((Math.min(toSafeNonNegativeInteger(args.masteredSyntaxChecks), safeSyntaxTotal) / safeSyntaxTotal) * 300);
  const safeBonusRatio = Number.isFinite(args.bonusRatio) ? Math.max(0, Math.min(args.bonusRatio, 1)) : 0;
  const bonus = Math.round(safeBonusRatio * 400);

  return {
    vocabulary,
    syntax,
    bonus,
    total: vocabulary + syntax + bonus,
  };
}

function toSafeNonNegativeInteger(value: number): number {
  return Number.isFinite(value) ? Math.max(Math.trunc(value), 0) : 0;
}

export * from "./sessionSettings";
export * from "./reviewSurfaceScope";
export * from "./prototypeIntakeReadinessSummary";
export * from "./prototypeReturnReadinessSummary";
export * from "./aiGenerationRequestPacketPreview";
export * from "./persistenceAdapter";
export * from "./persistenceRecords";
export * from "./persistenceConsistency";
export * from "./persistenceHandoff";
export * from "./pilotHandoff";
export * from "./evidencePacketHandoff";
export * from "./pilotReviewDecision";
export * from "./pilotDeploymentDecision";
export * from "./sourcePackageAssembly";
export * from "./sourceDraftImport";
export * from "./teacherDraftPersistencePreflight";
export * from "./teacherDraftOwnerPolicyBinding";
export * from "./teacherDraftAcceptanceReadiness";
export * from "./teacherDraftPersistenceImplementationReadiness";
export * from "./packageApprovalLedger";
export * from "./packageReadinessReconciliation";
export * from "./packageReadinessPersistence";
export * from "./persistenceRuntime";
export * from "./reportRuntime";
export * from "./teacherReportPersistenceRuntime";
export * from "./canonicalGameReport";
export * from "./assetRuntime";
export * from "./assetEvidencePacket";
export * from "./assetManifestRuntime";
export * from "./contentPackageRuntime";
export * from "./launchRuntime";
export * from "./assignmentRuntime";
export * from "./sourceRuntime";
export * from "./sourceExtractionPreview";
export * from "./releaseRuntime";
export * from "./recoveryRuntime";
export * from "./progressionRuntime";
export * from "./hostedProgressionPersistence";
export * from "./rewardRuntime";
export * from "./entitlementRuntime";
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
export * from "./aiPrototypeEvidenceAlignment";
export * from "./aiPrototypeReturnedPackageManifest";
export * from "./aiPrototypeReturnedPackageAlignment";
export * from "./prototypeIntakeAlert";
export * from "./prototypeReturnReadiness";
export * from "./aiPrototypeAppPatchProposal";
export * from "./aiPrototypePatchTestReadinessGate";
export * from "./aiPrototypePatchTestHarnessPlan";
export * from "./aiPrototypePatchHarnessImplementationProposal";
export * from "./aiPrototypeCodexPatchApprovalDecision";
export * from "./aiPrototypeSignedApprovalPreflight";
export * from "./aiPrototypePatchAuthorizationReleaseLock";
export * from "./aiPrototypePatchImplementationWorkOrder";
export * from "./aiPrototypePatchChangeSetPreview";
export * from "./phaserCandidateContractReview";
export * from "./phaserCandidateIntegrationEligibility";
export * from "./phaserCandidateEvidenceReturnPacket";
export * from "./phaserCandidateEvidenceAdjudication";
export * from "./phaserCandidateSourceIdentity";
export * from "./whiteLabelReleaseReadiness";
export * from "./canonicalGameIntegration";
export * from "./canonicalGameReplay";
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
export * from "./progressEventPersistence";
export * from "./teacherLaunchReportAggregation";
export * from "./teacherReportPackageSnapshot";
export * from "./teacherReportPackageSnapshotRuntime";
export * from "./publisherMaintenance";
export * from "./pilotPolicy";
export * from "./pilotReviewDecisionPersistence";
export * from "./pilotReviewDecisionRetentionPolicy";
export * from "./pilotReviewDecisionImplementationReadiness";
export * from "./persistenceProviderSelectionPreflight";
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
export * from "./tenant";
export * from "./teacherReporting";
export * from "./gameOffer";
export * from "./classRoster";
export * from "./teacherAssignment";
export * from "./localBundleManifest";
export * from "./localBundleAssetEvidence";
export * from "./localBundleHandoff";
export * from "./localBundleHandoffPersistence";
export * from "./localBundleHandoffReview";
export * from "./localBundleHandoffRecord";
export * from "./localBundleProviderApproval";
export * from "./localBundleRecoveryPacket";
export * from "./localBundleRecoveryReconciliation";
export * from "./localBundleExportRetentionDryRun";
export * from "./localBundlePackageManifestRollbackDryRun";
export * from "./localBundleMediaEvidenceBinding";
export * from "./localBundleMediaManifestReconciliation";
export * from "./localBundleMediaReleaseControlBinding";
export * from "./releaseControlEvidence";
export * from "./localBundleRuntime";
export * from "./qrAliasRuntime";
