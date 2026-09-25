# Build Session: Z.ai Memory Match Human Handoff Helper

## Outcome

Added a repeatable PowerShell entry point for the human-side return of the
isolated Memory Match evidence package. The helper requires
`evidence/return-package.json`, can resolve one nested extraction folder, and
rejects placeholder paths, frozen source snapshots, ambiguous packages, and
candidate roots inside `LivingTextbook`.

The helper delegates content validation to
`verify:phaser-candidate-package`; it does not import source, mutate routes,
write persistence, alter scoring or audio manifests, or promote a package.

## Verification evidence

- Full `npm run verify:foundation`: passed.
- Production build: passed with 89 active route checks.
- Frozen snapshot smoke test: rejected because it has no returned
  `evidence/return-package.json`.
- Worktree and remote branch are synchronized after commit `73dbed6c`.

## Human next action

Z.ai must return the separate Memory Match evidence package from
`Drewsure/ministar-lab`. The frozen ZIP remains provenance only. After
extraction, the human runs the helper and sends the branch, commit, candidate
path, and complete verifier output back for Codex review.
