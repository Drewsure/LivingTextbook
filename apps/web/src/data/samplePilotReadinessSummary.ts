import {
  samplePackagePublishGate,
  type PackagePublishGate,
  type PackagePublishGateDomain,
  type PackagePublishGateOwner,
  type PackagePublishGateStatus,
} from "@/data/samplePackagePublishGate";
import type { LocalBundleMediaReleaseControlBinding } from "@living-textbook/content-model";
import { sampleLocalBundleMediaReleaseControlBinding } from "@/data/sampleLocalBundleMediaReleaseControlBinding";

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

export const samplePilotReadinessSummary = createPilotReadinessSummary(
  samplePackagePublishGate,
  sampleLocalBundleMediaReleaseControlBinding,
);

export function createPilotReadinessSummary(
  gate: PackagePublishGate,
  mediaReleaseControlBinding?: LocalBundleMediaReleaseControlBinding,
): PilotReadinessSummary {
  const demoReadyNow = gate.items.filter((item) => item.status === "ready").map(toSummaryGate);
  const pilotBlockerItems = gate.items.filter((item) => item.blocksRelease && item.status !== "ready");
  const pilotBlockers = pilotBlockerItems.map(toSummaryGate);
  if (mediaReleaseControlBinding) {
    pilotBlockers.push(toMediaSummaryGate(mediaReleaseControlBinding));
  }
  const missingEvidence = pilotBlockerItems.flatMap((item) =>
    item.requiredBeforePilot.map((requirement) => ({
      gateId: item.gateId,
      gateLabel: item.label,
      requirement,
    })),
  );
  if (mediaReleaseControlBinding) {
    missingEvidence.push(
      ...mediaReleaseControlBinding.releaseBlockingReasons.map((requirement) => ({
        gateId: `media-release-control-${mediaReleaseControlBinding.bindingId}`,
        gateLabel: "Media release-control evidence",
        requirement,
      })),
    );
  }

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
    pilotBlockers,
    missingEvidence,
    stillNotAllowed: gate.items.flatMap((item) =>
      item.notAllowedYet.map((restriction) => ({
        gateId: item.gateId,
        gateLabel: item.label,
        restriction,
      })),
    ),
  };
}

function toMediaSummaryGate(binding: LocalBundleMediaReleaseControlBinding): PilotReadinessSummaryGate {
  return {
    gateId: `media-release-control-${binding.bindingId}`,
    label: "Media release-control evidence",
    domain: "media",
    owner: "shared",
    status: binding.decision === "blocked" ? "blocked" : "needs-review",
    evidence: binding.releaseBlockingReasons.join(" "),
    nextStep: `Close required approvals: ${binding.requiredApprovals.join(", ")}.`,
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
