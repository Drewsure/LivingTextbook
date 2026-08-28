# DR-517: Package Writer Assignment Shell Guard

Status: Accepted

Date: 2026-08-28

Decision: Add a review-only assignment shell guard after the local companion package guard.

White-label impact: Positive. Generated packages now have a governed bridge toward future teacher QR/front-door assignments, private assignment links, class roster scope, progress events, teacher report previews, and launch gate bindings without assuming one school workflow.

Cost impact: Positive. Blocking generated assignment activation until policy, reporting, roster, event, and launch-gate evidence exists prevents costly privacy, reporting, and support failures.

Constraints:

- Assignment shell writes, private assignment link activation, class roster binding, progress event stream activation, teacher report export, live classroom launch, assignment activation from generated packages, support-language-only assignment approval, and writer execution remain blocked.
- Required checks include teacher QR/front-door assignment review, target-language trigger checks, no-real-learner-data checks, school policy acceptance, teacher report privacy, progress event taxonomy, and raw microphone audio/transcript exclusion.
- MiniStar assignment shell guards must preserve English target-language progress and hiragana-only Japanese support.
