# ADR 0097: Foundation Verification Script

## Status

Accepted

## Context

The build now has stable typecheck/build commands and a route verifier. Running them separately is workable but easy to forget during long sessions.

## Decision

Add `npm run verify:foundation` to run typecheck, production build, and active-route verification in order.

## Consequences

Local verification becomes easier and cheaper to repeat. Because route verification depends on the local server, the command is intended for sessions where `http://127.0.0.1:3000` is already live.
