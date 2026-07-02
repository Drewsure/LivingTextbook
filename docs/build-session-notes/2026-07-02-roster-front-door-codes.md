# Build Session Note: Roster Codes In Front-Door And Teacher Session Routes

Date: 2026-07-02

## Purpose

Connect the lightweight class roster boundary to the visible classroom routes so the product demonstrates coded learner identity without pretending to have production accounts.

## Added

- Front-door route context now attaches the matching sample class roster plan and accepted learner codes.
- `/enter/[tenantId]` passes allowed learner codes into the front-door flow.
- The front-door flow validates user codes against the roster-aware accepted-code list.
- Teacher session routes render a roster identity card before the session monitor.
- Class roster verification now includes `/enter/ministar`, `/enter/sample-publisher`, and both teacher session monitor routes.

## Guardrail

Learner codes are reporting slots, not production accounts. Real names, family contact, raw audio, and transcripts remain blocked from the core roster.

## Verification Needed

After local pull:

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- Browser check `http://127.0.0.1:3000/teacher/intake`
- Browser check `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- Browser check `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`
- Browser check `http://127.0.0.1:3000/enter/ministar`
- Browser check `http://127.0.0.1:3000/enter/sample-publisher`
