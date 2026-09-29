# DR-1228: Quarantine Package Handoff Preview

Date: 2026-09-29  
Status: Accepted

The controlled publisher intake now links an authorized reviewer from a real
quarantine record to a deterministic candidate package-handoff preview. The
preview carries tenant, source, unit, package, admission, evidence-packet,
checksum, and payload-presence identities, while retaining pending evidence
blockers and provider-neutral storage gates.

The preview is deliberately not a durable evidence record. No file, evidence
row, package JSON, route, playlist, game, assignment, QR alias, promotion, or
student-facing record is written. The next implementation gate is human review
of source-to-package mapping followed by an explicit evidence-storage provider
selection and activation decision.

See ADR 1228.
