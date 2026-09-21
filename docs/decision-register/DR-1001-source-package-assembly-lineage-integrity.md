# DR-1001: Source Package Assembly Lineage Integrity

Decision: source-to-package assembly must validate deterministic source
identity, unique candidate references, and the review evidence required for a
draft candidate while remaining review-only.

Required invariants:

- `sourceChecksum` uses the canonical `sha256:<64 hexadecimal characters>` form.
- Candidate units, candidate media, required records, and blockers are unique
  non-blank strings.
- Draft candidates require lineage, extraction, mapping, and teacher-handoff
  evidence.
- No assembly packet can create a draft, capture approval, promote a package,
  or create a student-facing payload.

Evidence: `docs/adr/0929-source-package-assembly-lineage-integrity.md`,
`packages/content-model/src/sourcePackageAssembly.ts`,
`apps/web/src/data/sampleSourcePackageAssembly.ts`, and
`scripts/verify-runtime-behavior.mjs`.
