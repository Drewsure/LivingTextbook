import type { GameModeId } from "@living-textbook/content-model";

export interface MinistarUnitAuthoringProposal {
  proposalId: string;
  sourceReviewId: string;
  tenantId: "ministar";
  unitKey: string;
  title: string;
  status: "proposed-review-only";
  sourceTerms: string[];
  targetSentenceDrafts: [string, string];
  sentenceProvenance: string;
  requestedActivityPath: GameModeId[];
  reviewGates: {
    gateId: string;
    label: string;
    status: "pass" | "blocked" | "review-required";
    evidence: string;
    nextStep: string;
  }[];
  blockers: string[];
  canAssignToStudents: false;
  canCreateReleasePackage: false;
  canPrintQrCodes: false;
}

export const sampleMinistarUnitAuthoringProposal: MinistarUnitAuthoringProposal = {
  proposalId: "proposal-ministar-l1-u1-genki-disco-sentences-v1",
  sourceReviewId: "review-ministar-source-derived-l1-u1-genki-disco-v1",
  tenantId: "ministar",
  unitKey: "ministar:ministar-english:L1:U1",
  title: "Genki Disco Warmup sentence proposal",
  status: "proposed-review-only",
  sourceTerms: ["stand up", "sit down", "hands up", "hands down", "clap", "cheer", "walk", "bow"],
  targetSentenceDrafts: ["Stand up, please.", "Sit down, please."],
  sentenceProvenance:
    "Platform-authored from the extracted command terms. These sentences are not present in the supplied DOCX and require teacher approval.",
  requestedActivityPath: ["flashcards", "memory-match", "sentence-builder", "speak-it"],
  reviewGates: [
    {
      gateId: "proposal-source-term-mapping",
      label: "Source-term mapping",
      status: "pass",
      evidence: "Each proposed sentence uses terms from the checksum-bound Unit 1 extraction.",
      nextStep: "Keep the source review identity attached if wording changes.",
    },
    {
      gateId: "proposal-teacher-approval",
      label: "Teacher approval",
      status: "blocked",
      evidence: "No teacher reviewer, approval timestamp, or accepted wording has been recorded.",
      nextStep: "A teacher must approve or edit both sentence structures before draft creation can be considered.",
    },
    {
      gateId: "proposal-audio-support",
      label: "English audio support",
      status: "blocked",
      evidence: "The proposal has no approved term, sentence, instruction, feedback, or control audio evidence.",
      nextStep: "Attach reviewed English audio and transcript evidence for every requested activity path.",
    },
    {
      gateId: "proposal-japanese-support",
      label: "Japanese support review",
      status: "review-required",
      evidence: "Foundation-level support must remain hiragana-only and cannot unlock progress.",
      nextStep: "Review support text/audio separately after English wording is approved.",
    },
    {
      gateId: "proposal-package-release",
      label: "Package and release",
      status: "blocked",
      evidence: "No reviewed media rights, package evidence, release receipt, QR authorization, or student payload exists.",
      nextStep: "Keep this proposal out of routes, assignments, local bundles, and production QR output.",
    },
  ],
  blockers: [
    "The two sentence candidates are proposals, not extracted source text.",
    "Teacher approval and English audio evidence are required before a teacher draft may be created.",
    "Media rights, package integrity, release, QR, and student-assignment gates remain closed.",
  ],
  canAssignToStudents: false,
  canCreateReleasePackage: false,
  canPrintQrCodes: false,
};
