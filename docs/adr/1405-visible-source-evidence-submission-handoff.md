# ADR 1405: Visible Source Evidence Submission Handoff

## Status

Accepted for the foundation and pilot review workflow.

## Context

The source-preflight evidence workflow already had two safe operator commands:
one to create a metadata-only request and one to submit it with a
tenant-allowlisted server credential. The tenant requirements workspace showed
only the first command, increasing the chance of an unsafe workaround.

## Decision

Show both commands, in order, in `PublisherPilotInputKitPanel`. Keep the token
as an environment variable and describe the submission as review-only metadata
capture. The panel must name the still-blocked actions explicitly.

## Consequences

Operators have one copy-ready handoff. The UI becomes more useful without
adding a browser upload, copying raw files, package assembly, QR printing,
persistence activation, or student access. The production build and browser
rehearsal remain required before claiming pilot saleability.
