# ADR 0838: Shared Persistence Handoff Validator

## Status

Accepted for foundation hardening.

## Decision

Keep the persistence handoff packet schema and validator in
`packages/content-model`, not only in the web workbench. The web, future AI
service, and local companion must consume the same review-only invariants:
provider selection is null, required checks exist, side effects remain blocked,
and every tenant-bound category has an explicit coverage row.

## Rationale

A presentation-only handoff can look complete while another runtime invents a
different contract. Shared validation makes the packet portable and makes
missing hosted/local/durable coverage visible as an actual finding.

## Excluded

This validator does not select a database, create storage, permit writes,
authorize exports, accept school policy, or activate a deployment.
