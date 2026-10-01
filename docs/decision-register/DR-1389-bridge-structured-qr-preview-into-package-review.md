# DR-1389: Bridge Structured QR Preview Into Package Review

Decision: derive the Sample Publisher package-preview QR entries from the
structured upload-side QR preview through a shared adapter.

The adapter preserves QR identity and package fallback paths and rejects
tenant, package, and version drift. It is review-only metadata mapping and
does not authorize registry writes, printing, route mutation, persistence, or
student use.

Evidence: `scripts/verify-publisher-pilot-qr-preview-adapter.mjs`.
