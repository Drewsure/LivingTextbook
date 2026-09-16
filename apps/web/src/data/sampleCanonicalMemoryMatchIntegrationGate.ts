import { getPhaserCandidateProfile } from "@living-textbook/content-model";
import { sampleAiPrototypeIntegrationReadinessGates } from "@/data/sampleAiPrototypeIntegrationReadinessGate";
import { sampleAiPrototypeIntegrationPlans } from "@/data/sampleAiPrototypeIntegrationPlan";
import { samplePhaserCandidateContractReviews } from "@/data/samplePhaserCandidateContractReview";

export type MemoryMatchGateStatus = "blocked" | "review-only";
export type MemoryMatchGateEvidenceStatus = "reviewed" | "pending-review" | "blocked";

export interface CanonicalMemoryMatchEvidenceLane {
  laneId: string;
  label: string;
  status: MemoryMatchGateEvidenceStatus;
  sourceRecord: string;
  evidence: string;
}

export interface CanonicalMemoryMatchIntegrationGate {
  gateId: string;
  tenantId: string;
  unitKey: string;
  gameMode: "memory-match";
  parentEngine: "pairing";
  status: MemoryMatchGateStatus;
  summary: string;
  canonicalSurface: {
    component: string;
    route: string;
    routeFlow: string;
    scoringProfile: string;
  };
  frozenCandidate: {
    repository: string;
    snapshotId: string;
    commitSha: string;
    sourceFiles: number;
  };
  evidenceLanes: CanonicalMemoryMatchEvidenceLane[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

const candidate = samplePhaserCandidateContractReviews.find((review) => review.gameMode === "memory-match");
const readinessGate = sampleAiPrototypeIntegrationReadinessGates.find((gate) => gate.tenantId === "ministar");
const integrationPlan = sampleAiPrototypeIntegrationPlans.find((plan) => plan.tenantId === "ministar");
const candidateProfile = getPhaserCandidateProfile("memory-match", "pairing");

if (!candidate || !readinessGate || !integrationPlan || !candidateProfile) {
  throw new Error("Canonical Memory Match integration gate requires the mapped candidate, readiness gate, plan, and profile.");
}

const readinessByRecord = new Map(readinessGate.evidenceChecks.map((check) => [check.sourceRecord, check]));

function readinessStatus(sourceRecord: string): MemoryMatchGateEvidenceStatus {
  const status = readinessByRecord.get(sourceRecord)?.status;
  return status === "reviewed" ? "reviewed" : status === "pending-review" ? "pending-review" : "blocked";
}

export const sampleCanonicalMemoryMatchIntegrationGate: CanonicalMemoryMatchIntegrationGate = {
  gateId: "canonical-memory-match-integration-gate-ministar",
  tenantId: "ministar",
  unitKey: "ministar-l1-u1-greetings",
  gameMode: "memory-match",
  parentEngine: "pairing",
  status: candidate.approval.status === "blocked" || readinessGate.status === "blocked" ? "blocked" : "review-only",
  summary:
    "The canonical Memory Match route is the platform reference surface. The frozen Phaser candidate is mapped against it as evidence only; it cannot replace the route or own payload, audio, scoring, persistence, or progression.",
  canonicalSurface: {
    component: "apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx",
    route: "apps/web/src/app/memory/[code]/page.tsx",
    routeFlow: "MemoryMatchDemoFlow",
    scoringProfile: "pairing-reinforcement-v1",
  },
  frozenCandidate: {
    repository: candidate.sourceRepository,
    snapshotId: candidate.sourceSnapshotId,
    commitSha: candidate.sourceCommitSha,
    sourceFiles: candidate.sourceFiles.length,
  },
  evidenceLanes: [
    {
      laneId: "candidate-profile",
      label: "Candidate profile and parent engine",
      status: candidateProfile.parentEngine === candidate.parentEngine ? "reviewed" : "blocked",
      sourceRecord: "phaser_candidate_profile",
      evidence: `${candidateProfile.label} is bound to the ${candidateProfile.parentEngine} parent engine with ${candidateProfile.requiredScenarios.length} required scenarios.`,
    },
    {
      laneId: "source-freeze",
      label: "Frozen source provenance",
      status: candidate.sourceCommitSha && candidate.sourceSnapshotId ? "reviewed" : "blocked",
      sourceRecord: "phaser_source_evidence_manifest",
      evidence: `${candidate.sourceRepository} is referenced by snapshot ${candidate.sourceSnapshotId} at ${candidate.sourceCommitSha}.`,
    },
    {
      laneId: "wrapper",
      label: "Pairing wrapper adapter",
      status: readinessStatus("prototype_wrapper_adapter_review"),
      sourceRecord: "prototype_wrapper_adapter_review",
      evidence: "The candidate must consume the validated UnitPayload and return platform-owned events without route or state ownership.",
    },
    {
      laneId: "fixture",
      label: "Reviewed JSON fixture replay",
      status: readinessStatus("prototype_fixture_replay_report"),
      sourceRecord: "prototype_fixture_replay_report",
      evidence: "The candidate must replay the supplied unit fixture rather than hard-code MiniStar terms or pairing data.",
    },
    {
      laneId: "events",
      label: "Canonical event replay",
      status: readinessStatus("prototype_event_replay_report"),
      sourceRecord: "prototype_event_replay_report",
      evidence: "The replay must prove started, round, submitted, result, mastery, completed, and audio-requested evidence in order.",
    },
    {
      laneId: "audio",
      label: "Target-language audio coverage",
      status: readinessStatus("prototype_audio_coverage_report"),
      sourceRecord: "prototype_audio_coverage_report",
      evidence: "Every learner-facing card and instruction must resolve through the reviewed target-language cue manifest.",
    },
    {
      laneId: "scoring",
      label: "Deterministic scoring replay",
      status: readinessStatus("prototype_scoring_replay_report"),
      sourceRecord: "prototype_scoring_replay_report",
      evidence: `The wrapper must use ${candidateProfile.targetMode} scoring through ${"pairing-reinforcement-v1"}; the scene cannot award Star Dust.`,
    },
    {
      laneId: "mobile-accessibility",
      label: "Mobile and accessibility evidence",
      status: readinessStatus("prototype_mobile_accessibility_report"),
      sourceRecord: "prototype_mobile_accessibility_report",
      evidence: "Touch, keyboard or assist controls, readable text, focus behavior, and reduced-motion notes are required.",
    },
    {
      laneId: "codex-decision",
      label: "Codex integration decision",
      status: readinessStatus("codex_integration_review_decision"),
      sourceRecord: "codex_integration_review_decision",
      evidence: "A reviewed decision is required before an integration patch can be proposed; this gate does not grant that decision.",
    },
  ],
  blockedActions: [
    "No direct source import",
    "No replacement of the canonical Memory Match route",
    "No scene-owned scoring, rewards, or progression",
    "No browser persistence ownership",
    "No audio manifest mutation",
    "No package promotion or student assignment",
  ],
  nextRequiredRecords: [
    ...integrationPlan.nextReviewRecords,
    "Explicit Codex decision comparing the candidate with the canonical PairingMemoryMatchGame",
  ],
};

export const sampleCanonicalMemoryMatchIntegrationGateErrors = validateCanonicalMemoryMatchIntegrationGate(
  sampleCanonicalMemoryMatchIntegrationGate,
);

export function validateCanonicalMemoryMatchIntegrationGate(
  gate: CanonicalMemoryMatchIntegrationGate,
): string[] {
  const errors: string[] = [];
  if (gate.gameMode !== "memory-match" || gate.parentEngine !== "pairing") {
    errors.push("Memory Match gate must bind memory-match to the pairing parent engine.");
  }
  if (!gate.canonicalSurface.component.includes("PairingMemoryMatchGame")) {
    errors.push("Memory Match gate must name the canonical pairing wrapper.");
  }
  if (!gate.canonicalSurface.route.includes("memory/[code]")) {
    errors.push("Memory Match gate must name the canonical memory route.");
  }
  if (!gate.frozenCandidate.commitSha || !gate.frozenCandidate.snapshotId) {
    errors.push("Memory Match gate must preserve frozen candidate provenance.");
  }
  if (gate.evidenceLanes.length !== 9) {
    errors.push("Memory Match gate must contain nine evidence lanes.");
  }
  if (gate.status === "blocked" && !gate.evidenceLanes.some((lane) => lane.status === "blocked")) {
    errors.push("Blocked Memory Match gate must expose at least one blocked evidence lane.");
  }
  if (!gate.blockedActions.some((action) => action.includes("direct source import"))) {
    errors.push("Memory Match gate must block direct source import.");
  }
  if (!gate.blockedActions.some((action) => action.includes("student assignment"))) {
    errors.push("Memory Match gate must block student assignment.");
  }
  return errors;
}
