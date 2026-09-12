import {
  sampleAiPrototypeEvidenceAlignmentBundles,
  sampleAiPrototypeEvidenceAlignmentErrors,
} from "@/data/sampleAiPrototypeEvidenceAlignment";
import { samplePrototypeIntakeQueue } from "@/data/samplePrototypeIntakeQueue";
import { sampleAiPrototypeIntegrationReadinessGates } from "@/data/sampleAiPrototypeIntegrationReadinessGate";
import { validateAiPrototypeEvidenceAlignmentBundles } from "@living-textbook/content-model/src/aiPrototypeEvidenceAlignment";
import { validateAiPrototypeIntegrationReadinessGates } from "@living-textbook/content-model/src/aiPrototypeIntegrationReadinessGate";
import { validatePrototypeIntakeReadinessSummary } from "@living-textbook/content-model/src/prototypeIntakeReadinessSummary";
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

function deriveIntegrationReadinessLane(
  gates: typeof sampleAiPrototypeIntegrationReadinessGates,
  tenantId?: string,
): PrototypeIntakeReadinessLane {
  const scopedGates = tenantId ? gates.filter((gate) => gate.tenantId === tenantId) : gates;
  const gateErrors = validateAiPrototypeIntegrationReadinessGates(scopedGates);
  const blockedGateCount = scopedGates.filter(
    (gate) => gate.status !== "ready-for-codex-review",
  ).length;

  if (scopedGates.length === 0) {
    return {
      laneId: "integration-readiness-gates",
      label: "Integration readiness gates",
      status: "missing",
      summary: tenantId
        ? `No detailed integration readiness gate exists for ${tenantId}.`
        : "No detailed integration readiness gates exist for the prototype intake surface.",
    };
  }

  if (gateErrors.length > 0 || blockedGateCount > 0) {
    return {
      laneId: "integration-readiness-gates",
      label: "Integration readiness gates",
      status: "blocked",
      summary: tenantId
        ? `${blockedGateCount} ${tenantId} integration readiness gate(s) remain blocked or review-only; ${gateErrors.length} structural gate error(s) also require review.`
        : `${blockedGateCount} integration readiness gate(s) remain blocked or review-only; ${gateErrors.length} structural gate error(s) also require review.`,
    };
  }

  return {
    laneId: "integration-readiness-gates",
    label: "Integration readiness gates",
    status: "ready",
    summary: tenantId
      ? `All ${tenantId} integration readiness gates are ready for Codex review; no import is authorized by this lane alone.`
      : "All integration readiness gates are ready for Codex review; no import is authorized by this lane alone.",
  };
}

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
  deriveIntegrationReadinessLane(sampleAiPrototypeIntegrationReadinessGates),
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

export const samplePrototypeIntakeReadinessSummaryErrors = validatePrototypeIntakeReadinessSummary(
  samplePrototypeIntakeReadinessSummary,
);

export function createPrototypeIntakeReadinessSummary(
  tenantId: string,
): PrototypeIntakeReadinessSummary {
  const tenantBundles = sampleAiPrototypeEvidenceAlignmentBundles.filter(
    (bundle) => bundle.returnReview.tenantId === tenantId,
  );
  const tenantAlignmentErrors = validateAiPrototypeEvidenceAlignmentBundles(tenantBundles);
  const tenantManifests = sampleAiPrototypeReturnedPackageManifests.filter(
    (manifest) => manifest.tenantId === tenantId,
  );
  const tenantManifestIds = new Set(tenantManifests.map((manifest) => manifest.manifestId));
  const tenantManifestErrors = [
    ...sampleAiPrototypeReturnedPackageManifestErrors,
    ...sampleAiPrototypeReturnedPackageAlignmentErrors,
    ...sampleAiPrototypeReturnedPackageIntakeAlignmentErrors,
  ].filter((error) => [...tenantManifestIds].some((manifestId) => error.startsWith(`${manifestId}:`)));
  const tenantQueueItems = samplePrototypeIntakeQueue.filter((item) => item.tenantId === tenantId);
  const tenantLanes = samplePrototypeIntakeReadinessSummary.lanes.map((lane): PrototypeIntakeReadinessLane => {
    if (lane.laneId === "queue-visible") {
      return {
        ...lane,
        status: tenantQueueItems.length > 0 ? "ready" : "missing",
        summary:
          tenantQueueItems.length > 0
            ? `The ${tenantId} prototype intake queue is visible on its tenant review workbench.`
            : `No prototype intake queue item exists for ${tenantId}.`,
      };
    }
    if (lane.laneId === "evidence-alignment") {
      return {
        ...lane,
        status: tenantBundles.length === 0 ? "missing" : tenantAlignmentErrors.length === 0 ? "ready" : "blocked",
        summary:
          tenantBundles.length === 0
            ? `No aligned evidence packet exists for ${tenantId}.`
            : tenantAlignmentErrors.length === 0
              ? `The ${tenantId} review packet is structurally aligned across its evidence lanes.`
              : `${tenantAlignmentErrors.length} ${tenantId} evidence alignment error(s) must be resolved before Codex review.`,
      };
    }
    if (lane.laneId === "integration-readiness-gates") {
      return deriveIntegrationReadinessLane(sampleAiPrototypeIntegrationReadinessGates, tenantId);
    }
    if (lane.laneId === "returned-package-manifest-contract") {
      return {
        ...lane,
        status: tenantManifests.length === 0 ? "missing" : tenantManifestErrors.length === 0 ? "ready" : "blocked",
        summary:
          tenantManifests.length === 0
            ? `No returned-package manifest exists for ${tenantId}.`
            : tenantManifestErrors.length === 0
              ? `The ${tenantId} returned-package manifest previews are structurally valid; no package has been returned.`
              : `${tenantManifestErrors.length} ${tenantId} returned-package manifest or provenance error(s) require review.`,
      };
    }
    if (lane.laneId === "returned-package-availability") {
      const hasTenantPackage = tenantManifests.some((manifest) => manifest.status !== "not-returned");
      return {
        ...lane,
        status: hasTenantPackage ? "ready" : "missing",
        summary: hasTenantPackage
          ? `A returned package record exists for ${tenantId} and remains subject to evidence review.`
          : `No returned prototype package has been supplied for ${tenantId}.`,
      };
    }
    return { ...lane };
  });
  const tenantReadinessStatus = derivePrototypeIntakeReadinessStatus(tenantLanes);
  const tenantAlertDecision = derivePrototypeIntakeAlertDecision({
    status: tenantReadinessStatus,
    lanes: tenantLanes,
  });

  return {
    ...samplePrototypeIntakeReadinessSummary,
    summaryId: `${samplePrototypeIntakeReadinessSummary.summaryId}-${tenantId}`,
    label: `${samplePrototypeIntakeReadinessSummary.label} (${tenantId})`,
    tenantId,
    status: tenantReadinessStatus,
    codexAlertState: derivePrototypeIntakeCodexAlertState(tenantAlertDecision),
    summary: `The ${tenantId} workbench derives prototype intake readiness from tenant-scoped queue, evidence, and returned-package records. Controlled Z.ai intake remains blocked until a real returned package and wrapper-review records exist. Structurally valid previews do not count as a return.`,
    lanes: tenantLanes,
    blockedNextActions: [...samplePrototypeIntakeReadinessSummary.blockedNextActions],
  };
}
