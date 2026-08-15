# DR-454: Label It Active Route

Date: 2026-08-15

Decision: Promote `label-it` to a first-class active student route at `/label-it/[code]`.

White-label impact: Positive. Label It gives tenants a reusable image-aware pairing mode for textbook diagrams, classroom objects, routines, and vocabulary scenes while preserving shared scoring, event, audio, and route contracts.

Cost impact: Controlled. The route uses a structural reviewed-anchor placeholder and browser audio support. It does not require image storage, file processing, object storage, CDN, AI vision, or live upload infrastructure in the foundation build.

Guardrails:
- Every visible label, instruction, and feedback control must remain tap-to-speak.
- Target-language label placement is the only progress trigger.
- Support-language labels remain support-only and cannot unlock mastery.
- Real uploaded images cannot become student-facing until `game_asset_manifest`, `label_anchor_record`, rights, alt text, safety, audio, accessibility, and release gates pass.
- No live label editor, file picker write, or upload-to-assignment shortcut is introduced by this route.

Implementation notes:
- `label-it` uses the `pairing` parent engine and the `pairing-reinforcement-v1` scoring profile.
- The first playable route draws a responsive reviewed-image placeholder with fixed anchor buttons.
- Future uploaded assets should feed the same anchor model after storage and release-control work is complete.
