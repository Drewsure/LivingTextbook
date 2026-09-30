# DR-1363: Shared Reviewed-Custody Summary Contract

## Decision

Define the bounded reviewed bundle-manifest custody summary in the shared
content-model package. The package-readiness route and live handoff panel both
consume the canonical contract.

## Guardrails

- Metadata-only fields.
- No manifest body, path, bytes, credentials, learner records, or activation.
- One shared status and validation shape for all tenants and adapters.

## Evidence

See `docs/adr/1363-shared-reviewed-custody-summary-contract.md` and the
foundation-composition gate.
