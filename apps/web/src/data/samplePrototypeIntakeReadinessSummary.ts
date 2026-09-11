import { sampleAiPrototypeEvidenceAlignmentErrors } from "@/data/sampleAiPrototypeEvidenceAlignment";
import {
  derivePrototypeIntakeAlertDecision,
  derivePrototypeIntakeCodexAlertState,
  derivePrototypeIntakeReadinessStatus,
} from "@living-textbook/content-model/src/prototypeIntakeAlert";
import type {
  PrototypeIntakeCodexAlertState,
  PrototypeIntakeReadinessStatus as ContentModelPrototypeIntakeReadinessStatus,
} from "@living-textbook/content-model/src/prototypeIntakeAlert";
import {
  sampleAiPrototypeReturnedPackageAlignmentErrors,
  sampleAiPrototypeReturnedPackageIntakeAlignmentErrors,
  sampleAiPrototypeReturnedPackageManifestErrors,
  sampleAiPrototypeReturnedPackageManifests,
} from "@/data/sampleAiPrototypeReturnedPackageManifest";

export type PrototypeIntakeReadinessStatus = ContentModelPrototypeIntakeReadinessStatus;

export interface PrototypeIntakeReadinessLane {
  laneId: string;
  label: string;
  status: "ready" | "missing" | "blocked";
  summary: string;
}

export interface PrototypeIntakeReadinessSummary {
  summaryId: string;
  label: string;
  tenantId: string;
  status: PrototypeIntakeReadinessStatus;
  codexAlertState: PrototypeIntakeCodexAlertState;
  summary: string;
  lanes: PrototypeIntakeReadinessLane[];
  blockedNextActions: string[];
}

const returnedPackageContractErrors = [
  ...sampleAiPrototypeReturnedPackageManifestErrors,
  ...sampleAiPrototypeReturnedPackageAlignmentErrors,
  ...sampleAiPrototypeReturnedPackageIntakeAlignmentErrors,
];
const hasReturnedPrototypePackage = sampleAiPrototypeReturnedPackageManifests.some(
  (manifest) => manifest.status !== "not-returned",
);

const lanes: PrototypeIntakeReadinessLane[] = [
  {
    laneId: "queue-visible",
    label: "Queue visible",
    status: "ready",
    summary: "The prototype intake queue is visible on game-readiness and tenant prototype review workbenches.",
  },
  {
    laneId: "storage-contract-visible",
    label: "Storage contract visible",
    status: "ready",
    summary: "The prototype intake queue storage contract and hosted/local write intents are visible and verified.",
  },
  {
    laneId: "evidence-flow-visible",
    label: "Evidence flow visible",
    status: "ready",
    summary: "The prototype evidence packet flow defines source, fixture, event/scoring, audio, mobile, and wrapper lanes.",
  },
  {
    laneId: "evidence-alignment",
    label: "Evidence packet alignment",
    status: sampleAiPrototypeEvidenceAlignmentErrors.length === 0 ? "ready" : "blocked",
    summary:
      sampleAiPrototypeEvidenceAlignmentErrors.length === 0
        ? "The review-only sample packet shares one tenant, request, integration plan, mode set, and parent-engine identity across every evidence lane."
        : `${sampleAiPrototypeEvidenceAlignmentErrors.length} cross-artifact alignment error(s) must be resolved before Codex review can rely on the packet.`,
  },
  {
    laneId: "returned-package-manifest-contract",
    label: "Returned package manifest",
    status: returnedPackageContractErrors.length === 0 ? "ready" : "blocked",
    summary:
      returnedPackageContractErrors.length === 0
        ? "Sample manifest identity, artifact shape, checklist alignment, intake provenance, and target surface are structurally valid; no package has been returned."
        : `${returnedPackageContractErrors.length} returned-package manifest or provenance error(s) must be resolved before Codex review can rely on the return record.`,
  },
  {
    laneId: "returned-package-availability",
    label: "Returned prototype package",
    status: hasReturnedPrototypePackage ? "ready" : "missing",
    summary: hasReturnedPrototypePackage
      ? "A returned package record exists for a specific candidate and remains subject to artifact and evidence review."
      : "No specific returned prototype package has been supplied; the structurally valid previews do not count as a return.",
  },
  {
    laneId: "replay-reports-missing",
    label: "Replay reports",
    status: "missing",
    summary: "Fixture, event, scoring, audio, and mobile/accessibility reports are still missing.",
  },
  {
    laneId: "codex-wrapper-decision-blocked",
    label: "Codex wrapper decision",
    status: "blocked",
    summary: "Codex cannot issue a wrapper or integration decision until evidence packets are complete.",
  },
];

const readinessStatus = derivePrototypeIntakeReadinessStatus(lanes);
const alertDecision = derivePrototypeIntakeAlertDecision({
  status: readinessStatus,
  lanes,
});

export const samplePrototypeIntakeReadinessSummary: PrototypeIntakeReadinessSummary = {
  summaryId: "prototype-intake-readiness-summary-foundation",
  label: "Prototype intake readiness summary",
  tenantId: "platform",
  status: readinessStatus,
  codexAlertState: derivePrototypeIntakeCodexAlertState(alertDecision),
  summary:
    `The foundation can inventory and review outside game work, and the current sample evidence packets are structurally ${sampleAiPrototypeEvidenceAlignmentErrors.length === 0 ? "aligned" : "misaligned"}. Controlled Z.ai intake is still blocked until a real returned package and wrapper-review records exist for a specific candidate.`,
  lanes,
  blockedNextActions: [
    "No Codex green-light alert yet",
    "No returned prototype upload",
    "No app file import",
    "No active route replacement",
    "No scoring mutation",
    "No reward inventory write",
    "No playlist write",
    "No package promotion",
    "No student assignment",
  ],
};

export function createPrototypeIntakeReadinessSummary(
  tenantId: string,
): PrototypeIntakeReadinessSummary {
  return {
    ...samplePrototypeIntakeReadinessSummary,
    summaryId: `${samplePrototypeIntakeReadinessSummary.summaryId}-${tenantId}`,
    label: `${samplePrototypeIntakeReadinessSummary.label} (${tenantId})`,
    tenantId,
    lanes: samplePrototypeIntakeReadinessSummary.lanes.map((lane) => ({ ...lane })),
    blockedNextActions: [...samplePrototypeIntakeReadinessSummary.blockedNextActions],
  };
}
