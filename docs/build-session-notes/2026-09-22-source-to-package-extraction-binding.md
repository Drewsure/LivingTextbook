# Source-to-Package Extraction Binding

Date: 2026-09-22

Source package assembly now requires an extraction preview identity and can
validate the exact tenant, source, package, checksum, and preview relationship.
The binding also checks the preview's review-only and no-side-effect flags.

Runtime behavior coverage proves valid bindings pass and tenant drift fails.
The binding remains evidence reconciliation only; it does not accept
extraction, create drafts, promote packages, write storage, assign students,
or launch a classroom.
