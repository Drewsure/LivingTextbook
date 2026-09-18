# ADR 0865: Local Provider Approval Evidence

## Status

Accepted for foundation rehearsal.

## Context

The platform must eventually support closed local deployments and optional
hosted persistence, but a provider choice without evidence for retention,
export, recovery, fallback, and tenant isolation would create a premature
production dependency.

## Decision

Define `LocalBundleProviderApprovalPacket` as a review-only evidence contract.
The packet records a candidate channel, tenant-scoped control references, and
required evidence checks. It keeps provider selection and activation null/false
and blocks package writes, student promotion, and learner-data export.

## Consequences

Schools and publishers can review the operational burden and cost boundaries
before a vendor is selected. The packet is visible in the teacher persistence
workbench but cannot activate storage, change routes, create a bundle, or
collect learner data.
