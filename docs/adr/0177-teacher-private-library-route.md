# ADR 0177: Teacher Private Library Route

Date: 2026-07-13

## Status

Accepted

## Context

Teachers and textbook partners will expect reusable resources, but a public community library creates moderation, copyright, privacy, tenant-isolation, and quality-control burden. The product needs a concrete private-first library surface before live authoring, copy/edit, or public sharing work begins.

## Decision

Add `/teacher/library/sample-publisher` as a read-only teacher library scaffold for the sample publisher tenant.

The route shows teacher private drafts, tenant-approved packages, planned school sharing, public community blocking, source lineage, allowed actions, blocked actions, and no-student-data-copy guardrails.

## Consequences

The white-label product now has a safer answer to community-resource expectations: private tenant libraries first. Public community sharing remains blocked for v1.
