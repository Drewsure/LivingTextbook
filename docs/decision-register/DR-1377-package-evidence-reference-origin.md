# DR-1377: Package Evidence Reference Origin

- Decision: Preserve the custody origin of every package evidence reference.
- Scope: Quarantine package evidence review and publisher handoff.
- Date: 2026-10-01
- Status: Accepted

Package evidence references now declare `publisher-asset` or
`platform-derived`. Game pathway, canonical engine, and game-audio references
use the derived origin; publisher content and media references use the asset
origin. This improves reviewer auditability without enabling assembly,
promotion, QR print, persistence, or student-facing use.
