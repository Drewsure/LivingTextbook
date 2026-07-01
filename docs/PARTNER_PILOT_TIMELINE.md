# Partner Pilot Timeline

This document gives a practical answer for white-label partner conversations. It should be reviewed before making any timeframe promise to a publisher, school, or colleague.

## Current Position

The platform has a working foundation slice:

- tenant-branded shell,
- second sample tenant proof route,
- teacher launch route,
- teacher/admin content intake route,
- deployment profile scaffold,
- persistence boundary scaffold,
- teacher session monitor scaffold,
- student QR launch route,
- front-door entry-code/user-code route,
- flashcard entry practice,
- Memory Match,
- Training Academy,
- Speak It with local record/replay,
- sample multimedia package,
- local progress summaries,
- teacher-visible progress summary concept.

This is not yet a complete product, but it is enough to support a credible pilot plan.

The current second-tenant proof is visible at `/partner-demo`, with review, teacher, and student routes at `/teacher/intake`, `/teacher/sessions/demo-unit-1`, `/teacher/sessions/partner-demo-unit-1`, `/enter/sample-publisher`, `/launch/partner-demo-unit-1`, and `/speak/partner-demo-unit-1`.

## Timeframe To Quote

Recommended external wording:

> We can prepare a testable white-label Living Textbook pilot in roughly 8-12 weeks, with commercial readiness following after pilot feedback.

## Deployment Guidance

The recommended first pilot path is a hosted PWA. It is the fastest, lowest-friction way to test branded content, permanent-ish route behavior, media engagement, games, and teacher reporting assumptions without taking on installer and offline sync complexity too early.

Local classroom server and packaged local app paths remain first-class requirements for closed textbook companion deployments. They should move forward after the pilot scope chooses clear rules for local routing, yearly content-package updates, media rights, offline bundle manifests, reporting export/sync, and QR/deep-link fallback behavior.

## Reporting Guidance

The teacher session monitor route now demonstrates the desired report shape using sample data and the shared event stream. A real pilot still requires persisted launch sessions, progress/media event storage, privacy and retention policy, teacher access control, and export rules before real student data is recorded.

## Milestones

| Window | Outcome | Notes |
| --- | --- | --- |
| Now-2 weeks | Internal proof-of-concept | Verify current routes, stabilize local checks, choose the first partner pilot scope, and select the first deployment profile. |
| 3-6 weeks | Pilot content package | Expand the second-tenant sample into a small set of reviewed partner units, media assets, and game payloads. |
| 6-8 weeks | Partner-facing demo | Show branded shell, QR/front-door entry, content intake review, deployment profile, teacher session monitor, 2-4 games, and media playlist. |
| 8-12 weeks | Testable pilot | Run a controlled pilot with real unit content, reporting persistence, privacy rules, and deployment assumptions. |
| 4-6 months | Commercial product candidate | Add persistence, admin tools, content import review, local/offline packaging, security/privacy review, and broader game coverage. |

## Scope For A First Partner Pilot

Keep the first partner pilot narrow:

- one tenant brand,
- one book or level sample,
- two to four units,
- two to four reusable game modes,
- one audio playlist,
- one video playlist,
- one teacher reporting view,
- one agreed deployment style.

Avoid promising all 48 game modes, AI Tutor, full offline packaging, full analytics, or automated PDF conversion in the first partner pilot.

## Required Partner Inputs

Before a serious pilot estimate is confirmed, collect:

- PDF or editable source files for sample units,
- audio/video files or ownership confirmation,
- desired support language rules,
- preferred student entry style,
- logo/color/brand rules,
- age range and reading level,
- school privacy/reporting expectations,
- whether the pilot must run hosted, local, or both.

## Product Boundary

MiniStar remains the flagship tenant and reference curriculum. A partner pilot must prove that the same platform can be configured for another textbook without hard-coding MiniStar curriculum, Star Dust naming, avatar families, or Japanese assist language into universal platform rules.
