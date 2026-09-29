# ADR 1241: Release-Bound QR Print Artifact

## Status

Accepted for controlled local-package implementation. Production printing
remains blocked until real publisher and rollback evidence is accepted.

## Decision

Extend the controlled local package assembler to generate a self-contained QR
print sheet and a machine-readable QR print manifest. The symbols encode
stable /q/ aliases resolved against an explicit operator-provided print base
URL. The artifact is generated only when the approved delivery manifest and
manual release receipt both allow QR printing.

## Consequences

- A released local package can contain a printer-ready sheet without requiring
  a live QR registry mutation at assembly time.
- The base URL and encoded destinations are auditable and replay-bound.
- Local fallback paths remain visible beside the printed target.
- Draft and review-only aliases cannot produce the artifact.
- The artifact does not activate routes, hosted persistence, students, or
  learner-data writes.

## Verification

The local package assembler verifier checks the explicit print URL gate, QR
generation, static HTML and JSON artifacts, and the unchanged QR/hosted/student
side-effect boundaries.
