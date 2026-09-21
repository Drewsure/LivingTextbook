# DR-986: Teacher Event Review Panel

## Decision

Add a teacher-session review panel that consumes the launch-scoped event
listing through the authorized same-origin API path. Keep the panel summary
only and preserve the server as the source of truth for privacy and taxonomy.

## Required Invariants

- The panel is read-only and launch-scoped.
- It displays pseudonymous learner slots, mode, event count, and completion
  count only.
- Raw event objects, learner audio, and transcripts are never rendered.
- Authorization changes cause a re-read, not an implicit authorization grant.
- Empty, protected, policy-blocked, and unavailable results remain distinct.

## Evidence

- ADR 0914
- `apps/web/src/features/persistence/HostedProgressEventReviewPanel.tsx`
- `apps/web/src/features/persistence/hostedProgressionPersistenceClient.ts`
