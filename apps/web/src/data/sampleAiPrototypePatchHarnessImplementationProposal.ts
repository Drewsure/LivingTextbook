import { sampleAiPrototypePatchTestHarnessPlans } from "@/data/sampleAiPrototypePatchTestHarnessPlan";

export type AiPrototypePatchHarnessImplementationProposalStatus =
  | "blocked"
  | "review-only"
  | "ready-for-implementation-review";

export interface AiPrototypePatchHarnessImplementationProposal {
  proposalId: string;
  tenantId: string;
  requestId: string;
  harnessPlanId: string;
  label: string;
  status: AiPrototypePatchHarnessImplementationProposalStatus;
  summary: string;
  proposedFileScope: string[];
  implementationBoundaries: string[];
  requiredReviewGates: string[];
  dryRunOnlyChecks: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const sampleAiPrototypePatchHarnessImplementationProposals: AiPrototypePatchHarnessImplementationProposal[] =
  sampleAiPrototypePatchTestHarnessPlans.map((plan) => {
    const isMiniStar = plan.tenantId === "ministar";

    return {
      proposalId: `ai-prototype-patch-harness-implementation-proposal-${plan.requestId}`,
      tenantId: plan.tenantId,
      requestId: plan.requestId,
      harnessPlanId: plan.planId,
      label: isMiniStar
        ? "MiniStar patch harness implementation proposal"
        : "Patch harness implementation proposal",
      status: "blocked",
      summary: isMiniStar
        ? "MiniStar harness implementation remains blocked until Codex approves file scope, route safety, rollback, storage, and hiragana support-only checks."
        : "Harness implementation remains blocked until Codex approves file scope, route safety, rollback, and storage checks.",
      proposedFileScope: [
        "Future harness manifest adapter only",
        "Future fixture replay assertion map only",
        "Future standard event assertion map only",
        "Future audio cue coverage assertion map only",
        "Future mobile viewport checklist only",
        "Future deterministic scoring replay checklist only",
        "Future route safety smoke checklist only",
        "Future storage adapter checklist only",
        "Future rollback dry-run checklist only",
      ],
      implementationBoundaries: [
        "No app route implementation is proposed here.",
        "No student-facing UI implementation is proposed here.",
        "No runtime test runner is proposed here.",
        "No Playwright invocation is proposed here.",
        "No fixture, score, reward, audio, route, package, or assignment writes are proposed here.",
        "Support-language checks remain support-only and cannot unlock target-language progress.",
      ],
      requiredReviewGates: [
        "Codex patch approval decision",
        "Patch test harness plan accepted",
        "Route safety release gate accepted",
        "Rollback drill record accepted",
        "Storage contract verification accepted",
        "Reviewer identity signature gate accepted",
      ],
      dryRunOnlyChecks: [
        "Fixture replay assertion names",
        "Standard event assertion names",
        "Audio cue coverage assertion names",
        "Mobile viewport checklist names",
        "Deterministic scoring replay assertion names",
        "Route safety smoke assertion names",
        "Storage adapter checklist names",
        "Rollback dry-run checklist names",
        ...(isMiniStar ? ["Hiragana support-language assertion names"] : []),
      ],
      blockedActions: [
        "No harness implementation from this proposal",
        "No test execution",
        "No Playwright run",
        "No app file write",
        "No app patch generation",
        "No route mutation",
        "No student-facing route",
        "No scoring or reward mutation",
        "No audio manifest mutation",
        "No package promotion",
        "No assignment",
        "No support-language progress trigger",
      ],
      nextRequiredRecords: [
        "Codex patch approval decision",
        "Harness implementation file-scope review",
        "Route safety release gate",
        "Rollback drill record",
        "Storage contract verification",
      ],
    };
  });

export function filterAiPrototypePatchHarnessImplementationProposalsByTenant(
  proposals: AiPrototypePatchHarnessImplementationProposal[],
  tenantId: string,
): AiPrototypePatchHarnessImplementationProposal[] {
  return proposals.filter((proposal) => proposal.tenantId === tenantId);
}
