import { sampleTeacherDraftPackages } from "./sampleTeacherDraftPackage";
import type { TeacherDraftPackagePreview } from "./sampleTeacherDraftPackage";

export type TeacherDraftReviewQueueStatus = "handoff-preview" | "blocked" | "ready-for-verifier" | "returned";
export type TeacherDraftReviewerDecisionStatus = "preview-only" | "blocked" | "future";

export interface TeacherDraftReviewerDecisionOption {
  decisionId: string;
  label: string;
  status: TeacherDraftReviewerDecisionStatus;
  evidenceRequired: string[];
  blockedBy: string[];
  outcome: string;
}

export interface TeacherDraftReviewAuditTrailEvent {
  eventId: string;
  label: string;
  actor: string;
  previewStatus: "recorded-preview" | "blocked-preview";
  evidenceLink: string;
  blockedBy: string[];
}

export interface TeacherDraftVerifierPreflightCheck {
  checkId: string;
  label: string;
  status: "ready-preview" | "blocked-preview";
  detail: string;
}

export interface TeacherDraftReviewQueueItem {
  queueItemId: string;
  draft: TeacherDraftPackagePreview;
  status: TeacherDraftReviewQueueStatus;
  reviewerLane: string;
  packetSections: string[];
  blockedBy: string[];
  allowedActions: string[];
  notAllowedYet: string[];
  reviewerDecisionOptions: TeacherDraftReviewerDecisionOption[];
  evidencePacketPreview: string[];
  evidenceUploadBlockedBy: string[];
  auditTrailPreview: TeacherDraftReviewAuditTrailEvent[];
  auditTrailBlockedBy: string[];
  verifierPreflightChecks: TeacherDraftVerifierPreflightCheck[];
  verifierSubmissionBlockedBy: string[];
  nextStep: string;
}

export interface TeacherDraftReviewQueue {
  queueId: string;
  label: string;
  summary: string;
  items: TeacherDraftReviewQueueItem[];
  hardRules: string[];
}

const draft = sampleTeacherDraftPackages[0];

export const sampleTeacherDraftReviewQueue: TeacherDraftReviewQueue = {
  queueId: "teacher-draft-review-queue-sample-publisher",
  label: "Sample publisher draft review queue",
  summary:
    "A read-only workbench preview for draft review handoff packets. It shows how teacher drafts will reach verifier and human review later without enabling live approval, direct publish, or student assignment.",
  items: draft
    ? [
        {
          queueItemId: "queue-draft-sample-publisher-l1-u1",
          draft,
          status: "handoff-preview",
          reviewerLane: "content-and-audio-review",
          packetSections: [
            "Schema validation packet",
            "Source lineage packet",
            "Audio coverage packet",
            "Rights and version packet",
            "Route and activity packet",
            "Approval packet",
          ],
          blockedBy: [
            "Durable handoff storage required",
            "Verifier workflow required",
            "Teacher ownership required",
            "Audio regeneration required",
            "Package approval blocked",
          ],
          allowedActions: ["Preview packet", "Review blockers", "Inspect source lineage"],
          notAllowedYet: ["Submit to verifier", "Approve package", "Assign to students", "Direct AI publish"],
          reviewerDecisionOptions: [
            {
              decisionId: "return-for-edits",
              label: "Return for edits",
              status: "preview-only",
              evidenceRequired: ["Reviewer note", "Teacher owner", "Draft revision"],
              blockedBy: ["Reviewer identity required", "Draft persistence required"],
              outcome: "Draft returns to the teacher without becoming student-facing.",
            },
            {
              decisionId: "needs-audio",
              label: "Needs audio",
              status: "preview-only",
              evidenceRequired: ["Missing cue list", "Fallback voice decision", "Audio review owner"],
              blockedBy: ["Audio regeneration required", "Audio ownership policy required"],
              outcome: "Draft remains blocked until term, sentence, instruction, and fallback audio coverage is reviewed.",
            },
            {
              decisionId: "ready-for-approval",
              label: "Ready for approval",
              status: "blocked",
              evidenceRequired: ["Schema pass", "Audio pass", "Rights/version pass", "Route compatibility pass"],
              blockedBy: ["Package approval ledger required", "Release-control policy required", "Approver identity required"],
              outcome: "Future path only: creates an approval candidate, not a student assignment.",
            },
          ],
          evidencePacketPreview: [
            "Reviewer identity evidence",
            "Draft revision evidence",
            "Audio gap evidence",
            "Rights and version evidence",
            "Route compatibility evidence",
            "Release-control evidence",
          ],
          evidenceUploadBlockedBy: [
            "Evidence storage required",
            "Reviewer authentication required",
            "Approval ledger policy required",
            "No file upload in foundation preview",
          ],
          auditTrailPreview: [
            {
              eventId: "audit-handoff-packet-created",
              label: "Handoff packet created",
              actor: "Teacher owner",
              previewStatus: "recorded-preview",
              evidenceLink: "Draft review handoff packet",
              blockedBy: ["Durable audit trail storage required"],
            },
            {
              eventId: "audit-reviewer-decision-drafted",
              label: "Reviewer decision drafted",
              actor: "Content reviewer",
              previewStatus: "blocked-preview",
              evidenceLink: "Reviewer decision preview",
              blockedBy: ["Reviewer identity required", "No live state transition"],
            },
            {
              eventId: "audit-evidence-packet-blocked",
              label: "Evidence packet blocked",
              actor: "Content reviewer",
              previewStatus: "blocked-preview",
              evidenceLink: "Review evidence packet preview",
              blockedBy: ["Audit trail storage required", "Evidence storage required"],
            },
            {
              eventId: "audit-approval-ledger-blocked",
              label: "Approval ledger blocked",
              actor: "Tenant approver",
              previewStatus: "blocked-preview",
              evidenceLink: "Package approval ledger",
              blockedBy: ["Approver identity required", "Release-control policy required"],
            },
          ],
          auditTrailBlockedBy: [
            "Audit trail storage required",
            "Reviewer authentication required",
            "Approval ledger policy required",
            "No live state transition",
          ],
          verifierPreflightChecks: [
            {
              checkId: "schema-packet-ready",
              label: "Schema packet ready",
              status: "ready-preview",
              detail: "Vocabulary count, sentence count, and package shape can be preview-checked before verifier submission.",
            },
            {
              checkId: "audio-regeneration-pending",
              label: "Audio regeneration pending",
              status: "blocked-preview",
              detail: "Term, sentence, instruction, and fallback audio must be regenerated and reviewed before student-facing release.",
            },
            {
              checkId: "support-language-support-only",
              label: "Support language support-only",
              status: "ready-preview",
              detail: "Assist-language clicks can support comprehension, but English or target-language tasks remain the progression trigger.",
            },
            {
              checkId: "route-compatibility-ready",
              label: "Route compatibility ready",
              status: "ready-preview",
              detail: "Curated activity path and route targets can be checked before verifier workflow exists.",
            },
            {
              checkId: "review-evidence-pending",
              label: "Review evidence pending",
              status: "blocked-preview",
              detail: "Reviewer identity, evidence packets, audit trail, and approval ledger storage must exist before live verifier submission.",
            },
          ],
          verifierSubmissionBlockedBy: [
            "No automatic verifier submit",
            "Verifier workflow required",
            "Reviewer identity required",
            "Evidence storage required",
            "Approval ledger policy required",
          ],
          nextStep:
            "Connect this queue to persisted teacher draft review handoff records after authentication, verifier workflow, and package approval policy exist.",
        },
      ]
    : [],
  hardRules: [
    "Verifier submission blocked until handoff packets are durable.",
    "Package approval blocked until evidence, approver identity, and release-control policy exist.",
    "Student assignment blocked until a reviewed package release is created.",
    "Review audit trail preview cannot change package state.",
    "No direct AI publish from teacher drafts or review queue items.",
  ],
};
