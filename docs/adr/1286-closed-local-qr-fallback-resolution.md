# ADR 1286: Closed-Local QR Fallback Resolution

Date: 2026-09-30
Status: Accepted

## Decision

Closed-local QR fallbacks must resolve to the installed package's approved
front-door route. For the first saleable pilot, the local writer supports the
`unit-launch` target type only and requires the bundle route, delivery manifest,
and printable QR artifact to contain the exact same package-scoped path.

Generic paths such as `/launch/unit-1` are not accepted as local package
fallbacks because they do not prove which tenant, package, or version will
receive the learner. Additional target types require their own resolver and
verification before they can be printed into a closed-local package.

## Rationale

The QR sheet is a delivery artifact, not merely a safe string. A fallback that
passes path-safety checks but cannot open the installed package would fail the
publisher's core promise at the point of use. Exact route identity also keeps
white-label tenant boundaries and version rollback behavior visible.

## Boundaries

- This validates route identity; it does not authorize printing or activate a
  package.
- Hosted redirects remain optional and separately gated.
- Frozen Z.ai/Phaser source remains isolated.
- Learner records remain excluded from local package metadata.
