# DR-1390: Structured Publisher Evidence Lanes At Intake

Decision: publisher intake briefs now declare rights, accessibility/caption,
and scan evidence files with safe paths and explicit coverage identities.

The generator creates the evidence folder and the no-write preflight checks
those files with source and media inventory. Missing evidence remains
incomplete. No declaration authorizes package assembly, release, QR printing,
persistence, or student use.

Evidence: `scripts/verify-publisher-pilot-intake-kit.mjs` and
`scripts/publisher-pilot-intake-preflight.mjs --self-test`.
