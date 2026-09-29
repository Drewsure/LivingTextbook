# DR-1002: Package-Owned White-Label Tenant Configuration

Date: 2026-09-30
Status: Accepted

The local bundle now carries the reviewed tenant configuration required for
white-label delivery. Assembly and runtime validation bind that configuration
to the package tenant id, and package pages prefer it over the demo tenant
registry. This removes a MiniStar-only route dependency while preserving a safe
generic shell for blocked or incomplete review states.

The change does not make a package saleable by itself. Publisher rights,
release, QR, device, installer/update, school-policy, persistence, and human
pilot evidence remain required.
