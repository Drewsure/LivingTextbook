import {
  getAiGeneratedPackageManifestCollectionWarnings,
  validateAiGeneratedPackageManifests,
  type AiGeneratedPackageManifest,
} from "@living-textbook/content-model/src/aiGeneratedPackageManifest";

export const sampleAiGeneratedPackageManifests: AiGeneratedPackageManifest[] = [
  {
    manifestId: "ai-generated-package-manifest-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher generated package manifest",
    summary:
      "A review-only manifest that bundles the generator request, prompt package, draft JSON, audio coverage, engine binding, gamification mapping, verifier packet, and review queue item before any package write exists.",
    status: "manifest-preview",
    assemblyState: "Package assembly blocked",
    links: [
      {
        label: "Prompt package",
        recordId: "ai-generator-prompt-v2026.07.foundation",
        purpose: "Locks tenant rules, schema requirements, and model-use cost gates.",
      },
      {
        label: "Draft JSON preview",
        recordId: "ai-draft-preview-sample-publisher-l1-routines-v1",
        purpose: "Shows the generated payload shape before persistence.",
      },
      {
        label: "Audio coverage plan",
        recordId: "ai-audio-coverage-sample-publisher-l1-routines-v1",
        purpose: "Lists required target-language audio before student use.",
      },
      {
        label: "Engine binding plan",
        recordId: "ai-engine-binding-sample-publisher-l1-routines-v1",
        purpose: "Binds modes to existing parent engines and scoring profiles.",
      },
      {
        label: "Gamification mapping plan",
        recordId: "ai-gamification-sample-publisher-l1-routines-v1",
        purpose: "Keeps Star Dust and collection unlocks deterministic.",
      },
      {
        label: "Verifier submission packet",
        recordId: "ai-verifier-submission-sample-publisher-game-draft-v1",
        purpose: "Defines checks and rejection rules before teacher approval.",
      },
      {
        label: "Review queue item",
        recordId: "queue-ai-draft-sample-publisher-l1-routines-v1",
        purpose: "Places the generated draft in the normal teacher review queue.",
      },
    ],
    records: [
      {
        recordType: "ai_generated_package_manifest",
        label: "Generated package manifest",
        status: "ready-preview",
        source: "This preview panel",
        blocker: "Durable manifest storage required",
      },
      {
        recordType: "teacher_draft_package",
        label: "Teacher draft package",
        status: "ready-preview",
        source: "AI-generated draft package preview",
        blocker: "Draft persistence required",
      },
      {
        recordType: "teacher_draft_verifier_submission",
        label: "Teacher draft verifier submission",
        status: "blocked-preview",
        source: "AI verifier submission packet",
        blocker: "Live verifier workflow required",
      },
      {
        recordType: "package_game_audio_coverage",
        label: "Package game/audio coverage",
        status: "blocked-preview",
        source: "AI audio coverage plan",
        blocker: "Audio cue approval required",
      },
      {
        recordType: "engine_mode_config_binding",
        label: "Engine mode config binding",
        status: "ready-preview",
        source: "AI engine binding plan",
        blocker: "Route registry write blocked",
      },
      {
        recordType: "collection_unlock_binding",
        label: "Collection unlock binding",
        status: "ready-preview",
        source: "AI gamification mapping plan",
        blocker: "Inventory and progress storage required",
      },
      {
        recordType: "activity_compatibility_snapshot",
        label: "Activity compatibility snapshot",
        status: "ready-preview",
        source: "Curated pathway compatibility matrix",
        blocker: "No broad switch panel",
      },
      {
        recordType: "media_rights_manifest",
        label: "Media rights manifest",
        status: "missing",
        source: "Partner evidence not attached",
        blocker: "Media rights proof required",
      },
      {
        recordType: "teacher_approval_packet",
        label: "Teacher approval packet",
        status: "missing",
        source: "No reviewer decision captured",
        blocker: "Reviewer identity and approval ledger required",
      },
    ],
    assemblySteps: [
      "Collect source evidence packet and prompt package version.",
      "Validate JSON-first payload against the content model.",
      "Bind generated modes to parent engines and scoring profiles.",
      "Attach target-language audio coverage and media-rights evidence.",
      "Create verifier submission packet and review queue item.",
      "Wait for durable storage, reviewer identity, and release-control binding.",
    ],
    releaseLocks: [
      "No package assembly write",
      "No route registry write",
      "No media playlist write",
      "No assignment write",
      "No local bundle write",
      "No student-ready marker",
      "No support-language-only package assembly",
    ],
    blockedActions: [
      "Assemble generated package blocked",
      "Submit package manifest to verifier blocked",
      "Create launch route from manifest blocked",
      "Create media playlist from manifest blocked",
      "Create local package bundle from manifest blocked",
      "Assign generated package from manifest blocked",
      "Assemble support-language-only package blocked",
    ],
    nextRequirements: [
      "Durable generated package manifest storage",
      "Manifest-to-review-queue adapter",
      "Verifier submission workflow",
      "Audio cue approval workflow",
      "Media rights evidence attachment storage",
      "Release-control and approval ledger binding",
    ],
  },
  {
    manifestId: "ai-generated-package-manifest-ministar-l1-greetings-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar generated package manifest",
    summary:
      "A review-only manifest that gathers the MiniStar prompt package, Draft JSON preview, audio coverage plan, engine binding, gamification mapping, verifier packet, and future review queue item before any package write exists.",
    status: "manifest-preview",
    assemblyState: "Package assembly blocked",
    links: [
      {
        label: "Prompt package",
        recordId: "ai-generator-prompt-ministar-l1-greetings-v1",
        purpose: "Locks MiniStar tenant rules, schema requirements, support-language policy, and model-use cost gates.",
      },
      {
        label: "Draft JSON preview",
        recordId: "ai-draft-preview-ministar-l1-greetings-v1",
        purpose: "Shows the MiniStar generated payload shape before persistence.",
      },
      {
        label: "Audio coverage plan",
        recordId: "ai-audio-coverage-ministar-l1-greetings-v1",
        purpose: "Lists required English target-language audio and support-only hiragana cue rules.",
      },
      {
        label: "Engine binding plan",
        recordId: "ai-engine-binding-ministar-l1-greetings-v1",
        purpose: "Binds Flashcards, Memory Match, and Speak It to existing parent engines and scoring profiles.",
      },
      {
        label: "Gamification mapping plan",
        recordId: "ai-gamification-ministar-l1-greetings-v1",
        purpose: "Keeps Star Dust, mastery, and collection unlocks deterministic.",
      },
      {
        label: "Verifier submission packet",
        recordId: "ai-verifier-submission-ministar-l1-greetings-v1",
        purpose: "Defines MiniStar checks and rejection rules before teacher approval.",
      },
      {
        label: "Review queue item",
        recordId: "queue-ai-draft-ministar-l1-greetings-v1",
        purpose: "Future normal teacher review queue binding for this generated draft.",
      },
    ],
    records: [
      {
        recordType: "ai_generated_package_manifest",
        label: "Generated package manifest",
        status: "ready-preview",
        source: "This preview panel",
        blocker: "Durable manifest storage required",
      },
      {
        recordType: "teacher_draft_package",
        label: "Teacher draft package",
        status: "ready-preview",
        source: "MiniStar Draft JSON preview",
        blocker: "Draft persistence required",
      },
      {
        recordType: "teacher_draft_verifier_submission",
        label: "Teacher draft verifier submission",
        status: "blocked-preview",
        source: "MiniStar AI verifier packet",
        blocker: "Live verifier workflow required",
      },
      {
        recordType: "package_game_audio_coverage",
        label: "Package game/audio coverage",
        status: "blocked-preview",
        source: "MiniStar AI audio coverage plan",
        blocker: "English target-language audio approval required",
      },
      {
        recordType: "engine_mode_config_binding",
        label: "Engine mode config binding",
        status: "ready-preview",
        source: "MiniStar generated-mode engine binding",
        blocker: "Route registry write blocked",
      },
      {
        recordType: "collection_unlock_binding",
        label: "Collection unlock binding",
        status: "ready-preview",
        source: "MiniStar AI gamification map",
        blocker: "Inventory and progress storage required",
      },
      {
        recordType: "activity_compatibility_snapshot",
        label: "Activity compatibility snapshot",
        status: "ready-preview",
        source: "Curated pathway compatibility matrix",
        blocker: "No broad switch panel",
      },
      {
        recordType: "media_rights_manifest",
        label: "Media rights manifest",
        status: "missing",
        source: "MiniStar media rights not attached",
        blocker: "Media rights proof required",
      },
      {
        recordType: "teacher_approval_packet",
        label: "Teacher approval packet",
        status: "missing",
        source: "MiniStar teacher approval not captured",
        blocker: "Reviewer identity and approval ledger required",
      },
    ],
    assemblySteps: [
      "Collect MiniStar source evidence packet and prompt package version.",
      "Validate JSON-first payload against the content model.",
      "Bind generated modes to parent engines and scoring profiles.",
      "Attach English target-language audio approval and media-rights evidence.",
      "Create verifier submission packet and normal review queue item.",
      "Wait for durable storage, reviewer identity, and release-control binding.",
    ],
    releaseLocks: [
      "No package assembly write",
      "No route registry write",
      "No media playlist write",
      "No assignment write",
      "No local bundle write",
      "No student-ready marker",
      "No support-language-only package assembly",
    ],
    blockedActions: [
      "Assemble generated package blocked",
      "Submit package manifest to verifier blocked",
      "Create launch route from manifest blocked",
      "Create media playlist from manifest blocked",
      "Create local package bundle from manifest blocked",
      "Assign generated package from manifest blocked",
      "Assemble support-language-only package blocked",
    ],
    nextRequirements: [
      "Durable generated package manifest storage",
      "MiniStar review queue adapter",
      "Verifier submission workflow",
      "Target-language audio approval workflow",
      "MiniStar media rights evidence attachment storage",
      "Release-control and approval ledger binding",
    ],
  },
];

export function filterAiGeneratedPackageManifestsByTenant(
  manifests: AiGeneratedPackageManifest[],
  tenantId: string,
): AiGeneratedPackageManifest[] {
  return manifests.filter((manifest) => manifest.tenantId === tenantId);
}

export const sampleAiGeneratedPackageManifestErrors =
  validateAiGeneratedPackageManifests(sampleAiGeneratedPackageManifests);

export const sampleAiGeneratedPackageManifestWarnings =
  getAiGeneratedPackageManifestCollectionWarnings(sampleAiGeneratedPackageManifests);
