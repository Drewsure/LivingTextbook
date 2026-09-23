# ADR 1080: JSON Request Boundary Hardening

## Decision

All browser-facing JSON mutation routes for persistence and session creation
must use one shared request boundary before validation or provider code runs.
The boundary requires `application/json`, rejects invalid or oversized
`Content-Length` values, measures the decoded request body in UTF-8 bytes, and
returns deterministic `415`, `413`, or `400` responses for boundary failures.

The limits are 128 KiB for progression and event writes and 8 KiB for student
and teacher session creation. These are transport limits, not permission to
enable durable writes.

## Rationale

Independent `request.json()` calls made it easy for a future endpoint to omit
content-type enforcement or accept a body larger than the reviewed payload
contract. A shared boundary makes malformed input handling consistent and
keeps untrusted browser data outside adapters, cookies, and provider logic.

## Consequences

- Clients must send JSON with the `application/json` content type.
- The existing browser clients already satisfy this contract.
- Persistence provider selection, authorization, and durable-write gates are
  unchanged and still fail closed.
- New JSON mutation routes must use the shared helper and add a focused
  verifier assertion before they can join the foundation gate.

## Verification

- `scripts/verify-request-boundary.mjs`
- `npm run verify:persistence-runtime`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

