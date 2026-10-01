# DR-1370: QR Payload Alias Integrity

**Decision:** Require each QR print entry to retain its complete generated SVG
and require its encoded URL to equal the print base URL joined with its alias
path.

**Why:** A valid URL shape alone does not prove that the printed code points to
the reviewed unit. Payload/alias drift must be rejected before operator reads.

**Boundary:** This is verification only. It does not authorize printing,
release, alias mutation, hosted persistence, learner records, or student use.

**Verification:** Local package assembly behavior and foundation composition
cover complete SVG presence, alias/payload drift rejection, and the existing
checksum/fallback boundaries.

