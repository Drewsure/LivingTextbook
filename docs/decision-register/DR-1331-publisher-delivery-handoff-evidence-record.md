# DR-1331: Publisher Delivery Handoff Evidence Record

The live publisher handoff now derives a versioned `PublisherDeliveryHandoffRecord`.
It binds eight evidence identities: source review, package review packet,
delivery manifest, release receipt, package index, assembly request, QR
registry, and closed-local fallback route.

The record also names the expected metadata files and preserves the missing
rollback reference. It is an evidence projection only: no payload bytes,
learner records, package files, QR print artifact, persistence activation, or
student-facing use is created.

See ADR 1332.
