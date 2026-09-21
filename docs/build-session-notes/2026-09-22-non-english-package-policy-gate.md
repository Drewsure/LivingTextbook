# Build Session: Non-English Package Policy Gate

Added a fail-closed runtime gate requiring explicit package target-language
policy metadata for non-English requests. This prevents a route-level Japanese
or future multilingual request from being treated as ready while its package
still relies on English assumptions.

English migration fixtures remain compatible. Japanese pilot blockers remain
unchanged.

Recorded in ADR 0934 and decision register DR-1006.
