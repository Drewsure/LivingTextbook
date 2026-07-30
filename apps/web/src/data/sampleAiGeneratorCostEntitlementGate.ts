export type AiGeneratorCostGateStatus = "ready-preview" | "premium-disabled" | "blocked";

export interface AiGeneratorCostGateCheck {
  checkId: string;
  label: string;
  status: AiGeneratorCostGateStatus;
  evidence: string;
  blocker: string;
}

export interface AiGeneratorEstimateInput {
  inputId: string;
  label: string;
  value: string;
  status: AiGeneratorCostGateStatus;
}

export interface AiGeneratorCostCeiling {
  ceilingId: string;
  label: string;
  value: string;
  policy: string;
  status: AiGeneratorCostGateStatus;
}

export interface AiGeneratorCostEntitlementGate {
  gateId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  packageState: string;
  estimateState: string;
  approvalState: string;
  requiredRecords: string[];
  checks: AiGeneratorCostGateCheck[];
  estimateInputs: AiGeneratorEstimateInput[];
  costCeilings: AiGeneratorCostCeiling[];
  blockedActions: string[];
  adoptionRequirements: string[];
}

export const sampleAiGeneratorCostEntitlementGates: AiGeneratorCostEntitlementGate[] = [
  {
    gateId: "premium-ai-cost-gate-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher AI cost and entitlement gate",
    summary:
      "A disabled commercial gate that shows what must exist before live AI generation, model billing, voice generation, speech scoring, or AI Tutor support can be enabled for a tenant.",
    packageState: "Premium package required",
    estimateState: "Cost estimate preview only",
    approvalState: "Tenant and school approval required",
    requiredRecords: [
      "premium_ai_cost_gate",
      "tenant_ai_generation_entitlement",
      "usage_budget_ceiling",
      "model_rate_card_snapshot",
      "voice_generation_separate_package",
      "cost_estimate_preview",
      "school_approval_required",
    ],
    checks: [
      {
        checkId: "tenant-entitlement",
        label: "Tenant AI generation entitlement",
        status: "premium-disabled",
        evidence: "No paid AI generation package is enabled for this sample tenant.",
        blocker: "Tenant admin must adopt an AI generation package before any model call.",
      },
      {
        checkId: "school-approval",
        label: "School approval required",
        status: "blocked",
        evidence: "No school-level AI usage acceptance exists.",
        blocker: "School policy must approve AI generation, speech scoring, voice generation, tutor use, and reporting boundaries.",
      },
      {
        checkId: "usage-budget",
        label: "Usage budget ceiling",
        status: "blocked",
        evidence: "No monthly teacher, class, unit, or tenant cap is configured.",
        blocker: "A hard cost ceiling must exist before live prompt dispatch.",
      },
      {
        checkId: "model-rate-card",
        label: "Model rate card snapshot",
        status: "blocked",
        evidence: "No approved model, price snapshot, or latency target is selected.",
        blocker: "Rate card and model-quality review required before estimates are trusted.",
      },
      {
        checkId: "voice-package",
        label: "Voice generation separate package",
        status: "premium-disabled",
        evidence: "Synthetic voice is not bundled into text generation.",
        blocker: "Voice generation and speech scoring need separate tenant approval because they can create extra cost and privacy duties.",
      },
    ],
    estimateInputs: [
      {
        inputId: "unit-count",
        label: "Generated units",
        value: "1 review-only unit",
        status: "ready-preview",
      },
      {
        inputId: "mode-count",
        label: "Generated modes",
        value: "3 curated modes",
        status: "ready-preview",
      },
      {
        inputId: "audio-scope",
        label: "Target-language audio scope",
        value: "Terms, sentences, instructions, feedback, controls",
        status: "blocked",
      },
      {
        inputId: "voice-scope",
        label: "Synthetic voice scope",
        value: "Not included in text generation estimate",
        status: "premium-disabled",
      },
      {
        inputId: "ai-tutor-scope",
        label: "AI Tutor scope",
        value: "Not included in Level 1 generator package",
        status: "premium-disabled",
      },
    ],
    costCeilings: [
      {
        ceilingId: "tenant-monthly-cap",
        label: "Tenant monthly cap",
        value: "Not configured",
        policy: "No live generation until a tenant-level hard cap exists.",
        status: "blocked",
      },
      {
        ceilingId: "teacher-request-cap",
        label: "Teacher request cap",
        value: "Not configured",
        policy: "Teacher requests need per-day and per-unit limits.",
        status: "blocked",
      },
      {
        ceilingId: "student-facing-cost-cap",
        label: "Student-facing cost cap",
        value: "Zero in foundation",
        policy: "Children never trigger premium spending or see upsell copy.",
        status: "ready-preview",
      },
    ],
    blockedActions: [
      "Enable AI generation blocked",
      "Estimate API cost via live model blocked",
      "Dispatch live prompt blocked",
      "No live model billing",
      "Bill tenant blocked",
      "Teacher self-enable blocked",
      "Generate voice blocked",
      "Enable speech scoring blocked",
      "Enable AI Tutor blocked",
      "Show premium upsell to children blocked",
    ],
    adoptionRequirements: [
      "Tenant package selection",
      "School policy approval",
      "Usage budget ceiling",
      "Model rate card snapshot",
      "Prompt and output retention policy",
      "Voice and speech package separation",
      "Teacher-visible cost estimate preview",
      "No child-facing premium upsell",
    ],
  },
  {
    gateId: "premium-ai-cost-gate-ministar-l1-greetings-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar AI cost and entitlement gate",
    summary:
      "A disabled commercial gate for MiniStar AI authoring. It separates low-cost draft generation from optional voice generation, speech scoring, and AI Tutor packages before any billing or live model action exists.",
    packageState: "Premium package required",
    estimateState: "Cost estimate preview only",
    approvalState: "MiniStar school approval required",
    requiredRecords: [
      "premium_ai_cost_gate",
      "tenant_ai_generation_entitlement",
      "usage_budget_ceiling",
      "model_rate_card_snapshot",
      "voice_generation_separate_package",
      "speech_scoring_separate_package",
      "ai_tutor_separate_package",
      "cost_estimate_preview",
      "school_approval_required",
    ],
    checks: [
      {
        checkId: "tenant-entitlement",
        label: "Tenant AI generation entitlement",
        status: "premium-disabled",
        evidence: "No paid MiniStar AI generation package is enabled in the scaffold.",
        blocker: "MiniStar admin must adopt an AI generation package before any model call.",
      },
      {
        checkId: "school-approval",
        label: "School approval required",
        status: "blocked",
        evidence: "No school-level AI usage acceptance exists for MiniStar.",
        blocker: "School policy must approve AI generation, speech scoring, voice generation, tutor use, and reporting boundaries.",
      },
      {
        checkId: "usage-budget",
        label: "Usage budget ceiling",
        status: "blocked",
        evidence: "No monthly tenant, class, teacher, or unit cap is configured.",
        blocker: "A hard cost ceiling must exist before live prompt dispatch.",
      },
      {
        checkId: "voice-package",
        label: "Voice generation separate package",
        status: "premium-disabled",
        evidence: "Target-language audio is required, but synthetic voice generation is not bundled into text generation.",
        blocker: "Voice generation needs separate tenant approval because it can create extra cost and review duties.",
      },
      {
        checkId: "ai-tutor-package",
        label: "AI Tutor separate package",
        status: "premium-disabled",
        evidence: "AI Tutor is optional for upper levels and not included in the Level 1 greetings generator package.",
        blocker: "AI Tutor requires separate privacy, transcript, usage-limit, and school approval records.",
      },
    ],
    estimateInputs: [
      {
        inputId: "unit-count",
        label: "Generated units",
        value: "1 review-only MiniStar unit",
        status: "ready-preview",
      },
      {
        inputId: "mode-count",
        label: "Generated modes",
        value: "3 curated modes",
        status: "ready-preview",
      },
      {
        inputId: "audio-scope",
        label: "Target-language audio scope",
        value: "English terms, sentences, instructions, feedback, controls",
        status: "blocked",
      },
      {
        inputId: "voice-scope",
        label: "Synthetic voice scope",
        value: "Separate optional package",
        status: "premium-disabled",
      },
      {
        inputId: "ai-tutor-scope",
        label: "AI Tutor scope",
        value: "Not included for Level 1",
        status: "premium-disabled",
      },
    ],
    costCeilings: [
      {
        ceilingId: "tenant-monthly-cap",
        label: "Tenant monthly cap",
        value: "Not configured",
        policy: "No live generation until a MiniStar hard cap exists.",
        status: "blocked",
      },
      {
        ceilingId: "teacher-request-cap",
        label: "Teacher request cap",
        value: "Not configured",
        policy: "Teacher requests need per-day and per-unit limits.",
        status: "blocked",
      },
      {
        ceilingId: "student-facing-cost-cap",
        label: "Student-facing cost cap",
        value: "Zero in foundation",
        policy: "Children never trigger premium spending or see upsell copy.",
        status: "ready-preview",
      },
    ],
    blockedActions: [
      "Enable AI generation blocked",
      "Estimate API cost via live model blocked",
      "Dispatch live prompt blocked",
      "No live model billing",
      "Bill tenant blocked",
      "Teacher self-enable blocked",
      "Generate voice blocked",
      "Enable speech scoring blocked",
      "Enable AI Tutor blocked",
      "Show premium upsell to children blocked",
    ],
    adoptionRequirements: [
      "MiniStar package selection",
      "School policy approval",
      "Usage budget ceiling",
      "Model rate card snapshot",
      "Prompt and output retention policy",
      "Voice, speech, and AI Tutor package separation",
      "Teacher-visible cost estimate preview",
      "No child-facing premium upsell",
    ],
  },
];

export function filterAiGeneratorCostEntitlementGatesByTenant(
  gates: AiGeneratorCostEntitlementGate[],
  tenantId: string,
): AiGeneratorCostEntitlementGate[] {
  return gates.filter((gate) => gate.tenantId === tenantId);
}
