# DR-1000: Local Package Route Map

Date: 2026-09-30
Status: Accepted

The local companion now has one identity-bound route map for the approved
package runtime. It derives the front door, Memory Match, teacher evidence, and
media paths from the package tenant, package, version, and registered unit
route, while preserving the printed QR fallback.

This closes a route-drift risk in the first white-label vertical slice. It does
not promote the package to production: release approval, rights, device,
installer/update, local-data, school-policy, and human pilot evidence remain
required. The map rejects missing and unsafe units and creates no side effects.
