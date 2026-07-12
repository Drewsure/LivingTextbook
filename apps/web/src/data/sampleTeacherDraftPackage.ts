import type { GameModeId } from "@living-textbook/content-model";
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
];

export function findSampleTeacherDraftPackage(draftId: string): TeacherDraftPackagePreview | undefined {
  return sampleTeacherDraftPackages.find((draft) => draft.draftId === draftId);
}
