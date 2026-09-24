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

Identifiers use the same safe identifier rules as the local manifest. The
identity is package metadata only; it does not grant file access, activate
offline mode, enable persistence, or promote a route to students.

## Resolver Gate

`createReadOnlyLocalBundleResolver` validates the structural manifest first and
then validates package identity. Incomplete identity blocks route and asset
resolution. Tenant scope remains enforced for every route and asset lookup.
This prevents a generic preview manifest from appearing valid for a different
tenant, book, or unit.

## White-Label Rule

The identity values are tenant-owned package data. MiniStar values are sample
tenant data only and must not be used as universal defaults. A new publisher
package must declare its own curriculum, series, book, and unit identifiers
before local handoff or offline-readiness review.

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
