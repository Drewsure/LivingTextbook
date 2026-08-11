import {
  sampleAiGeneratedPackageWriterTestHarnessImplementationProposals,
  type AiGeneratedPackageWriterTestHarnessImplementationProposal,
} from "@/data/sampleAiGeneratedPackageWriterTestHarnessImplementationProposal";
import {
  getAiGeneratedPackageWriterHarnessImplementationDecisionCollectionWarnings,
  validateAiGeneratedPackageWriterHarnessImplementationDecisions,
  type AiGeneratedPackageWriterHarnessDecisionOption,
  type AiGeneratedPackageWriterHarnessImplementationDecision,
  type AiGeneratedPackageWriterHarnessImplementationDecisionStatus,
} from "@living-textbook/content-model/src/aiPackageWriterHarnessImplementationDecision";

export type {
  AiGeneratedPackageWriterHarnessDecisionOption,
  AiGeneratedPackageWriterHarnessImplementationDecision,
  AiGeneratedPackageWriterHarnessImplementationDecisionStatus,
};

export const sampleAiGeneratedPackageWriterHarnessImplementationDecisions:
  AiGeneratedPackageWriterHarnessImplementationDecision[] =
  sampleAiGeneratedPackageWriterTestHarnessImplementationProposals.map((proposal) =>
    createHarnessImplementationDecision(proposal),
  );

export const sampleAiGeneratedPackageWriterHarnessImplementationDecisionErrors =
  validateAiGeneratedPackageWriterHarnessImplementationDecisions(
    sampleAiGeneratedPackageWriterHarnessImplementationDecisions,
  );

export const sampleAiGeneratedPackageWriterHarnessImplementationDecisionWarnings =
  getAiGeneratedPackageWriterHarnessImplementationDecisionCollectionWarnings(
    sampleAiGeneratedPackageWriterHarnessImplementationDecisions,
  );

export function filterAiGeneratedPackageWriterHarnessImplementationDecisionsByTenant(
  decisions: AiGeneratedPackageWriterHarnessImplementationDecision[],
  tenantId: string,
): AiGeneratedPackageWriterHarnessImplementationDecision[] {
  return decisions.filter((decision) => decision.tenantId === tenantId);
}

function createHarnessImplementationDecision(
  proposal: AiGeneratedPackageWriterTestHarnessImplementationProposal,
): AiGeneratedPackageWriterHarnessImplementationDecision {
  const isMiniStar = proposal.tenantId === "ministar";

  return {
    decisionId: `ai-generated-package-writer-harness-implementation-decision-${proposal.requestId}`,
    tenantId: proposal.tenantId,
    requestId: proposal.requestId,
    proposalId: proposal.proposalId,
    harnessPlanId: proposal.harnessPlanId,
    label: isMiniStar
      ? "MiniStar package writer harness implementation decision"
      : "AI package writer harness implementation decision",
    status: "blocked",
    summary: isMiniStar
      ? "No Codex decision has approved harness code. MiniStar still requires route, playlist, local bundle, assignment, rollback, storage, English target-language, and hiragana support-only checks before any implementation can be considered."
      : "No Codex decision has approved harness code. The package writer harness remains a review-only decision preview until route, playlist, local bundle, assignment, rollback, storage, and target-language checks are accepted.",
    decisionState: "No decision recorded",
    requiredEvidence: [
      proposal.harnessPlanId,
      proposal.evidencePacketId,
      "Package writer test harness implementation proposal reviewed",
      "Route and playlist write guard review",
      "Local companion package guard review",
      "Assignment shell guard review",
      "Rollback guard review",
      "Backend storage readiness verification",
      ...(isMiniStar ? ["Hiragana support-only assertions remain required"] : []),
    ],
    fileScopeRules: [
      "Decision may approve future dry-run harness files only.",
      "Decision cannot approve package writer implementation.",
      "Decision cannot approve package JSON, route registry, playlist, local bundle, or assignment writers.",
      "Decision cannot approve mutation browser tests or evidence upload.",
      "Decision cannot bypass release-control, signed approval, or school policy gates.",
    ],
    decisionOptions: [
      {
        optionId: "return-for-more-evidence",
        label: "Return for more evidence",
        effect: "Keep proposal blocked and request clearer fixture, route, media, local, assignment, rollback, or support-language evidence.",
        requiredBeforeSelection: ["Reviewer identity", "Missing evidence list"],
        blockedActions: ["No harness implementation approval", "No automated writer test execution"],
      },
      {
        optionId: "reject-harness-scope",
        label: "Reject harness scope",
        effect: "Reject the current file scope and require a smaller implementation proposal.",
        requiredBeforeSelection: ["Codex architecture reason", "Replacement scope note"],
        blockedActions: ["No package writer harness code", "No app file patch"],
      },
      {
        optionId: "approve-dry-run-harness-scope-only",
        label: "Approve dry-run harness scope only",
        effect: "Would allow a future scoped harness implementation decision, but still not writer execution, route writes, playlists, local bundles, assignments, or live evidence upload.",
        requiredBeforeSelection: ["Signed approval preflight", "Release-control binding", "Rollback guard", "Storage verification"],
        blockedActions: ["No package writer execution", "No route registry write", "No media playlist write"],
      },
    ],
    blockedActions: [
      "No harness implementation approval",
      "No package writer harness code",
      "No automated writer test execution",
      "No writer mutation browser run",
      "No evidence upload",
      "No signed approval capture",
      "No app file patch",
      "No generated package JSON write",
      "No route registry write",
      "No media playlist write",
      "No local bundle packaging",
      "No assignment activation",
      "No production QR redirect mutation",
      "No support-language-only implementation decision",
    ],
    nextRequiredRecords: [
      "Harness implementation decision storage contract",
      "Reviewer identity signature gate",
      "Route and playlist write guard review",
      "Local companion package guard review",
      "Assignment shell guard review",
      "Rollback guard review",
      "Signed approval preflight",
    ],
    supportLanguageBoundary: proposal.supportLanguageBoundary,
  };
}
