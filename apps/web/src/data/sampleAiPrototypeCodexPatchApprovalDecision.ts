import { sampleAiPrototypePatchHarnessImplementationProposals } from "@/data/sampleAiPrototypePatchHarnessImplementationProposal";

export type AiPrototypeCodexPatchApprovalDecisionStatus =
  | "blocked"
  | "review-only"
  | "ready-for-codex-approval-review";
export type AiPrototypeCodexPatchApprovalDecisionCheckStatus = "missing" | "blocked" | "pending-review" | "reviewed";

export interface AiPrototypeCodexPatchApprovalDecisionCheck {
  label: string;
  status: AiPrototypeCodexPatchApprovalDecisionCheckStatus;
  requiredRecord: string;
  evidenceNeeded: string;
}

export interface AiPrototypeCodexPatchApprovalDecision {
  decisionId: string;
  tenantId: string;
  requestId: string;
  proposalId: string;
  harnessPlanId: string;
  label: string;
  status: AiPrototypeCodexPatchApprovalDecisionStatus;
  selectedDecision: string;
  summary: string;
  sourceRecords: string[];
  checks: AiPrototypeCodexPatchApprovalDecisionCheck[];
  decisionOptions: string[];
  requiredBeforeDecision: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const sampleAiPrototypeCodexPatchApprovalDecisions: AiPrototypeCodexPatchApprovalDecision[] =
  sampleAiPrototypePatchHarnessImplementationProposals.map((proposal) => {
    const isMiniStar = proposal.tenantId === "ministar";

    return {
      decisionId: `codex-patch-approval-decision-${proposal.requestId}`,
      tenantId: proposal.tenantId,
      requestId: proposal.requestId,
      proposalId: proposal.proposalId,
      harnessPlanId: proposal.harnessPlanId,
      label: isMiniStar
        ? "MiniStar Codex patch approval decision"
        : "Codex patch approval decision",
      status: "blocked",
      selectedDecision: "No patch approval recorded",
      summary: isMiniStar
        ? "MiniStar patch approval is blocked until Codex reviews file scope, route safety, rollback, storage, reviewer identity, and hiragana support-only evidence."
        : "Patch approval is blocked until Codex reviews file scope, route safety, rollback, storage, reviewer identity, and white-label boundaries.",
      sourceRecords: [
        "ai_prototype_app_patch_proposal",
        "ai_prototype_patch_test_readiness_gate",
        "ai_prototype_patch_test_harness_plan",
        "ai_prototype_patch_harness_implementation_proposal",
        "route_safety_release_gate",
        "rollback_drill_record",
        "storage_contract_verification",
        "reviewer_identity_signature_gate",
        "codex_patch_approval_decision",
      ],
      checks: [
        {
          label: "Patch file scope review",
          status: "pending-review",
          requiredRecord: "ai_prototype_app_patch_proposal",
          evidenceNeeded: "Future files, fixture-only data paths, route preview scope, rollback scope, and no-write boundaries must be reviewed.",
        },
        {
          label: "Patch test readiness review",
          status: "pending-review",
          requiredRecord: "ai_prototype_patch_test_readiness_gate",
          evidenceNeeded: "Fixture, event, target-language audio, mobile, scoring, route, storage, and rollback test lanes must be accepted.",
        },
        {
          label: "Harness plan review",
          status: "pending-review",
          requiredRecord: "ai_prototype_patch_test_harness_plan",
          evidenceNeeded: "Harness design must remain non-executable and cover every required dry-run lane.",
        },
        {
          label: "Harness implementation proposal review",
          status: "pending-review",
          requiredRecord: "ai_prototype_patch_harness_implementation_proposal",
          evidenceNeeded: "Implementation scope must remain proposed only, with no runnable harness, Playwright run, or app file write.",
        },
        {
          label: "Route safety release gate",
          status: "blocked",
          requiredRecord: "route_safety_release_gate",
          evidenceNeeded: "No generated route, route alias, QR target, or student-facing route may change from this decision preview.",
        },
        {
          label: "Rollback drill record",
          status: "blocked",
          requiredRecord: "rollback_drill_record",
          evidenceNeeded: "Rollback owner, revert scope, feature flag, release snapshot, and audit trail must be accepted before approval.",
        },
        {
          label: "Storage contract verification",
          status: "blocked",
          requiredRecord: "storage_contract_verification",
          evidenceNeeded: "Hosted and local persistence contracts must preserve the decision without enabling patch execution.",
        },
        {
          label: "Reviewer identity signature gate",
          status: "blocked",
          requiredRecord: "reviewer_identity_signature_gate",
          evidenceNeeded: "A future signed approval record must identify the Codex reviewer and accepted scope.",
        },
        ...(isMiniStar
          ? [
              {
                label: "MiniStar hiragana support boundary",
                status: "blocked" as const,
                requiredRecord: "assist_language_policy",
                evidenceNeeded:
                  "Foundation Japanese support remains hiragana-only and support-only; English remains the trigger for progress.",
              },
            ]
          : []),
      ],
      decisionOptions: [
        "Keep patch blocked",
        "Approve patch planning only",
        "Return for evidence repair",
        "Reject patch scope",
      ],
      requiredBeforeDecision: [
        "Codex manual review completed",
        "Patch scope accepted",
        "Route safety gate accepted",
        "Rollback drill accepted",
        "Storage contract verified",
        "Reviewer identity signature gate accepted",
        "No support-language progress trigger",
      ],
      blockedActions: [
        "No Codex patch approval",
        "No app file write",
        "No app patch generation",
        "No test execution",
        "No Playwright run",
        "No route mutation",
        "No student-facing route",
        "No scoring or reward mutation",
        "No audio manifest mutation",
        "No package promotion",
        "No assignment",
        "No support-language progress trigger",
      ],
      nextRequiredRecords: [
        "Codex patch approval decision storage contract",
        "Reviewer identity signature gate",
        "Route safety release gate",
        "Rollback drill record",
        "Storage contract verification",
      ],
    };
  });

export function filterAiPrototypeCodexPatchApprovalDecisionsByTenant(
  decisions: AiPrototypeCodexPatchApprovalDecision[],
  tenantId: string,
): AiPrototypeCodexPatchApprovalDecision[] {
  return decisions.filter((decision) => decision.tenantId === tenantId);
}
