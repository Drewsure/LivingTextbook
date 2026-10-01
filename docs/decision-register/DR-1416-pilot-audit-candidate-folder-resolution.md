# DR-1416: Resolve One Nested Z.ai Candidate Package

`audit:pilot` now accepts an outer extraction folder only when it contains one
nested `evidence/return-package.json`. It refuses ambiguous folders and sends
the resolved root through the canonical candidate verifier. This improves the
operator handoff without changing the review-only, no-copy, no-promotion
boundary. See ADR 1416 and
`docs/adr/1416-pilot-audit-candidate-folder-resolution.md`.
