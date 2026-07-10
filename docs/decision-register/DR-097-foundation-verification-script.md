# DR-097: Foundation Verification Script

## Decision

Add `npm run verify:foundation` as the standard local foundation check.

## Reason

The recurring local verification sequence is typecheck, production build, and active route verification. A single command lowers friction and keeps future sessions consistent.

## Standard

- The command runs typecheck, webpack production build, and active route verification.
- The local dev server must already be running before the route verification stage.
- This command supplements, not replaces, visual browser checks.
