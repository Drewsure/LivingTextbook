# DR-051: Source Review Queue Before Package Release

Date: 2026-07-09

Status: accepted

## Decision

Add a source review queue to the teacher intake scaffold before package releases.

## Rationale

White-label partners will provide PDF units, DOCX curriculum documents, audio, video, and teacher notes. The platform needs a visible, review-first handoff lane so raw files do not become student-facing payloads without human review, rights review, package mapping, and route planning.

## Consequences

- PDF/DOCX/media onboarding has a safer structure.
- Rights review for audio/video is visible from the start.
- AI extraction remains an assistant, not the source of truth.
- Package releases remain the canonical student-facing layer.
- The durable source extraction storage contract is recorded in `DR-277-source-extraction-review-packet-storage-contract.md`.
