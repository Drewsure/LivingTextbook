# ADR 0710: Canonical Game Event Identity

## Status

Accepted for canonical game integration.

## Decision

Every event in a canonical game evidence sequence must carry tenant metadata and
non-blank unit, launch, and student-session identity. Optional comparison
arguments may verify that identity matches a known route, but they are not
required to make the identity fields present.

## Rationale

Canonical events feed progression, reports, and future hosted/local persistence.
Allowing an unbound event sequence creates an ambiguity between tenants or
student sessions and weakens the white-label boundary.

## Verification

The canonical integration verifier checks the shared contract markers. The
runtime behavior harness rejects missing tenant metadata and missing launch
identity while preserving a valid fully bound sequence.
