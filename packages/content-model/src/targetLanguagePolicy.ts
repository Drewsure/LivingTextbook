export type TargetLanguageProgressionRole = "target" | "assist";

export type TargetLanguageScriptPolicy =
  | "latin"
  | "hiragana-only"
  | "hiragana-first"
  | "reviewed-mixed-script"
  | "tenant-defined";

export type TargetLanguageSegmentationPolicy =
  | "whitespace"
  | "japanese-aware"
  | "tenant-defined";

export interface TargetLanguagePolicy {
  language: string;
  progressionRole: TargetLanguageProgressionRole;
  scriptPolicy: TargetLanguageScriptPolicy;
  segmentationPolicy: TargetLanguageSegmentationPolicy;
  targetLanguageAudioRequired: boolean;
  supportLanguageProgressAllowed: false;
}

export interface TargetLanguagePolicyContext {
  tenantId: string;
  targetLanguage: string;
  assistLanguages: string[];
  policy: TargetLanguagePolicy;
}

export function validateTargetLanguagePolicy(
  context: TargetLanguagePolicyContext,
): string[] {
  const errors: string[] = [];
  const language = context.targetLanguage.trim().toLowerCase();
  const policyLanguage = context.policy.language.trim().toLowerCase();
  const assistLanguages = context.assistLanguages.map((value) => value.trim().toLowerCase());

  if (!context.tenantId.trim()) errors.push("Target-language policy must identify a tenant.");
  if (!language) errors.push("Target-language policy must identify the tenant target language.");
  if (!policyLanguage) errors.push("Target-language policy must identify its language.");
  if (language && policyLanguage && !languagesMatch(language, policyLanguage)) {
    errors.push("Target-language policy language must match the tenant target language.");
  }
  if (!assistLanguages.every((assistLanguage) => assistLanguage && assistLanguage !== language)) {
    errors.push("Assist languages must be non-empty and must not equal the target language.");
  }
  if (context.policy.progressionRole !== "target") {
    errors.push("The tenant language policy must reserve progressionRole target for the configured target language.");
  }
  if (context.policy.supportLanguageProgressAllowed !== false) {
    errors.push("Target-language policy must keep support-language progress disabled.");
  }
  if (context.policy.targetLanguageAudioRequired !== true) {
    errors.push("Target-language policy must require learner-facing target-language audio.");
  }

  if (language === "ja" || language.startsWith("ja-")) {
    if (!["hiragana-first", "reviewed-mixed-script", "tenant-defined"].includes(context.policy.scriptPolicy)) {
      errors.push("Japanese target-language policy must use hiragana-first, reviewed mixed script, or tenant-defined script rules.");
    }
    if (!["japanese-aware", "tenant-defined"].includes(context.policy.segmentationPolicy)) {
      errors.push("Japanese target-language policy must use Japanese-aware or tenant-defined segmentation.");
    }
  }

  return errors;
}

export function languagesMatch(left: string, right: string): boolean {
  const normalizedLeft = left.trim().toLowerCase();
  const normalizedRight = right.trim().toLowerCase();
  return Boolean(normalizedLeft) && (
    normalizedLeft === normalizedRight
    || normalizedLeft.startsWith(`${normalizedRight}-`)
    || normalizedRight.startsWith(`${normalizedLeft}-`)
  );
}
