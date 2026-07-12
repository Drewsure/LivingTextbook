# ADR 0178: Tenant Library Item Storage Contract

Date: 2026-07-13

## Status

Accepted

## Context

The teacher private library route makes resource reuse visible, but live copy/edit, school sharing, search, and public-community decisions need durable storage rules first. Public community sharing remains a v1 risk because it requires moderation, copyright, privacy, quality, tenant isolation, and abuse-reporting governance.

## Decision

Add `tenant-library-item` to durable record categories, persistence write intents, backend schema draft, migration candidates, and migration specifications.

Tenant library item records must preserve source lineage, block student-data copies, and block public community publishing.

## Consequences

The white-label product can grow private teacher libraries without drifting into an unsafe public marketplace or copying student reports into reusable resources.
