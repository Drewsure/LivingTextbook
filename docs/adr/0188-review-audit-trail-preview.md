# ADR 0188: Review Audit Trail Preview

Date: 2026-07-13

## Status

Accepted

## Context

Teacher draft review now has handoff, decision, and evidence packet previews. The next foundation risk is that reviewers or tenants may assume those previews are live approvals or durable workflow history.

## Decision

Add a review audit trail preview to `/teacher/review`.

The preview shows future audit events for handoff creation, reviewer decision drafting, evidence blocking, and approval-ledger blocking. It also keeps live state transitions, approvals, publishing, evidence upload, and student assignment disabled.

## Consequences

Future review workflows must preserve an auditable sequence of events before any package state changes. The foundation UI can explain accountability without implying that review actions are already persisted or legally approved.
