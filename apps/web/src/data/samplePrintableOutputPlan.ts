export type PrintableOutputStatus = "planned" | "ready" | "blocked";
export type PrintableAudience = "student" | "teacher" | "family";

export interface PrintableOutputItem {
  outputId: string;
  label: string;
  audience: PrintableAudience;
  status: PrintableOutputStatus;
  format: "pdf" | "browser-print";
  sourceData: string;
  audioBridge: string;
  routeBridge: string;
  reportingBoundary: string;
  blocker: string;
  nextStep: string;
}

export interface PrintableReadinessGate {
  gateId: string;
  label: string;
  status: PrintableOutputStatus;
  evidence: string;
  blocksExport: boolean;
  nextStep: string;
}

export interface PrintableOutputPlan {
  planId: string;
  tenantId: string;
  contentPackageId: string;
  unitKey: string;
  label: string;
  summary: string;
  exportDecision: string;
  outputs: PrintableOutputItem[];
  gates: PrintableReadinessGate[];
}

export const samplePrintableOutputPlan: PrintableOutputPlan = {
  planId: "sample-publisher-l1-u1-printable-plan",
  tenantId: "sample-publisher",
  contentPackageId: "sample-publisher-l1-u1-package",
  unitKey: "sample-publisher:starter-english:L1:U1",
  label: "Printable output readiness",
  summary:
    "Printable outputs should project reviewed package content into classroom and homework materials without drifting from the digital unit, audio support, QR routes, or target-language progression rules.",
  exportDecision: "PDF export blocked. Browser-print planning is visible, but no printable should be handed off until layout, QR/audio, rights, and versioning gates are closed.",
  outputs: [
    {
      outputId: "vocabulary-listening-sheet",
      label: "Vocabulary listening sheet",
      audience: "student",
      status: "planned",
      format: "pdf",
      sourceData: "Reviewed 8 vocabulary terms, assist-language support labels, and unit media route.",
      audioBridge: "Printed QR or short code must resolve to the same reviewed term audio cues.",
      routeBridge: "/launch/partner-demo-unit-1 or a future printable-specific QR route.",
      reportingBoundary: "No automatic Star Dust or mastery unless opened through an assignment QR route.",
      blocker: "Printable renderer, QR placement, and audio bridge are not implemented.",
      nextStep: "Design the first printable layout after package versioning is stable.",
    },
    {
      outputId: "sentence-practice-sheet",
      label: "Sentence practice worksheet",
      audience: "student",
      status: "planned",
      format: "pdf",
      sourceData: "Exactly 2 reviewed target sentence structures with teacher-approved segmentation.",
      audioBridge: "Printed listen links should play sentence model audio before students write or order words.",
      routeBridge: "/sentence/partner-demo-unit-1 or a future printable sentence route.",
      reportingBoundary: "Paper practice remains teacher-marked unless a digital assignment route is used.",
      blocker: "Printable sentence layout and teacher-marking workflow are not built.",
      nextStep: "Define tracing, ordering, fill-in, and answer-key variants.",
    },
    {
      outputId: "teacher-answer-key",
      label: "Teacher answer key",
      audience: "teacher",
      status: "planned",
      format: "pdf",
      sourceData: "Reviewed vocabulary, target sentences, and accepted answer variants.",
      audioBridge: "Teacher copy can show audio cue ids or QR references for classroom playback.",
      routeBridge: "/teacher/sessions/partner-demo-unit-1/report-package",
      reportingBoundary: "Teacher answer keys do not create student progress records.",
      blocker: "Teacher-only printable access and export policy are not implemented.",
      nextStep: "Add after auth/role boundaries are selected.",
    },
    {
      outputId: "word-search-printable",
      label: "Word Search printable",
      audience: "student",
      status: "blocked",
      format: "pdf",
      sourceData: "Plain text vocabulary only.",
      audioBridge: "Needs QR/audio companion for young learners.",
      routeBridge: "No route until printable puzzle support exists.",
      reportingBoundary: "No automatic reporting.",
      blocker: "Text normalization, layout validation, and puzzle generator do not exist.",
      nextStep: "Revisit after the first simple vocabulary and sentence PDFs are stable.",
    },
    {
      outputId: "crossword-printable",
      label: "Crossword printable",
      audience: "student",
      status: "blocked",
      format: "pdf",
      sourceData: "Requires reviewed clue text, not only vocabulary terms.",
      audioBridge: "Digital or printed clue audio needs a separate cue plan.",
      routeBridge: "No route until clue-authoring and puzzle validation exist.",
      reportingBoundary: "No automatic reporting.",
      blocker: "Reviewed clue workflow, text-only validation, and crossword layout are not built.",
      nextStep: "Revisit after printable clue-authoring rules exist.",
    },
  ],
  gates: [
    {
      gateId: "reviewed-package-source",
      label: "Reviewed package source",
      status: "ready",
      evidence: "Sample publisher package has reviewed vocabulary and target sentences.",
      blocksExport: false,
      nextStep: "Keep printable data sourced from reviewed package records only.",
    },
    {
      gateId: "print-layout-renderer",
      label: "Print layout renderer",
      status: "blocked",
      evidence: "No browser-print or PDF renderer exists yet.",
      blocksExport: true,
      nextStep: "Build the first simple printable layout before adding puzzle formats.",
    },
    {
      gateId: "qr-audio-bridge",
      label: "QR and audio bridge",
      status: "blocked",
      evidence: "Digital audio routes exist, but printable-specific QR placement is not implemented.",
      blocksExport: true,
      nextStep: "Define printed QR behavior for hosted and local companion deployments.",
    },
    {
      gateId: "version-and-rights",
      label: "Version and rights snapshot",
      status: "blocked",
      evidence: "Package versioning exists as planning data, but printable export snapshots are not generated.",
      blocksExport: true,
      nextStep: "Bind printable output to package id, edition, version, rights, and generated date.",
    },
    {
      gateId: "teacher-export-policy",
      label: "Teacher export policy",
      status: "blocked",
      evidence: "Teacher report export remains blocked, and teacher-only printable access is not implemented.",
      blocksExport: true,
      nextStep: "Add role and export rules before answer keys or assignment printouts.",
    },
  ],
};
