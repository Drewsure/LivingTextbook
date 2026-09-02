export type PrototypeIntakeAlertStatus = "not-ready" | "ready-for-review" | "blocked";

export interface PrototypeIntakeAlert {
  alertId: string;
  label: string;
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
  status: "not-ready",
  summary:
    "Codex will explicitly alert the user when the LivingTextbook foundation is ready for controlled Z.ai game intake. Until then, Z.ai work remains external prototype inventory, not a source for direct app integration.",
  humanSignalRule:
    "Human handoff signal: Codex will ask for specific Z.ai branches, archives, demo links, or fixture folders only after the intake alert changes from not-ready to ready-for-review.",
  currentHumanAction:
    "Current human action: keep Z.ai builds isolated in Drewsure/ministar-lab and preserve their prompts, fixture JSON, screenshots, and notes for later review.",
  notNeededYet: [
    "No Z.ai source handoff requested yet",
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
