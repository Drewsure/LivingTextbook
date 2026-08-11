import { sampleAiPrototypePatchImplementationWorkOrders } from "@/data/sampleAiPrototypePatchImplementationWorkOrder";

export type AiPrototypePatchChangeSetPreviewStatus =
  | "blocked"
  | "review-only"
  | "ready-for-change-set-review";

export interface AiPrototypePatchFileChangePreview {
  filePath: string;
  action: string;
  fileGroup: string;
  purpose: string;
  guardrail: string;
}

export interface AiPrototypePatchChangeSetPreview {
  changeSetId: string;
  tenantId: string;
  requestId: string;
  workOrderId: string;
  label: string;
  status: AiPrototypePatchChangeSetPreviewStatus;
  summary: string;
  plannedFileChanges: AiPrototypePatchFileChangePreview[];
  invariantChecks: string[];
  reviewBlockers: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const sampleAiPrototypePatchChangeSetPreviews: AiPrototypePatchChangeSetPreview[] =
  sampleAiPrototypePatchImplementationWorkOrders.map((workOrder) => {
    const isMiniStar = workOrder.tenantId === "ministar";

    return {
      changeSetId: `ai-prototype-patch-change-set-preview-${workOrder.requestId}`,
      tenantId: workOrder.tenantId,
      requestId: workOrder.requestId,
      workOrderId: workOrder.workOrderId,
      label: isMiniStar ? "MiniStar patch change set preview" : "Prototype patch change set preview",
      status: "blocked",
      summary: isMiniStar
        ? "MiniStar prototype patch changes remain blocked. This preview shows the future file-level plan while preserving English-only progress triggers and hiragana-only support for Foundation Japanese."
        : "Prototype patch changes remain blocked. This preview shows the future file-level plan while preserving wrapper-first integration, tenant portability, and blocked student-facing side effects.",
      plannedFileChanges: [
        {
          filePath: "apps/web/src/features/games/prototype-wrapper/[mode]Adapter.tsx",
          action: "future add",
          fileGroup: "Removable wrapper adapter",
          purpose: "Mount the reviewed prototype inside the parent-engine shell without owning route, score, audio, or assignment state.",
          guardrail: "Wrapper owns transient interaction and animation state only.",
        },
        {
          filePath: "apps/web/src/data/generated-fixture-mappings/[tenant]-[request].ts",
          action: "future add",
          fileGroup: "Reviewed fixture mapping",
          purpose: "Map reviewed JSON fixture fields into the wrapper input contract.",
          guardrail: "No hard-coded tenant vocabulary, sentences, mascot rules, media, route ids, or rewards.",
        },
        {
          filePath: "apps/web/src/features/games/prototype-wrapper/[mode].event-replay.test.ts",
          action: "future add",
          fileGroup: "Standard event replay test",
          purpose: "Replay game_started, round_shown, answer_submitted, answer_result, game_completed, and mastery_updated.",
          guardrail: "Parent engine remains the only scoring and progress authority.",
        },
        {
          filePath: "apps/web/src/features/games/prototype-wrapper/[mode].audio-coverage.test.ts",
          action: "future add",
          fileGroup: "Audio coverage assertion file",
          purpose: "Assert tap-to-speak coverage for terms, sentences, instructions, feedback, and controls.",
          guardrail: "Target-language audio is required; support-language audio stays support-only.",
        },
        {
          filePath: "docs/build-session-notes/[date]-prototype-patch.md",
          action: "future update",
          fileGroup: "Rollback and decision notes",
          purpose: "Record approved scope, verification order, rollback evidence, and follow-up risks.",
          guardrail: "Decision register entry must exist before any patch can be described as accepted.",
        },
      ],
      invariantChecks: [
        "Wrapper-first integration only",
        "Target-language progress only",
        "Parent engine owns scoring",
        "No route registry mutation",
        "No reward inventory write",
        "No audio manifest mutation",
        "No student-facing route",
        ...(isMiniStar ? ["No Japanese support-language progress trigger", "Foundation Japanese remains hiragana-only"] : []),
      ],
      reviewBlockers: [
        "Patch change set storage contract missing",
        "Accepted work order execution record missing",
        "Patch fixture archive missing",
        "Rollback snapshot missing",
        "Human reviewer sign-off missing",
      ],
      blockedActions: [
        "No apply patch",
        "No app patch write",
        "No generated file write",
        "No test execution",
        "No Playwright run",
        "No route creation",
        "No scoring or reward mutation",
        "No audio manifest mutation",
        "No package promotion",
        "No assignment",
        "No support-language progress trigger",
      ],
      nextRequiredRecords: [
        "Patch change set storage contract",
        "Work order execution authorization",
        "Patch fixture archive",
        "Rollback snapshot record",
        "Human reviewer sign-off record",
      ],
    };
  });

export function filterAiPrototypePatchChangeSetPreviewsByTenant(
  previews: AiPrototypePatchChangeSetPreview[],
  tenantId: string,
): AiPrototypePatchChangeSetPreview[] {
  return previews.filter((preview) => preview.tenantId === tenantId);
}
