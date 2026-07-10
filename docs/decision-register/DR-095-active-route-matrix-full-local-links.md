# DR-095: Active Route Matrix Full Local Links

## Decision

The active route matrix should display full local `http://127.0.0.1:3000` URLs while linking to the same route path.

## Reason

The platform owner uses the route list during live browser checks. Showing full local URLs reduces friction and avoids confusion between relative scaffold paths and the exact address to test.

## Standard

- The route matrix remains a scaffold/admin QA surface.
- Full local URLs are shown for testing convenience only.
- Full local URLs must not be treated as production QR or publisher-facing links.
