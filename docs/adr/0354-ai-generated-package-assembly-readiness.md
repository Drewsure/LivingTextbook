# ADR 0354: AI Generated Package Assembly Readiness

Status: accepted

## Context

Generated package work now has manifest, promotion checklist, publish readiness, and release candidate previews. The next risk is allowing those records to appear complete without one combined assembly decision that checks teacher approval evidence, media-rights evidence, target-language audio approval, and tenant-specific language boundaries.

## Decision

Add review-only AI generated package assembly readiness previews to tenant generator routes.

The preview combines manifest completeness, promotion checklist status, publish readiness, release candidate handoff, teacher approval evidence, media-rights evidence, target-language audio approval, and support-language boundary lanes into one blocked assembly decision.

## Consequences

- Reviewers can see why a generated package is not ready before package writes exist.
- Package assembly, route registry writes, media playlist writes, local bundle writes, assignments, student-ready markers, and support-language-only assembly remain blocked.
- MiniStar readiness must preserve English as the target-language assembly trigger and keep early Japanese hiragana support support-only.
