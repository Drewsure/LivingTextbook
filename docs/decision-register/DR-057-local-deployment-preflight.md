# DR-057: Local Deployment Preflight Before Closed Companion Build

Date: 2026-07-09

Status: accepted

## Decision

Add a local deployment preflight gate before building a closed local companion product.

## Rationale

The white-label platform must support textbook partners that need local apps, bundled media, and closed deployments. That path is valuable, but it has real operational requirements: installer/update, media rights, QR/deep-link behavior, local reporting, export, backup, restore, and offline access policy.

## Consequences

- Local deployment remains a first-class product path.
- Hosted PWA remains the recommended first pilot path.
- Local companion blockers are explicit and cannot be accidentally treated as polish.
