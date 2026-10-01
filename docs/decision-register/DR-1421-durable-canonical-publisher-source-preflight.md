# DR-1421: Durable Canonical Publisher Source Preflight

- **Decision:** Require durable canonical source-preflight evidence in the
  external publisher handoff before the saleability source gate can pass.
- **Reason:** A complete intake inventory is not the same as a manifest-bound
  source review.
- **Implementation:** The audit requires the source manifest and preflight
  report, reruns preflight in a temporary comparison lane, and checks identity,
  checksums, completeness, and blocked actions.
- **Human action:** After changing the manifest or source files, rerun the
  canonical preflight to a new create-once evidence path and regenerate the
  downstream evidence request.
- **White-label impact:** Positive. Every publisher receives the same
  provider-neutral, checksum-bound source review boundary.
