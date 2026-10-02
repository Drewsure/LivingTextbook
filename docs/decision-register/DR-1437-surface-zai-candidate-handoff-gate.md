# DR-1437: Surface The Z.ai Candidate Handoff Gate

The pilot requirements surface now documents the exact external candidate
root, the `npm run verify:phaser-candidate-package` command, and a combined
read-only pilot audit. It explicitly distinguishes a frozen Z.ai snapshot from
the required returned package containing `evidence/return-package.json`.

The handoff remains review-only. No source import, route replacement, scoring
ownership, persistence write, package promotion, or student activation is
authorized by this surface.

See ADR 1437 and
`apps/web/src/features/pilot/PublisherPilotInputKitPanel.tsx`.
