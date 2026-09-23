# DR-1102: External Candidate Read Budget

- Candidate manifests are capped at 64 KiB before parsing.
- Referenced evidence artifacts are capped at 4 MiB before hashing or review.
- Oversized external files remain rejected and quarantined; the change does
  not enable import, execution, promotion, persistence, or assignment.

References: ADR 1102, Build session 1016, FR-060, and the candidate package
behavior regression.
