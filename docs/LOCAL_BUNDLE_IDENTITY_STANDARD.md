# Local Bundle Package Identity Standard

## Purpose

Every closed-local or offline companion package must carry an explicit identity
before its routes or assets can be resolved. A bundle is not identified by its
tenant name alone: the resolver must know the tenant, bundle, curriculum,
series, book, and one or more textbook units.

## Required Identity

The review manifest must provide:

- `tenant_id`
- `bundle_id`
- `curriculum_id`
- `series_id`
- `book_id`
- a non-empty, unique `unit_ids` list
- `unit_id` on every declared QR route
- `unit_id` on every declared local media asset

Identifiers use the same safe identifier rules as the local manifest. The
identity is package metadata only; it does not grant file access, activate
offline mode, enable persistence, or promote a route to students.

## Resolver Gate

`createReadOnlyLocalBundleResolver` validates the structural manifest first and
then validates package identity. Incomplete identity blocks route and asset
resolution. Tenant scope remains enforced for every route and asset lookup.
This prevents a generic preview manifest from appearing valid for a different
tenant, book, or unit. Every QR route must name a unit included in the package
unit scope.

## White-Label Rule

The identity values are tenant-owned package data. MiniStar values are sample
tenant data only and must not be used as universal defaults. A new publisher
package must declare its own curriculum, series, book, and unit identifiers
before local handoff or offline-readiness review.

QR routes also carry `unit_id`, and that value must be present in `unit_ids`.
This prevents a printed or copied QR record from resolving into a different
unit inside an otherwise valid package.

Audio, video, and image assets follow the same rule. A media item cannot be
resolved or admitted as package evidence when its unit is outside the declared
package scope.

The teacher review surface must display the asset or route unit and show unit
scope as an evidence check. A package is not presented as handoff-ready when
that check fails.

## Current Boundary

The local companion path remains review-only. It does not read files, write a
bundle, register a service worker, activate offline delivery, or persist learner
data. Package identity is the prerequisite for a future controlled handoff,
not an approval to ship one.

## Verification

- `npm run verify:local-bundle`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:foundation`

The resolver runtime test includes a negative case for missing curriculum and
unit identity.
