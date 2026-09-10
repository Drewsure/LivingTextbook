# DR-615: Progress Event Timestamps

Status: Accepted

Decision: Require progress-event envelopes to carry parseable ISO/RFC3339 timestamps with an explicit timezone.

Rationale:

- Cross-deployment evidence needs deterministic time parsing.
- Loose date strings can differ across runtimes.

Guardrails:

- `Z` or a numeric timezone offset is required.
- Date-only and invalid values block validation.
- The gate remains review-only and side-effect free.

See also: `docs/adr/0543-progress-event-timestamps.md`.
