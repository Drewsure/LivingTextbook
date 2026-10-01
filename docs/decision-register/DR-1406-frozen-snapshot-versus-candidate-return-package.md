# DR-1406: Frozen Snapshot Versus Candidate Return Package

- **Decision:** Treat the frozen MiniStar Phaser ZIP as source context only. The
  next Z.ai handoff must be a separate Memory Match candidate package with
  `evidence/return-package.json` and all required hash-verified evidence lanes.
- **Reason:** Provenance is not enough to prove wrapper compatibility, audio,
  scoring, accessibility, replay, privacy, or integration safety.
- **Boundary:** No archive import, route replacement, scoring mutation, audio
  manifest mutation, package promotion, assignment, or student activation.
- **Verification:** `npm run verify:phaser-candidate-package` after the human
  supplies the isolated returned-package folder, followed by Codex adjudication
  and the canonical game integration checks.
