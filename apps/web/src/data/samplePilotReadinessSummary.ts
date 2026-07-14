import {
  samplePackagePublishGate,
  type PackagePublishGate,
  type PackagePublishGateDomain,
  type PackagePublishGateOwner,
  type PackagePublishGateStatus,
} from "@/data/samplePackagePublishGate";

export interface PilotReadinessSummaryGate {
  gateId: string;
  label: string;
  domain: PackagePublishGateDomain;
  owner: PackagePublishGateOwner;
  status: PackagePublishGateStatus;
  evidence: string;
  nextStep: string;
}

export interface PilotReadinessSummaryEvidence {
  gateId: string;
  gateLabel: string;
  requirement: string;
}

export interface PilotReadinessSummaryRestriction {
  gateId: string;
  gateLabel: string;
  restriction: string;
}

export interface PilotReadinessSummary {
  summaryId: string;
  title: string;
  sourceOfTruth: string;
  sourceGateId: string;
  sourceGateLabel: string;
  releaseCandidate: string;
  targetPilotRoute: string;
  noPublishActionLabel: string;
  summary: string;
  demoReadyNow: PilotReadinessSummaryGate[];
  pilotBlockers: PilotReadinessSummaryGate[];
  missingEvidence: PilotReadinessSummaryEvidence[];
  stillNotAllowed: PilotReadinessSummaryRestriction[];
}

export const samplePilotReadinessSummary = createPilotReadinessSummary(samplePackagePublishGate);

export function createPilotReadinessSummary(gate: PackagePublishGate): PilotReadinessSummary {
  const demoReadyNow = gate.items.filter((item) => item.status === "ready").map(toSummaryGate);
  const pilotBlockers = gate.items.filter((item) => item.blocksRelease && item.status !== "ready");

  return {
    summaryId: `${gate.gateId}-publisher-summary`,
    title: "Publisher pilot readiness summary",
    sourceOfTruth: "Source of truth: package publish gate",
    sourceGateId: gate.gateId,
    sourceGateLabel: gate.label,
    releaseCandidate: gate.releaseCandidate,
    targetPilotRoute: gate.targetPilotRoute,
    noPublishActionLabel: "No publish action",
    summary:
      "This summary translates the package publish gate into plain-language pilot readiness. It is safe for publisher conversations because it separates controlled demo evidence from release blockers and missing review evidence.",
    demoReadyNow,
    pilotBlockers: pilotBlockers.map(toSummaryGate),
    missingEvidence: pilotBlockers.flatMap((item) =>
      item.requiredBeforePilot.map((requirement) => ({
        gateId: item.gateId,
        gateLabel: item.label,
        requirement,
      })),
    ),
    stillNotAllowed: gate.items.flatMap((item) =>
      item.notAllowedYet.map((restriction) => ({
        gateId: item.gateId,
        gateLabel: item.label,
        restriction,
      })),
    ),
  };
}

function toSummaryGate(item: {
  gateId: string;
  label: string;
  domain: PackagePublishGateDomain;
  owner: PackagePublishGateOwner;
  status: PackagePublishGateStatus;
  evidence: string;
  nextStep: string;
}): PilotReadinessSummaryGate {
  return {
    gateId: item.gateId,
    label: item.label,
    domain: item.domain,
    owner: item.owner,
    status: item.status,
    evidence: item.evidence,
    nextStep: item.nextStep,
  };
}
