# ADR 0183: Teacher Draft Review Queue Preview

Date: 2026-07-13

## Status

Accepted

## Context

Teacher authoring needs a visible path from teacher-only draft packages to verifier and human review. The platform now has a draft handoff packet and storage contract, but no reviewer-facing workbench surface.

## Decision

Add `/teacher/review` as a read-only teacher/content-review queue preview.

The route shows review handoff packet sections, blockers, allowed actions, and next steps while blocking live verifier submission, package approval, direct AI publish, and student assignment.

## Consequences

The product can demonstrate a trustworthy authoring review flow without implementing authentication, persistence, verifier workflow, approval signatures, or assignment release too early.
