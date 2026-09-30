# DR-1326: Live Publisher Handoff Browser Rehearsal

Date: 2026-09-30  
Status: Accepted

The publisher-intake rehearsal now loads the real tenant-bound handoff route
after quarantine intake and after review-only evidence progression. It checks
that the route preserves the quarantine identity and declares its reference-
only, non-assembly boundary while the live journey remains client-derived
from protected metadata.

This adds browser-route evidence without enabling package assembly, promotion,
QR printing, hosted persistence, or student-facing use. See ADR 1327.
