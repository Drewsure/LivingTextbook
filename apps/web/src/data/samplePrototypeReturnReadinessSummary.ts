import {
  derivePrototypeReturnReadinessStatus,
  derivePrototypeReturnReviewState,
} from "@living-textbook/content-model/src/prototypeReturnReadiness";
import { validatePrototypeReturnReadinessSummary } from "@living-textbook/content-model/src/prototypeReturnReadinessSummary";
import {
  samplePrototypeReturnPackageChecklists,
  type PrototypeReturnPackageChecklist,
} from "@/data/samplePrototypeReturnPackageChecklist";
import type {
  PrototypeReturnReadinessStatus as ContentModelPrototypeReturnReadinessStatus,
  PrototypeReturnReviewState,
} from "@living-textbook/content-model/src/prototypeReturnReadiness";

export type PrototypeReturnReadinessStatus = ContentModelPrototypeReturnReadinessStatus;

export interface PrototypeReturnReadinessLane {
  laneId: string;
  label: string;
  status: "ready" | "missing" | "blocked";
  summary: string;
}

export interface PrototypeReturnReadinessSummary {
  summaryId: string;
  label: string;
  tenantId: string;
  status: PrototypeReturnReadinessStatus;
  codexReviewState: PrototypeReturnReviewState;
  summary: string;
  lanes: PrototypeReturnReadinessLane[];
  blockedNextActions: string[];
}

const lanes: PrototypeReturnReadinessLane[] = [
  {
    laneId: "return-checklist-visible",
    label: "Return checklist visible",
    status: "ready",
    summary: "Returned prototype package checklists are visible for MiniStar and sample publisher candidates.",
  },
  {
    laneId: "return-storage-guard-visible",
    label: "Return storage guard visible",
    status: "ready",
    summary: "The prototype return package checklist storage contract is visible with hosted/local write intents.",
  },
  {
    laneId: "source-manifest-missing",
    label: "Source archive manifest",
    status: "missing",
    summary: "No returned package has supplied a reviewed source archive manifest tied to a single snapshot.",
  },
  {
    laneId: "fixture-replay-missing",
    label: "Reviewed fixture replay",
    status: "missing",
    summary: "Returned packages still need fixture replay evidence proving payload-driven behavior.",
  },
  {
    laneId: "audio-mobile-scoring-missing",
    label: "Audio, mobile, and scoring proof",
    status: "missing",
    summary: "Target-language audio, mobile accessibility, and deterministic scoring replay evidence are still missing.",
  },
  {
    laneId: "codex-return-review-blocked",
    label: "Codex return review",
    status: "blocked",
    summary: "Codex cannot open return review until the returned package evidence is complete and storage boundaries are satisfied.",
  },
];

const readinessStatus = derivePrototypeReturnReadinessStatus(lanes);

export const samplePrototypeReturnReadinessSummary: PrototypeReturnReadinessSummary = {
  summaryId: "prototype-return-readiness-summary-foundation",
  label: "Prototype return readiness summary",
  tenantId: "platform",
  status: readinessStatus,
  codexReviewState: derivePrototypeReturnReviewState(readinessStatus),
  summary:
    "Returned Z.ai, Phaser, DOM reference, or outside-game work is not ready for Codex review until the returned package checklist, storage guard, evidence packets, replay reports, audio coverage, and wrapper boundary are complete.",
  lanes,
  blockedNextActions: [
    "No Codex return review yet",
    "No returned archive import",
    "No direct file copy into apps/web",
    "No active route replacement",
    "No scoring mutation",
    "No reward inventory write",
    "No playlist write",
    "No package promotion",
    "No student assignment",
    "No support-language progress trigger",
  ],
};

export const samplePrototypeReturnReadinessSummaryErrors = validatePrototypeReturnReadinessSummary(
  samplePrototypeReturnReadinessSummary,
);

export function createPrototypeReturnReadinessSummary(
  tenantId: string,
): PrototypeReturnReadinessSummary {
  const tenantChecklists = samplePrototypeReturnPackageChecklists.filter(
    (checklist) => checklist.tenantId === tenantId,
  );
  const hasTenantChecklists = tenantChecklists.length > 0;
  const hasReadyPreview = (predicate: (checklist: PrototypeReturnPackageChecklist) => boolean) =>
    hasTenantChecklists && tenantChecklists.every(predicate);
  const tenantLanes: PrototypeReturnReadinessLane[] = lanes.map((lane) => {
    if (lane.laneId === "return-checklist-visible") {
      return {
        ...lane,
        status: hasTenantChecklists ? "ready" : "missing",
        summary: hasTenantChecklists
          ? `The ${tenantId} returned-package checklist is visible on its tenant review workbench.`
          : `No returned-package checklist exists for ${tenantId}.`,
      };
    }
    if (lane.laneId === "source-manifest-missing") {
      return {
        ...lane,
        status: hasReadyPreview((checklist) => checklist.packageItems.some((item) => item.itemId.includes("manifest") && item.status === "ready-preview"))
          ? "ready"
          : "missing",
        summary: hasTenantChecklists
          ? `The ${tenantId} source archive manifest remains unreturned and requires review.`
          : `No source archive manifest record exists for ${tenantId}.`,
      };
    }
    if (lane.laneId === "fixture-replay-missing") {
      return {
        ...lane,
        status: hasReadyPreview((checklist) => checklist.packageItems.some((item) => item.itemId.includes("fixture") && item.status === "ready-preview"))
          ? "ready"
          : "missing",
        summary: hasTenantChecklists
          ? `The ${tenantId} fixture replay remains unreturned and requires review.`
          : `No reviewed fixture replay record exists for ${tenantId}.`,
      };
    }
    if (lane.laneId === "audio-mobile-scoring-missing") {
      return {
        ...lane,
        status: hasReadyPreview((checklist) => checklist.packageItems.some((item) => item.itemId.includes("audio") && item.status === "ready-preview"))
          ? "ready"
          : "missing",
        summary: hasTenantChecklists
          ? `The ${tenantId} audio, mobile, and scoring proof remains unreturned and requires review.`
          : `No audio, mobile, or scoring proof record exists for ${tenantId}.`,
      };
    }
    return { ...lane };
  });
  const tenantStatus = derivePrototypeReturnReadinessStatus(tenantLanes);

  return {
    ...samplePrototypeReturnReadinessSummary,
    summaryId: `${samplePrototypeReturnReadinessSummary.summaryId}-${tenantId}`,
    label: `${samplePrototypeReturnReadinessSummary.label} (${tenantId})`,
    tenantId,
    status: tenantStatus,
    codexReviewState: derivePrototypeReturnReviewState(tenantStatus),
    summary: `The ${tenantId} workbench derives returned-prototype readiness from tenant-scoped checklist records. Archive import and Codex return review remain blocked until the required package evidence is complete.`,
    lanes: tenantLanes,
    blockedNextActions: [...samplePrototypeReturnReadinessSummary.blockedNextActions],
  };
}
