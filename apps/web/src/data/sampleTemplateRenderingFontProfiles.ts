export type ProfileReadinessStatus = "foundation-preview" | "requires-review" | "blocked-live";

export interface TemplateRenderingProfilePreview {
  profileId: string;
  label: string;
  sourceTemplate: string;
  status: ProfileReadinessStatus;
  compatibleFamilies: string[];
  rowShapePolicy: string[];
  mediaSlotPolicy: string[];
  layoutConstraints: string[];
  blockedShortcuts: string[];
  studentFacingRenderingAllowed: boolean;
}

export interface FontAccessibilityProfilePreview {
  profileId: string;
  label: string;
  approvedLearnerFont: string;
  status: ProfileReadinessStatus;
  tenantFontPack: string[];
  languageRenderingRules: string[];
  readabilityChecks: string[];
  blockedShortcuts: string[];
  studentFacingFontAllowed: boolean;
}

export interface TemplateRenderingFontProfilePlan {
  planId: string;
  label: string;
  summary: string;
  foundationRule: string;
  templateProfiles: TemplateRenderingProfilePreview[];
  fontProfiles: FontAccessibilityProfilePreview[];
  requiredRecords: string[];
  reviewGates: string[];
}

export const sampleTemplateRenderingFontProfilePlan: TemplateRenderingFontProfilePlan = {
  planId: "foundation-template-rendering-font-profile-readiness",
  label: "Template and font profile readiness",
  summary:
    "Preview of the profile records required before the Flip Tiles-style upload guide can safely render across games, printables, local bundles, and tenant-branded learner surfaces.",
  foundationRule:
    "Template rendering and font choices remain profile-gated. Teachers can preview the shape, but student-facing rendering, template switching, tenant font packs, and printable output stay blocked until reviewed profiles exist.",
  templateProfiles: [
    {
      profileId: "template-profile-flip-tiles-cross-game-v1",
      label: "Flip Tiles cross-game rendering profile",
      sourceTemplate: "Flip Tiles source template",
      status: "requires-review",
      compatibleFamilies: [
        "Flashcards and flip tiles",
        "Memory Match and Matching Pairs",
        "Quiz and selection prompts",
        "Sentence Builder and printable rows",
        "Labelled Diagram image labels",
      ],
      rowShapePolicy: [
        "Front and Back fields stay separate from target/support language text.",
        "Target-language text is the only progress trigger.",
        "Support-language text remains support-only and report-only.",
        "Rows keep min 2 max 50 limits until a game-specific rule narrows them.",
      ],
      mediaSlotPolicy: [
        "Audio cue is required for target-language text.",
        "Image upload remains an intake/review record before use.",
        "Video and playlist slots stay optional to core progress.",
        "Background media cannot override learning audio.",
      ],
      layoutConstraints: [
        "Stable mobile tile sizing and wrapping.",
        "Classroom-screen contrast and touch target checks.",
        "Printable output keeps text, image, and audio bridge references readable.",
        "No overflow from long words, hiragana, furigana, symbols, or formulas.",
      ],
      blockedShortcuts: [
        "No switch-to-anything panel",
        "No arbitrary teacher CSS",
        "No student-facing rendering profile",
        "No unchecked printable output",
      ],
      studentFacingRenderingAllowed: false,
    },
  ],
  fontProfiles: [
    {
      profileId: "font-profile-young-learner-ja-safe-v1",
      label: "Young learner and Japanese-safe font profile",
      approvedLearnerFont: "Approved learner font",
      status: "requires-review",
      tenantFontPack: [
        "Tenant font pack is configuration, not a teacher upload.",
        "Brand fonts can decorate headers only after readability review.",
        "Learner text keeps a readable default on mobile and print.",
      ],
      languageRenderingRules: [
        "Foundation, Bronze, and Plus Japanese support text uses hiragana-first rendering.",
        "Silver and above may introduce katakana, kanji, and furigana where approved.",
        "Target-language text remains visually primary over assist language.",
        "Symbols and formulas require tap-to-speak and printable renderer checks.",
      ],
      readabilityChecks: [
        "Minimum touch target and line-height checks.",
        "No negative letter spacing.",
        "Contrast checks for active, disabled, and review-only states.",
        "Readable tile sizing across phone, tablet, classroom screen, and worksheet.",
      ],
      blockedShortcuts: [
        "No arbitrary teacher font upload",
        "No unlicensed font",
        "No broken hiragana/furigana rendering",
        "No font profile as a mastery trigger",
      ],
      studentFacingFontAllowed: false,
    },
  ],
  requiredRecords: [
    "template_rendering_profile",
    "font_accessibility_profile",
    "activity_compatibility_snapshot",
    "package_release_candidate",
    "package_publish_gate",
    "package_approval_ledger",
  ],
  reviewGates: [
    "Reviewed profile required",
    "Compatibility review required",
    "Font license review required",
    "Language rendering review required",
    "Printable renderer review required",
    "Release control gate required",
  ],
};

