export interface SourceDerivedUnitReview {
  reviewId: string;
  tenantId: string;
  sourceId: string;
  sourceReference: string;
  sourceChecksum: string;
  sourceByteLength: number;
  extractionMethod: "docx-parse";
  sourceLocation: string;
  unitKey: string;
  level: number;
  module: number;
  unit: number;
  title: string;
  themeSummary: string;
  vocabularyTerms: string[];
  targetSentenceReview: {
    requiredCount: 2;
    status: "missing-from-source";
    candidateSentences: string[];
    note: string;
  };
  demoComparison: {
    packageId: string;
    demoTheme: string;
    demoVocabularyTerms: string[];
    mismatchSummary: string;
  };
  blockers: string[];
  reviewOnly: true;
  draftCreationAllowed: false;
  studentFacingPayloadAllowed: false;
  packagePromotionAllowed: false;
}

export const sampleMinistarSourceDerivedUnitReview: SourceDerivedUnitReview = {
  reviewId: "review-ministar-source-derived-l1-u1-genki-disco-v1",
  tenantId: "ministar",
  sourceId: "src-ministar-master-docx",
  sourceReference: "MINISTAR ENGLISH 8 LEVELS x 40 UNITS.docx",
  sourceChecksum: "sha256:25fddcd6410fd75dc7f0ff0eea43147dfb00a0538b8c5530c1a070494061154f",
  sourceByteLength: 97819,
  extractionMethod: "docx-parse",
  sourceLocation: "Paragraph 16: Level/Unit Title, vocabulary/grammar summary, and core learning objective keywords",
  unitKey: "ministar:ministar-english:L1:U1",
  level: 1,
  module: 1,
  unit: 1,
  title: "Genki Disco Warmup",
  themeSummary: "Basic physical commands and classroom actions.",
  vocabularyTerms: ["stand up", "sit down", "hands up", "hands down", "clap", "cheer", "walk", "bow"],
  targetSentenceReview: {
    requiredCount: 2,
    status: "missing-from-source",
    candidateSentences: [],
    note: "The supplied Unit 1 source excerpt provides keywords and a grammar/topic summary, but no target sentence structures.",
  },
  demoComparison: {
    packageId: "ministar-l1-u1-greetings-package",
    demoTheme: "Greetings",
    demoVocabularyTerms: ["hello", "goodbye", "please", "thank you", "yes", "no", "teacher", "friend"],
    mismatchSummary: "The existing demo payload is a greeting rehearsal and must not be presented as the source-derived Genki Disco Warmup package.",
  },
  blockers: [
    "Exactly two age-appropriate target sentence structures must be authored and teacher-reviewed.",
    "Teacher launch copy and Japanese support text must be reviewed against the source-derived unit.",
    "Audio, media, rights, package, and release evidence are not supplied by this DOCX source record.",
  ],
  reviewOnly: true,
  draftCreationAllowed: false,
  studentFacingPayloadAllowed: false,
  packagePromotionAllowed: false,
};
