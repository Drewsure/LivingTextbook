# ADR 0671: Ready And Blocked Report Fixture

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

The teacher report sample must include both an intentionally incomplete game
attempt and a complete retry that passes canonical evidence validation. The
fixture remains read-only and must not authorize persistence, export, or live
classroom use.

## Rationale

A report boundary is easier to review when it demonstrates the full decision
surface: incomplete evidence is blocked, while a properly formed retry can be
recognized as ready. A fixture containing only blocked groups cannot prove that
the positive path is wired correctly.

## Consequences

- Report previews show the distinction between blocked and ready attempts.
- Retry separation and canonical validation are exercised through realistic
  sample data.
- The sample remains clearly labeled and cannot become a production report.
