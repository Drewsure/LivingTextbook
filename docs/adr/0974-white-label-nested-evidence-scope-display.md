# ADR 0974: Display Nested Evidence Scope

Status: Accepted

## Context

The release-readiness model validates package, pilot, and release-control
evidence against the parent tenant and package. Reviewers should not have to
infer those bindings from headings or contract prose.

## Decision

The readiness workbench displays tenant and package facts in each nested
evidence card. The displayed values come from the validated nested records.

## Consequences

- Cross-record scope is visible during partner and school review.
- The same review surface works for MiniStar and future white-label tenants.
- No release, persistence, promotion, or student-launch behavior is enabled.

## Verification

The static readiness verifier checks the scope labels, while model behavior
tests continue to reject tenant and package mismatches.
