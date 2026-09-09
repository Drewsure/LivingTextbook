# DR-590: Media Asset Metadata Integrity

Status: Accepted

Decision: Require non-empty media asset identity and title, compatible kind/type, and safe optional duration metadata.

Guardrails:

- Asset IDs and titles are required.
- Durations are finite and non-negative when present.
- Rights and upload gates remain separate.
- Validation remains side-effect free.
