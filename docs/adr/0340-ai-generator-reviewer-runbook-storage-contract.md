# ADR 0340: AI Generator Reviewer Runbook Storage Contract

## Status

Accepted

## Context

The generator route now shows an AI generator reviewer runbook with human review order, standing rules, evidence lanes, required records, and blocked shortcuts. Because this runbook can guide teachers, Codex, and outside AI builders, it must not remain only a static UI artifact before future hosted or local pilots rely on it.

## Decision

Add `ai_generator_reviewer_runbook` / `ai-generator-reviewer-runbook` to the backend-neutral storage contract.

The record preserves:

- human review order
- standing rules
- evidence lanes
- required record ids
- target-language trigger rules
- assist-language support rules
- blocked shortcuts

The record must continue to block live generation, app patch generation, generated package assembly, route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers.

## Consequences

- The reviewer runbook can become durable in hosted and closed local deployments without becoming workflow permission.
- Future external AI prototype handoffs can cite the runbook, but cannot bypass detailed source records.
- The teacher intake storage dashboard and backend verifier now fail if the runbook contract disappears.
