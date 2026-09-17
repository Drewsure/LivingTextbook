# DR-897: Pilot Evidence Envelope

## Decision

Introduce one typed, provider-neutral pilot evidence envelope derived from the
validated browser rehearsal record. Teacher reporting uses it as the coherent
session summary for the canonical Front Door -> Flashcards -> Memory Match ->
Sentence Builder -> Teacher Report journey.

## Included

- Tenant, package, launch, unit, student-session, and target-language identity.
- Ordered workflow, deterministic stage status, event counts, event types,
  completed modes, progression snapshot, and stable idempotency key.
- Explicit exclusions for raw learner audio, transcripts, support-language
  progress, durable writes, and live classroom records.
- Browser-rehearsal derivation independent of the future hosted or local
  persistence provider.

## Excluded

- Hosted storage, report export, assignment results, live classroom status,
  reward mutation, and student unlock authority from the envelope itself.
