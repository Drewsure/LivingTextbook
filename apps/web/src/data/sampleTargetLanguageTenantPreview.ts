import type { TenantConfig } from "@living-textbook/content-model";
import { sampleJapaneseTenant } from "@/features/tenant/sampleJapaneseTenant";

export type TargetTenantPreviewStatus = "preview-only" | "blocked";

export interface TargetTenantPreviewGate {
  gateId: string;
  label: string;
  status: "ready" | "planned" | "blocked";
  evidence: string;
  studentImpact: string;
}

export interface TargetLanguageTenantPreview {
  previewId: string;
  tenant: TenantConfig;
  status: TargetTenantPreviewStatus;
  routePath: string;
  registryStatus: string;
  packageStatus: string;
  progressionTrigger: string;
  gates: TargetTenantPreviewGate[];
  blockedActions: string[];
}

export const sampleJapaneseTargetTenantPreview: TargetLanguageTenantPreview = {
  previewId: "sample-japanese-school-target-tenant-preview",
  tenant: sampleJapaneseTenant,
  status: "blocked",
  routePath: "/enter/sample-japanese-school",
  registryStatus: "not-registered",
  packageStatus: "not-created",
  progressionTrigger: "Japanese target-language events only; English support cannot unlock progress.",
  gates: [
    {
      gateId: "japanese-curriculum-review",
      label: "Teacher-reviewed Japanese curriculum",
      status: "blocked",
      evidence: "No reviewed Japanese target-language ContentPackage has been submitted for this tenant.",
      studentImpact: "No student-facing Japanese unit route may be activated.",
    },
    {
      gateId: "japanese-audio-approval",
      label: "Target-language audio approval",
      status: "planned",
      evidence: "The tenant requires Japanese audio coverage for terms, sentences, instructions, and feedback before assignment.",
      studentImpact: "Learner-facing Japanese audio and speech activities remain unavailable.",
    },
    {
      gateId: "japanese-segmentation",
      label: "Language-aware segmentation",
      status: "blocked",
      evidence: "Japanese sentence and typing activities must not reuse English whitespace tokenization.",
      studentImpact: "Sentence Builder, typing, spelling, and puzzle modes remain blocked for Japanese target content.",
    },
    {
      gateId: "japanese-script-policy",
      label: "Script policy and reading support",
      status: "planned",
      evidence: "The tenant declares hiragana-first policy; level-based kana, kanji, and furigana rules still require review.",
      studentImpact: "Script-sensitive activities cannot be assigned until the level policy is approved.",
    },
  ],
  blockedActions: [
    "Register a student-facing Japanese front-door route",
    "Create or assign a Japanese target-language package",
    "Treat English support activity as Japanese mastery",
    "Enable Japanese speech matching or AI pronunciation scoring",
  ],
};
