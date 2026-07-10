# DR-122: Teacher Report Package Boundary

## Decision

Add a teacher-visible report package boundary to session monitor pages.

## Reason

Teacher reports must not become a raw dump of every recorded event. A white-label pilot needs a clear boundary that separates learning evidence, support-only signals, excluded sensitive data, and export blockers before any backend or school reporting workflow is selected.

## Standard

- Teacher session pages show `Report package boundary`.
- Learning evidence is separated from support-only media, background audio, support-language, and route-guidance signals.
- Support-only signals cannot unlock progression, award mastery, or award Star Dust.
- Core reports exclude raw learner audio, learner transcripts, open-ended AI Tutor chat, unreviewed notes, and private identifiers unless a future premium policy explicitly permits them.
- Live export remains blocked until policy, persistence, retention, access control, and tenant report format approval are accepted.
- The route verifier checks the boundary remains visible on MiniStar and sample-publisher teacher session routes.
