# Living Textbook Operating Notes

This document records repeatable procedures, environment constraints, and workarounds that future Codex sessions, engineers, or outside AI agents may need to recall.

These notes are not product standards. Product standards live in `docs/PRINCIPLES_AND_STANDARDS.md`. This file is the operational memory for how work actually gets done when tooling, branches, local permissions, or connectors behave in a consistent way.

## OW-001: GitHub Connector File Updates When Local Repo Access Is Blocked

Status: Active

Observed behavior: The local checkout may allow reading the repository root but block nested reads inside `LivingTextbook`, even after explicit read permission is requested. This prevents normal local patching and local build verification in that session.

Procedure:

1. Confirm the intended branch before editing. Current planning/build work has been on `legacy-source-import`.
2. Fetch target files through the GitHub connector using repository `Drewsure/LivingTextbook` and ref `legacy-source-import`.
3. Update or create files through the GitHub connector on the same branch.
4. Read back changed files through the connector after every meaningful update.
5. State clearly in the final response that local build/typecheck was not run if the local checkout remained inaccessible.
6. Do not assume the local checkout mirrors the remote working branch until it has been explicitly synchronized and verified.

Why this matters: It prevents accidental work on `main`, avoids destructive local workarounds, and preserves a reliable audit trail on the remote branch.

## OW-002: Branch Comparison May Fail Between `main` And `legacy-source-import`

Status: Active

Observed behavior: GitHub compare between `main` and `legacy-source-import` may report no common ancestor.

Procedure:

1. Do not use branch comparison as the only verification method.
2. Verify by reading back changed files directly from the target branch.
3. Mention this branch-state limitation when summarizing verification.
4. Avoid merge or reset operations until branch history is intentionally normalized.

## OW-003: Standards Must Be Updated When A Repeated Rule Appears

Status: Active

Procedure:

1. If a product/build principle affects future decisions, update `docs/PRINCIPLES_AND_STANDARDS.md`.
2. If a repeatable technical workaround or environment behavior appears, update this file.
3. If a major architecture decision is accepted, update `docs/DECISION_REGISTER.md` and add an ADR when useful.
4. Do not leave durable process knowledge only in chat history.

## OW-004: GitHub Connector Stale SHA Conflict

Status: Active

Observed behavior: Updating a file through the GitHub connector can fail with a 409 conflict if the file SHA is stale. This can happen after a recent create/update or when multiple related edits happen close together.

Procedure:

1. Stop updating that path immediately.
2. Refetch the exact file from `legacy-source-import`.
3. Use the fresh `sha` from the refetch.
4. Reapply the intended update against the fresh content.
5. Read back the changed file after the update succeeds.

Why this matters: It prevents accidental overwrites and keeps connector-based edits safe when local checkout verification is unavailable.

## OW-005: Local Checkout May Not Track Remote Connector Branch

Status: Active

Observed behavior: The local `D:\LIVING TEXTBOOOK PROJECT\LivingTextbook` checkout can be present but still not match the active GitHub connector branch. In the current observed state, local `git status --short --branch` reported `main`, `git log --oneline -5` showed a single local import commit, and `git remote -v` returned no configured remotes. Network permission was granted for a sync attempt, but adding the GitHub remote was blocked because `.git` write permission was not granted.

Procedure:

1. Do not run build or typecheck as proof of `legacy-source-import` unless the local checkout has first been synchronized to that branch.
2. Check local branch and remotes before claiming local verification.
3. If no remote is configured, either use GitHub connector readback only or intentionally configure/sync the repo in a separate setup step.
4. To sync locally, the session needs both network access and write access to `D:\LIVING TEXTBOOOK PROJECT\LivingTextbook\.git`.
5. Clearly distinguish connector readback verification from local build, typecheck, or browser verification.
6. Avoid local edits on `main` while connector work is happening on `legacy-source-import` unless the task explicitly calls for local branch repair.

Preferred recovery when `.git` write remains blocked:

1. Preserve the stale local folder by renaming it to `LivingTextbook-local-main-backup`.
2. Clone `Drewsure/LivingTextbook` fresh into `D:\LIVING TEXTBOOOK PROJECT\LivingTextbook` using branch `legacy-source-import`.
3. Confirm `git status --short --branch` reports `legacy-source-import`.
4. Confirm `git remote -v` shows the GitHub remote.
5. Install dependencies if needed.
6. Run typecheck/build.
7. Start the local web app and verify `/launch/demo-unit-1` and `/enter/ministar` against `docs/VERIFICATION_CHECKLIST.md`.

Manual PowerShell recovery commands:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT"
Rename-Item "LivingTextbook" "LivingTextbook-local-main-backup"
git clone --branch legacy-source-import https://github.com/Drewsure/LivingTextbook.git LivingTextbook
```

Why this matters: It prevents false confidence, avoids testing stale files, and keeps future work from splitting between an unsynced local checkout and the remote branch.

## OW-006: Fresh Clone Dependency Install Requires One-Time Lockfile Creation

Status: Active

Observed behavior: After a fresh clone of `legacy-source-import`, the repository may not contain `package-lock.json` or `node_modules`. In the managed Codex desktop environment, `npm ci` is allowed, but `npm install` can be blocked by local command policy. Because `npm ci` requires an existing lockfile, build and typecheck will fail until the first install creates the lockfile and dependencies.

Observed failure signatures:

- `npm ci` fails with `The npm ci command can only install with an existing package-lock.json`.
- `npm run typecheck --workspace @living-textbook/web` fails with `'tsc' is not recognized`.
- `npm run build --workspace @living-textbook/web` fails with `'next' is not recognized`.

Procedure:

1. Confirm the clone is on `legacy-source-import`.
2. If `package-lock.json` is missing and Codex cannot run `npm install`, ask the repository owner to run the one-time install locally:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
npm install
```

3. After `package-lock.json` exists, future sessions should prefer the reproducible install path:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
npm ci
```

4. Then run:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

5. Do not mark local build/browser verification complete until dependencies have been installed and the route checks have actually run.

Why this matters: It prevents the team from mistaking missing local dependencies for application bugs, while preserving a clean path toward reproducible installs once a lockfile is committed.

## OW-007: Stale Next Dev Server Blocks Local Route Verification

Status: Active

Observed behavior: A prior `next dev` process can continue holding port `3000` or block a second dev server even when browser navigation hangs. Next may print the active process id, directory, and log path with `Another next dev server is already running`.

Observed failure signatures:

- `listen EADDRINUSE: address already in use 127.0.0.1:3000`.
- `Another next dev server is already running` followed by a `PID`, `Dir`, and `.next\dev\logs\next-development.log`.
- HTTP or browser route checks hang even though a port appears occupied.

Procedure:

1. Confirm the printed `Dir` points to the intended app, usually `D:\LIVING TEXTBOOOK PROJECT\LivingTextbook\apps\web`.
2. Stop only the printed process id:

```powershell
taskkill /PID <printed-pid> /F
```

3. Restart the dev server from the repository root:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

4. Leave the terminal window open while browser verification runs.
5. If port `3000` is intentionally unavailable, try `3001`, but stop stale same-app Next servers first because Next may block multiple dev servers for the same app directory.

Why this matters: It avoids wasting time debugging the app when the real issue is a stale local development process.

## OW-008: Managed Session Allows Local Reads But Rejects Local Writes

Status: Active

Observed behavior: Some managed Codex desktop sessions can read the local `LivingTextbook` checkout but reject local write operations, including directory creation and `apply_patch`, even inside `D:\LIVING TEXTBOOOK PROJECT`. Git network fetch may also be blocked from the agent side while the user can still pull successfully in PowerShell.

Observed failure signatures:

- Shell write command returns `approval required by policy`, but sandbox approval is unavailable.
- `apply_patch` returns `writing outside of the project; rejected by user approval settings`.
- `git fetch` is blocked for the agent even though the repository owner can run `git pull --ff-only` locally.

Procedure:

1. Read local files for context when available.
2. Use the GitHub connector for repository writes on `legacy-source-import`.
3. Read back connector-created files before asking for local verification.
4. Ask the human owner to run `git pull --ff-only` locally when connector commits need to be synchronized.
5. After the human pull, run typecheck/build and browser verification locally if the agent is allowed to execute those commands.
6. Keep the generated `apps/web/next-env.d.ts` local modification uncommitted unless a real source change requires it.

Why this matters: It keeps progress moving without unsafe local workarounds, and it makes the human-side pull an explicit bridge rather than a mystery failure.

## OW-009: Tailwind Variable Color Classes Need Explicit Color Syntax

Status: Active

Observed behavior: Tailwind arbitrary text color classes such as `text-[var(--tenant-primary-text)]` can be interpreted ambiguously or fail to compile as a color utility. The visual symptom is a dark tenant-primary button with invisible dark inherited text, even though the component appears correct in JSX.

Observed failure signatures:

- Primary buttons render as dark blocks with no readable label.
- `Mark practice complete` or `Start Memory Match` appears to be missing even though the button exists and is clickable.
- Typecheck/build pass because the issue is CSS utility generation, not TypeScript.

Procedure:

1. For tenant color variables used as text colors, use explicit color syntax: `text-[color:var(--tenant-primary-text)]`.
2. Use the same explicit syntax for secondary or quiet variants when they depend on tenant text variables.
3. After changing shared UI primitives, verify `/launch/demo-unit-1` visually, not only by typecheck/build.
4. Confirm primary action buttons show readable labels in both locked/unlocked states.
5. Add or update visual verification notes if a new arbitrary variable color class is introduced.

Why this matters: Tailwind syntax ambiguity can hide primary learning controls, which blocks young learners from finding Memory Match or completing entry practice.

## OW-010: Learner Action Buttons Need Local Style Fallbacks

Status: Active

Observed behavior: A connector-side shared UI primitive update may not immediately appear in a local dev server or a local checkout that has not pulled the latest remote commit. The visual symptom can persist as a black, blank-looking action button even after the shared `Button` source has been corrected on GitHub.

Procedure:

1. Keep the shared `Button` primitive correct, but do not rely only on shared-package Tailwind classes for critical learner action colors.
2. For wrappers such as `AudioSupportedAction`, pass explicit inline CSS variable fallback styles for background, border, and text color.
3. Use `var(--tenant-accent)` and `var(--tenant-accent-text)` for primary learner actions.
4. After pulling and rebuilding, hard refresh `/launch/demo-unit-1` or restart the dev server if the old visual remains.
5. Verify by screenshot or direct browser view, not only typecheck/build.

Why this matters: Young learners must be able to see the action button immediately. Shared package caching or stale local files should not hide the next step in the classroom flow.

## OW-011: Next 16 Windows Build Uses Webpack Fallback

Status: Active

Observed behavior: `next build` can fail on Windows with a Turbopack internal error while processing `apps/web/src/app/globals.css` through PostCSS. The dev server may still start successfully, which indicates the app source and routes are not necessarily broken.

Procedure:

1. Keep the dev server on the normal Next path.
2. Keep the production build script on `next build --webpack` until a future Next upgrade proves the Windows Turbopack/PostCSS worker path is stable.
3. Before local verification, pull the branch and run:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

4. See `docs/operating-notes/2026-07-02-next16-windows-webpack-build.md` for the detailed failure signature and recovery note.

Why this matters: The project can keep the low-cost Next/Tailwind foundation while avoiding repeat production-build interruptions from a tooling worker failure.

## OW-012: Transient Git Index Lock After Parallel Checks

Status: Active

Observed behavior: A `git commit` can briefly fail with `.git/index.lock` after nearby parallel status/diff/staging checks. In the observed cases, no active Git process remained and the lock disappeared without manual deletion.

Observed failure signature:

- `fatal: Unable to create '.git/index.lock': File exists.`

Procedure:

1. Do not immediately delete `.git/index.lock`.
2. Check for an active Git process:

```powershell
Get-Process git -ErrorAction SilentlyContinue
```

3. Check whether `.git\index.lock` still exists:

```powershell
Get-Item .git\index.lock -ErrorAction SilentlyContinue
```

4. If no Git process is active and the lock has already cleared, retry the original Git command.
5. Only consider manually removing the lock after confirming no Git process is active and the lock persists.

Why this matters: It avoids corrupting the repository while still giving future sessions a quick recovery path for a repeat Windows/local tooling hiccup.

## OW-013: Full Foundation Verification May Need A Longer Tool Window

Status: Active

Observed behavior: `npm run verify:foundation` can pass but take longer than a short command timeout because it runs many focused verifiers, Next type generation, a production build, and 47 live route checks. A timeout with no failure output should not be treated as a broken build until rerun with a longer window.

Observed failure signature:

- Tool reports `command timed out` around 300 seconds.
- A rerun with a longer timeout completes successfully.

Procedure:

1. Run targeted checks first when developing a narrow slice.
2. Before commit, run the full command with a longer timeout:

```powershell
npm run verify:foundation
```

3. If a managed tool timeout occurs without verifier failure output, rerun the same command with a longer command window.
4. Treat actual `FAIL` lines from a verifier as build failures; treat a bare timeout as inconclusive.

Why this matters: The foundation gate is intentionally broad. A longer verification window protects quality without misreading a slow Windows/Next route pass as a product defect.

## OW-014: Next Route Type Generation Must Run Sequentially

Status: Active

Observed behavior: Running `npm run typecheck --workspace @living-textbook/web` and `npm run build --workspace @living-textbook/web` in parallel can produce temporary `TS6053` missing-file errors under `apps/web/.next/types/app/...`. This is a generated route-type race, not necessarily a source-code failure.

Procedure:

1. Run typecheck and build sequentially.
2. If the route-type `TS6053` error appears after a parallel run, wait for build to finish and rerun typecheck.
3. Treat a repeated sequential failure as real.
4. See `docs/operating-notes/2026-07-17-next-route-typegen-sequential-run.md` for the detailed note.

Why this matters: Next route type generation writes into `.next/types`. Sequential verification avoids false failures and keeps the local build process calm.

## OW-015: GitHub Push Can Block On Missing Windows Credentials

Status: Active

Observed behavior: Local commits can succeed, but `git push origin legacy-source-import` may hang until the tool window times out. A non-interactive retry can reveal that Windows/Git has no available GitHub credentials.

Observed failure signature:

- `fatal: unable to access 'https://github.com/Drewsure/LivingTextbook.git/': schannel: AcquireCredentialsHandle failed: SEC_E_NO_CREDENTIALS`

Procedure:

1. Confirm the local branch is clean and ahead of the remote:

```powershell
git status -sb
git log --oneline --decorate -4
```

2. Try a non-interactive diagnostic push to avoid silent waiting:

```powershell
$env:GIT_TERMINAL_PROMPT='0'
git push --porcelain origin legacy-source-import
```

3. If `SEC_E_NO_CREDENTIALS` appears, the human-side fix is to run:

```powershell
git push origin legacy-source-import
```

4. Complete the GitHub/Git Credential Manager sign-in prompt, then rerun:

```powershell
git rev-parse origin/legacy-source-import
```

5. If the remote commit still does not match local `HEAD`, retry the normal push after credentials are refreshed.

Why this matters: It separates a real GitHub credential prompt from source-control or build failure. Work can continue locally, but the user must refresh credentials before the verified commit reaches GitHub.

## OW-016: Active Route Verification Can Hit Transient Local Fetch Failures

Status: Active

Observed behavior: `npm run verify:routes` can pass several routes and then report many `fetch failed` entries if the local Next server briefly stops responding during a long route sweep. A rerun can pass without source changes.

Observed failure signature:

- Many consecutive `FAIL error http://127.0.0.1:3000/... fetch failed` lines after earlier successful route checks.

Procedure:

1. Confirm the local server still responds:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/ -TimeoutSec 10
```

2. If it responds, rerun:

```powershell
npm run verify:routes
```

3. The verifier retries each route fetch twice with a short backoff and a 20-second per-attempt timeout.
4. Treat missing expected text, repeated fetch failure after retry, or repeated route fetch timeout as a real issue.

Why this matters: The active route list is intentionally broad. Lightweight retry behavior reduces false negatives without hiding real route content failures.

## OW-017: Recursive Text Search In PowerShell

Status: Active

Observed behavior: Windows PowerShell can reject `Select-String -Recurse` with a parameter-binding error in this environment.

Preferred procedure:

```powershell
rg "search text" path
```

Fallback procedure if `rg` is unavailable:

```powershell
Get-ChildItem -Recurse -File path | Select-String -Pattern "search text"
```

Why this matters: Search should stay fast and read-only. Do not use this workaround to build delete, move, or overwrite command strings.

## OW-018: PowerShell Needs Literal Paths For Bracketed Next Routes

Status: Active

Observed behavior: Next.js App Router folders such as `[tenantId]` are valid route folders, but PowerShell treats square brackets as wildcard pattern syntax when reading or staging files by path.

Observed failure signature:

- `Get-Content : specified path ... [tenantId] ... does not exist or was filtered by -Include or -Exclude.`

Procedure:

1. Use `-LiteralPath` when reading bracketed route files:

```powershell
Get-Content -LiteralPath "apps\web\src\app\teacher\maintenance\[tenantId]\page.tsx"
```

2. Quote bracketed route paths when staging or inspecting them through Git.
3. Do not treat a failed normal `Get-Content -Path` call as evidence that the route file is missing.

Why this matters: Dynamic route folders are now common in the build. Literal-path handling prevents false missing-file diagnosis.

## OW-019: Active Route Verification Uses Small-Batch Fetching

Status: Active

Observed behavior: As the active route matrix grew past 60 routes, `npm run verify:routes` could time out or appear frozen while checking large pages, especially `/teacher/intake`, if the verifier waited until the end to print route results.

Procedure:

1. Keep `scripts/verify-active-routes.mjs` on small-batch route fetching rather than a fully sequential route sweep.
2. Keep the per-route fetch timeout finite so a stalled local server produces a clear route failure instead of a silent hang.
3. Keep the heavy shell routes fully checked sequentially before the concurrent sweep and exclude them from the worker pool: `/`, `/teacher`, `/teacher/intake`, `/teacher/persistence`, `/teacher/session-settings`, `/teacher/reporting`, `/teacher/entitlements`, `/teacher/game-readiness`, `/teacher/generator/sample-publisher`, and `/teacher/generator/ministar`.
4. Keep route output streaming and concise: passing routes should report the route path and expected-text count, while failures should report missing text, forbidden text, or timeout details.
5. If `npm run verify:routes` times out, directly probe the newest route and `/teacher/intake` first:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/match/demo-unit-1
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/teacher/intake
```

6. If those routes return `200`, rerun `npm run verify:routes` with a longer command timeout before assuming a source failure.
7. Treat missing expected text, failed route status, or repeated timeout after direct probes as a real issue.

Why this matters: The verifier is now protecting a broad commercial foundation. Small-batch fetching keeps the check practical without weakening the expected-text gate.

## OW-020: Repeated Review Text Needs Contextual React Keys

Status: Active

Observed behavior: Large teacher/admin review pages often repeat blocker, warning, and evidence text across cards. Using only the visible text as a React key can produce duplicate-key console warnings when the same sentence appears twice.

Procedure:

1. For mapped review lists, include a stable owner/context id plus the row index in the key.
2. Acceptable examples:

```tsx
items.map((item, index) => <li key={`${title}-${index}-${item}`}>{item}</li>)
records.map((record, index) => <section key={`${tenantId}-record-${index}-${record}`}>{record}</section>)
```

3. Prefer real record ids when the data model has them, such as `packetId`, `uploadId`, `laneId`, or `workspaceId`.
4. Do not use `Math.random()` or timestamp keys; they make React remount rows unnecessarily.

Why this matters: These pages are evidence-heavy and intentionally repetitive. Contextual keys keep the console clean and prevent row identity drift as the review data grows.

## OW-021: Next Type Generation And Build Must Run Sequentially

Status: Active

Observed behavior: `next typegen`, TypeScript checks, and `next build` all touch generated files under `.next/types`. Running typecheck and build in parallel can create false missing-file errors even when the source code is valid.

Observed failure signature:

- `TS6053: File '.next/types/app/.../page.ts' not found.`

Procedure:

1. Run typecheck first:

```powershell
npm run typecheck --workspace @living-textbook/web
```

2. After it finishes, run build:

```powershell
npm run build --workspace @living-textbook/web
```

3. Prefer `npm run verify:foundation` for the full local gate because it already runs checks in the correct order.
4. Do not diagnose route type files as missing until the checks have been rerun sequentially.

Why this matters: The foundation verifier must stay trustworthy. Avoiding parallel generated-file writes prevents noisy failures from hiding real build issues.

## OW-022: Next Dev Cold Route Warmup Can Produce A Transient 500

Status: Active

Observed behavior: On a cold Windows Next dev server, a broad active-route sweep can hit a transient route `500` during first compilation even when the same route returns `200` immediately afterward. In the observed case, `/assign/assignment-ministar-demo-whole-class` and `/teacher/units/ministar%3Aministar-english%3AL1%3AU1` briefly showed `SyntaxError: Unexpected end of JSON input`, then both returned `200` on direct repeat requests and the full route verifier passed without source changes.

Observed failure signatures:

- A small number of route `500` failures during the first `npm run verify:routes` sweep after starting `next dev`.
- Next dev log shows `SyntaxError: Unexpected end of JSON input` without a useful source stack.
- Direct `Invoke-WebRequest` calls to the same route return `200`.

Procedure:

1. Directly probe the failed route or routes:

```powershell
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:3000/assign/assignment-ministar-demo-whole-class"
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:3000/teacher/units/ministar%3Aministar-english%3AL1%3AU1"
```

2. If the direct probes return `200`, rerun:

```powershell
npm run verify:routes
```

3. Treat the failure as real if the same route returns `500` repeatedly, if direct probes fail, or if expected text remains missing after the route has warmed.
4. Do not weaken expected-text coverage to hide a transient cold compile issue.

Why this matters: Route verification should remain strict, but broad cold-start sweeps can expose dev-server timing noise. Warming and rerunning protects quality without misdiagnosing stable source code as broken.

## OW-023: PWA Manifest Does Not Mean Offline Ready

Status: Active

Observed behavior: A web app can expose a valid manifest and still have no approved offline lesson, media, QR fallback, report, cache, or local data behavior. This is especially easy to confuse when discussing closed textbook companions.

Procedure:

1. Treat the manifest as installable-shell evidence only.
2. Keep offline readiness blocked until service worker registration, cache policy, media rights, checksums, versioned manifests, QR fallback, rollback, learner-data exclusions, report/export policy, and school policy are complete.
3. Do not add service worker registration, cache writes, media precache, local installer export, local package activation, background sync, or student data offline storage from a review panel.
4. Preserve learning audio priority before allowing background music, video, or offline media behavior.
5. Run `npm run verify:local-bundle` and `npm run verify:routes` after any local companion, PWA, media bundle, manifest, or QR fallback change.

Why this matters: The white-label product can sell hosted PWA and future closed companion options only if each delivery promise is explicit, reliable, and policy-backed.

## OW-024: Deployment Workbench Is A Decision Surface, Not Activation

Status: Active

Observed behavior: Hosted PWA, local classroom server, and packaged textbook companion discussions can easily blur into implementation promises if they are not shown with cost, policy, media, storage, QR, report, and rollback blockers beside them.

Procedure:

1. Use `/teacher/deployment` for deployment conversations with schools or publishers.
2. Treat hosted PWA as the default first pilot recommendation unless a school requirement forces local operation.
3. Keep local classroom server and packaged companion options visible as paid or policy-gated product paths.
4. Do not activate local packages, export installers, claim offline readiness, mutate production QR redirects, export reports, collect real learner data, or enable premium AI Tutor features from the deployment workbench.
5. Run `npm run verify:deployment` and `npm run verify:routes` after any hosted/local/package deployment wording, route, offline, media bundle, or package tier change.

Why this matters: The platform can be sold confidently only when deployment choices are clear, cost-aware, and honest about what is ready versus what still needs evidence.

## OW-025: Pilot Dashboard Is A Go/No-Go Conversation Surface

Status: Active

Observed behavior: A strong controlled demo can sound like a live pilot if the evidence and blocker routes are not shown together.

Procedure:

1. Use `/teacher/pilot` for first colleague, publisher, or school pilot-readiness conversations.
2. State the current position as demo-ready, not classroom-ready.
3. Keep source/media evidence, school policy, persistence, reports, deployment, launch gates, and package publish gates visible from the dashboard.
4. Do not launch classrooms, collect real learner data, export reports, accept school policy, activate local packages, claim offline readiness, enable premium AI Tutor, or request Z.ai prototype intake from this route.
5. Run `npm run verify:pilot`, `npm run verify:deployment`, and `npm run verify:routes` after any pilot-readiness wording, evidence-link, deployment, policy, persistence, report, or package-gate change.

Why this matters: The first partner conversation should build confidence without creating promises the platform has not yet earned.

## OW-026: Partner Pilot Intake Is Requirements First

Status: Active

Observed behavior: Once a partner asks for uploads, QR codes, reports, videos, games, or a closed local package, it is tempting to create live forms too early.

Procedure:

1. Use `/teacher/pilot/requirements/sample-publisher` to guide the first partner requirements conversation.
2. Record what the partner must supply and what the school must decide before building live upload, storage, policy, report, or local package workflows.
3. Keep source files, media rights, game pathway scope, QR/front-door entry, learner data, reports, deployment, package tier, optional AI Tutor, and Z.ai timing visible.
4. Keep hosted PWA as the default first pilot recommendation unless a closed local operation is explicitly required.
5. Do not add upload buttons, file picker writes, policy acceptance, live storage writes, report exports, classroom launch, local package activation, premium AI Tutor activation, microphone prompts, or Z.ai source handoff requests from this route.
6. Run `npm run verify:pilot-requirements` and `npm run verify:routes` after any partner intake, source/media requirement, school decision, deployment, package tier, or Z.ai timing change.

Why this matters: Good commercial onboarding starts by reducing ambiguity, not by accepting files into an unfinished workflow.

## OW-027: Partner Pilot Evidence Traceability

Status: Active

Observed behavior: Requirements meetings can drift into loose promises unless every ask points back to a review route and a blocked-until condition.

Procedure:

1. Keep the evidence traceability map visible inside `/teacher/pilot/requirements/sample-publisher`.
2. Link source extraction, media rights, curated activity pathway, QR/front-door, learner data policy, teacher report/export, deployment, premium AI Tutor, and Z.ai/outside prototype items to their evidence routes.
3. Preserve current signal, blocked-until condition, and pilot dependency text for each trace item.
4. Do not use the trace map to capture partner answers, upload files, accept policy, write storage, export reports, mutate routes, activate packages, enable premium AI, request outside source handoff, or launch classes.
5. Run `npm run verify:pilot-requirements`, `npm run verify:routes`, and `npm run verify:foundation` after traceability changes.

Why this matters: Traceability lets a partner see exactly how close the pilot is without confusing demo evidence for classroom approval.

## OW-028: First Partner Pilot Meeting Agenda

Status: Active

Observed behavior: A promising partner conversation can accidentally become a promise to upload files, launch a class, or provide local software before the foundation gates are ready.

Procedure:

1. Use the meeting agenda inside `/teacher/pilot/requirements/sample-publisher` for first publisher or school discovery calls.
2. Ask through source package, multimedia rights, curated activity pathway, QR/front-door, learner data policy, reporting, deployment, premium AI, and outside prototype topics in that order.
3. Request evidence only as future required materials; do not collect files through the route.
4. Keep decisions not made here visible beside each agenda section.
5. Do not treat meeting notes as policy acceptance, storage selection, report export approval, local app approval, premium AI adoption, Z.ai handoff approval, or classroom launch approval.
6. Run `npm run verify:pilot-requirements`, `npm run verify:routes`, and `npm run verify:foundation` after agenda changes.

Why this matters: The first meeting should make the product feel organized and saleable while protecting the build from premature live workflow promises.

## OW-029: Partner Pilot Follow-Up Packet Preview

Status: Active

Observed behavior: After a strong first meeting, partners need a concise next-step summary, but a packet preview can easily become an accidental email, export, attachment, or approval workflow.

Procedure:

1. Use the follow-up packet preview inside `/teacher/pilot/requirements/sample-publisher` to show requested evidence, school decisions, demo links, blockers, and the next evidence gate.
2. Keep packet contents explicit and tenant-scoped; each item must name its owner, review route, and reason.
3. Treat the preview as an adult review aid only. It must not send email, download a file, create an attachment, save meeting answers, accept school policy, or mutate release state.
4. Keep the first packet centered on source files, media rights, curated pathway approval, entry rules, policy, deployment, and dry-run evidence.
5. Do not put premium AI Tutor adoption, microphone approval, or Z.ai source handoff into the core packet as an enabled action.
6. Run `npm run verify:pilot-requirements`, `npm run verify:routes`, and `npm run verify:foundation` after packet-preview or partner handoff changes.

Why this matters: A clear follow-up packet makes the white-label sales conversation actionable while preserving the boundary between a review summary and a live operational workflow.

## OW-030: Windows GitHub Credential Handoff

Status: Active

Observed behavior: Local verification and commits can succeed while `git push origin legacy-source-import` fails with `SEC_E_NO_CREDENTIALS` from Windows Schannel credential acquisition.

Procedure:

1. Preserve the local commit; do not reset, amend, or discard it just because the push failed.
2. Confirm the local branch and commit with `git status --short` and `git log -1 --oneline`.
3. Have the human operator re-authenticate GitHub in the approved connector or Windows Git credential flow, then rerun `git push origin legacy-source-import` from `D:\LIVING TEXTBOOOK PROJECT\LivingTextbook`.
4. Confirm the remote advances to the local commit with `git rev-parse origin/legacy-source-import` after the push.
5. Keep the local dev server on `http://127.0.0.1:3000` separate from Git authentication; a working browser does not prove that the push credential is available.

Why this matters: A credential failure is an external handoff problem, not a reason to undo verified local work. Recording the exact recovery steps prevents repeated rework and makes the human intervention small and safe.
