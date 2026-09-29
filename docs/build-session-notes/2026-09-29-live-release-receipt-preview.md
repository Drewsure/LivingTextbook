# Build session: Live release receipt preview

- Added a shared review-only release-receipt preview derived from the live
  quarantine delivery-manifest preview.
- Added independent checks for delivery manifest, named release approval, QR
  authorization, rollback, and package index.
- Mounted the preview in the real publisher handoff and kept all approval and
  activation fields pending.
- Added a focused verifier and recorded the standard in the principles,
  decision register, and ADR documentation.
