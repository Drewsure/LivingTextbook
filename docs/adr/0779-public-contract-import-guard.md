# ADR 0779: Public Contract Import Guard

## Status

Accepted

## Decision

App source consumes shared content-model contracts through the package root.
An executable foundation guard rejects direct imports of internal
`@living-textbook/content-model/src/*` paths from the web and AI-service
applications.

## Why

The public package boundary is the stable seam for white-label tenants,
future deployment targets, and replaceable providers. Enforcing it prevents
package layout from becoming an accidental integration contract.

## Scope

This guard covers TypeScript and TSX source under `apps/web/src` and
`apps/ai-service/src`. Internal relative imports within the content-model
package remain valid implementation details.

## Non-goals

The guard does not create live storage, enable AI calls, authorize uploads or
assignment, or promote frozen external game source.

## Verification

- `verify:content-model-boundary` passes.
- The guard runs from `verify-foundation-composition`.
- Web and AI-service typechecks plus the production build pass.
