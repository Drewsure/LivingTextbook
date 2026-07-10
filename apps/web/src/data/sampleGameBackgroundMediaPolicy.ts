export type BackgroundMediaRuleStatus = "required" | "recommended" | "blocked";

export interface BackgroundMediaPolicyRule {
  ruleId: string;
  label: string;
  status: BackgroundMediaRuleStatus;
  summary: string;
}

export interface GameBackgroundMediaPolicy {
  policyId: string;
  label: string;
  decision: string;
  priorityRule: string;
  reportingRule: string;
  rules: BackgroundMediaPolicyRule[];
}

export const sampleGameBackgroundMediaPolicy: GameBackgroundMediaPolicy = {
  policyId: "game-background-media-policy",
  label: "Game background media policy",
  decision:
    "Game-background music or chant audio is optional enrichment. It must be teacher-controlled and must never replace tap-to-speak learning audio.",
  priorityRule:
    "Learner-facing English text, instructions, answer choices, sentence tiles, and feedback always receive audio priority. Background media must pause, duck, or mute when required learning audio plays.",
  reportingRule:
    "Background media events are reported as engagement context only. They do not unlock games, Star Dust, mastery, or progress gates.",
  rules: [
    {
      ruleId: "teacher-enable",
      label: "Teacher enablement",
      status: "required",
      summary:
        "Background media is off by default for young learner flows unless a reviewed unit plan and teacher/session setting enable it.",
    },
    {
      ruleId: "audio-priority",
      label: "Tap-to-speak priority",
      status: "required",
      summary:
        "Text, tiles, cards, instructions, and feedback keep direct listen controls. Their audio always interrupts or lowers background media.",
    },
    {
      ruleId: "mode-fit",
      label: "Mode fit",
      status: "recommended",
      summary:
        "Use background media only in modes where rhythm or atmosphere helps practice, such as Memory Match or light review, not in precision listening checks.",
    },
    {
      ruleId: "no-mastery-credit",
      label: "No mastery credit",
      status: "blocked",
      summary:
        "Starting, pausing, completing, or enabling background media cannot count as vocabulary, syntax, speaking, or mastery completion.",
    },
  ],
};
