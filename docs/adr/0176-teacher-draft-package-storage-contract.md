# ADR 0176: Teacher Draft Package Storage Contract

Date: 2026-07-13

## Status

Accepted

## Context

The teacher draft preview route proves the authoring workflow shape, but live authoring will need durable owner, source lineage, visibility, draft payload, requested activity path, audio plan, and review gate records.

## Decision

Add `teacher-draft-package` to durable record categories, persistence write intents, backend schema draft, migration candidates, and migration specifications.

Teacher draft records must preserve review gates and block direct student assignment until schema, audio, rights, route, version, and approval gates pass.

## Consequences

Future hosted and local persistence work has a shared contract for teacher drafts. Teacher authoring can evolve without becoming a shortcut around package review or audio support.
