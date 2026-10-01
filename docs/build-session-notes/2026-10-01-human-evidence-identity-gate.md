# Build session: Gate saleability on human evidence identity binding

The human evidence validator already checked each policy and release record.
This slice closes the remaining false-ready path: the saleability audit now
requires the validator's cross-record identity binding to be proved before
either human gate is counted. The validator self-test deliberately mutates the
release package identity and expects a blocked result.

This preserves the external, metadata-only, fail-closed boundary. It does not
upload, assemble, print QR codes, activate persistence, or enable students.
Recorded under ADR 1414 / DR-1414.
