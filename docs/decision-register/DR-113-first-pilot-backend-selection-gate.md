# DR-113: First Pilot Backend Selection Gate

## Decision

Do not choose a production backend provider until privacy, reporting, release-control, schema, migration sequence, deployment mode, and cost limits are reviewed together.

## Reason

The white-label product must remain portable across hosted PWA and closed/local textbook companion deployments. Choosing a vendor too early can create avoidable cost, lock-in, and reporting/privacy mistakes before the pilot requirements are stable.

## Standard

- Backend selection remains a gate, not a default assumption.
- The first backend must support reviewed package records, stable QR routes, teacher launch sessions, coded learner progress, and report policy records.
- Raw learner audio and AI Tutor transcripts are not stored in the core schema by default.
- AI Tutor and speech scoring remain optional premium tenant choices.
- Hosted pilot records must stay exportable for a later local classroom package.

