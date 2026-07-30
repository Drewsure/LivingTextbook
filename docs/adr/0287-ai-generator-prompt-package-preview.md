# ADR 0287: AI Generator Prompt Package Preview

Status: Accepted  
Date: 2026-07-31

## Decision

Add a versioned AI prompt package preview to the teacher generator route.

The prompt package records template version, input slots, output schema locks, tenant brand rules, model-use state, usage budget, cost controls, and blocked live actions before any live model call exists.

## Rationale

The AI teaching game generator must be saleable, auditable, and tenant-safe. Free-form prompts would make quality, cost, privacy, and white-label behavior hard to control. Versioned prompt packages give the future product a controlled commercial boundary.

## Consequences

- Prompt packages must be reviewed and tenant-scoped before live AI generation.
- Raw student data, student prompt editing, direct billing, voice generation, and student assignment remain blocked.
- Prompt versions become part of future package review evidence and rollback reasoning.
