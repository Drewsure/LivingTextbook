# DR-127: Active Route Matrix 26-Route Alignment

## Decision

Expand the visible active route matrix to match the current 26-route verification list.

## Reason

The automated route verifier had grown to include game, media, teacher session, report package, and stable QR routes, while the `/teacher/intake` matrix still showed only a smaller subset. The visible admin surface should reflect the real scaffold surface future builders must protect.

## Standard

- `/teacher/intake` shows `26 checked routes`.
- The matrix includes core, MiniStar, sample-publisher, and stable QR route groups.
- The matrix includes teacher session and report package preview routes.
- The route verifier checks the route count text remains visible.
