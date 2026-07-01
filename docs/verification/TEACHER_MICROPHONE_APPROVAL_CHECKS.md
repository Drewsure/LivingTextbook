# Teacher Microphone Approval Checks

Use this checklist after pulling `legacy-source-import`.

## Full Test Addresses

[http://127.0.0.1:3000/teacher](http://127.0.0.1:3000/teacher)

[http://127.0.0.1:3000/speak/demo-unit-1](http://127.0.0.1:3000/speak/demo-unit-1)

## Checks

1. Open `http://127.0.0.1:3000/teacher`.
2. Confirm `Microphone approval` appears below the teacher launch panel.
3. Confirm the panel has `Allow local mic` and `Keep mic off` controls.
4. Confirm local replay is described as no API cost.
5. Confirm AI transcription or pronunciation scoring is described as premium and potentially API-cost-bearing.
6. Click `Keep mic off`.
7. Open `http://127.0.0.1:3000/speak/demo-unit-1` and confirm record/replay controls are hidden.
8. Return to the teacher page and click `Allow local mic`.
9. Open `http://127.0.0.1:3000/speak/demo-unit-1` and confirm record/replay controls are visible.
10. Confirm speaking progress still requires `I said it`; recording alone must not complete the prompt.

## Current Limitation

The approval is stored in browser local storage for the foundation scaffold. Production classroom use must move this into persisted launch/session settings so a teacher device can control student devices reliably.
