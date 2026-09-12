# DR-746: Locked Completion Progression Boundary

The shared progression adapter now rejects completion for any game mode absent
from `unlockedGameModes`, returning unchanged progression and zero Star Dust.
This complements the shared route access gate and protects scoring/reward
authority from direct wrapper calls. See ADR 0674.
