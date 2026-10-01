# ADR 1404: Guarded Source Preflight Evidence Submission Command

## Status

Accepted for the first saleable white-label pilot foundation.

## Context

The source evidence request bridge produces the correct metadata-only JSON, but
manual HTTP submission leaves room for operators to send the wrong fields,
omit the tenant credential, or accidentally treat the request as an upload.

## Decision

Add `scripts/submit-publisher-source-preflight-evidence-request.mjs`. The
command reads a bounded create-once request, validates its review-only shape,
and sends only `{ tenantId, quarantineId, packageId, report }` to the
tenant-bound source-preflight evidence route using the server-side
`LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN`. It does not accept raw file
paths or bytes and reports protected actions as disabled.

## Consequences

- The real publisher handoff has a repeatable submission step.
- Tenant allowlisting and quarantine checksum checks remain server-side.
- A successful response records review evidence only; it does not approve,
  assemble, promote, print, activate, or enable students.
- The command requires the web service and authorized deployment credentials;
  it cannot bypass the production release gate.

## Verification

- `npm run verify:publisher-source-preflight-evidence-submit`
- `npm run verify:publisher-source-preflight-evidence-request`
- `npm run verify:publisher-source-preflight-evidence-binding`
