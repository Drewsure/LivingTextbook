# Build session: Quarantine filename portability

- Hardened the review-only multimedia and source upload boundary for filenames.
- Preserved international-language filenames for white-label publisher use.
- Rejected path separators, control characters, unsafe Windows filename
  characters, trailing dots, and reserved device names.
- Kept payload storage quarantine-generated and promotion-neutral.
- Added ADR 1198, DR-1198, and verifier coverage.
