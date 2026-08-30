# Next Dev Cold Route Warmup

Date: 2026-08-31

## Summary

During active route verification on a cold Windows Next dev server, two MiniStar routes briefly returned `500` with `SyntaxError: Unexpected end of JSON input`. Direct repeat requests to the same routes returned `200`, and the full `npm run verify:routes` sweep passed after warmup without source changes.

## Procedure

If this recurs:

1. Probe the failed route directly with `Invoke-WebRequest`.
2. If it returns `200`, rerun `npm run verify:routes`.
3. Treat the issue as real only if the route repeatedly fails after warmup or expected text remains missing.

## Guardrail

Do not remove route expectations or lower verifier coverage to work around cold dev-server behavior.
