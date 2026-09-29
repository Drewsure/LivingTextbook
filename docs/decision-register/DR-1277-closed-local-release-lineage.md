# DR-1277: Closed-Local Release Lineage

- **Decision:** Apply the shared release-lineage validator before local package assembly.
- **Reason:** A closed-local writer is a real release-side effect and must not bypass live source, package-evidence, checksum, or mode custody.
- **Still required:** Dedicated token, local write gate, approved roots, release receipt, package index, bundle checksums, and QR authorization.
- **Not enabled:** Student activation or hosted persistence activation.
- **Verification:** `scripts/verify-local-pilot-package-assembler.mjs` and `scripts/verify-foundation-composition.mjs`.
