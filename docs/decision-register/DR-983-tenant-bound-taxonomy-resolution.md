# DR-983: Tenant-Bound Taxonomy Resolution

## Decision

Bind event taxonomy authority to tenant and reviewed package identity before
event evidence reaches hosted persistence.

## Rationale

White-label tenants may use different game modes, scoring policies, support
languages, and reporting rules. A global taxonomy fallback would make an
unknown package appear valid and could misclassify evidence across tenants.

## Boundary

The current resolver contains two reviewed sample bindings. It is an explicit
sample registry, not a claim that live publisher package registration is
complete. Unknown bindings fail closed.

## Evidence

- ADR 0911
- `apps/web/src/server/persistence/progressEventTaxonomyResolver.ts`
- `apps/web/src/app/api/persistence/events/route.ts`
