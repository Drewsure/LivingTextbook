# DR-1369: Deterministic QR Print Profile

**Decision:** The v1 local pilot QR print artifact records a fixed physical
profile: A4 portrait, two cards per row, monochrome output, 260px QR rendering,
and a two-module quiet zone.

**Why:** The publisher needs a reproducible physical handoff, not only a JSON
route map. The machine-readable manifest, embedded SVG, and printable HTML now
share one validated profile.

**Boundary:** This does not print automatically, mutate QR aliases, release a
package, activate hosted persistence, create learner records, or enable student
use. Tenant-specific print profiles remain a later reviewed white-label
configuration.

**Verification:** The local package assembler behavior harness checks manifest
geometry and HTML print CSS; foundation composition and web typecheck remain
green.

