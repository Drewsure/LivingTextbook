export type ContentIntakeStatus = "complete" | "in-review" | "blocked" | "not-started";
export type ContentIntakeSourceKind = "pdf" | "docx" | "spreadsheet" | "media-folder";

export interface ContentIntakeGate {
  gateId: string;
  label: string;
  status: ContentIntakeStatus;
  owner: "tenant" | "teacher" | "platform" | "verifier";
  note: string;
}

export interface ContentIntakeRun {
  intakeId: string;
  tenantId: string;
  tenantName: string;
  sourceKind: ContentIntakeSourceKind;
  sourceName: string;
  targetPackageId: string;
  targetRoutePath: string;
  unitCount: number;
  mediaAssetCount: number;
  reviewedUnitCount: number;
  status: ContentIntakeStatus;
  gates: ContentIntakeGate[];
}

export const sampleContentIntakeRuns: ContentIntakeRun[] = [
  {
    intakeId: "intake-ministar-l1-u1-docx",
    tenantId: "ministar",
    tenantName: "MiniStar English Lab",
    sourceKind: "docx",
    sourceName: "MINISTAR ENGLISH 8 LEVELS x 40 UNITS.docx",
    targetPackageId: "ministar-l1-u1-greetings-package",
    targetRoutePath: "/enter/ministar",
    unitCount: 1,
    mediaAssetCount: 2,
    reviewedUnitCount: 1,
    status: "in-review",
    gates: [
      {
        gateId: "source-preserved",
        label: "Source preserved",
        status: "complete",
        owner: "platform",
        note: "Original curriculum source remains preserved and is not overwritten by generated package data.",
      },
      {
        gateId: "unit-payload-reviewed",
        label: "Unit payload reviewed",
        status: "complete",
        owner: "teacher",
        note: "The sample Level 1 Unit 1 payload has 8 target terms, 2 target sentences, and teacher launch copy.",
      },
      {
        gateId: "audio-support-plan",
        label: "Audio support plan",
        status: "complete",
        owner: "verifier",
        note: "Vocabulary, sentence, instruction, and feedback text have audio cue ids before student assignment.",
      },
      {
        gateId: "media-rights",
        label: "Media rights and files",
        status: "in-review",
        owner: "tenant",
        note: "The sample package contains media metadata; real audio/video files and rights proof remain partner-provided inputs.",
      },
    ],
  },
  {
    intakeId: "intake-sample-publisher-starter-pdf",
    tenantId: "sample-publisher",
    tenantName: "Sample Publisher Lab",
    sourceKind: "pdf",
    sourceName: "Partner Textbook Sample Unit.pdf",
    targetPackageId: "sample-publisher-l1-u1-routines-package",
    targetRoutePath: "/enter/sample-publisher",
    unitCount: 1,
    mediaAssetCount: 2,
    reviewedUnitCount: 1,
    status: "in-review",
    gates: [
      {
        gateId: "source-metadata",
        label: "Source metadata captured",
        status: "complete",
        owner: "platform",
        note: "Tenant, series, book, unit, activity, language, edition, and version are represented in the sample package.",
      },
      {
        gateId: "payload-extraction",
        label: "Payload extraction reviewed",
        status: "complete",
        owner: "teacher",
        note: "Daily Routines has 8 target terms and 2 target sentence patterns; no automated PDF extraction is trusted yet.",
      },
      {
        gateId: "route-registry",
        label: "Front-door route registry",
        status: "complete",
        owner: "platform",
        note: "The sample publisher package resolves through /enter/sample-publisher using registry-shaped route data.",
      },
      {
        gateId: "media-file-handoff",
        label: "Media file handoff",
        status: "in-review",
        owner: "tenant",
        note: "The package has audio/video placeholders; production requires partner files or owned/licensed replacements.",
      },
      {
        gateId: "teacher-approval",
        label: "Teacher approval",
        status: "not-started",
        owner: "teacher",
        note: "Future pilot flow must let a teacher approve the package before assigning it to a real class.",
      },
    ],
  },
];

export function countIntakeGatesByStatus(run: ContentIntakeRun, status: ContentIntakeStatus): number {
  return run.gates.filter((gate) => gate.status === status).length;
}
