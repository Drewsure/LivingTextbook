# DR-238: Evidence Packet Storage Contract

## Decision

Promote evidence packets into the backend-neutral storage plan as `evidence_packet` records with schema, migration, adapter, and durable-record coverage.

## Rationale

Evidence packets must become durable before real upload controls, asset editors, media processing, playlist creation, signed approvals, release promotion, local activation, or assignment shortcuts exist. A generic record keeps upload, Labelled Diagram, media, local-bundle, and future review flows aligned across hosted and local deployments.

## Implications

- Backend schema includes `evidence_packet`.
- Migration candidates include `m035-evidence-packet-records`.
- Migration specs include `spec-evidence-packet`.
- Hosted and local adapters include evidence packet write intents.
- Durable records include `evidence-packet-record` and an `evidence-packet-boundary`.
- Evidence packets block evidence upload, signed approval capture, promotion, and student-facing use until identity, policy, storage, and release gates pass.

## Next

Only implement live evidence upload, signed approval capture, or release-state mutation after authentication, retention/export policy, storage adapters, and release-control gates are accepted.
