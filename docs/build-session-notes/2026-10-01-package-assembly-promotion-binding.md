# Build Session: Package Assembly Promotion Binding

Connected the approved asset promotion boundary to local package assembly.

- Package assembly now prefers `approved-root/<tenant>/<package>/<version>/` when that package-scoped directory exists.
- A readable, valid, identity-bound `promotion-record.json` is required in that directory.
- Content, media, poster, and transcript source files are copied from the package-scoped custody root.
- The immutable assembly record records `package-scoped-promotion` or the explicit compatibility `legacy-flat-root` scope.
- Added end-to-end rehearsal coverage for package-scoped consumption and promotion-record tampering.
- Release, QR, policy, review-packet, hosted-persistence, student-activation, and learner-record boundaries remain independent.

Recorded ADR 1347 / DR-1346.

