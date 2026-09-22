import {
  PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS,
  validatePhaserCandidateSourceIdentity,
} from "@living-textbook/content-model";
import { sampleAiPrototypeIntegrationPlans } from "@/data/sampleAiPrototypeIntegrationPlan";
import { samplePhaserCandidateContractReviews } from "@/data/samplePhaserCandidateContractReview";
import { sampleCanonicalMemoryMatchIntegrationGate } from "@/data/sampleCanonicalMemoryMatchIntegrationGate";
import { samplePhaserCandidateIntegrationEligibility } from "@/data/samplePhaserCandidateIntegrationEligibility";

export type MemoryMatchEvidenceHandoffState = "ready-for-human-handoff" | "blocked";

export interface MemoryMatchEvidenceHandoffPacket {
  packetId: string;
  tenantId: string;
  requestId: string;
  targetBuilder: "Z.ai";
  handoffState: MemoryMatchEvidenceHandoffState;
  integrationState: "blocked";
  sourceRepository: string;
  sourceSnapshotId: string;
  sourceCommitSha: string;
  eligibilityId: string;
  requiredEvidenceLaneIds: string[];
  targetMode: "memory-match";
  parentEngine: "pairing";
  canonicalReference: {
    component: string;
    route: string;
    scoringProfile: string;
  };
  permittedContents: string[];
  requiredReturnArtifacts: string[];
  acceptanceChecks: string[];
  blockedActions: string[];
  humanAction: string;
}

const candidate = samplePhaserCandidateContractReviews.find((review) => review.gameMode === "memory-match");
const integrationPlan = sampleAiPrototypeIntegrationPlans.find((plan) => plan.tenantId === "ministar");
const eligibility = samplePhaserCandidateIntegrationEligibility.find((record) => record.gameMode === "memory-match");

if (!candidate || !integrationPlan || !eligibility) {
  throw new Error("Memory Match evidence handoff packet requires the mapped candidate, integration plan, and eligibility record.");
}

export const sampleMemoryMatchEvidenceHandoffPacket: MemoryMatchEvidenceHandoffPacket = {
  packetId: "memory-match-evidence-handoff-ministar-v1",
  tenantId: "ministar",
  requestId: integrationPlan.requestId,
  targetBuilder: "Z.ai",
  handoffState: "ready-for-human-handoff",
  integrationState: "blocked",
  sourceRepository: candidate.sourceRepository,
  sourceSnapshotId: candidate.sourceSnapshotId,
  sourceCommitSha: candidate.sourceCommitSha,
  eligibilityId: eligibility.eligibilityId,
  requiredEvidenceLaneIds: [...PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS],
  targetMode: "memory-match",
  parentEngine: "pairing",
  canonicalReference: {
    component: sampleCanonicalMemoryMatchIntegrationGate.canonicalSurface.component,
    route: sampleCanonicalMemoryMatchIntegrationGate.canonicalSurface.route,
    scoringProfile: sampleCanonicalMemoryMatchIntegrationGate.canonicalSurface.scoringProfile,
  },
  permittedContents: [
    "A quarantined prototype source or archive manifest only",
    "The exact reviewed JSON fixture used for replay",
    "A standard event log with tenant, unit, launch, student-session, and replay metadata",
    "A target-language audio cue map for cards, instructions, and feedback",
    "A deterministic scoring replay against pairing-reinforcement-v1",
    "Mobile, touch, keyboard, focus, readable-control, and reduced-motion evidence",
    "Wrapper adapter notes describing platform-owned state boundaries",
    "SHA-256 checksums for every returned artifact",
  ],
  requiredReturnArtifacts: [
    "return-package-manifest.json",
    "reviewed-unit-fixture.json",
    "standard-event-replay.json",
    "audio-coverage-report.json",
    "deterministic-scoring-replay.json",
    "mobile-accessibility-report.json",
    "wrapper-adapter-review.md",
    "source-manifest.sha256",
    "README.md with setup and known limitations",
  ],
  acceptanceChecks: [
    "Candidate profile is memory-match on the pairing parent engine.",
    "Frozen snapshot and source commit match the existing source evidence record.",
    "Fixture replay uses reviewed UnitPayload data and does not hard-code MiniStar content.",
    "Event replay proves game_started, round_shown, audio_requested, answer_submitted, answer_result, mastery_updated, and game_completed.",
    "Every learner-facing text item has target-language tap-to-speak or replay evidence.",
    "Support language cannot unlock progress, mastery, rewards, or assignments.",
    "Scoring and Star Dust remain platform-owned, deterministic, and reward-safe.",
    "Prototype can be removed without changing the canonical route or route registry.",
  ],
  blockedActions: [
    "No direct source import into apps/web or apps/ai-service",
    "No replacement of the canonical Memory Match route",
    "No scene-owned scoring, Star Dust, rewards, persistence, or progression",
    "No route registry, audio manifest, or package manifest mutation",
    "No package promotion, release, QR activation, or student assignment",
  ],
  humanAction:
    "A human may send this checklist to Z.ai for an evidence-only return packet. A returned packet still requires Codex review before any integration proposal.",
};

export function validateMemoryMatchEvidenceHandoffPacket(
  packet: MemoryMatchEvidenceHandoffPacket,
): string[] {
  const errors: string[] = [];
  if (packet.targetMode !== "memory-match" || packet.parentEngine !== "pairing") {
    errors.push("Memory Match evidence handoff must bind memory-match to pairing.");
  }
  if (packet.handoffState !== "ready-for-human-handoff" || packet.integrationState !== "blocked") {
    errors.push("Memory Match evidence handoff must be human-handoff ready while integration remains blocked.");
  }
  if (!packet.eligibilityId || packet.requiredEvidenceLaneIds.length !== PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS.length) {
    errors.push("Memory Match evidence handoff must bind the complete frozen-candidate eligibility record.");
  }
  for (const laneId of PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS) {
    if (!packet.requiredEvidenceLaneIds.includes(laneId)) errors.push(`Memory Match evidence handoff must preserve eligibility lane ${laneId}.`);
  }
  errors.push(
    ...validatePhaserCandidateSourceIdentity({
      sourceRepository: packet.sourceRepository,
      sourceSnapshotId: packet.sourceSnapshotId,
      sourceCommitSha: packet.sourceCommitSha,
    }).map((error) => `Memory Match evidence handoff ${error.toLowerCase()}`),
  );
  if (packet.permittedContents.length !== 8) {
    errors.push("Memory Match evidence handoff must define eight permitted evidence content categories.");
  }
  if (packet.requiredReturnArtifacts.length !== 9) {
    errors.push("Memory Match evidence handoff must define nine required return artifacts.");
  }
  if (packet.acceptanceChecks.length !== 8) {
    errors.push("Memory Match evidence handoff must define eight acceptance checks.");
  }
  if (!packet.blockedActions.some((action) => action.includes("direct source import"))) {
    errors.push("Memory Match evidence handoff must block direct source import.");
  }
  if (!packet.blockedActions.some((action) => action.includes("student assignment"))) {
    errors.push("Memory Match evidence handoff must block student assignment.");
  }
  return errors;
}

export const sampleMemoryMatchEvidenceHandoffPacketErrors = validateMemoryMatchEvidenceHandoffPacket(
  sampleMemoryMatchEvidenceHandoffPacket,
);
