# DR-336: AI Generator Route Map

## Decision

The platform will keep teacher AI generator routes organized by a stable route map with Request setup, Prototype review, Integration gates, Package review, and Draft repair sections.

## Rationale

The generator surface is becoming a serious admin command center. A named route map keeps review work navigable and gives future build slices a clear home without turning the page into a tangled list of panels.

## Implementation Notes

- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` now render the generator route map at the top.
- Each section is anchored for quick movement through the page.
- The route map is review-only and does not enable live AI generation, verifier submission, package assembly, route creation, playlist creation, assignment, or app patch generation.

## Follow-Up

Keep future generator panels inside one of the named sections or update this decision if a new section becomes necessary.
