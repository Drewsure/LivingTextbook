export type CompetitiveCoverageStatus = "core" | "planned" | "optional" | "not-for-v1" | "white-label-risk";

export interface CompetitiveFeatureCoverageItem {
  itemId: string;
  label: string;
  status: CompetitiveCoverageStatus;
  productResponse: string;
  foundationAction: string;
}

export interface CompetitiveFeatureCoverageMatrix {
  matrixId: string;
  label: string;
  summary: string;
  principle: string;
  items: CompetitiveFeatureCoverageItem[];
}

export const sampleCompetitiveFeatureCoverageMatrix: CompetitiveFeatureCoverageMatrix = {
  matrixId: "wordwall-style-coverage-2026-07",
  label: "Competitive feature coverage",
  summary:
    "This matrix records Wordwall-style product capabilities as foundation-stage coverage checks. It is not a copy plan; it protects the white-label build from missing important teacher, publisher, and classroom expectations.",
  principle:
    "Living Textbook should offer curated, teacher-approved activity pathways from reviewed unit packages rather than unrestricted template switching that can break audio, reporting, or young-learner progression.",
  items: [
    {
      itemId: "curated-activity-pathways",
      label: "Curated activity pathways",
      status: "core",
      productResponse:
        "Teachers should see streamlined game options already prepared for the unit theme, with required, optional, premium, and blocked modes clearly separated.",
      foundationAction:
        "Use the unit game offer map and package readiness gates before adding a broader compatibility matrix.",
    },
    {
      itemId: "printable-outputs",
      label: "Printable activities",
      status: "planned",
      productResponse:
        "Printable worksheets and PDF companions are important for homework, low-device classrooms, textbook partners, and teacher handoff.",
      foundationAction:
        "Add printable projection from reviewed payloads after package versioning and route stability are in place.",
    },
    {
      itemId: "private-library",
      label: "Private tenant library first",
      status: "planned",
      productResponse:
        "Reusable teacher and publisher resources should begin inside private tenant libraries, not a public marketplace.",
      foundationAction:
        "Design ownership, copy/edit, visibility, and package versioning before any public sharing surface.",
    },
    {
      itemId: "public-community",
      label: "Public community library",
      status: "white-label-risk",
      productResponse:
        "A public library has value, but it adds moderation, copyright, privacy, tenant-isolation, and quality-control risk.",
      foundationAction:
        "Keep public community sharing out of v1 and record it as a governed future opportunity.",
    },
    {
      itemId: "embed-links",
      label: "Embeds and share links",
      status: "optional",
      productResponse:
        "Embeds can help publishers and school portals, but assignment embeds must preserve access control and reporting boundaries.",
      foundationAction:
        "Revisit after route security, package visibility, and report policy are stable.",
    },
    {
      itemId: "japanese-target-language",
      label: "Japanese as target language",
      status: "planned",
      productResponse:
        "Japanese-language schools could plausibly use the platform if Japanese becomes the target learning language rather than only an assist language.",
      foundationAction:
        "Keep language contracts target-language agnostic and plan kana, kanji, furigana, Japanese audio, and Japanese segmentation support.",
    },
  ],
};
