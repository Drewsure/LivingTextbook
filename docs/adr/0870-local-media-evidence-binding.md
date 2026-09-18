# ADR 0870: Local Media Evidence Binding

## Status

Accepted for foundation rehearsal.

## Context

The versioned local package manifest can name a media manifest, but that alone
does not prove rights, checksum, security, mapping, or accessibility readiness.
Those gaps are especially important for publisher-owned audio, video, images,
and local closed deployments.

## Decision

Define `LocalBundleMediaEvidenceBinding` as the provider-neutral media seam. It
binds each asset to the exact tenant, bundle, package, and package version and
records rights, checksum, scan, target mapping, transcript/caption, poster,
and alt-text state. Review-stage missing or pending evidence remains valid as
evidence but keeps local eligibility blocked. Safe relative paths and
`sideEffect: "none"` are mandatory.

## Consequences

Media review can be honest and detailed before files are available, and the
same evidence can serve hosted and closed deployments. No file upload, copy,
package write, local activation, student promotion, or QR mutation can start
from the binding.
