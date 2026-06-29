# AI Tutor Entitlement Verification Checks

Use these checks when the `legacy-source-import` branch is locally accessible and after the normal build/typecheck/browser checks pass.

AI Tutor is an optional premium package. These checks must not require live model calls, speech services, billing, or active tutor UI.

## Static Contract Checks

1. Confirm `packages/content-model/src/index.ts` exports:
   - `AiTutorEntitlement`
   - `TenantFeatureEntitlements`
   - `UnitAiTutorPlan`
   - `AiTutorModeId`
   - `validateAiTutorEntitlement`
   - `validateUnitAiTutorPlan`
2. Confirm `ContentPackage` can include optional `aiTutorPlans`.
3. Confirm `validateContentPackage` validates AI Tutor plans without requiring one for baseline packages.
4. Confirm enabled AI Tutor plans require `premium` or `enterprise` entitlement.
5. Confirm disabled AI Tutor plans do not block valid core packages.

## Tenant Configuration Checks

1. Confirm `TenantConfig` supports optional `featureEntitlements`.
2. Confirm `ministarTenant.featureEntitlements.aiTutor.enabled` is `false` by default.
3. Confirm MiniStar's sample AI Tutor package tier is `premium`.
4. Confirm allowed tutor levels are upper-level only in the sample configuration.
5. Confirm core tenant brand, rewards, QR launch, audio, games, and multimedia do not depend on AI Tutor being enabled.

## Dashboard Package Checks

On `/`:

1. Confirm the Living Textbook package panel includes an `AI Tutor` package metric.
2. Confirm the metric says `Premium off` for the current MiniStar sample package.
3. Confirm the AI Tutor package section says the plan is disabled.
4. Confirm the entitlement is shown as `premium`.
5. Confirm the package still validates as `Package valid`.
6. Confirm no active tutor chat, model call, or student AI route appears in the foundation slice.

## Student Flow Checks

On `/launch/demo-unit-1` and `/enter/ministar`:

1. Confirm flashcards still work without AI Tutor enabled.
2. Confirm Memory Match still unlocks and plays without AI Tutor enabled.
3. Confirm media engagement still works without AI Tutor enabled.
4. Confirm teacher report preview still separates game/media progress and does not require tutor events.
5. Confirm no AI Tutor disabled state blocks the student from normal progression.

## Future Prototype Gate

Do not build an active AI Tutor prototype until:

1. The foundation slice is locally verified.
2. A tenant entitlement model is accepted for active feature gating.
3. Privacy, safety, usage limits, and reporting rules are documented.
4. One upper-level unit is selected for a narrow prototype.
5. The prototype has a verification checklist update before implementation.
