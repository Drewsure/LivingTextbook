# DR-1403: Source Preflight Evidence Request Bridge

## Decision

Provide a create-once, metadata-only request generator between the completed
publisher source folder and the tenant-bound source-preflight evidence route.

## Boundary

The command may read the declared source folder and emit the validated
preflight report, but it must never copy raw publisher files, upload content,
assemble a package, promote assets, print QR codes, activate hosted
persistence, or enable student use. A complete inventory is necessary
evidence, not approval.

## Verification

The self-test proves canonical preflight execution, tenant and package
identity carry-through, review-only protected flags, absence of raw payload
copies, and create-once overwrite refusal.

## Next gate

Use the generated request only with an authorized real quarantine record, then
continue through rights, accessibility, game, audio, package, release, QR,
delivery, and human pilot gates.
