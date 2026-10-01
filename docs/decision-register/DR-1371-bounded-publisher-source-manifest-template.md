# DR-1371: Bounded Publisher Source Manifest Template

**Decision:** Provide a command that creates a review-only publisher source
manifest from explicit identities and relative asset paths, without creating or
uploading publisher content.

**Why:** A saleable white-label pilot needs an operator-friendly intake start,
but convenience must not bypass source custody or review.

**Boundary:** The generated manifest does not prove that files exist, that
rights are granted, or that any content is student-ready. Existing preflight,
quarantine, media, accessibility, package, release, QR, persistence, and
launch gates remain mandatory.

**Verification:** The template self-test proves safe multi-media declarations,
review-only flags, and no content-file creation.

