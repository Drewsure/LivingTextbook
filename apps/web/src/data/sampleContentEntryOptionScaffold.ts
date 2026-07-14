export type ContentEntryOptionStatus = "foundation-preview" | "blocked-live" | "requires-review";

export interface ContentEntryWorkflowStep {
  stepId: string;
  label: string;
  detail: string;
}

export interface ContentEntryControl {
  controlId: string;
  label: string;
  status: ContentEntryOptionStatus;
  detail: string;
}

export interface ContentEntryRowAction {
  actionId: string;
  label: string;
  status: ContentEntryOptionStatus;
  detail: string;
}

export interface ContentEntryOptionScaffold {
  scaffoldId: string;
  label: string;
  summary: string;
  foundationRule: string;
  sourceTemplate: ContentEntryControl;
  workflowSteps: ContentEntryWorkflowStep[];
  crossGameGuide: ContentEntryControl[];
  globalControls: ContentEntryControl[];
  sidednessOptions: ContentEntryControl[];
  fontRenderingControls: ContentEntryControl[];
  rowEditor: {
    label: string;
    itemLimit: string;
    columns: string[];
    formattingTools: ContentEntryRowAction[];
    rowActions: ContentEntryRowAction[];
    requiredRecords: string[];
    blockedShortcuts: string[];
  };
  reviewGates: ContentEntryControl[];
}

export const sampleContentEntryOptionScaffold: ContentEntryOptionScaffold = {
  scaffoldId: "foundation-content-entry-option-scaffold",
  label: "Content entry option scaffold",
  summary:
    "Foundation preview for the teacher-facing content entry panel: template flow, AI draft support, sided cards, per-row text, audio, image, formatting, reorder, duplicate, delete, and review-gated completion.",
  foundationRule:
    "Content entry creates teacher draft records only. The Done control cannot route content to students until storage, rights, audio coverage, compatibility, review, and package release gates pass.",
  sourceTemplate: {
    controlId: "flip-tiles-source-template",
    label: "Flip Tiles source template",
    status: "foundation-preview",
    detail:
      "The current upload-panel example comes from a Flip Tiles authoring template, but its row, media, formatting, and font controls define a reusable guide for many activity pathways.",
  },
  workflowSteps: [
    {
      stepId: "pick-template",
      label: "Pick a template",
      detail: "Teacher chooses a curated activity pathway or approved template family before content entry begins.",
    },
    {
      stepId: "enter-content",
      label: "Enter content",
      detail: "Teacher edits title, instructions, sidedness, rows, media cues, and row actions inside a draft-only workbench.",
    },
    {
      stepId: "play-preview",
      label: "Play",
      detail: "Teacher can preview the activity, but student assignment stays blocked until package review and release gates pass.",
    },
  ],
  crossGameGuide: [
    {
      controlId: "cross-game-upload-guide",
      label: "Cross-game upload guide",
      status: "foundation-preview",
      detail:
        "The same content rows can guide flashcards, flip tiles, matching, quiz, sentence builder, labelled diagram, media playlist, and printable outputs after compatibility review.",
    },
    {
      controlId: "pairing-family-application",
      label: "Pairing-family games",
      status: "foundation-preview",
      detail: "Front/back rows can map to Flashcards, Flip Tiles, Memory Match, Matching Pairs, Match Up, and Word Match.",
    },
    {
      controlId: "selection-family-application",
      label: "Selection-family games",
      status: "requires-review",
      detail: "Rows can become quiz choices only after distractors, scoring, audio prompts, and answer keys pass review.",
    },
    {
      controlId: "text-family-application",
      label: "Text and printable outputs",
      status: "requires-review",
      detail: "Rows can become Sentence Builder, Type Answer, worksheets, and symbol-heavy printables after text shape and renderer checks pass.",
    },
  ],
  globalControls: [
    {
      controlId: "activity-title",
      label: "Activity title",
      status: "foundation-preview",
      detail: "Draft title captured as metadata, not a public student route title until review.",
    },
    {
      controlId: "instruction",
      label: "+ Instruction",
      status: "foundation-preview",
      detail: "Teacher instruction text must be tap-to-speak capable before young learners use the activity.",
    },
    {
      controlId: "generate-with-ai",
      label: "Generate With AI",
      status: "requires-review",
      detail: "AI can help create a draft, but direct AI publish is blocked and verifier review is mandatory.",
    },
    {
      controlId: "flip-tiles",
      label: "Flip tiles",
      status: "foundation-preview",
      detail: "Tile direction can be previewed for matching/flashcard modes after compatibility rules allow it.",
    },
    {
      controlId: "done",
      label: "Done",
      status: "blocked-live",
      detail: "Done saves or previews draft state only; it never assigns, publishes, or promotes uploaded media in the foundation scaffold.",
    },
    {
      controlId: "add-item",
      label: "+ Add an item",
      status: "foundation-preview",
      detail: "Teachers can add rows in the future workbench within limits, but live draft persistence is still gated.",
    },
  ],
  sidednessOptions: [
    {
      controlId: "single-sided",
      label: "Single sided",
      status: "foundation-preview",
      detail: "Single-sided rows support vocabulary, prompts, labels, and simple listening activities.",
    },
    {
      controlId: "double-sided",
      label: "Double sided",
      status: "foundation-preview",
      detail: "Double-sided rows support source/target pairs, front/back flashcards, matching, and translation support where allowed.",
    },
  ],
  fontRenderingControls: [
    {
      controlId: "approved-learner-font",
      label: "Approved learner font",
      status: "foundation-preview",
      detail: "Early learner surfaces must use approved readable fonts rather than arbitrary teacher-uploaded fonts.",
    },
    {
      controlId: "tenant-font-pack",
      label: "Tenant font pack",
      status: "requires-review",
      detail: "White-label tenants can have brand and curriculum font packs, but they must pass readability and licensing checks.",
    },
    {
      controlId: "hiragana-safe-font",
      label: "Hiragana-safe font",
      status: "requires-review",
      detail: "Japanese target-language or assist-language materials need fonts that preserve hiragana readability and furigana rendering.",
    },
    {
      controlId: "readable-tile-sizing",
      label: "Readable tile sizing",
      status: "foundation-preview",
      detail: "Tile text must keep stable sizing, wrapping, contrast, and touch targets across mobile, classroom screens, and printables.",
    },
    {
      controlId: "font-rendering-gate",
      label: "Font rendering gate",
      status: "requires-review",
      detail: "Font, symbol, formula, and multilingual rendering must be checked before a template is assigned to students.",
    },
  ],
  rowEditor: {
    label: "Row editor options",
    itemLimit: "min 2 max 50",
    columns: ["Front", "Back", "Target-language text", "Support-language text"],
    formattingTools: [
      {
        actionId: "bold",
        label: "Bold",
        status: "foundation-preview",
        detail: "Simple emphasis marker preserved in draft content; styling cannot hide the target-language trigger.",
      },
      {
        actionId: "superscript",
        label: "Superscript",
        status: "foundation-preview",
        detail: "Useful for science/math publishers and printable outputs after renderer compatibility review.",
      },
      {
        actionId: "subscript",
        label: "Subscript",
        status: "foundation-preview",
        detail: "Useful for formulas or graded publisher materials after renderer compatibility review.",
      },
      {
        actionId: "symbol-picker",
        label: "Symbol picker",
        status: "requires-review",
        detail: "Special symbols need text-to-speech and printable rendering checks before student use.",
      },
    ],
    rowActions: [
      {
        actionId: "audio-cue",
        label: "Audio cue",
        status: "requires-review",
        detail: "Every target-language text item needs reviewed tap-to-speak audio or a planned generation/review cue.",
      },
      {
        actionId: "image-upload",
        label: "Image upload",
        status: "blocked-live",
        detail: "Images require rights proof, classroom-safety review, alt text, and target binding before they can be used in games.",
      },
      {
        actionId: "reorder-item",
        label: "Reorder item",
        status: "foundation-preview",
        detail: "Row order can change draft sequence, but compatibility and scoring maps must be recalculated before assignment.",
      },
      {
        actionId: "duplicate-item",
        label: "Duplicate item",
        status: "foundation-preview",
        detail: "Duplication helps authoring speed, but duplicate content warnings must run before review.",
      },
      {
        actionId: "delete-item",
        label: "Delete item",
        status: "foundation-preview",
        detail: "Deleting a row must not break minimum item counts, audio coverage, or game compatibility.",
      },
    ],
    requiredRecords: [
      "teacher_draft_package",
      "teacher_draft_review_handoff",
      "upload_intake_asset",
      "upload_review_decision",
      "upload_promotion_gate",
      "game_asset_manifest",
      "media_manifest",
      "media_playlist_binding",
      "activity_compatibility_snapshot",
      "template_rendering_profile",
      "font_accessibility_profile",
    ],
    blockedShortcuts: [
      "No live media upload",
      "No Done-to-student route",
      "No direct AI publish",
      "No unreviewed image activation",
      "No support-language progress trigger",
      "No file picker writes",
      "No template switch without compatibility check",
    ],
  },
  reviewGates: [
    {
      controlId: "rights-review",
      label: "Rights review gate",
      status: "requires-review",
      detail: "Images, audio, music, video, and publisher files must have ownership or license evidence.",
    },
    {
      controlId: "audio-coverage",
      label: "Audio coverage gate",
      status: "requires-review",
      detail: "Target-language terms, sentences, labels, and instructions need reviewed audio cues before assignment.",
    },
    {
      controlId: "compatibility-review",
      label: "Compatibility review gate",
      status: "requires-review",
      detail: "Curated activity pathways must confirm item count, text shape, image needs, and scoring support before preview becomes assignment.",
    },
    {
      controlId: "release-control",
      label: "Release control gate",
      status: "blocked-live",
      detail: "Student-facing routes remain blocked until package release and tenant approval are recorded.",
    },
  ],
};
