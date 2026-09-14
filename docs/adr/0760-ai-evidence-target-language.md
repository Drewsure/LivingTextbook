# ADR 0760: AI Evidence Target Language

## Status

Accepted

## Context

The AI generator review workbench assembles external prototype briefs and
audio-coverage reports from reviewed source records. Those builders had a
sample-only English fallback when the source target language was absent. That
could hide a white-label package defect before evidence review.

## Decision

Require an explicit, non-blank target language during AI evidence-package
assembly. Fail closed when the reviewed request or audio plan does not provide
one, and guard both builders against silent English defaults.

## Consequences

AI evidence remains tenant-correct before a prototype is considered for
canonical integration. No provider call, billing, assignment, progression,
persistence, reporting, or Phaser source-promotion authority is enabled.

## Verification

Run `npm run verify:ai-generator`, the web typecheck, and the full foundation
suite.
