# ADR 1228: Quarantine Package Handoff Preview

Date: 2026-09-29  
Status: Accepted

## Decision

The pilot will expose a tenant-authorized package-handoff preview after a
quarantine record and admission preview exist. The preview binds the opaque
quarantine identity, source identity, evidence packet identity, and candidate
package identity into one review-only contract.

The preview is not a durable reviewed-evidence record. It cannot write
evidence, select storage, assemble a package, promote an upload, create routes,
playlists, games, assignments, QR aliases, or student-facing content.

## Rationale

This gives a publisher a credible handoff artifact while preserving the
provider-neutral persistence decision. A later storage adapter can consume the
same bounded identity without inventing a second lineage model or silently
turning intake into publication.

## Verification

Run `node scripts/verify-upload-quarantine-package-handoff.mjs` and the full
`npm run verify:foundation` gate after changing this surface. The focused
check is also executed by `npm run verify:upload-quarantine-admission`.
