import {
  derivePrototypeIntakeAlertDecision,
  validatePrototypeIntakeAlertAlignment,
  validatePrototypeIntakeAlert,
} from "@living-textbook/content-model/src/prototypeIntakeAlert";
import { samplePrototypeIntakeReadinessSummary } from "@/data/samplePrototypeIntakeReadinessSummary";

export type PrototypeIntakeAlertStatus = "not-ready" | "ready-for-review" | "blocked";

export interface PrototypeIntakeAlert {
  alertId: string;
  label: string;
  tenantId: string;
  status: PrototypeIntakeAlertStatus;
  summary: string;
  humanSignalRule: string;
  currentHumanAction: string;
  notNeededYet: string[];
  readyWhen: string[];
  requiredEvidence: string[];
  blockedUntilReady: string[];
  ownerRule: string;
}

export const samplePrototypeIntakeAlert: PrototypeIntakeAlert = {
  alertId: "zai-prototype-intake-alert-foundation",
  label: "Z.ai prototype intake alert",
  tenantId: "platform",
  status: derivePrototypeIntakeAlertDecision(samplePrototypeIntakeReadinessSummary),
  summary:
    "The LivingTextbook foundation gate is open and the frozen Z.ai snapshot has been received. Codex review is now open for the candidate, but the snapshot is not approved for direct app integration.",
  humanSignalRule:
    "Human handoff signal: the exact Z.ai branch, commit, tag, and verification record are now identified; Codex must complete evidence and wrapper review before issuing an integration green light.",
  currentHumanAction:
    "Current human action: preserve the frozen main branch and tag in Drewsure/ministar-lab; no source copy, route activation, or student assignment is needed while Codex reviews the candidate.",
  notNeededYet: [
    "No direct Z.ai source import requested",
    "No Phaser import requested yet",
    "No archive upload requested yet",
    "No pull request requested yet",
    "No app patch requested yet",
  ],
  readyWhen: [
    "Parent engine readiness is accepted for the target game family",
    "Active route replay checks pass for the matching game mode",
    "Prototype review route names required fixture, audio, event, scoring, mobile, and accessibility evidence",
    "Returned prototype scope is limited to Drewsure/ministar-lab or another explicitly approved prototype repository",
    "Codex integration review confirms wrapper-first import is possible",
  ],
  requiredEvidence: [
    "JSON fixture replay",
    "Standard event replay",
    "Target-language audio coverage",
    "Deterministic scoring replay",
    "Mobile layout evidence",
    "Phaser wrapper review when Phaser is used",
  ],
  blockedUntilReady: [
    "No direct app file writes",
    "No route creation",
    "No scoring mutation",
    "No reward inventory mutation",
    "No audio manifest mutation",
    "No playlist creation",
    "No package promotion",
    "No student assignment",
  ],
  ownerRule:
    "Codex owns architecture, schema discipline, wrapper/integration review, final merge decisions, and the user alert that controlled Z.ai intake can begin.",
};

export function createPrototypeIntakeAlert(
  tenantId: string,
  readinessSummary = samplePrototypeIntakeReadinessSummary,
): PrototypeIntakeAlert {
  return {
    ...samplePrototypeIntakeAlert,
    alertId: `${samplePrototypeIntakeAlert.alertId}-${tenantId}`,
    tenantId,
    status: derivePrototypeIntakeAlertDecision(readinessSummary),
  };
}

export const samplePrototypeIntakeAlertErrors = [
  ...validatePrototypeIntakeAlert(samplePrototypeIntakeAlert),
  ...validatePrototypeIntakeAlertAlignment(samplePrototypeIntakeAlert, samplePrototypeIntakeReadinessSummary),
];
