# Teacher Operations Authorization Checks

This check protects the tenant-scoped, read-only persistence history boundary.

- `npm run verify:teacher-operations-auth` must pass.
- Teacher access must use a separate signed, expiring HttpOnly cookie with the
  `persistence:read` scope.
- The student session cookie must not authorize teacher operations history.
- Teacher session issuance must require the deployment review code and an
  explicit tenant allowlist.
- The operations route must require a tenant ID and matching teacher scope
  before it can return any receipt, including in rehearsal mode.
- Receipt history must be filtered by a one-way tenant digest. Platform-wide
  backup and restore receipts must not appear in a tenant teacher response.
- The browser must receive no review code, signing secret, persistence token,
  database path, learner record, or tenant digest.
- The teacher surface remains read-only: no backup, restore, deletion, export,
  launch, or release mutation controls are permitted.

This is a closed-pilot access boundary. A production tenant should replace the
review-code exchange with its approved identity provider while preserving the
same claims, scope, tenant binding, expiry, and read-only contract.
