# DR-084: Recommended Route Audio Controls

## Decision

Recommended game path cards must separate listening from navigation.

## Reason

Early learners need audio support for route choices, but tapping a listen control must not accidentally open a new activity or unlock progress. The route summary can be heard through a dedicated `Listen` control, while `Open` remains a separate navigation action available only when the route is unlocked.

## Standard

- Route cards may show locked or ready state.
- Listening to a route summary is support only.
- Opening a route remains a distinct action.
- No progress event should be inferred from hearing a route summary.

