# DR-158: Printable Worksheet Preview Route

## Decision

Add a browser-print worksheet preview route before PDF export.

## Rationale

Teachers need printable materials, but jumping straight to PDF export would hide unresolved QR/audio, rights, versioning, and teacher export-policy requirements. A browser-print preview proves the layout and package-data projection cheaply.

## Accepted Direction

- Add `/print/[code]`.
- Render vocabulary listening and sentence practice sections from reviewed package data.
- Show audio bridge and digital route references.
- Keep paper work from awarding Star Dust, mastery, or completion.
- Keep PDF export blocked.
- Add MiniStar and sample publisher print routes to active route verification.
- Expose the current unit printable preview from the teacher launch shortcuts.

## Follow-Up

Add real QR placement, export snapshots, teacher access policy, answer-key variants, and PDF generation only after the browser-print preview is reviewed.
