# ADR 0418: Package Adoption Readiness Flow

Status: Accepted

## Context

The white-label platform needs optional paid packages, but schools and publishers will need to see more than a catalog. They need to understand who approves a package, which policy records are required, what costs are reviewed, and what actions remain blocked before activation.

## Decision

Add a review-only package adoption readiness flow to `/teacher/entitlements`. The flow maps core, premium AI authoring, premium Voice Tutor, and enterprise storage/local companion packages to required approvals, required records, cost review items, policy review items, blocked actions, owners, and next steps.

## Consequences

- Premium packages become an adult-facing adoption packet, not a student purchase or teacher self-enable flow.
- The base package can remain reviewable separately from optional add-ons.
- AI generation, Voice Tutor, speech scoring, report export, hosted storage, and local companion activation all require explicit tenant/school approval records first.
- The entitlement verifier now checks package adoption readiness alongside the package catalog and cost gates.
