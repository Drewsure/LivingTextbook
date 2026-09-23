# DR-1104: Asset Intake File Boundary

Decision: The review-only asset runtime now requires a MIME type compatible
with the declared asset kind and a positive integer byte length no greater than
the shared 256 MiB platform ceiling.

- Supported kinds are image, audio, video, font, and source-document.
- Tenant size-budget policy remains a separate stricter gate when required.
- MIME and size validation occur before future scan, rights, mapping, storage,
  release, or student-facing decisions.
- No upload adapter, storage write, transform, promotion, or learner-upload
  behavior is enabled.

References: ADR 1104, Build session 1018, and the content intake verification
checks.
