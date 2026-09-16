# DR-890: Tenant-Scoped Teacher Operations Authorization

The persistence operations history is now protected by a separate signed and
expiring teacher session. It requires the teacher role, the
`persistence:read` scope, a matching tenant ID, and an explicit deployment
tenant allowlist. The student session cookie cannot authorize this history.

Identity-scoped retention receipts are filtered by one-way tenant digest;
platform-wide backup and restore receipts remain hidden from tenant teachers.
The browser remains read-only and receives no review code, secret, token,
database path, learner record, or tenant digest.

This is a closed-pilot bridge to an approved production identity provider, not
the final white-label authentication product. See ADR 0818 and
`docs/verification/TEACHER_OPERATIONS_AUTHORIZATION_CHECKS.md`.
