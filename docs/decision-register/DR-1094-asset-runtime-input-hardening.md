# DR-1094: Asset Runtime Input Hardening

- Asset runtime requests now fail closed for non-object input and unsupported
  operation, kind, scan, rights, and source-review values.
- Tenant and asset identifiers, unit keys, MIME types, and checksums have
  bounded runtime input rules.
- The same review-only, no-upload, no-copy, no-promotion boundary remains in
  force.

References: ADR 1094, Build session 1008, and the asset runtime verifier.
