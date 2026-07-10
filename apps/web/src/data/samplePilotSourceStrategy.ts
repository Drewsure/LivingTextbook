export type PilotSourceOptionStatus = "recommended" | "later" | "blocked";

export interface PilotSourceOption {
  optionId: string;
  label: string;
  status: PilotSourceOptionStatus;
  costPosture: "lowest" | "controlled" | "higher";
  summary: string;
  benefits: string[];
  risks: string[];
  requiredBeforeUse: string[];
}

export interface PilotSourceStrategy {
  strategyId: string;
  label: string;
  decision: string;
  reason: string;
  options: PilotSourceOption[];
}

export const samplePilotSourceStrategy: PilotSourceStrategy = {
  strategyId: "first-partner-pilot-source-strategy",
  label: "First partner pilot source strategy",
  decision: "Use manually reviewed unit data for the first pilot. Treat draft PDF import as a reviewed intake workflow, not automatic student content.",
  reason:
    "The first white-label pilot should prove games, media, QR/front-door routes, teacher reports, package gates, and persistence boundaries with the lowest delivery risk. PDF import is important, but it should not become the first source of student-facing truth.",
  options: [
    {
      optionId: "manual-reviewed-units",
      label: "Manually reviewed units",
      status: "recommended",
      costPosture: "lowest",
      summary: "Use two to four partner units that humans review and enter into the package schema before student assignment.",
      benefits: [
        "Fastest route to a credible partner demo.",
        "Keeps language, audio, media, games, and reports aligned.",
        "Avoids debugging OCR/PDF extraction while game and reporting foundations are still stabilizing.",
      ],
      risks: [
        "Not yet a self-service publisher ingestion workflow.",
        "Requires careful manual package entry and review.",
      ],
      requiredBeforeUse: [
        "Reviewed vocabulary, sentences, media rights, and assigned games.",
        "Teacher-visible report policy remains demo or pilot-scoped.",
      ],
    },
    {
      optionId: "draft-pdf-import",
      label: "Draft PDF import workflow",
      status: "later",
      costPosture: "controlled",
      summary: "Parse partner PDFs into draft package records, then require human review before any student-facing assignment.",
      benefits: [
        "Scales partner onboarding after the pilot shape is proven.",
        "Can preserve page/unit/activity references for long-lived QR codes.",
      ],
      risks: [
        "PDF extraction errors can create bad learning payloads.",
        "Needs review UI, diffing, source hashes, and rollback before partner trust is safe.",
      ],
      requiredBeforeUse: [
        "Source-review queue and verifier gates are persisted.",
        "No AI or parser draft can publish without human approval.",
      ],
    },
    {
      optionId: "automatic-pdf-to-student-package",
      label: "Automatic PDF-to-student package",
      status: "blocked",
      costPosture: "higher",
      summary: "Convert PDFs directly into live student units without review.",
      benefits: ["None for the first safe pilot."],
      risks: [
        "High risk of incorrect language, missing audio, broken routes, and unlicensed media.",
        "Conflicts with the review-first standards document.",
      ],
      requiredBeforeUse: ["Not allowed in the current product standard."],
    },
  ],
};
