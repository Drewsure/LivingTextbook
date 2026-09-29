# DR-1268: Live Package-Index Preview

**Status:** Accepted

**Decision:** Add a live package-index inventory preview bound to the real
quarantine source checksum, with empty route, media, QR, and local-fallback
paths until separate release evidence exists.

**Reason:** Publishers need an honest package completeness view before route or
QR creation.

**Boundary:** Metadata-only preview. No package index write, route creation, QR
mutation, local/hosted activation, or student use is enabled.
