# 2026-08-11 Shared Game Route Header

## Summary

Extracted a shared route header for active game routes.

## Changes

- Added `GameRouteHeaderCard`.
- Updated Flashcards, Memory Match, Quiz, Sentence Builder, and Speak It route wrappers to use the shared header.
- Preserved each route's existing game engine, progress summary, assignment settings, event log, and reward behavior.

## Boundaries

- No route count changed.
- No game scoring changed.
- No support-language or microphone policy changed.
- No premium visual polish was added.

## Verification Target

Run typecheck, production build, and active route checks.
