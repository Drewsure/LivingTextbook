# DR-088: Persistence Event Taxonomy Write Intents

## Decision

Progress-event persistence write intents must declare that they preserve event effect taxonomy.

## Reason

Backend schema fields are not enough if the adapter handoff forgets the same rule. Hosted and local storage must both preserve whether an event is progress-affecting, report-only, or support-only.

## Standard

- Progress event write intents include `preservesEventEffectTaxonomy: true`.
- Validation fails when a progress-event-stream write intent omits the taxonomy guarantee.
- The persistence readiness panel shows taxonomy preservation for progress-event writes.

