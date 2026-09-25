# DR-1199: Source Runtime Checksum Format

The source-runtime validator now requires the canonical
`sha256:<64 hexadecimal characters>` checksum format, matching extraction
preview and source-package assembly validation. This closes a source-lineage
weakening point without enabling storage, draft creation, promotion, or
student-facing use. See ADR 1199.
