export type WhiteLabelPackageTier = "core" | "premium" | "enterprise";
export type WhiteLabelPackageStatus = "included" | "optional-add-on" | "policy-blocked";

export interface WhiteLabelPackageCatalogItem {
  packageId: string;
  tier: WhiteLabelPackageTier;
  status: WhiteLabelPackageStatus;
  label: string;
  summary: string;
  includedCapabilities: string[];
  adoptionRequirements: string[];
  costControls: string[];
  childSafetyRules: string[];
}

export const sampleWhiteLabelPackageCatalog: WhiteLabelPackageCatalogItem[] = [
  {
    packageId: "core-classroom-pwa",
    tier: "core",
    status: "included",
    label: "Core classroom PWA",
    summary:
      "The default package for teacher-led QR launch, student self-progression, target-language audio, curated game pathways, Training Academy recovery, and review-only teacher reporting.",
    includedCapabilities: [
      "Teacher QR/front-door launch",
      "Flashcards and curated game pathway",
      "Target-language tap-to-speak audio",
      "Training Academy recovery",
      "Deterministic earned collection",
      "Teacher report preview",
    ],
    adoptionRequirements: ["Tenant branding", "Reviewed content package", "Launch safety gate", "School operating mode"],
    costControls: ["No model calls", "No speech API calls", "No report export infrastructure", "No hosted storage dependency"],
    childSafetyRules: ["No premium prompt", "No random reward pressure", "No support-language-only progress"],
  },
  {
    packageId: "premium-ai-authoring",
    tier: "premium",
    status: "optional-add-on",
    label: "Premium AI authoring",
    summary:
      "Teacher/admin package for draft unit generation, verifier packets, image prompt drafting, repair queues, and reviewed package assembly support.",
    includedCapabilities: [
      "AI draft request planner",
      "Verifier submission packet",
      "Audio coverage planner",
      "Correction queue support",
      "Generated game build briefs",
    ],
    adoptionRequirements: [
      "Tenant AI generation entitlement",
      "School policy approval",
      "Usage budget ceiling",
      "Model rate card snapshot",
    ],
    costControls: ["Hard monthly tenant cap", "Teacher request limits", "No live model call from student routes"],
    childSafetyRules: ["No direct AI publish", "No child-triggered generation", "No child-facing upgrade copy"],
  },
  {
    packageId: "premium-voice-tutor",
    tier: "premium",
    status: "optional-add-on",
    label: "Premium Voice Tutor",
    summary:
      "Optional speech layer for upper-level tutoring, speech matching, pronunciation feedback, and voice-assisted review after school and tenant approval.",
    includedCapabilities: [
      "Voice Tutor package plan",
      "Teacher-gated microphone policy",
      "Speech matching readiness",
      "Pronunciation scoring readiness",
      "Tutor feedback boundaries",
    ],
    adoptionRequirements: [
      "AI Tutor entitlement",
      "Microphone policy acceptance",
      "Speech API cost policy",
      "Transcript retention decision",
    ],
    costControls: ["Speech API budget", "No raw audio in core reports", "No transcript storage by default"],
    childSafetyRules: ["No microphone prompt before teacher approval", "No lower-level default tutor", "No paid prompt to students"],
  },
  {
    packageId: "enterprise-storage-and-local",
    tier: "enterprise",
    status: "policy-blocked",
    label: "Enterprise storage and local companion",
    summary:
      "Policy-gated package for hosted persistence, report export, evidence attachment storage, closed local companion delivery, and offline/hybrid handoff.",
    includedCapabilities: [
      "Hosted storage adapter",
      "Report export package",
      "Evidence attachment storage",
      "Closed local companion manifest",
      "Rollback and recovery records",
    ],
    adoptionRequirements: [
      "Persistence vendor selection",
      "School retention policy",
      "Release-control acceptance",
      "Local bundle rights proof",
    ],
    costControls: ["Storage quota policy", "Export policy", "Local support scope", "No release mutation before approval"],
    childSafetyRules: ["No real learner data until launch gate", "No public sharing by default", "No local package activation from review"],
  },
];
