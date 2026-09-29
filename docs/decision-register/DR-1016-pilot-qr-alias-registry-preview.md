# DR-1016: Pilot QR Alias Registry Preview

Status: Accepted

Decision: Bind a review-only QR alias registry preview to the exact pilot
delivery manifest, release receipt, and package QR preview records.

Rationale:

- Printed textbook identities must remain stable across package versions and
  deployment choices.
- Alias, fallback, rollback, and release evidence must be inspected together.
- The current platform must expose this evidence without pretending that a
  durable registry or print authorization already exists.

Consequences:

- Alias identity drift is now visible in the publisher handoff.
- Future durable registry work has a canonical input shape.
- Production QR printing remains blocked until human release, persistence,
  fallback, and rollback gates close.
