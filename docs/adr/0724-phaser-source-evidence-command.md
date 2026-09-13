# ADR 0724: Expose the Frozen Phaser Source Evidence Check

## Status

Accepted

## Decision

Expose `scripts/verify-phaser-source-evidence.mjs` through the root command
`npm run verify:phaser-source-evidence`.

The command remains an identity and reproducibility check for the isolated
frozen Z.ai snapshot. It may use the default review folder or the explicit
`LIVING_TEXTBOOK_ZAI_REVIEW_ROOT` override. It does not import source, activate
routes, write learner data, or change integration status.

## Consequences

The documented procedure is directly runnable from the repository, reducing
operator error during external candidate review. The command remains outside
the canonical foundation suite because the frozen snapshot is intentionally
not part of the repository. A passing hash check still requires a separate
candidate return package and Codex integration decision.
