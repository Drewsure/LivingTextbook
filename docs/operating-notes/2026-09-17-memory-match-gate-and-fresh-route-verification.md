# 2026-09-17 Memory Match gate and fresh route verification

## What changed

The teacher game-readiness workbench now includes a focused canonical Memory
Match integration gate. It joins the active `PairingMemoryMatchGame` route to
the frozen MiniStar Phaser candidate review without importing candidate source.

## Verification workaround

The first full foundation run used the default port 3000 and reported many
500s because that port was serving a stale or incompatible Next process. A
fresh webpack server on port 3019 returned 200 for all 88 active routes, and
the route verifier passed after setting `ACTIVE_ROUTE_BASE_URL` to that port.

Use this procedure when port 3000 is occupied or suspect:

1. Start the web server on an available port, such as 3019, with webpack.
2. In a second PowerShell window, set
   `$env:ACTIVE_ROUTE_BASE_URL = "http://127.0.0.1:3019"`.
3. Run `npm run verify:routes`.
4. Stop only the temporary server after verification.

This is a read-only verification routing override. It does not replace the
user's existing server and does not authorize any source promotion.

See ADR 0819, DR-891, and
`docs/verification/CANONICAL_MEMORY_MATCH_INTEGRATION_GATE_CHECKS.md`.
