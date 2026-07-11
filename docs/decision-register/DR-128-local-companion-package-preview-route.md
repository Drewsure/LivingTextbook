# DR-128: Local Companion Package Preview Route

## Decision

Add a standalone local companion package preview route for the sample publisher tenant.

## Reason

The white-label product needs a concrete closed/local companion story for textbook partners. A dedicated route makes the package shape inspectable without implying that an offline installer or local server is complete.

## Standard

- `/local/sample-publisher` shows `Local companion package preview`.
- The route shows bundled content, audio/video assets, local QR fallback routes, and local deployment preflight blockers.
- The route is planning-only until media rights, checksums, installer/update, local storage, backup/restore, and report export rules are accepted.
- The active route list and active route matrix include the route.
- The route verifier checks the page remains visible.
