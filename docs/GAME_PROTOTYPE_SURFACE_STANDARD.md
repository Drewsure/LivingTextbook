# Game Prototype Surface Standard

The platform uses different prototype surfaces depending on the learning mechanic.

This standard exists to prevent two bad extremes:

- building every game as plain static UI when motion is the learning experience,
- building every game in Phaser when text accessibility, audio, reporting, and localization are the main challenge.

## Decision Rule

Use Phaser for action, physics, movement, timing, collision, and reflex modes.

Use DOM/React-style reference prototypes for text-heavy, syntax-heavy, spelling-heavy, quiz/reporting-heavy modes.

## Phaser-First Candidates

- Balloon Pop
- Whack-a-Mole
- Maze Chase
- Airplane
- Endless Runner
- Physics Puzzler
- Bridge Builder
- Other action/reflex modes

## DOM/Reference-First Candidates

- Sentence Builder
- Fill in the Blank
- Type Answer
- Spelling
- Quiz / True-False
- Teacher-report-heavy review activities

## Why Sentence Builder Starts DOM First

Sentence Builder is a syntax-construction engine. The first useful prototype must prove:

- target sentence tokenization,
- word ordering logic,
- tap-to-speak tiles,
- separate listen/replay controls,
- keyboard/focus accessibility,
- mobile layout stability,
- deterministic scoring,
- standard event output,
- integration with teacher reporting.

A Phaser skin may come later, but canvas rendering is not the first integration need.

## Why Arcade Modes Start Phaser First

Arcade modes need motion and game feel. Phaser is appropriate when the core interaction depends on:

- collision,
- spawn timing,
- velocity,
- physics,
- animated feedback,
- scene state,
- mobile touch control,
- action pacing.

Phaser prototypes still must emit LivingTextbook events and must not become standalone games that bypass schema, audio, scoring, or white-label boundaries.

## Current Implementation

- Sample data: `apps/web/src/data/sampleGamePrototypeAssignmentPlan.ts`
- Panel: `apps/web/src/features/game-offers/GamePrototypeAssignmentPanel.tsx`
- Route: `/teacher/intake`
- Z.ai directive: `docs/agent-briefs/ZAI_GAME_PROTOTYPE_DIRECTIVES.md`
