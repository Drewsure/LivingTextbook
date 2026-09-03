export type BuildStageStatus = "ready" | "review-only" | "blocked";

export interface BuildStageLane {
  laneId: string;
  label: string;
  status: BuildStageStatus;
  summary: string;
  evidence: string;
  nextStep: string;
}

export interface BuildStageMap {
  mapId: string;
  label: string;
  summary: string;
  currentBuildPoint: string;
  zaiIntakeRule: string;
  lanes: BuildStageLane[];
}

export const sampleBuildStageMap: BuildStageMap = {
  mapId: "living-textbook-foundation-stage-2026-08",
  label: "Build stage map",
  currentBuildPoint: "Foundation structure and playable route shell",
  summary:
    "This review map answers where the platform currently is: the white-label app shell, curated route structure, active demo game routes, upload governance, and backend-neutral contracts are being hardened before premium game design or outside prototype intake.",
  zaiIntakeRule:
    "Z.ai intake waits for Codex integration gate: outside prototypes remain useful inventory, but no Z.ai code is imported until return review, wrapper adapter, fixture replay, audio coverage, scoring replay, and Codex integration decision records are ready.",
  lanes: [
    {
      laneId: "frontend-structure",
      label: "Frontend structure ready",
      status: "ready",
      summary:
        "The PWA shell, tenant theming, teacher/admin review pages, student front doors, activity hubs, media routes, print previews, and game route wrappers are active in local preview.",
      evidence: "86 active route checks pass, including MiniStar and sample publisher student, teacher, media, print, assignment, report, deployment, local companion, and QR resolver routes.",
      nextStep: "Keep reducing one-off UI before adding premium skins or micro-interactions.",
    },
    {
      laneId: "active-game-shell",
      label: "Active playable route shell ready",
      status: "ready",
      summary:
        "The non-entry playable routes share standard assignment settings, unit progress, completion-next routing, earned reward display, and event log scaffolding.",
      evidence:
        "Memory Match, Match Up, Label It, Quiz, True or False, Balloon Pop, Type Answer, Spelling Practice, Fill in the Blank, Sentence Builder, and Speak It use the shared playable route shell.",
      nextStep: "Use this shell as the wrapper contract for future Phaser or premium game surfaces.",
    },
    {
      laneId: "backend-contracts",
      label: "Backend contract review-only",
      status: "review-only",
      summary:
        "The storage model, migration candidates, local/hosted write intents, school policy gates, report boundaries, and upload evidence records are defined but not implemented as live writes.",
      evidence: "Backend storage and local bundle readiness pass while object storage, local evidence folders, setting saves, report export, signed approvals, cache writes, media pre-cache, and learner data writes remain blocked.",
      nextStep: "Select the first hosted/local persistence adapter only after policy and release-control gates stay aligned.",
    },
    {
      laneId: "live-pilot",
      label: "Live classroom pilot blocked",
      status: "blocked",
      summary:
        "The app is demo-ready for controlled review but not yet live-pilot-ready for real learner data, production accounts, report export, or school launch approval.",
      evidence: "Classroom launch gate, school policy acceptance, evidence export, attachment storage, and release-state mutation remain blocked on teacher/admin surfaces.",
      nextStep: "Run teacher dry-run evidence, choose persistence, close media rights, and record school policy acceptance before live pilots.",
    },
    {
      laneId: "game-design",
      label: "Game design stage next but controlled",
      status: "review-only",
      summary:
        "The platform is approaching deeper game design, but new game work should enter through parent-engine contracts, audio coverage, settings profiles, and route verification instead of one-off static pages.",
      evidence: "Game mode catalog, scoring profiles, settings profiles, activity compatibility, package readiness, and route verification already guard active modes.",
      nextStep: "Add new game modes only when the parent engine, event contract, audio plan, scoring profile, and route shell are specified first.",
    },
  ],
};
