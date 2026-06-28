# Local Textbook Companion Strategy

Scenario: A textbook publisher or colleague has an existing textbook series and needs a closed local companion application that provides both games and a music/audio platform. Printed textbooks may include long-lived QR codes that launch the correct unit activities.

## Can Living Textbook Support This?

Yes. This is directly aligned with the white-label platform direction.

The platform should support a partner tenant where the textbook is the curriculum source, the PDF units are the onboarding material, and the digital companion provides:

- unit-linked games,
- unit-linked audio/music playback,
- deterministic gamification,
- teacher launch routes,
- student self-progression,
- local or closed deployment,
- and permanent QR identifiers printed in the book.

## Product Shape

The partner product would be a white-label textbook companion, not a MiniStar product.

Possible label:

- Living Textbook Companion
- Publisher-branded Learning Companion
- Book Series Digital Companion

Core modules:

1. Textbook unit library
2. Game companion
3. Music/audio companion
4. QR launch registry
5. Student progression and rewards
6. Teacher preview/launch surface
7. Local/offline content package manager

## PDF Unit Onboarding

The partner provides PDF units.

The platform needs an onboarding pipeline that can convert each PDF unit into reviewed structured content:

- tenant id
- textbook series id
- book id
- unit id
- page references
- unit title/theme
- vocabulary list
- grammar/sentence targets
- activity notes
- audio/music asset references
- recommended game modes
- teacher notes

Important rule: PDF extraction is not automatically trusted. It should create draft unit payloads for human review, then AI/verifier checks before student use.

## Music/Audio Platform Clarification

The partner does not need us to create music content. The partner needs a music/audio platform.

The platform should support:

- audio track catalog
- unit-linked playlists
- teacher preview player
- student playback player
- local/offline audio bundles
- audio metadata such as title, unit, page, duration, rights/owner, language, and version
- QR codes that open the correct song, chant, listening activity, or playlist

This should be built as a media asset layer, not as a one-off music page.

## Games And Gamification

Games should use the same reusable parent-engine model already defined for the platform.

For a textbook partner, each unit can map to:

- flashcards for entry practice
- Memory Match or matching games for vocabulary
- quiz/selection games for review
- spelling or sentence games for later depth
- deterministic rewards tied to completion and mastery

The partner tenant may define its own reward names, badges, avatar style, visual theme, and progression rules.

## Closed Local Application Requirement

A closed local application is achievable, but it needs a deployment choice.

Recommended options:

### Option A: Installed Local App

Use a packaged desktop/tablet app that includes the web experience, content packages, and local storage.

Possible future packaging approaches:

- Tauri-style shell
- Electron-style shell
- installed PWA where acceptable
- local LAN classroom server for schools

Strengths:

- Can run without public student accounts.
- Can bundle audio and games.
- Can work offline after installation.
- Can protect partner content better than a public-only website.

Risks:

- Requires installation and update process.
- QR behavior depends on app/deep-link support or local server setup.
- Device management varies by school.

### Option B: Stable Cloud Redirect Plus Local App

Printed QR codes point to a stable hosted redirect service, which opens the local app when installed or provides a controlled web fallback.

Strengths:

- Best path for truly long-lived printed QR codes.
- QR destinations can be changed without reprinting books.
- Allows analytics and support if desired.
- Can still direct to local/offline content when the app is installed.

Risks:

- Requires a small hosted redirect service.
- Not purely offline.

### Option C: Pure Offline QR / Deep Link

Printed QR codes use a custom app scheme or local route identifier.

Example shape:

`livingtextbook://tenant/series/book/unit/activity`

Strengths:

- Can be fully offline if the app is installed.
- No public URL dependency.

Risks:

- QR code only works after app installation.
- Some devices handle custom schemes inconsistently.
- Harder to update printed QR behavior after publication.

## Eternal QR Code Rule

Printed QR codes should never point directly to fragile local files, temporary localhost ports, or version-specific asset paths.

They should point to stable identifiers.

Recommended QR payload concepts:

- tenant id
- series id
- book id
- unit id
- activity id
- optional language/edition/version

The platform should resolve that stable id to the current local or hosted asset.

## Recommended Strategy For This Partner

Build toward a hybrid strategy:

1. Use a stable QR registry model from the beginning.
2. Support a local closed app/content package for classrooms or schools.
3. Allow a tiny hosted redirect layer for printed QR permanence when the partner wants truly durable external QR codes.
4. Keep all games/audio as tenant content packages, not hard-coded product pages.

This gives the partner confidence while keeping the platform saleable to future textbook publishers.

## Minimum Viable Partner Pilot

A realistic first pilot could include:

- 1 textbook unit imported from PDF
- 1 unit-linked audio playlist
- flashcard entry practice
- Memory Match vocabulary game
- deterministic reward preview
- teacher launch screen
- student QR route
- local content package sample
- printed-style QR id mapped to the digital unit

## Key Risks

- PDF extraction quality can vary.
- Audio rights and file ownership must be tracked.
- Eternal QR codes require stable route policy before printing.
- Fully offline local deployments require installation/update planning.
- If we build partner-specific shortcuts too early, we could damage the white-label architecture.

## Confidence Assessment

Can we deliver this? Yes.

Required adaptation: add explicit support for content packages, audio/media assets, local/closed deployment, and permanent QR registry planning.

This does not require abandoning the current build. It confirms that the current white-label direction is correct, but it adds a crucial deployment/product dimension that must be designed before we promise printed textbook QR permanence.
