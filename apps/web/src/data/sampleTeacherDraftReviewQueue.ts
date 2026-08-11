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
const aiGeneratedDraft = sampleTeacherDraftPackages.find(
  (teacherDraft) => teacherDraft.draftId === "ai-draft-sample-publisher-l1-routines-v1",
);
const ministarAiGeneratedDraft = sampleTeacherDraftPackages.find(
  (teacherDraft) => teacherDraft.draftId === "ai-draft-ministar-l1-greetings-v1",
);

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
        ...(aiGeneratedDraft
          ? [
              {
                queueItemId: "queue-ai-draft-sample-publisher-l1-routines-v1",
                draft: aiGeneratedDraft,
                status: "blocked" as const,
                reviewerLane: "ai-draft-verifier-review",
                packetSections: [
                  "AI verifier submission packet",
                  "Schema validation packet",
                  "Pedagogical lock packet",
                  "Audio coverage packet",
                  "Engine binding packet",
                  "Gamification mapping packet",
                  "Activity compatibility snapshot",
                  "Media rights manifest",
                  "Teacher approval packet",
                ],
                blockedBy: [
                  "AI verifier submission packet required",
                  "Durable verifier storage required",
                  "Reviewer identity required",
                  "Audio cue approval required",
                  "Media rights proof required",
                  "Approval ledger binding required",
                  "Package writer harness implementation decision required",
                ],
                allowedActions: [
                  "Preview AI draft package",
                  "Inspect AI verifier packet",
                  "Review blocked actions",
                  "Compare with source evidence",
                ],
                notAllowedYet: [
                  "Submit AI draft to verifier",
                  "Approve generated package",
                  "Create route from AI draft",
                  "Create playlist from AI draft",
                  "Assign generated draft to students",
                  "Mark generated package student-ready",
                  "Approve package writer harness implementation",
                ],
                reviewerDecisionOptions: [
                  {
                    decisionId: "return-ai-draft-for-edits",
                    label: "Return AI draft for edits",
                    status: "preview-only" as const,
                    evidenceRequired: ["Reviewer note", "Prompt package version", "Source evidence packet"],
                    blockedBy: ["Reviewer identity required", "Draft persistence required"],
                    outcome: "Generated draft returns to teacher review without becoming student-facing.",
                  },
                  {
                    decisionId: "ai-draft-needs-audio",
                    label: "AI draft needs audio",
                    status: "preview-only" as const,
                    evidenceRequired: ["Missing cue list", "Voice policy decision", "Audio approval owner"],
                    blockedBy: ["Audio cue approval required", "No API voice cost approval"],
                    outcome:
                      "Generated draft remains blocked until target-language term, sentence, instruction, feedback, and control audio is reviewed.",
                  },
                  {
                    decisionId: "reject-ai-draft",
                    label: "Reject AI draft",
                    status: "preview-only" as const,
                    evidenceRequired: ["Reason code", "Source mismatch note", "Reviewer identity"],
                    blockedBy: ["Reviewer identity required", "Review audit storage required"],
                    outcome: "Generated draft is marked unsuitable in a future audit trail without changing package release state.",
                  },
                  {
                    decisionId: "ai-draft-ready-for-approval",
                    label: "AI draft ready for approval",
                    status: "blocked" as const,
                    evidenceRequired: [
                      "Verifier pass",
                      "Target audio pass",
                      "Media rights pass",
                      "Engine binding pass",
                      "Gamification mapping pass",
                    ],
                    blockedBy: [
                      "Package approval ledger required",
                      "Release-control policy required",
                      "Approver identity required",
                      "Package writer harness implementation decision required",
                    ],
                    outcome: "Future path only: creates an approval candidate, not a route, playlist, or student assignment.",
                  },
                ],
                evidencePacketPreview: [
                  "AI prompt package version evidence",
                  "AI draft JSON snapshot",
                  "AI verifier submission packet evidence",
                  "Audio coverage evidence",
                  "Media rights manifest evidence",
                  "Teacher approval evidence",
                  "Package writer harness decision evidence",
                ],
                evidenceUploadBlockedBy: [
                  "Evidence storage required",
                  "Reviewer authentication required",
                  "AI prompt package persistence required",
                  "Approval ledger policy required",
                  "No file upload in foundation preview",
                ],
                auditTrailPreview: [
                  {
                    eventId: "audit-ai-draft-queued",
                    label: "AI draft queued for review",
                    actor: "Teacher owner",
                    previewStatus: "recorded-preview" as const,
                    evidenceLink: "AI draft payload preview",
                    blockedBy: ["Durable audit trail storage required"],
                  },
                  {
                    eventId: "audit-ai-verifier-packet-reviewed",
                    label: "AI verifier packet reviewed",
                    actor: "Content reviewer",
                    previewStatus: "blocked-preview" as const,
                    evidenceLink: "AI verifier submission packet",
                    blockedBy: ["Reviewer identity required", "No live verifier workflow"],
                  },
                  {
                    eventId: "audit-ai-draft-returned",
                    label: "AI draft returned or rejected",
                    actor: "Content reviewer",
                    previewStatus: "blocked-preview" as const,
                    evidenceLink: "Reviewer decision preview",
                    blockedBy: ["Review audit storage required", "No live state transition"],
                  },
                ],
                auditTrailBlockedBy: [
                  "Audit trail storage required",
                  "Reviewer authentication required",
                  "AI verifier workflow required",
                  "Approval ledger policy required",
                  "No live state transition",
                ],
                verifierPreflightChecks: [
                  {
                    checkId: "ai-schema-packet-ready",
                    label: "AI schema packet ready",
                    status: "ready-preview" as const,
                    detail: "Generated payload keeps 8 vocabulary terms, exactly 2 target sentences, and JSON-first shape.",
                  },
                  {
                    checkId: "ai-pedagogical-lock-ready",
                    label: "AI pedagogical lock ready",
                    status: "ready-preview" as const,
                    detail: "Level 1 routines content is bounded to the reviewed 8-term unit payload.",
                  },
                  {
                    checkId: "ai-audio-coverage-pending",
                    label: "AI audio coverage pending",
                    status: "blocked-preview" as const,
                    detail: "Target-language learner text still needs approved audio cues before student use.",
                  },
                  {
                    checkId: "ai-engine-binding-ready",
                    label: "AI engine binding ready",
                    status: "ready-preview" as const,
                    detail: "Generated pathway binds to flashcards, memory match, sentence builder, and quiz parent engines.",
                  },
                  {
                    checkId: "ai-gamification-mapping-ready",
                    label: "AI gamification mapping ready",
                    status: "ready-preview" as const,
                    detail: "Star Dust and collection unlocks remain deterministic and mastery-based.",
                  },
                  {
                    checkId: "ai-media-rights-pending",
                    label: "AI media rights pending",
                    status: "blocked-preview" as const,
                    detail: "Partner audio, video, image, playlist, and background media rights evidence is not attached.",
                  },
                  {
                    checkId: "ai-teacher-approval-missing",
                    label: "AI teacher approval missing",
                    status: "blocked-preview" as const,
                    detail: "No reviewer identity, teacher approval packet, or release-control binding exists yet.",
                  },
                  {
                    checkId: "ai-package-writer-gate-pending",
                    label: "AI package writer gate pending",
                    status: "blocked-preview" as const,
                    detail:
                      "Package writer harness implementation decision records must exist before generated routes, playlists, local bundles, or assignment shells can be written.",
                  },
                ],
                verifierSubmissionBlockedBy: [
                  "No live AI verifier workflow",
                  "AI verifier packet not durable",
                  "Reviewer identity required",
                  "Evidence storage required",
                  "Audio cue approval required",
                  "Approval ledger policy required",
                  "Package writer harness decision required before route or playlist writes",
                ],
                nextStep:
                  "Persist AI draft queue items, verifier packets, and package writer harness implementation decision records before allowing any generated package review submission, approval, route creation, playlist creation, or assignment.",
              },
            ]
          : []),
        ...(ministarAiGeneratedDraft
          ? [
              {
                queueItemId: "queue-ai-draft-ministar-l1-greetings-v1",
                draft: ministarAiGeneratedDraft,
                status: "blocked" as const,
                reviewerLane: "ministar-ai-draft-verifier-review",
                packetSections: [
                  "MiniStar AI verifier submission packet",
                  "Schema validation packet",
                  "Pedagogical lock packet",
                  "Audio coverage packet",
                  "Engine binding packet",
                  "Gamification mapping packet",
                  "Activity compatibility snapshot",
                  "Media rights manifest",
                  "Teacher approval packet",
                ],
                blockedBy: [
                  "MiniStar AI verifier submission packet required",
                  "Durable verifier storage required",
                  "Reviewer identity required",
                  "English audio cue approval required",
                  "MiniStar media rights proof required",
                  "Approval ledger binding required",
                  "MiniStar package writer harness implementation decision required",
                ],
                allowedActions: [
                  "Preview MiniStar AI draft package",
                  "Inspect MiniStar AI verifier packet",
                  "Review MiniStar blocked actions",
                  "Compare with MiniStar source evidence",
                ],
                notAllowedYet: [
                  "Submit MiniStar AI draft to verifier",
                  "Approve MiniStar generated package",
                  "Create route from MiniStar AI draft",
                  "Create playlist from MiniStar AI draft",
                  "Assign MiniStar generated draft to students",
                  "Mark MiniStar generated package student-ready",
                  "Approve MiniStar package writer harness implementation",
                ],
                reviewerDecisionOptions: [
                  {
                    decisionId: "return-ministar-ai-draft-for-edits",
                    label: "Return MiniStar AI draft for edits",
                    status: "preview-only" as const,
                    evidenceRequired: ["Reviewer note", "MiniStar prompt package version", "MiniStar source evidence packet"],
                    blockedBy: ["Reviewer identity required", "Draft persistence required"],
                    outcome: "MiniStar generated draft returns to teacher review without becoming student-facing.",
                  },
                  {
                    decisionId: "ministar-ai-draft-needs-audio",
                    label: "MiniStar AI draft needs audio",
                    status: "preview-only" as const,
                    evidenceRequired: ["Missing English cue list", "Voice policy decision", "Audio approval owner"],
                    blockedBy: ["English audio cue approval required", "No API voice cost approval"],
                    outcome:
                      "MiniStar generated draft remains blocked until English term, sentence, instruction, feedback, and control audio is reviewed.",
                  },
                  {
                    decisionId: "reject-ministar-ai-draft",
                    label: "Reject MiniStar AI draft",
                    status: "preview-only" as const,
                    evidenceRequired: ["Reason code", "MiniStar source mismatch note", "Reviewer identity"],
                    blockedBy: ["Reviewer identity required", "Review audit storage required"],
                    outcome: "MiniStar generated draft is marked unsuitable in a future audit trail without changing package release state.",
                  },
                  {
                    decisionId: "ministar-ai-draft-ready-for-approval",
                    label: "MiniStar AI draft ready for approval",
                    status: "blocked" as const,
                    evidenceRequired: [
                      "Verifier pass",
                      "English target audio pass",
                      "MiniStar media rights pass",
                      "Engine binding pass",
                      "Gamification mapping pass",
                    ],
                    blockedBy: [
                      "Package approval ledger required",
                      "Release-control policy required",
                      "Approver identity required",
                      "MiniStar package writer harness implementation decision required",
                    ],
                    outcome: "Future path only: creates an approval candidate, not a route, playlist, or student assignment.",
                  },
                ],
                evidencePacketPreview: [
                  "MiniStar prompt package version evidence",
                  "MiniStar draft JSON snapshot",
                  "MiniStar AI verifier submission packet evidence",
                  "English audio coverage evidence",
                  "MiniStar media rights manifest evidence",
                  "MiniStar teacher approval evidence",
                  "MiniStar package writer harness decision evidence",
                ],
                evidenceUploadBlockedBy: [
                  "Evidence storage required",
                  "Reviewer authentication required",
                  "MiniStar prompt package persistence required",
                  "Approval ledger policy required",
                  "No file upload in foundation preview",
                ],
                auditTrailPreview: [
                  {
                    eventId: "audit-ministar-ai-draft-queued",
                    label: "MiniStar AI draft queued for review",
                    actor: "Teacher owner",
                    previewStatus: "recorded-preview" as const,
                    evidenceLink: "MiniStar AI draft payload preview",
                    blockedBy: ["Durable audit trail storage required"],
                  },
                  {
                    eventId: "audit-ministar-ai-verifier-packet-reviewed",
                    label: "MiniStar AI verifier packet reviewed",
                    actor: "Content reviewer",
                    previewStatus: "blocked-preview" as const,
                    evidenceLink: "MiniStar AI verifier submission packet",
                    blockedBy: ["Reviewer identity required", "No live AI verifier workflow"],
                  },
                  {
                    eventId: "audit-ministar-ai-draft-returned",
                    label: "MiniStar AI draft returned or rejected",
                    actor: "Content reviewer",
                    previewStatus: "blocked-preview" as const,
                    evidenceLink: "Reviewer decision preview",
                    blockedBy: ["Review audit storage required", "No live state transition"],
                  },
                ],
                auditTrailBlockedBy: [
                  "Audit trail storage required",
                  "Reviewer authentication required",
                  "AI verifier workflow required",
                  "Approval ledger policy required",
                  "No live state transition",
                ],
                verifierPreflightChecks: [
                  {
                    checkId: "ministar-ai-schema-packet-ready",
                    label: "MiniStar AI schema packet ready",
                    status: "ready-preview" as const,
                    detail: "Generated payload keeps 8 vocabulary terms, exactly 2 target sentences, and JSON-first shape.",
                  },
                  {
                    checkId: "ministar-ai-pedagogical-lock-ready",
                    label: "MiniStar AI pedagogical lock ready",
                    status: "ready-preview" as const,
                    detail: "Level 1 greetings content is bounded to the reviewed 8-term unit payload.",
                  },
                  {
                    checkId: "ministar-ai-support-language-ready",
                    label: "MiniStar AI support language ready",
                    status: "ready-preview" as const,
                    detail: "Japanese support is hiragana-only and support-only; it cannot unlock progress.",
                  },
                  {
                    checkId: "ministar-ai-audio-coverage-pending",
                    label: "MiniStar AI audio coverage pending",
                    status: "blocked-preview" as const,
                    detail: "English learner text still needs approved audio cues before student use.",
                  },
                  {
                    checkId: "ministar-ai-engine-binding-ready",
                    label: "MiniStar AI engine binding ready",
                    status: "ready-preview" as const,
                    detail: "Generated pathway binds to flashcards, memory match, and Speak It parent engines.",
                  },
                  {
                    checkId: "ministar-ai-gamification-mapping-ready",
                    label: "MiniStar AI gamification mapping ready",
                    status: "ready-preview" as const,
                    detail: "Star Dust and collection unlocks remain deterministic and mastery-based.",
                  },
                  {
                    checkId: "ministar-ai-media-rights-pending",
                    label: "MiniStar AI media rights pending",
                    status: "blocked-preview" as const,
                    detail: "MiniStar audio, video, image, playlist, and background media rights evidence is not attached.",
                  },
                  {
                    checkId: "ministar-ai-teacher-approval-missing",
                    label: "MiniStar AI teacher approval missing",
                    status: "blocked-preview" as const,
                    detail: "No reviewer identity, teacher approval packet, or release-control binding exists yet.",
                  },
                  {
                    checkId: "ministar-ai-package-writer-gate-pending",
                    label: "MiniStar AI package writer gate pending",
                    status: "blocked-preview" as const,
                    detail:
                      "MiniStar package writer harness implementation decision records must exist before generated routes, playlists, local bundles, or assignment shells can be written. English remains the target-language trigger; Japanese support cannot approve the writer gate.",
                  },
                ],
                verifierSubmissionBlockedBy: [
                  "No live AI verifier workflow",
                  "MiniStar AI verifier packet not durable",
                  "Reviewer identity required",
                  "Evidence storage required",
                  "English audio cue approval required",
                  "Approval ledger policy required",
                  "MiniStar package writer harness decision required before route or playlist writes",
                ],
                nextStep:
                  "Persist MiniStar AI draft queue items, verifier packets, and package writer harness implementation decision records before allowing any generated package review submission, approval, route creation, playlist creation, or assignment.",
              },
            ]
          : []),
      ]
    : [],
  hardRules: [
    "Verifier submission blocked until handoff packets are durable.",
    "Package approval blocked until evidence, approver identity, and release-control policy exist.",
    "Student assignment blocked until a reviewed package release is created.",
    "AI-generated drafts enter the same review queue as teacher drafts and stay read-only until verifier and approval records exist.",
    "AI-generated package approval cannot bypass package writer harness implementation decision records.",
    "Review audit trail preview cannot change package state.",
    "No direct AI publish from teacher drafts or review queue items.",
  ],
};
