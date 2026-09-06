# DR-570: Foundation Verification Composition

Status: Accepted

The canonical foundation command now includes the AI service and persistence runtime verifiers, the complete runtime boundary chain, AI service typecheck, web typecheck, production webpack build, and active route verification. A composition verifier protects the command from silently losing one of these checks in a future build session.
