# ADR 0175: Teacher Draft Package Preview Route

Date: 2026-07-13

## Status

Accepted

## Context

Teacher authoring must eventually feel fast, but direct draft assignment and direct AI publish are blocked. The platform needs a visible teacher-only draft surface that proves the workflow without pretending live editing or persistence is ready.

## Decision

Add `/teacher/authoring/draft-sample-publisher-l1-u1` as an active scaffold route.

The route shows a teacher-only draft package, source lineage, draft payload, requested activity path, audio-before-students requirement, blocked actions, and review gates. Student assignment remains blocked.

## Consequences

Teacher authoring now has a concrete preview route while preserving the draft-first rule. Active route verification grows to 36 routes.
