# DR-181: Draft Review Handoff Preview

## Decision

Add a read-only review handoff packet to the teacher draft package route.

## Rationale

The platform needs a visible path from local draft edits to verifier and human review, but live submission must wait for persistence, teacher ownership, audio workflow, rights/version checks, route checks, and package approval.

## Implications

- Draft route shows review packet sections.
- Review packet submission remains blocked.
- Student assignment and direct AI publish remain blocked.
- Future submit workflow must preserve these packet sections.

## Next

Connect review handoff to durable draft records and verifier workflow after authentication, persistence, audio policy, and approval workflow are accepted.
