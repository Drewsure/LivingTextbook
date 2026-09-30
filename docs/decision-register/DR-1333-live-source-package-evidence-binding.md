# DR-1333: Live Source-to-Package Evidence Binding

The source-to-package evidence bridge is now available as a tenant-authorized,
read-only binding route for quarantined publisher submissions. It derives
bounded source, extraction, and authoring identities from the live quarantine
metadata and preserves the eight evidence lanes used by the MiniStar sample.

The route returns no payload bytes and cannot write review records, assemble a
package, print QR codes, activate persistence, or enable student use. See ADR
1334.
