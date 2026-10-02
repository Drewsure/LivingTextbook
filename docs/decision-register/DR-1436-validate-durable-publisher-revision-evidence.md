# DR-1436: Validate Durable Publisher Revision Evidence

The publisher handoff now has a read-only validator that reopens the durable
revision record, recomputes the brief checksum, verifies declared file and
omission state, rejects excluded stale artifacts, and fails on tampering. It
does not write or promote anything.

See ADR 1436 and `scripts/verify-publisher-pilot-intake-revision.mjs`.
