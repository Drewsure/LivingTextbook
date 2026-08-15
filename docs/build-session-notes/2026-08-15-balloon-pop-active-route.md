# 2026-08-15: Balloon Pop Active Structural Route

Added the first active Balloon Pop student route as an arcade-style skin over the selection parent engine.

Implemented:

- `/balloon/[code]` route for MiniStar and sample publisher launch codes.
- Structural Balloon Pop game component with tap-to-speak prompt, instruction, option, and feedback support.
- Standard `game_started`, `round_shown`, `answer_submitted`, `answer_result`, `mastery_updated`, and `game_completed` event path.
- Deterministic `arcade-reinforcement-v1` scoring.
- Route contract/helper, activity hub link, teacher shortcut, recommended route link, package audio coverage, active route matrix entries, and route verifier expectations.

Boundaries:

- No Phaser implementation yet.
- No random reward loop.
- No support-language progress.
- No package publishing, assignment activation, route registry mutation, or local bundle activation.

Next:

- Browser/mobile verify Balloon Pop at `/balloon/demo-unit-1` and `/balloon/partner-demo-unit-1`.
- Later Phaser/Z.ai work can use this route as the wrapper and event contract baseline.
