export type AiGeneratorResponsibilityRoleId =
  | "teacher-school"
  | "codex-architecture"
  | "external-ai-builder"
  | "verifier-layer"
  | "platform-admin";

export interface AiGeneratorResponsibilityRole {
  roleId: AiGeneratorResponsibilityRoleId;
  label: string;
  owner: string;
  summary: string;
  owns: string[];
  mustProvide: string[];
  handoffRecords: string[];
  cannotDo: string[];
  nextGate: string;
}

export interface AiGeneratorResponsibilityMatrix {
  matrixId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: "review-only";
  summary: string;
  standingRules: string[];
  roles: AiGeneratorResponsibilityRole[];
}

const sharedRoles: AiGeneratorResponsibilityRole[] = [
  {
    roleId: "teacher-school",
    label: "Teacher / school reviewer",
    owner: "Teacher and school operator",
    summary:
      "Confirms classroom fit, source evidence, target level, target language, audio needs, and student-safe assignment intent.",
    owns: [
      "Unit purpose and classroom fit",
      "Source evidence confirmation",
      "Target level and target language",
      "Audio acceptance and support-language policy",
    ],
    mustProvide: [
      "Reviewed source packet",
      "Teacher approval evidence",
      "Audio coverage acceptance",
      "Classroom use constraints",
    ],
    handoffRecords: [
      "source_extraction_review_packet",
      "teacher_draft_review_handoff",
      "package_approval_ledger",
      "school_launch_policy_gate",
    ],
    cannotDo: [
      "Approve generated content directly to students",
      "Use support language to unlock progress",
      "Skip media rights evidence",
    ],
    nextGate: "Teacher approval ledger and school launch policy gate",
  },
  {
    roleId: "codex-architecture",
    label: "Codex architecture and integration",
    owner: "Codex",
    summary:
      "Codex owns architecture, schema discipline, parent-engine integration, route safety, verification, and final app review.",
    owns: [
      "Codex owns architecture and integration",
      "Parent-engine wrapper boundary",
      "Standard event contract",
      "Route, playlist, scoring, and reward authority",
    ],
    mustProvide: [
      "Codex integration review decision",
      "Wrapper adapter review",
      "Fixture and event replay checks",
      "Build and route verification",
    ],
    handoffRecords: [
      "codex_integration_review_decision",
      "ai_prototype_wrapper_adapter_review",
      "ai_prototype_integration_readiness_gate",
      "ai_generated_publish_readiness_gate",
    ],
    cannotDo: [
      "Accept unreviewed outside code",
      "Bypass parent engines",
      "Create live routes from a draft",
      "Patch apps/web without explicit integration evidence",
    ],
    nextGate: "Codex integration review decision",
  },
  {
    roleId: "external-ai-builder",
    label: "External AI builder / Z.ai",
    owner: "Outside prototype builder",
    summary:
      "Explores isolated game prototypes from strict briefs while staying outside production routes, scoring, rewards, and package authority.",
    owns: [
      "Isolated prototype component",
      "Fixture replay notes",
      "README integration notes",
      "Mode-specific interaction experiment",
    ],
    mustProvide: [
      "Prototype source folder",
      "Sample JSON fixture",
      "Event log evidence",
      "Audio coverage notes",
    ],
    handoffRecords: [
      "ai_generated_game_build_brief",
      "ai_prototype_return_review",
      "ai_prototype_fixture_replay_report",
      "ai_prototype_event_replay_report",
    ],
    cannotDo: [
      "No app file writes",
      "No route creation",
      "No scoring authority",
      "No reward inventory writes",
      "No student assignment",
    ],
    nextGate: "AI prototype return review",
  },
  {
    roleId: "verifier-layer",
    label: "Verifier layer",
    owner: "Schema and pedagogy verifier",
    summary:
      "Checks generated JSON against pedagogy, audio, target-language, assist-language, game-mode, and safety rules before approval.",
    owns: [
      "JSON schema validation",
      "8 default vocabulary terms with 8-12 allowed range",
      "Exactly 2 target sentence structures",
      "Target-language audio coverage",
    ],
    mustProvide: [
      "Verifier submission packet",
      "Schema guard result",
      "Audio coverage result",
      "Support-language boundary result",
    ],
    handoffRecords: [
      "teacher_draft_verifier_submission",
      "ai_verifier_submission_packet",
      "ai_generated_draft_payload_preview",
      "ai_draft_correction_queue",
    ],
    cannotDo: [
      "No automatic publish",
      "No direct assignment",
      "No unreviewed activity conversion",
      "Support language cannot unlock progress",
    ],
    nextGate: "AI verifier submission packet",
  },
  {
    roleId: "platform-admin",
    label: "Platform admin",
    owner: "Platform / tenant admin",
    summary:
      "Controls cost entitlements, storage selection, release control, feature packages, and child-safe premium boundaries.",
    owns: [
      "AI package entitlement",
      "Storage and deployment mode",
      "Release-control policy",
      "Premium feature boundary",
    ],
    mustProvide: [
      "API cost package gate",
      "Backend storage readiness",
      "Release-control gate",
      "Tenant feature entitlement",
    ],
    handoffRecords: [
      "premium_ai_cost_gate",
      "ai_generator_tenant_coverage_gate",
      "package_publish_gate",
      "local_companion_release_gate",
    ],
    cannotDo: [
      "No API cost without tenant approval",
      "No premium upsell shown to children",
      "No live model call before entitlement",
      "No release-state mutation from generator preview",
    ],
    nextGate: "API cost package gate and backend storage readiness",
  },
];

export const sampleAiGeneratorResponsibilityMatrices: AiGeneratorResponsibilityMatrix[] = [
  {
    matrixId: "ai-generator-responsibility-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher generator responsibility matrix",
    status: "review-only",
    summary:
      "A role map for the sample publisher AI game generator so every handoff has an owner before any live generation, integration, package, route, playlist, or assignment exists.",
    standingRules: [
      "Responsibility matrix is review-only",
      "Detailed source records remain authoritative",
      "External AI builders stay isolated",
      "Codex owns architecture and final integration",
      "Teacher approval remains required",
    ],
    roles: sharedRoles,
  },
  {
    matrixId: "ai-generator-responsibility-ministar-l1-greetings-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar generator responsibility matrix",
    status: "review-only",
    summary:
      "A role map for the MiniStar AI game generator so English remains the progress trigger, Japanese stays support-only, and outside prototype work stays isolated.",
    standingRules: [
      "Responsibility matrix is review-only",
      "Detailed source records remain authoritative",
      "External AI builders stay isolated",
      "Codex owns architecture and final integration",
      "English is the target-language trigger",
      "Japanese support cannot unlock progress",
      "Foundation Japanese support stays hiragana-only",
    ],
    roles: sharedRoles,
  },
];

export function filterAiGeneratorResponsibilityMatricesByTenant(
  matrices: AiGeneratorResponsibilityMatrix[],
  tenantId: string,
) {
  return matrices.filter((matrix) => matrix.tenantId === tenantId);
}
