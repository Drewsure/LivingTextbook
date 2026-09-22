# ADR 0972: Bind Quality Evidence to Tenant and Package

Status: Accepted

## Context

The release-readiness record combines typecheck, production-build, route,
runtime, browser, privacy, and tenant-isolation results. A boolean result or a
source-record label alone cannot prove that the result belongs to the tenant
and package currently under review.

## Decision

Every `WhiteLabelReleaseQualityEvidence` record carries `tenantId` and
`packageId`. The shared validator requires both values to match the parent
readiness record. Mismatches are invalid even when the quality result is true.

## Consequences

- Review evidence cannot be silently reused across tenants or package versions.
- Sample and future adapters must preserve identity when assembling evidence.
- Quality evidence still remains review-only and cannot authorize production,
  persistence, package promotion, or student launch.
- Existing integrations must add the two identity fields before they validate.

## Verification

The readiness behavior verifier covers tenant and package mismatch failures;
the static readiness verifier checks the corresponding model invariants.
