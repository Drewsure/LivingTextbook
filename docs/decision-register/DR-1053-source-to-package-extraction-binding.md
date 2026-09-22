# DR-1053: Source-to-Package Extraction Binding

Decision: require source package assembly packets to bind to the structured
extraction preview that supplied their source evidence.

Required invariants:

- Tenant, source, target package, source checksum, and preview identity must
  match across the assembly packet and preview.
- The bound preview must remain review-only, storage-write blocked, and
  student-payload blocked.
- Binding validation cannot accept extraction, create drafts, promote packages,
  assign students, or launch classrooms.

Evidence: `packages/content-model/src/sourcePackageAssembly.ts`,
`packages/content-model/src/sourceExtractionPreview.ts`, and
`docs/adr/0981-source-to-package-extraction-binding.md`.
