# DR-124: Teacher Report Package Preview Route

## Decision

Add a read-only teacher report package preview route for each launch session.

## Reason

Teachers, publishers, and school reviewers need to see the exact report package shape before live export exists. A preview route makes the future product tangible while keeping export blocked until policy, persistence, access, retention, and format rules are accepted.

## Standard

- Teacher session pages link to `Open report package preview`.
- Preview routes show `Report package preview` and `Export blocked`.
- Sanitized rows separate learning evidence, support-only signals, and session context.
- Raw learner audio, transcripts, open-ended AI Tutor chat, unreviewed notes, and private identifiers stay excluded.
- MiniStar and sample-publisher launch sessions both use the same preview route pattern.
- The active route verifier checks both report package preview routes.
