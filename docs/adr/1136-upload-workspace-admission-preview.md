# ADR 1136: Upload Workspace Admission Preview

## Status

Accepted for foundation preview.

## Decision

Expose the provider-neutral quarantine admission preview in the tenant upload
workspace. Show both incomplete evidence and evidence-complete-for-human-review
states using a representative package fixture.

## Boundaries

The preview is tenant-bound, review-only, and side-effect-free. It cannot write
quarantine state, return a file URL, select storage, promote an asset, release a
package, create routes or playlists, assign students, mutate QR aliases, or
activate a local bundle. `evidence-ready` means only that the listed evidence
is complete for the next human review gate.

## Verification

The active route verifier must check that the teacher upload route exposes the
admission preview and the publication boundary. The focused admission verifier
must check the sample incomplete and evidence-complete states.
