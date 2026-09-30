# DR-1018: Live quarantine release preflight

## Decision

Derive and display a checksum-bound release preflight for each authorized live
quarantine handoff. It reconciles the manifest, receipt, and package-index
previews before a future human release boundary.

## Evidence

The preflight is derived by the package-readiness binding route and displayed in
the live quarantine handoff bridge. Its output is metadata-only and carries
explicit blocked action flags.

## Not authorized

No release write, package assembly, QR persistence or printing, hosted write,
student activation, or learner-data storage is enabled by this decision.
