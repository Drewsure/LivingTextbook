# ADR 0317: AI Prototype Integration Plan

Date: 2026-07-31

## Status

Accepted.

## Context

After an outside prototype returns and passes a review gate, the project still needs an explicit path for deciding whether and how it can enter the LivingTextbook app. Without an integration plan, returned code could be imported directly, mutate routes, override scoring, alter audio manifests, or become package-ready without replay evidence.

## Decision

Add review-only AI prototype integration plans to teacher generator routes. These plans show a wrapper-first path through file quarantine, wrapper adapter proposal, JSON fixture replay, standard event replay, target-language audio coverage, deterministic scoring replay, mobile accessibility inspection, white-label theme checks, and Codex integration decision.

The plan cannot import returned files into `apps/web`, write route registry entries, mutate game sequences, mutate scoring profiles, mutate audio manifests, promote packages, assign students, or treat prototype evidence as package-ready.

## Consequences

- Prototype work gains a safe path toward future integration without becoming live code.
- Phaser and premium visual game surfaces remain possible through wrappers, not through bypassing platform contracts.
- Codex keeps review authority over architecture, events, audio, scoring, accessibility, and white-label fit.
- Future storage can persist these integration plans once the review shape is accepted.
