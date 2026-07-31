import type { GameModeId } from "@living-textbook/content-model";
import { sampleAiGeneratedDraftPayloadPreviews } from "./sampleAiGeneratedDraftPayloadPreview";
import { samplePartnerContentPackage } from "./samplePartnerPackage";

export type TeacherDraftPackageStatus = "teacher-only-draft" | "submitted-for-review" | "student-ready";
export type TeacherDraftGateStatus = "pass" | "blocked" | "review-required";

export interface TeacherDraftGate {
  gateId: string;
  label: string;
  status: TeacherDraftGateStatus;
  evidence: string;
  nextStep: string;
}

export interface TeacherDraftPackagePreview {
  draftId: string;
  tenantId: string;
  sourcePackageId: string;
  unitKey: string;
  label: string;
  status: TeacherDraftPackageStatus;
  canAssignToStudents: boolean;
  sourceLineage: string[];
  vocabularyDraft: string[];
  targetSentenceDrafts: [string, string];
  requestedActivityPath: GameModeId[];
  audioPlanSummary: string;
  allowedActions: string[];
  blockedActions: string[];
  reviewGates: TeacherDraftGate[];
}

const partnerUnit = samplePartnerContentPackage.units[0];
const aiDraftPreview = sampleAiGeneratedDraftPayloadPreviews[0];
const ministarAiDraftPreview = sampleAiGeneratedDraftPayloadPreviews.find(
  (preview) => preview.previewId === "ai-draft-preview-ministar-l1-greetings-v1",
);

export const sampleTeacherDraftPackages: TeacherDraftPackagePreview[] = [
  {
    draftId: "draft-sample-publisher-l1-u1",
    tenantId: "sample-publisher",
    sourcePackageId: samplePartnerContentPackage.meta.packageId,
    unitKey: partnerUnit ? `${partnerUnit.unitMeta.tenantId}:${partnerUnit.unitMeta.curriculumId}:L${partnerUnit.unitMeta.level}:U${partnerUnit.unitMeta.unit}` : "sample-publisher:partner-textbook-companion:L1:U1",
    label: "Daily routines draft preview",
    status: "teacher-only-draft",
    canAssignToStudents: false,
    sourceLineage: [
      "Copied from reviewed sample publisher package.",
      "Teacher edits are private until submitted.",
      "Original reviewed package cannot be overwritten by this draft.",
    ],
    vocabularyDraft: partnerUnit?.pedagogicalPayload.vocabularyTerms ?? [],
    targetSentenceDrafts: partnerUnit?.pedagogicalPayload.targetSentences ?? ["I wake up.", "I go to bed."],
    requestedActivityPath: ["flashcards", "memory-match", "quiz", "sentence-builder"],
    audioPlanSummary:
      "Audio coverage must be regenerated or confirmed for every edited term, sentence, instruction, and selected game mode before assignment.",
    allowedActions: ["Preview teacher-only draft", "Edit draft vocabulary", "Edit teacher notes", "Submit for verifier review"],
    blockedActions: ["Assign directly to students", "Publish publicly", "Overwrite reviewed source package", "Skip audio support"],
    reviewGates: [
      {
        gateId: "draft-schema-check",
        label: "Schema check",
        status: "pass",
        evidence: "Draft keeps 8 vocabulary terms and exactly 2 target sentence structures.",
        nextStep: "Run package verifier when edits are saved to persistence.",
      },
      {
        gateId: "audio-before-students",
        label: "Audio before students",
        status: "review-required",
        evidence: "Existing sample audio coverage is visible, but edited terms would require new reviewed cues.",
        nextStep: "Regenerate or attach reviewed audio cues before student assignment.",
      },
      {
        gateId: "review-before-assignment",
        label: "Review before assignment",
        status: "blocked",
        evidence: "Teacher-only draft has not passed verifier review, tenant approval, rights/version audit, or assignment rollout.",
        nextStep: "Submit draft to the AI authoring/verifier handoff and package approval workflow.",
      },
      {
        gateId: "private-library-lineage",
        label: "Private library lineage",
        status: "review-required",
        evidence: "Draft records source package lineage but does not yet have durable teacher ownership storage.",
        nextStep: "Persist owner, source package, copied-from version, and visibility before live authoring.",
      },
    ],
  },
  {
    draftId: "ai-draft-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    sourcePackageId: aiDraftPreview?.previewId ?? "ai-draft-preview-sample-publisher-l1-routines-v1",
    unitKey: "sample-publisher:partner-textbook-companion:L1:U1",
    label: "AI-generated daily routines draft preview",
    status: "teacher-only-draft",
    canAssignToStudents: false,
    sourceLineage: [
      "Created from AI generator draft preview, not from a published package.",
      "Requires AI verifier submission packet before teacher approval.",
      "Generated content cannot create routes, playlists, assignments, or local bundles.",
      "Original textbook/source package remains authoritative until human review.",
    ],
    vocabularyDraft: ["wake up", "wash", "eat", "drink", "brush", "pack", "walk", "sleep"],
    targetSentenceDrafts: ["I wake up in the morning.", "I brush my teeth, please."],
    requestedActivityPath: ["flashcards", "memory-match", "sentence-builder", "quiz"],
    audioPlanSummary:
      "AI-generated text still needs reviewed target-language term, sentence, instruction, feedback, and control audio before it can enter student use.",
    allowedActions: ["Preview AI draft package", "Inspect verifier packet blockers", "Compare with source evidence"],
    blockedActions: [
      "Assign generated draft to students",
      "Approve generated package",
      "Submit to live verifier",
      "Create route from AI draft",
      "Create playlist from AI draft",
      "Skip media rights proof",
    ],
    reviewGates: [
      {
        gateId: "ai-source-lineage",
        label: "AI source lineage",
        status: "review-required",
        evidence: "AI draft references the generator preview and must be tied to reviewed source evidence before approval.",
        nextStep: "Persist source evidence packet ids and prompt package version before review workflow activation.",
      },
      {
        gateId: "ai-verifier-packet-required",
        label: "AI verifier packet required",
        status: "blocked",
        evidence: "Verifier submission packet is visible, but no durable verifier workflow exists.",
        nextStep: "Create durable verifier submission records before any generated package can be submitted.",
      },
      {
        gateId: "ai-audio-before-students",
        label: "AI audio before students",
        status: "blocked",
        evidence: "Target-language audio cues are required-not-approved.",
        nextStep: "Attach or generate approved learner audio under tenant cost and review policy.",
      },
      {
        gateId: "ai-media-rights-manifest",
        label: "AI media rights manifest",
        status: "blocked",
        evidence: "Generated draft cannot prove partner audio/video/image rights from the preview alone.",
        nextStep: "Attach media rights evidence before playlist, background media, or printable image use.",
      },
      {
        gateId: "ai-teacher-approval-ledger",
        label: "AI teacher approval ledger",
        status: "blocked",
        evidence: "No reviewer identity, approval ledger, or release-control binding exists.",
        nextStep: "Keep package in review queue until approval and release-control records are implemented.",
      },
    ],
  },
  {
    draftId: "ai-draft-ministar-l1-greetings-v1",
    tenantId: "ministar",
    sourcePackageId: ministarAiDraftPreview?.previewId ?? "ai-draft-preview-ministar-l1-greetings-v1",
    unitKey: "ministar:ministar-english:L1:U1",
    label: "AI-generated MiniStar greetings draft preview",
    status: "teacher-only-draft",
    canAssignToStudents: false,
    sourceLineage: [
      "Created from the MiniStar AI generator draft preview, not from a published package.",
      "Requires MiniStar AI verifier submission packet before teacher approval.",
      "Generated MiniStar content cannot create routes, playlists, assignments, or local bundles.",
      "English target-language tasks remain authoritative for progress.",
      "Japanese support remains hiragana-only and support-only.",
    ],
    vocabularyDraft: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please", "thank you"],
    targetSentenceDrafts: ["Hello, teacher.", "Thank you, friend."],
    requestedActivityPath: ["flashcards", "memory-match", "speak-it"],
    audioPlanSummary:
      "MiniStar AI-generated learner text still needs reviewed English term, sentence, instruction, feedback, and control audio before it can enter student use.",
    allowedActions: ["Preview MiniStar AI draft package", "Inspect MiniStar verifier packet blockers", "Compare with MiniStar source evidence"],
    blockedActions: [
      "Assign MiniStar generated draft to students",
      "Approve MiniStar generated package",
      "Submit MiniStar draft to live verifier",
      "Create route from MiniStar AI draft",
      "Create playlist from MiniStar AI draft",
      "Use Japanese support to unlock progress",
      "Skip MiniStar media rights proof",
    ],
    reviewGates: [
      {
        gateId: "ministar-ai-source-lineage",
        label: "MiniStar AI source lineage",
        status: "review-required",
        evidence: "MiniStar AI draft references the generator preview and must be tied to reviewed source evidence before approval.",
        nextStep: "Persist MiniStar source evidence packet ids and prompt package version before review workflow activation.",
      },
      {
        gateId: "ministar-ai-verifier-packet-required",
        label: "MiniStar AI verifier packet required",
        status: "blocked",
        evidence: "MiniStar verifier submission packet is visible, but no durable verifier workflow exists.",
        nextStep: "Create durable verifier submission records before any MiniStar generated package can be submitted.",
      },
      {
        gateId: "ministar-ai-audio-before-students",
        label: "MiniStar AI audio before students",
        status: "blocked",
        evidence: "English target-language audio cues are required-not-approved.",
        nextStep: "Attach or generate approved learner audio under MiniStar cost and review policy.",
      },
      {
        gateId: "ministar-ai-media-rights-manifest",
        label: "MiniStar AI media rights manifest",
        status: "blocked",
        evidence: "Generated draft cannot prove MiniStar audio/video/image rights from the preview alone.",
        nextStep: "Attach media rights evidence before playlist, background media, or printable image use.",
      },
      {
        gateId: "ministar-ai-teacher-approval-ledger",
        label: "MiniStar AI teacher approval ledger",
        status: "blocked",
        evidence: "No reviewer identity, approval ledger, or release-control binding exists.",
        nextStep: "Keep MiniStar package in review queue until approval and release-control records are implemented.",
      },
    ],
  },
];

export function findSampleTeacherDraftPackage(draftId: string): TeacherDraftPackagePreview | undefined {
  return sampleTeacherDraftPackages.find((draft) => draft.draftId === draftId);
}
