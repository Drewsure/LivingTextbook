# ADR 0438: AI Verifier Submission Packet Validator

Status: Accepted

## Context

AI generator routes already show blocked verifier submission packets, but the packet rules lived mostly in sample data and route text checks. The new repair evidence packet also needs to become a required input before verifier submission.

## Decision

Add a shared content-model validator for AI verifier submission packets and require `ai_draft_repair_evidence_packet` before verifier submission can be considered.

The teacher generator panel now shows verifier guard blocks and warnings. The sample-publisher and MiniStar packets both include draft repair evidence checks, blocked actions, and next requirements.

## Consequences

- Verifier packets become reviewable through shared code, not only UI text.
- Draft repair evidence is now a hard prerequisite for verifier submission.
- MiniStar support-language and hiragana boundaries stay visible in the verifier layer.
- Route creation, playlist creation, assignments, package approval, and student-ready markers remain blocked.

## Non-Goals

This does not create live verifier submission, provider integration, model calls, package assembly, route writes, playlist writes, assignments, or student-ready workflow.
