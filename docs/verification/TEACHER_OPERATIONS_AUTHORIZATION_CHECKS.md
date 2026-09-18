# Teacher Operations Authorization Checks

This check protects the tenant-scoped, read-only persistence history boundary.

- `npm run verify:teacher-operations-auth` must pass.
- `node scripts/verify-teacher-operations-runtime.mjs` must pass when a
  review-code test deployment is running with the required runtime variables.
- Teacher access must use a separate signed, expiring HttpOnly cookie with the
  `persistence:read` scope.
- The student session cookie must not authorize teacher operations history.
- Teacher session issuance must require the deployment review code and an
  explicit tenant allowlist.
- Existing signed cookies must be rechecked against the current tenant
  allowlist on every session-status and operations read, so tenant removal
  takes effect before cookie expiry.
- A page refresh may discover only the current signed teacher session; it must
  not accept a client-supplied tenant or review code as proof of access.
- The operations route must require a tenant ID and matching teacher scope
  before it can return any receipt, including in rehearsal mode.
- Unauthorized operation-history responses must not disclose provider,
  durability, schema, database paths, or evidence state.
- Receipt history must be filtered by a one-way tenant digest. Platform-wide
  backup and restore receipts must not appear in a tenant teacher response.
- The browser must receive no review code, signing secret, persistence token,
  database path, learner record, or tenant digest.
- The teacher surface remains read-only: no backup, restore, deletion, export,
  launch, or release mutation controls are permitted.

This is a closed-pilot access boundary. A production tenant should replace the
review-code exchange with its approved identity provider while preserving the
same claims, scope, tenant binding, expiry, and read-only contract.

## Runtime verifier variables

```text
LIVING_TEXTBOOK_RUNTIME_URL=http://127.0.0.1:3035
LIVING_TEXTBOOK_RUNTIME_TENANT=sample-publisher
LIVING_TEXTBOOK_RUNTIME_OTHER_TENANT=other-tenant
LIVING_TEXTBOOK_RUNTIME_REVIEW_CODE=<deployment review code>
```

Set `LIVING_TEXTBOOK_REVOKED_RUNTIME_URL` to a second deployment using the
same signing secret but an allowlist that no longer includes the first tenant
to verify immediate revocation of the previously issued cookie.
