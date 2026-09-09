# DR-593: Approved Media Provenance And Locators

Status: Accepted

Decision: Require approved media assets to identify an owner and provide at least one hosted or local delivery locator.

Guardrails:

- Approved media assets require a non-empty owner name.
- Approved media assets require a non-empty `sourceUri` or `localBundlePath`.
- Unknown rights and placeholder learner audio remain blocked for approved packages.
- Upload, storage, checksum, scan, release, QR, and student-use behavior remain gated separately.

Recorded in `docs/adr/0522-approved-media-provenance-and-locators.md`.

