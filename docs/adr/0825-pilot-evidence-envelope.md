# ADR 0825: Pilot Evidence Envelope

## Status

Accepted for browser rehearsal and teacher review.

## Context

The teacher report already reconciles local evidence and derives activity
cards, but the underlying session summary was not represented as one reusable
provider-neutral packet. A shared envelope is needed before the same evidence
can be evaluated by hosted, local, or future export adapters.

## Decision

Create the pilot evidence envelope from the validated local browser record.
Bind it to tenant, package, launch, unit, student-session, and target-language
identity. Preserve the ordered five-step workflow and deterministic stage
summaries. Keep privacy exclusions explicit and keep the envelope
browser-rehearsal-only until a future adapter passes its policy gates.

## Consequences

- Teacher reporting has one coherent, reusable session summary.
- Route retries remain safe because the envelope uses stable identity and
  deterministic derived status rather than new mutation events.
- Hosted and local adapters receive a clear contract without being activated.
- The envelope cannot be mistaken for a live classroom record or report export.
