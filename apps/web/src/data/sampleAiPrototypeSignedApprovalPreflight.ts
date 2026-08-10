import { sampleAiPrototypeCodexPatchApprovalDecisions } from "@/data/sampleAiPrototypeCodexPatchApprovalDecision";

export type AiPrototypeSignedApprovalPreflightStatus =
  | "blocked"
  | "review-only"
  | "ready-for-signature-policy-review";

export interface AiPrototypeSignedApprovalPreflight {
  preflightId: string;
  tenantId: string;
  requestId: string;
  decisionId: string;
  label: string;
  status: AiPrototypeSignedApprovalPreflightStatus;
  summary: string;
  requiredIdentityLanes: string[];
  scopeLocks: string[];
  approvalRecordDraftFields: string[];
  evidenceChecklist: string[];
  cannotApproveWhile: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const sampleAiPrototypeSignedApprovalPreflights: AiPrototypeSignedApprovalPreflight[] =
  sampleAiPrototypeCodexPatchApprovalDecisions.map((decision) => {
    const isMiniStar = decision.tenantId === "ministar";

    return {
      preflightId: `ai-prototype-signed-approval-preflight-${decision.requestId}`,
      tenantId: decision.tenantId,
      requestId: decision.requestId,
      decisionId: decision.decisionId,
      label: isMiniStar
        ? "MiniStar signed approval preflight"
        : "Signed approval preflight",
      status: "blocked",
      summary: isMiniStar
        ? "MiniStar signed approval remains blocked until reviewer identity, approval scope, evidence, rollback, route safety, storage, and hiragana support-only boundaries are accepted."
        : "Signed approval remains blocked until reviewer identity, approval scope, evidence, rollback, route safety, storage, and white-label boundaries are accepted.",
      requiredIdentityLanes: [
        "Authenticated reviewer identity",
        "Tenant role binding",
        "Codex reviewer acknowledgement",
        "School or publisher approval policy",
        "Timestamped approval intent",
      ],
      scopeLocks: [
        "Patch scope must match Codex decision",
        "Route scope must match route safety release gate",
        "Rollback scope must match rollback drill record",
        "Storage scope must match hosted/local storage contract",
        "Student-facing route scope remains blocked",
        "Support-language evidence is support-only",
      ],
      approvalRecordDraftFields: [
        "signed_approval_preflight_id",
        "tenant_id",
        "request_id",
        "codex_patch_approval_decision_id",
        "reviewer_identity_id",
        "reviewer_role",
        "approval_scope",
        "approval_intent_text",
        "evidence_packet_ids",
        "route_safety_release_gate_id",
        "rollback_drill_record_id",
        "storage_contract_verification_id",
        "support_language_progress_allowed",
        "student_facing_route_allowed",
        "timestamp",
      ],
      evidenceChecklist: [
        "Approval cannot bypass evidence",
        "Patch file scope reviewed",
        "Patch test readiness reviewed",
        "Harness plan and implementation proposal reviewed",
        "Route safety gate reviewed",
        "Rollback drill reviewed",
        "Storage contract verified",
        "Reviewer identity signature gate reviewed",
        ...(isMiniStar ? ["Foundation Japanese support remains hiragana-only"] : []),
      ],
      cannotApproveWhile: [
        "Codex patch approval is unrecorded",
        "Reviewer identity is missing",
        "Signed approval policy is missing",
        "Route safety release gate is blocked",
        "Rollback drill record is blocked",
        "Storage contract verification is blocked",
        "Evidence attachments are unavailable",
        "Support-language progress trigger is possible",
      ],
      blockedActions: [
        "No signed approval capture",
        "No approve button",
        "No app patch generation",
        "No app file write",
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
        "Signed approval preflight storage contract",
        "Reviewer identity signature gate",
        "Evidence attachment storage",
        "Route safety release gate",
        "Rollback drill record",
        "Storage contract verification",
      ],
    };
  });

export function filterAiPrototypeSignedApprovalPreflightsByTenant(
  preflights: AiPrototypeSignedApprovalPreflight[],
  tenantId: string,
): AiPrototypeSignedApprovalPreflight[] {
  return preflights.filter((preflight) => preflight.tenantId === tenantId);
}
