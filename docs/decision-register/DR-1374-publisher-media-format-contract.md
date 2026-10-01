# DR-1374: Publisher Media Format Contract

**Decision:** Keep the publisher manifest starter and source preflight aligned
with the established v1 media policy, including Markdown/CSV, SVG, M4A/OGG,
and MOV lanes.

**Why:** A publisher-facing format promise must work through the actual intake
inventory check, not only appear in a UI list.

**Boundary:** Format detection is inventory evidence. It does not prove rights,
accessibility, review, promotion, package release, QR printing, persistence, or
student-facing use.

**Verification:** The starter self-test generates expanded-format fixtures and
runs the real source preflight successfully.
