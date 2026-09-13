# DR-759: Front-Door Game Start Ownership

The front-door launch flow now selects the next unlocked mode without creating
its own `game_started` event. The mounted canonical game wrapper emits the
single start event, matching the QR launch flow and preventing duplicate game
attempts in teacher reports. See ADR 0687.
