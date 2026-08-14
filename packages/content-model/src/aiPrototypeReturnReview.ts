export type AiPrototypeReturnReviewStatus = "not-submitted" | "returned-review-only" | "blocked";

export interface AiPrototypeModeReturnReview<ModeId extends string = string> {
  modeId: ModeId;
  title: string;
  parentEngine: string;
  prototypeSurface: string;
  reviewFocus: string;
  wrapperRequirements: string[];
  eventEvidence: string[];
  audioEvidence: string[];
  scoringEvidence: string[];
  accessibilityEvidence: string[];
  blockers: string[];
}

export interface AiPrototypeReturnReviewPacket<ModeId extends string = string> {
  reviewId: string;
  tenantId: string;
  requestId: string;
  buildBriefPacketId: string;
  label: string;
  submittedBy: string;
  status: AiPrototypeReturnReviewStatus;
  summary: string;
  returnedArtifacts: string[];
  requiredEvidence: string[];
  integrationReviewGates: string[];
  blockedActions: string[];
  modeReviews: AiPrototypeModeReturnReview<ModeId>[];
}

export const AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_ARTIFACTS = [
  "Prototype source folder or archive manifest",
  "Sample JSON fixture used by the prototype",
  "README with setup and integration notes",
  "Event log sample showing standard_event_contract output",
  "Audio cue map showing target-language tap-to-speak coverage",
  "Mobile screenshot or short rehearsal notes",
] as const;

export const AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_EVIDENCE = [
  "Build brief id and request id match",
  "reviewed JSON fixture",
  "standard events",
  "Learning audio is target-language first",
  "Scoring remains deterministic",
  "outside apps/web until Codex integration review",
] as const;

export const AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_INTEGRATION_GATES = [
  "Parent-engine wrapper review",
  "JSON fixture conformance review",
  "Standard event replay review",
  "Audio cue coverage review",
  "Deterministic scoring review",
  "Mobile accessibility review",
  "White-label tenant branding review",
] as const;

export const AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_EVENTS = [
  "game_started",
  "round_shown",
  "audio_requested",
  "answer_submitted",
  "answer_result",
  "mastery_updated",
  "game_completed",
] as const;

export const AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_AUDIO_EVIDENCE = [
  "Tap-to-speak terms",
  "Tap-to-speak sentences",
  "Instruction replay",
  "Feedback replay",
  "No support-language progress trigger",
] as const;

export const AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_SCORING_EVIDENCE = [
  "Deterministic scoring profile snapshot",
  "No random rewards",
  "No generated gacha",
  "No media-only Star Dust",
  "No support-language-only mastery",
] as const;

export const AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_ACCESSIBILITY_EVIDENCE = [
  "Mobile-first layout evidence",
  "Readable learner text",
  "Touch target spacing",
  "Keyboard or reduced-motion fallback notes",
  "No text hidden inside black buttons",
] as const;

export const AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_BLOCKED_ACTIONS = [
  "No production merge from returned prototype",
  "No route registry write",
  "No scoring profile mutation",
  "No audio manifest mutation",
  "No assignment creation",
  "No student-facing preview from returned code",
] as const;

export const AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_MODE_BLOCKERS = [
  "Prototype return cannot create a student route.",
  "Prototype return cannot create an assignment.",
  "Prototype return cannot override the selected parent engine.",
  "Prototype return cannot replace the audio cue manifest.",
  "Prototype return cannot alter reward rules.",
] as const;

export function validateAiPrototypeReturnReviewPacket(packet: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(packet)) {
    return ["AI prototype return review packet must be a JSON object."];
  }

  const reviewId = readString(packet, "reviewId");
  const tenantId = readString(packet, "tenantId");
  const requestId = readString(packet, "requestId");
  const buildBriefPacketId = readString(packet, "buildBriefPacketId");
  const label = readString(packet, "label");
  const submittedBy = readString(packet, "submittedBy");
  const status = readString(packet, "status");
  const summary = readString(packet, "summary");
  const returnedArtifacts = readStringArray(packet, "returnedArtifacts");
  const requiredEvidence = readStringArray(packet, "requiredEvidence");
  const integrationReviewGates = readStringArray(packet, "integrationReviewGates");
  const blockedActions = readStringArray(packet, "blockedActions");
  const modeReviews = readModeReturnReviews(packet);

  if (!reviewId || !tenantId || !requestId || !buildBriefPacketId) {
    errors.push("AI prototype return review packet must include reviewId, tenantId, requestId, and buildBriefPacketId.");
  }

  if (!label.includes("prototype return review")) {
    errors.push("AI prototype return review packet label must name the prototype return review.");
  }

  if (!submittedBy.includes("Z.ai") && !submittedBy.includes("External prototype builder")) {
    errors.push("AI prototype return review packet must identify an external prototype builder return.");
  }

  if (status !== "not-submitted" && status !== "returned-review-only" && status !== "blocked") {
    errors.push("AI prototype return review packet must use a supported review-only status.");
  }

  if (!summary.includes("Review-only intake")) {
    errors.push("AI prototype return review packet summary must keep returned work review-only.");
  }

  for (const artifact of AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_ARTIFACTS) {
    if (!textListIncludes(returnedArtifacts, artifact)) {
      errors.push(`AI prototype return review packet must require returned artifact: ${artifact}.`);
    }
  }

  for (const evidence of AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_EVIDENCE) {
    if (!textListIncludes(requiredEvidence, evidence)) {
      errors.push(`AI prototype return review packet must require evidence: ${evidence}.`);
    }
  }

  for (const gate of AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_INTEGRATION_GATES) {
    if (!integrationReviewGates.includes(gate)) {
      errors.push(`AI prototype return review packet must require integration gate: ${gate}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype return review packet must block action: ${blockedAction}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(blockedActions, "No Japanese support-language scoring or release")) {
    errors.push("MiniStar AI prototype return review packet must block Japanese support-language scoring or release.");
  }

  if (modeReviews.length === 0) {
    errors.push("AI prototype return review packet must include mode return reviews.");
  }

  for (const review of modeReviews) {
    validateModeReturnReview(review, tenantId, errors);
  }

  return errors;
}

export function getAiPrototypeReturnReviewPacketWarnings(packet: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(packet)) {
    return warnings;
  }

  const modeReviews = readModeReturnReviews(packet);

  if (!modeReviews.some((review) => review.prototypeSurface.includes("Phaser"))) {
    warnings.push("AI prototype return review packet has no Phaser wrapper candidate to inspect.");
  }

  if (!modeReviews.every((review) => review.reviewFocus.includes("LivingTextbook parent engine"))) {
    warnings.push("Every mode return review should name the LivingTextbook parent engine boundary.");
  }

  return warnings;
}

export function validateAiPrototypeReturnReviewPackets(packets: unknown[]): string[] {
  return packets.flatMap((packet) => validateAiPrototypeReturnReviewPacket(packet));
}

export function getAiPrototypeReturnReviewPacketCollectionWarnings(packets: unknown[]): string[] {
  return packets.flatMap((packet) => getAiPrototypeReturnReviewPacketWarnings(packet));
}

function validateModeReturnReview(review: AiPrototypeModeReturnReview, tenantId: string, errors: string[]) {
  if (!review.modeId || !review.title || !review.parentEngine || !review.prototypeSurface || !review.reviewFocus) {
    errors.push("AI prototype mode return review must include modeId, title, parentEngine, prototypeSurface, and reviewFocus.");
  }

  if (!textListIncludes(review.wrapperRequirements, "No direct import into apps/web")) {
    errors.push("AI prototype mode return review must block direct imports into apps/web.");
  }

  if (!textListIncludes(review.wrapperRequirements, "fixture-driven component boundary")) {
    errors.push("AI prototype mode return review must require a fixture-driven component boundary.");
  }

  if (!textListIncludes(review.wrapperRequirements, "standard_event_contract")) {
    errors.push("AI prototype mode return review must require standard event adapter output.");
  }

  if (!textListIncludes(review.wrapperRequirements, "injected config")) {
    errors.push("AI prototype mode return review must keep tenant theme, mascot, avatar, and media injected.");
  }

  for (const eventName of AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_EVENTS) {
    if (!review.eventEvidence.includes(eventName)) {
      errors.push(`AI prototype mode return review must include event evidence: ${eventName}.`);
    }
  }

  for (const audioEvidence of AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_AUDIO_EVIDENCE) {
    if (!textListIncludes(review.audioEvidence, audioEvidence)) {
      errors.push(`AI prototype mode return review must include audio evidence: ${audioEvidence}.`);
    }
  }

  for (const scoringEvidence of AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_SCORING_EVIDENCE) {
    if (!textListIncludes(review.scoringEvidence, scoringEvidence)) {
      errors.push(`AI prototype mode return review must include scoring evidence: ${scoringEvidence}.`);
    }
  }

  for (const accessibilityEvidence of AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_ACCESSIBILITY_EVIDENCE) {
    if (!textListIncludes(review.accessibilityEvidence, accessibilityEvidence)) {
      errors.push(`AI prototype mode return review must include accessibility evidence: ${accessibilityEvidence}.`);
    }
  }

  for (const blocker of AI_PROTOTYPE_RETURN_REVIEW_REQUIRED_MODE_BLOCKERS) {
    if (!textListIncludes(review.blockers, blocker)) {
      errors.push(`AI prototype mode return review must include blocker: ${blocker}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(review.audioEvidence, "Hiragana-only Japanese support for Foundation levels")) {
    errors.push("MiniStar AI prototype mode return review must preserve hiragana-only Japanese support evidence.");
  }
}

function readModeReturnReviews(source: Record<string, unknown>): AiPrototypeModeReturnReview[] {
  const value = source.modeReviews;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((review) => ({
    modeId: readString(review, "modeId"),
    title: readString(review, "title"),
    parentEngine: readString(review, "parentEngine"),
    prototypeSurface: readString(review, "prototypeSurface"),
    reviewFocus: readString(review, "reviewFocus"),
    wrapperRequirements: readStringArray(review, "wrapperRequirements"),
    eventEvidence: readStringArray(review, "eventEvidence"),
    audioEvidence: readStringArray(review, "audioEvidence"),
    scoringEvidence: readStringArray(review, "scoringEvidence"),
    accessibilityEvidence: readStringArray(review, "accessibilityEvidence"),
    blockers: readStringArray(review, "blockers"),
  }));
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
