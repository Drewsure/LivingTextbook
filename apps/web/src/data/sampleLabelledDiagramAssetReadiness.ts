export type LabelledDiagramAssetStatus = "blocked-preview" | "planned";

export interface LabelledDiagramAssetGate {
  gateId: string;
  label: string;
  status: LabelledDiagramAssetStatus;
  detail: string;
}

export interface LabelledDiagramAnchorRequirement {
  requirementId: string;
  label: string;
  detail: string;
}

export interface LabelledDiagramAssetReadinessPlan {
  planId: string;
  label: string;
  summary: string;
  manifestShape: string[];
  anchorShape: LabelledDiagramAnchorRequirement[];
  gates: LabelledDiagramAssetGate[];
  blockedShortcuts: string[];
  storageNames: string[];
}

export const sampleLabelledDiagramAssetReadinessPlan: LabelledDiagramAssetReadinessPlan = {
  planId: "foundation-labelled-diagram-asset-readiness",
  label: "Labelled Diagram asset readiness",
  summary:
    "Target asset preview for reviewed Labelled Diagram images. This defines the game asset manifest and label anchor requirements before any image upload can become a student-facing Labelled Diagram game.",
  manifestShape: [
    "game_asset_manifest",
    "Asset id, tenant id, source upload id, source lineage, rights proof, image metadata, alt text, target language, review status, release gate status",
    "Image rights proof",
    "Alt text required",
    "Image safety review",
    "Audio label coverage",
    "Target-language label text",
    "Support-language labels are support-only",
  ],
  anchorShape: [
    {
      requirementId: "anchor-coordinate-review",
      label: "Anchor coordinate review",
      detail: "Each label anchor needs reviewed x/y or region data that remains stable across responsive layouts.",
    },
    {
      requirementId: "label-text-review",
      label: "Target-language label text",
      detail: "The English or tenant target-language label is the only progress trigger; support-language labels cannot unlock progress.",
    },
    {
      requirementId: "label-audio-coverage",
      label: "Audio label coverage",
      detail: "Each visible label needs tap-to-speak term audio before the game can be assigned to young learners.",
    },
    {
      requirementId: "accessibility-review",
      label: "Accessibility review",
      detail: "Alt text, touch target size, contrast, and keyboard/touch fallback must be reviewed before student-facing use.",
    },
  ],
  gates: [
    {
      gateId: "manifest-gate",
      label: "Game asset manifest required",
      status: "blocked-preview",
      detail: "The image cannot become a reusable game asset until a durable manifest preserves source lineage, rights, alt text, and review status.",
    },
    {
      gateId: "anchor-gate",
      label: "label_anchor_record required",
      status: "blocked-preview",
      detail: "The game cannot be assigned until every label has reviewed anchor data, target-language text, and audio coverage.",
    },
    {
      gateId: "release-gate",
      label: "Asset release gate required",
      status: "blocked-preview",
      detail: "The asset remains blocked until package release control accepts rights, accessibility, audio, and route compatibility.",
    },
  ],
  blockedShortcuts: [
    "No student-facing image game",
    "No auto-generated labels",
    "No live label editor",
    "No asset promotion without release gate",
    "No support-language progress trigger",
    "No unreviewed image coordinates",
  ],
  storageNames: ["game_asset_manifest", "label_anchor_record"],
};
