# ADR 0342: AI Generator Responsibility Matrix Storage Contract

## Status

Accepted

## Context

The AI generator responsibility matrix separates teacher/school review, Codex integration authority, outside AI builder prototype work, verifier checks, and platform admin duties. Because this matrix governs handoffs between people and systems, future hosted or local pilots need it as a durable contract before it can influence workflow.

## Decision

Add `ai_generator_responsibility_matrix` / `ai-generator-responsibility-matrix` to the backend-neutral storage contract.

The record preserves:

- role ownership
- owner duties
- handoff record ids
- cannot-do rules
- next gates
- target-language trigger rules
- assist-language support-only rules

The record must block live generation, app patch generation, external-builder app writes, external-builder scoring authority, generated package assembly, route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers.

## Consequences

- Responsibility boundaries can survive hosted, local, and outside-builder workflows.
- Z.ai and other builders remain prototype contributors, not production authorities.
- Codex integration authority, teacher approval, verifier checks, and platform cost/storage/release authority remain separate.
- The teacher intake storage dashboard and backend verifier now fail if responsibility matrix storage disappears.
