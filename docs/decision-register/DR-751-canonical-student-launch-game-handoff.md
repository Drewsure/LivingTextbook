# DR-751: Canonical Student Launch Game Handoff

The QR launch pathway now mounts the canonical Match Up or Memory Match game
for supported next steps instead of rendering only a preview. The parent launch
flow selects the activity; the mounted game emits the single `game_started`
event; completion is accepted only after the shared canonical event validator
passes. This prevents duplicate starts and keeps in-page progression aligned
with standalone game routes. See ADR 0679.
