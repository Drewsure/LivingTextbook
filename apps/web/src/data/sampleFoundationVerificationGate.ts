export type FoundationVerificationStatus = "pass" | "manual-review" | "blocked";

export interface FoundationVerificationCheck {
  checkId: string;
  label: string;
  command: string;
  status: FoundationVerificationStatus;
  protects: string;
  evidence: string;
  nextStep: string;
}

export interface FoundationVerificationGate {
  gateId: string;
  label: string;
  summary: string;
  canonicalCommand: string;
  lastKnownStatus: FoundationVerificationStatus;
  checks: FoundationVerificationCheck[];
}

export const sampleFoundationVerificationGate: FoundationVerificationGate = {
  gateId: "foundation-verification-2026-07",
  label: "Foundation verification gate",
  summary:
    "This gate is the current no-shortcuts check before connector-side changes are treated as locally verified. It protects schema discipline, reusable game modes, package readiness, local companion honesty, production build health, and active route availability.",
  canonicalCommand: "npm run verify:foundation",
  lastKnownStatus: "pass",
  checks: [
    {
      checkId: "taxonomy-coverage",
      label: "Progress event taxonomy",
      command: "npm run verify:taxonomy",
      status: "pass",
      protects: "Teacher reports and future storage records use the same reviewed event vocabulary.",
      evidence: "The verifier checks shared GameEventType values against the taxonomy registry.",
      nextStep: "Extend only through a reviewed taxonomy revision record.",
    },
    {
      checkId: "game-mode-coverage",
      label: "Game mode catalog",
      command: "npm run verify:game-modes",
      status: "pass",
      protects: "New modes cannot bypass parent-engine mapping, scoring profiles, or learner audio requirements.",
      evidence: "The verifier checks the shared GameModeId union against the active game catalog and scoring map.",
      nextStep: "Keep Z.ai and external prototypes outside platform mode status until this check passes.",
    },
    {
      checkId: "package-readiness",
      label: "Package readiness",
      command: "npm run verify:package-readiness",
      status: "pass",
      protects: "MiniStar and sample publisher packages keep active game/audio, media, front-door, support-language, and AI Tutor policy aligned.",
      evidence: "The verifier checks two sample packages, five active modes, and seven readiness gates.",
      nextStep: "Move from sample source files to durable package manifests after persistence is selected.",
    },
    {
      checkId: "local-bundle-readiness",
      label: "Local bundle readiness",
      command: "npm run verify:local-bundle",
      status: "pass",
      protects: "Closed local companion packages stay preview-only until rights, checksums, installer/update, reporting, QR, and school policy gates are closed.",
      evidence: "The verifier checks two bundle manifests, five local game modes, and six release gate items.",
      nextStep: "Use generated signed manifests when a real local exporter exists.",
    },
    {
      checkId: "web-typecheck-build",
      label: "Web typecheck and build",
      command: "npm run typecheck --workspace @living-textbook/web && npm run build --workspace @living-textbook/web",
      status: "pass",
      protects: "The Next.js app compiles before route or browser verification claims are trusted.",
      evidence: "The build uses the webpack path documented for this Windows environment.",
      nextStep: "Keep the documented webpack workaround until Next/Turbopack is stable in this workspace.",
    },
    {
      checkId: "active-routes",
      label: "Active route checks",
      command: "npm run verify:routes",
      status: "pass",
      protects: "Teacher, student, game, media, report, local companion, and QR routes stay reachable.",
      evidence: "The verifier checks 27 active routes and required page text.",
      nextStep: "Add new active routes to the route matrix before treating them as part of a pilot.",
    },
  ],
};
