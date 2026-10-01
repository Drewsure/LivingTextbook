# DR-1399: Publisher Intake Canonical Source Manifest Bridge

## Decision

Bridge a completed publisher pilot intake kit into the canonical source
manifest used by source preflight, rather than asking operators to author a
second incompatible declaration.

## Boundaries

The bridge is create-once and review-only. It preserves lane, path, unit,
required, and accepted MIME metadata, but does not copy or upload files,
admit quarantine content, assemble packages, print QR codes, activate
persistence, or enable students.

## Verification

The self-test creates a temporary intake kit, completes its metadata, creates
declared fixture files, generates the canonical manifest, runs the real source
preflight, and confirms a second generation attempt is rejected.
