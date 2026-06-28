# Local Textbook Companion Strategy

Scenario: A textbook publisher or colleague has an existing textbook series and needs a closed local companion application that provides games, music/audio, videos, playlists, and gamified review. Printed textbooks may include long-lived QR codes that launch the correct unit activities.

## Can Living Textbook Support This?

Yes. This is directly aligned with the white-label platform direction.

The platform should support a partner tenant where the textbook is the curriculum source, the PDF units are the onboarding material, and the digital companion provides:

- unit-linked games,
- unit-linked music, audio, and video playback,
- optional unit media during games where pedagogically appropriate,
- deterministic gamification,
- teacher launch routes,
- student self-progression,
- teacher progress reports,
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
3. Multimedia companion for music, audio, and video
4. QR launch registry and front-door entry
5. Student progression and rewards
6. Teacher preview/launch/report surface
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
- music/audio/video asset references
- recommended game modes
- teacher notes

Important rule: PDF extraction is not automatically trusted. It should create draft unit payloads for human review, then AI/verifier checks before student use.

## Multimedia Platform Clarification

The partner does not need us to create music or video content. The partner needs a multimedia platform that can maintain, organize, launch, and report on those assets year after year.

The platform should support:

- audio track catalog
- video asset catalog
- unit-linked playlists
- teacher preview player
- student playback player
- local/offline multimedia bundles
- metadata such as title, unit, page, duration, rights/owner, language, media type, edition, and version
- QR codes that open the correct song, chant, listening activity, video, playlist, game, or unit front door
- optional teacher/tenant-controlled background music or support video during unit games

This should be built as a multimedia asset layer, not as one-off music or video pages.

## Games And Gamification

Games should use the same reusable parent-engine model already defined for the platform.

For a textbook partner, each unit can map to:

- flashcards for entry practice
- Memory Match or matching games for vocabulary
- quiz/selection games for review
- spelling or sentence games for later depth
- deterministic rewards tied to completion and mastery
- optional unit media played before, after, or during games as controlled support

The partner tenant may define its own reward names, badges, avatar style, visual theme, media rules, and progression rules.

## Front-Door Entry And Teacher Reporting

The recommended partner flow should support both direct printed QR routes and a front-door route.

Possible front-door flow:

1. Student scans the textbook QR.
2. Student lands on a branded partner front door.
3. Student enters an entry code.
4. If required, student enters a user code.
5. The platform opens the correct unit package.
6. Games, media, rewards, and progress all connect to the teacher report.

The teacher report should eventually distinguish:

- media started/completed,
- game started/completed,
- vocabulary progress,
- sentence/syntax progress,
- Star Dust or tenant reward progress,
- and Training Academy recommendations.

## Closed Local Application Requirement

A closed local application is achievable, but it needs a deployment choice.

Recommended options:

### Option A: Installed Local App

Use a packaged desktop/tablet app that includes the web experience, content packages, multimedia bundles, and local storage.

Possible future packaging approaches:

- Tauri-style shell
- Electron-style shell
- installed PWA where acceptable
- local LAN classroom server for schools

Strengths:

- Can run without public student accounts.
- Can bundle music, videos, and games.
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

Build toward the hybrid standard:

1. Use a stable QR registry model from the beginning.
2. Support a local closed app/content package for classrooms or schools.
3. Allow a tiny hosted redirect layer for printed QR permanence when the partner wants truly durable external QR codes.
4. Keep all games, music, audio, and video as tenant content packages, not hard-coded product pages.
5. Support a front-door QR route for entry code/user code when teacher reporting is needed.

This gives the partner confidence while keeping the platform saleable to future textbook publishers.

## Minimum Viable Partner Pilot

A realistic first pilot could include:

- 1 textbook unit imported from PDF
- 1 unit-linked audio asset
- 1 unit-linked video asset
- 1 unit playlist
- 1 optional background media setting for a game
- flashcard entry practice
- Memory Match vocabulary game
- deterministic reward preview
- teacher launch screen
- student QR/front-door route
- teacher progress summary concept
- local content package sample
- printed-style QR id mapped to the digital unit

## Key Risks

- PDF extraction quality can vary.
- Audio/video rights and file ownership must be tracked.
- Eternal QR codes require stable route policy before printing.
- Fully offline local deployments require installation/update planning.
- Background media can distract from learning if it is not teacher-controlled and accessible.
- If we build partner-specific shortcuts too early, we could damage the white-label architecture.

## Confidence Assessment

Can we deliver this? Yes.

Required adaptation: support complete multimedia content packages, front-door entry, teacher progress reporting, local/closed deployment, and permanent hybrid QR planning from the start.

This does not require abandoning the current build. It confirms that the current white-label direction is correct, but it adds a crucial product dimension that must be designed before we promise printed textbook QR permanence or partner multimedia maintenance.
