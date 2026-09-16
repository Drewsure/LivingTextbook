# Authenticated Student Session Checks

These checks protect the first browser-to-durable progression path.

- Server validates tenant, package, launch, entry code, and user code.
- Invalid codes do not receive an authenticated session.
- The session is signed, expiring, HttpOnly, SameSite, and server-only in its
  secret material.
- Browser progression writes require a matching session identity for every
  tenant-scoped field.
- Teacher/server reads use the separate server-only bearer token.
- Stored records preserve `durable-managed` mode.
- Rehearsal mode remains explicitly non-durable when SQLite gates are off.
- A second tenant or altered identity cannot read or write another learner's
  record.
- Temporary SQLite files and sidecars are ignored and removed after testing.

Live evidence should include response status, sanitized response body, restart
read-back, and cross-tenant denial. Do not record cookies, secrets, raw audio,
transcripts, or learner names in evidence packets.
