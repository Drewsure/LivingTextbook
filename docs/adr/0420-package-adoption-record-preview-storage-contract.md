# ADR 0420: Package Adoption Record Preview Storage Contract

Status: Accepted

## Context

`/teacher/entitlements` now shows future package adoption record previews, but storage and backend work need the same record vocabulary before premium adoption can become real.

## Decision

Add `package-adoption-record-preview` to durable record categories, hosted/local write intents, backend schema draft, migration candidates, migration specs, and verification. The contract preserves school policy acceptance, tenant package selection, budget/rate-card, microphone/transcript, storage/report, acceptance scopes, blocked writes, and rollback hooks.

## Consequences

- Premium package activation remains blocked until accepted adoption records and policy gates exist.
- AI authoring, Voice Tutor, microphone scoring, report export, hosted storage, and local companion delivery share one adoption-record vocabulary.
- Hosted and closed/local deployments stay aligned.
- The backend storage and package entitlement verifiers protect the contract.
