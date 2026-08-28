# ADR 0447: Package Writer Assignment Shell Guard Storage Contract

Status: Accepted

Date: 2026-08-28

## Context

The assignment shell guard protects future classroom activation. It needs backend-neutral persistence before any generated package writer can approach assignment workflows, class roster scope, progress events, reporting, or launch gates.

## Decision

Add `ai_generated_package_writer_assignment_shell_guard` as a backend-neutral storage contract.

The record preserves protected assignment surfaces, assignment safety checks, reporting safety checks, blocked assignment actions, next required records, class roster boundaries, progress event taxonomy, school policy requirements, reporting privacy, and support-language boundaries.

## Consequences

- Hosted and local deployments can use the same assignment guard record shape.
- No database vendor is selected by this decision.
- Assignment shell writes, private assignment link activation, class roster binding, progress event stream activation, teacher report export, live classroom launch, raw learner audio/transcript storage, and support-language-only assignment approval remain blocked.
- MiniStar assignment storage keeps English as the target-language trigger and Japanese support hiragana-only/support-only in lower levels.
