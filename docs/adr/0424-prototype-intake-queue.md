# ADR 0424: Prototype Intake Queue

Status: Accepted

## Context

The game-readiness workbench now shows a Z.ai intake alert. The next foundation need is an ordered inventory queue that can absorb future Z.ai work without treating it as approved code.

## Decision

Add `samplePrototypeIntakeQueue` and `PrototypeIntakeQueuePanel`. Render the queue on `/teacher/game-readiness` and tenant prototype review routes. The queue records tenant scope, source repository, game mode, parent engine, target surface, priority, status, required evidence, missing evidence, blocked actions, and review route.

## Consequences

- Z.ai prototypes can be discussed in a structured way without importing code.
- Sentence Builder becomes the first clean DOM/reference intake candidate.
- Balloon Pop and Whack-a-Mole remain Phaser inventory candidates that require wrapper and replay evidence.
- Prototype review remains blocked from route creation, scoring mutation, reward writes, playlist creation, package promotion, and assignment.
