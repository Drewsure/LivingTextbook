export type SourceExtractionMethod = "manual-structure" | "ocr" | "parser" | "ai-assisted";
export type SourceExtractionPacketStatus = "evidence-only" | "needs-review" | "blocked";

export interface SourceExtractionReviewPacket {
  packetId: string;
  tenantId: string;
  sourceId: string;
  label: string;
  extractionMethod: SourceExtractionMethod;
  status: SourceExtractionPacketStatus;
  ocrConfidenceSummary: string;
  segmentationReviewPacket: string;
  candidatePayloadSummary: string;
  requiredReview: string[];
  blockedActions: string[];
}

export const sampleSourceExtractionReviewPackets: SourceExtractionReviewPacket[] = [
  {
    packetId: "source-extract-ministar-master-docx-manual-v1",
    tenantId: "ministar",
    sourceId: "src-ministar-master-docx",
    label: "MiniStar master DOCX extraction review packet",
    extractionMethod: "manual-structure",
    status: "evidence-only",
    ocrConfidenceSummary: "OCR not used. DOCX structure must still be reviewed because headings, tables, and unit breaks can be misread.",
    segmentationReviewPacket: "Level, unit, theme, vocabulary, target sentence, teacher launch, and support-language sections require reviewer signoff.",
    candidatePayloadSummary:
      "Candidate output: reviewed unit payload with 8 canonical vocabulary terms, 2 target sentence structures, launch protocol, and hiragana-safe Japanese support notes.",
    requiredReview: [
      "Confirm the 8 canonical vocabulary terms for each unit.",
      "Confirm the 2 target sentence structures are age-appropriate.",
      "Confirm Foundation/Bronze/Plus Japanese support text remains hiragana-only.",
      "Confirm extracted launch protocol copy is teacher-facing.",
    ],
    blockedActions: [
      "No teacher draft creation from this packet.",
      "No student-facing payload from this packet.",
      "No support-language-only progression.",
      "No package release without verifier handoff.",
    ],
  },
  {
    packetId: "source-extract-sample-publisher-pdf-ocr-v1",
    tenantId: "sample-publisher",
    sourceId: "src-sample-publisher-unit-pdf",
    label: "Sample publisher PDF OCR review packet",
    extractionMethod: "ocr",
    status: "blocked",
    ocrConfidenceSummary: "OCR confidence unavailable because the real production PDF is not present in the scaffold.",
    segmentationReviewPacket: "Page, unit, activity, image-label, media callout, and QR target boundaries require human review.",
    candidatePayloadSummary:
      "Candidate output: draft package shell with page references, routine vocabulary candidates, sentence candidates, and media callout placeholders.",
    requiredReview: [
      "Supply the real PDF before production extraction.",
      "Confirm page and activity boundaries.",
      "Confirm textbook text versus teacher-only guidance.",
      "Confirm media rights before playlist or local bundle planning.",
    ],
    blockedActions: [
      "No raw PDF as student payload.",
      "No unreviewed OCR assignment.",
      "No parser output as a route target.",
      "No automatic PDF-to-game publish.",
    ],
  },
  {
    packetId: "source-extract-sample-publisher-media-ai-v1",
    tenantId: "sample-publisher",
    sourceId: "src-sample-publisher-audio-folder",
    label: "Sample publisher media AI indexing packet",
    extractionMethod: "ai-assisted",
    status: "needs-review",
    ocrConfidenceSummary: "OCR not applicable. AI media indexing can suggest track purpose only after real files and rights proof exist.",
    segmentationReviewPacket: "Track role, unit binding, transcript/caption availability, background-media policy, and learning-audio priority require review.",
    candidatePayloadSummary:
      "Candidate output: media manifest candidates for instruction audio, vocabulary audio, chant/background audio, and optional playlist entries.",
    requiredReview: [
      "Confirm rights owner and classroom use permission.",
      "Confirm which tracks are learning audio versus optional background media.",
      "Confirm captions or transcript requirements where video is used.",
      "Confirm media cannot trigger mastery progress by itself.",
    ],
    blockedActions: [
      "No playlist creation from uploaded media.",
      "No media-only progress.",
      "No background music overriding learning audio.",
      "No local bundle activation.",
    ],
  },
];
