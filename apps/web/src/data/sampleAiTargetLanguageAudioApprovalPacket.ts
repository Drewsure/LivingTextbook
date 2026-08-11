export type AiTargetLanguageAudioApprovalPacketStatus =
  | "blocked"
  | "review-only"
  | "ready-for-audio-review";

export type AiTargetLanguageAudioApprovalCueStatus =
  | "missing-audio"
  | "needs-review"
  | "approved-preview"
  | "support-only"
  | "blocked";

export type AiTargetLanguageAudioApprovalCueKind =
  | "term"
  | "sentence"
  | "instruction"
  | "feedback"
  | "control"
  | "support-language"
  | "background-media";

export interface AiTargetLanguageAudioApprovalCue {
  cueId: string;
  kind: AiTargetLanguageAudioApprovalCueKind;
  text: string;
  language: string;
  gameModes: string[];
  status: AiTargetLanguageAudioApprovalCueStatus;
  sourceRecord: string;
  approvalQuestion: string;
  progressBoundary: string;
}

export interface AiTargetLanguageAudioApprovalPacket {
  packetId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: AiTargetLanguageAudioApprovalPacketStatus;
  summary: string;
  targetLanguage: string;
  assistLanguageBoundary: string;
  approvalOwner: string;
  cueManifestRecord: string;
  targetLanguageApprovalRecord: string;
  requiredCoverage: string[];
  approvalChecks: string[];
  cues: AiTargetLanguageAudioApprovalCue[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const sampleAiTargetLanguageAudioApprovalPackets: AiTargetLanguageAudioApprovalPacket[] = [
  {
    packetId: "target-language-audio-approval-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher target-language audio approval packet",
    status: "review-only",
    summary:
      "Review-only approval packet for the exact English audio cues needed before a generated Daily Routines package can move beyond draft review.",
    targetLanguage: "English",
    assistLanguageBoundary:
      "No support language is supplied for this sample. Any future support-language audio remains support-only and cannot unlock progress.",
    approvalOwner: "Teacher or publisher audio reviewer",
    cueManifestRecord: "audio_cue_manifest",
    targetLanguageApprovalRecord: "target_language_audio_approval",
    requiredCoverage: [
      "8 vocabulary term cues",
      "2 target sentence cues",
      "Teacher instruction cues",
      "Student feedback cues",
      "Critical control cues",
      "Game-mode replay controls",
    ],
    approvalChecks: [
      "Target-language audio text matches the reviewed payload exactly.",
      "Every student-facing English text item has tap-to-speak coverage.",
      "Background music and video sound never count as learning audio.",
      "Support-language cues, if added later, remain support-only.",
      "Voice or speech API cost remains blocked until tenant approval.",
    ],
    cues: [
      {
        cueId: "sample-audio-approval-term-wake-up",
        kind: "term",
        text: "wake up",
        language: "en",
        gameModes: ["Flashcards", "Memory Match", "Sentence Builder"],
        status: "needs-review",
        sourceRecord: "ai_audio_coverage_plan",
        approvalQuestion: "Is this term audio clear enough for early learners to repeat?",
        progressBoundary: "English term activity can support progress only after approval.",
      },
      {
        cueId: "sample-audio-approval-term-brush",
        kind: "term",
        text: "brush",
        language: "en",
        gameModes: ["Flashcards", "Memory Match", "Sentence Builder"],
        status: "needs-review",
        sourceRecord: "ai_audio_coverage_plan",
        approvalQuestion: "Does the audio match the textbook vocabulary exactly?",
        progressBoundary: "English term activity can support progress only after approval.",
      },
      {
        cueId: "sample-audio-approval-sentence-wake-up",
        kind: "sentence",
        text: "I wake up in the morning.",
        language: "en",
        gameModes: ["Sentence Builder", "Speak It"],
        status: "needs-review",
        sourceRecord: "ai_audio_coverage_plan",
        approvalQuestion: "Does the sentence audio match the reviewed target sentence exactly?",
        progressBoundary: "Correct English sentence activity remains the progress trigger.",
      },
      {
        cueId: "sample-audio-approval-instruction",
        kind: "instruction",
        text: "Tap each card. Listen and repeat.",
        language: "en",
        gameModes: ["Flashcards"],
        status: "needs-review",
        sourceRecord: "audio_cue_manifest",
        approvalQuestion: "Can a young learner understand the instruction without reading fluently?",
        progressBoundary: "Instruction replay supports access but cannot unlock progress by itself.",
      },
      {
        cueId: "sample-audio-approval-control-ready-next",
        kind: "control",
        text: "Ready for the next activity.",
        language: "en",
        gameModes: ["Curated pathway"],
        status: "needs-review",
        sourceRecord: "audio_cue_manifest",
        approvalQuestion: "Does the control cue clearly explain the next step?",
        progressBoundary: "Control audio cannot replace a target-language answer event.",
      },
      {
        cueId: "sample-audio-approval-background-policy",
        kind: "background-media",
        text: "Background music may play only when learning audio stays clear.",
        language: "policy",
        gameModes: ["All generated games"],
        status: "blocked",
        sourceRecord: "background_media_policy_binding",
        approvalQuestion: "Can optional media be ducked or muted when learning audio plays?",
        progressBoundary: "Media-only listening cannot count toward mastery.",
      },
    ],
    blockedActions: [
      "No audio approval capture",
      "No voice generation",
      "No speech API billing",
      "No package audio-complete marker",
      "No route creation from audio packet",
      "No playlist creation from audio packet",
      "No student assignment from audio packet",
      "No media-only progress",
    ],
    nextRequiredRecords: [
      "audio_cue_manifest",
      "package_game_audio_coverage",
      "target_language_audio_approval",
      "media_rights_evidence_attachment",
      "teacher_approval_ledger",
    ],
  },
  {
    packetId: "target-language-audio-approval-ministar-l1-greetings-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar target-language audio approval packet",
    status: "review-only",
    summary:
      "Review-only approval packet for MiniStar Foundation greetings. English is the target-language trigger, and Japanese support remains hiragana-only and non-scoring.",
    targetLanguage: "English",
    assistLanguageBoundary:
      "Japanese support is teacher-enabled, hiragana-only for Foundation/Bronze/Plus, and cannot unlock progress.",
    approvalOwner: "MiniStar teacher or publisher audio reviewer",
    cueManifestRecord: "audio_cue_manifest",
    targetLanguageApprovalRecord: "target_language_audio_approval",
    requiredCoverage: [
      "8 English vocabulary term cues",
      "2 English target sentence cues",
      "English teacher instruction cues",
      "English feedback cues",
      "English critical control cues",
      "Optional hiragana-only Japanese support cue labelled support-only",
    ],
    approvalChecks: [
      "English target-language audio text matches the reviewed payload exactly.",
      "Every student-facing English text item has tap-to-speak coverage.",
      "Japanese support text is hiragana-only for Foundation.",
      "Japanese support audio cannot unlock progress, mastery, Star Dust, or package approval.",
      "Voice or speech API cost remains blocked until school or tenant approval.",
    ],
    cues: [
      {
        cueId: "ministar-audio-approval-term-hello",
        kind: "term",
        text: "hello",
        language: "en",
        gameModes: ["Flashcards", "Memory Match", "Speak It"],
        status: "needs-review",
        sourceRecord: "ai_audio_coverage_plan",
        approvalQuestion: "Is the English pronunciation clear for first-contact learners?",
        progressBoundary: "English target-language activity is the only progress trigger.",
      },
      {
        cueId: "ministar-audio-approval-term-goodbye",
        kind: "term",
        text: "goodbye",
        language: "en",
        gameModes: ["Flashcards", "Memory Match", "Speak It"],
        status: "needs-review",
        sourceRecord: "ai_audio_coverage_plan",
        approvalQuestion: "Does the cue match the MiniStar Foundation vocabulary exactly?",
        progressBoundary: "English target-language activity is the only progress trigger.",
      },
      {
        cueId: "ministar-audio-approval-sentence-hello-teacher",
        kind: "sentence",
        text: "Hello, teacher.",
        language: "en",
        gameModes: ["Sentence Builder", "Speak It"],
        status: "needs-review",
        sourceRecord: "ai_audio_coverage_plan",
        approvalQuestion: "Does the sentence audio match the reviewed sentence punctuation and phrasing?",
        progressBoundary: "Correct English sentence activity is the progress trigger.",
      },
      {
        cueId: "ministar-audio-approval-sentence-thank-you-friend",
        kind: "sentence",
        text: "Thank you, friend.",
        language: "en",
        gameModes: ["Sentence Builder", "Speak It"],
        status: "needs-review",
        sourceRecord: "ai_audio_coverage_plan",
        approvalQuestion: "Is the phrase natural enough for children to repeat confidently?",
        progressBoundary: "Correct English sentence activity is the progress trigger.",
      },
      {
        cueId: "ministar-audio-approval-instruction",
        kind: "instruction",
        text: "Tap each card. Listen and repeat.",
        language: "en",
        gameModes: ["Flashcards"],
        status: "needs-review",
        sourceRecord: "audio_cue_manifest",
        approvalQuestion: "Can a young learner use the activity through audio without fluent reading?",
        progressBoundary: "Instruction replay supports access but cannot unlock progress by itself.",
      },
      {
        cueId: "ministar-audio-approval-ja-support",
        kind: "support-language",
        text: "こんにちは。きいて、まねしましょう。",
        language: "ja-hiragana",
        gameModes: ["Teacher-enabled support"],
        status: "support-only",
        sourceRecord: "assist_language_policy",
        approvalQuestion: "Is the Japanese helper cue hiragana-only and clearly support-only?",
        progressBoundary: "Japanese support audio cannot unlock progress, mastery, Star Dust, or approval.",
      },
      {
        cueId: "ministar-audio-approval-control-ready-next",
        kind: "control",
        text: "Ready for the next activity.",
        language: "en",
        gameModes: ["Curated pathway"],
        status: "needs-review",
        sourceRecord: "audio_cue_manifest",
        approvalQuestion: "Does the English control cue clearly tell learners the next step?",
        progressBoundary: "Control audio cannot replace a target-language answer event.",
      },
      {
        cueId: "ministar-audio-approval-background-policy",
        kind: "background-media",
        text: "Background music may play only when English learning audio stays clear.",
        language: "policy",
        gameModes: ["All MiniStar generated games"],
        status: "blocked",
        sourceRecord: "background_media_policy_binding",
        approvalQuestion: "Can optional music duck or pause whenever English learning audio plays?",
        progressBoundary: "Media-only listening cannot count toward mastery.",
      },
    ],
    blockedActions: [
      "No audio approval capture",
      "No voice generation",
      "No speech API billing",
      "No package audio-complete marker",
      "No route creation from audio packet",
      "No playlist creation from audio packet",
      "No student assignment from audio packet",
      "No Japanese support-language progress trigger",
    ],
    nextRequiredRecords: [
      "audio_cue_manifest",
      "package_game_audio_coverage",
      "target_language_audio_approval",
      "media_rights_evidence_attachment",
      "teacher_approval_ledger",
    ],
  },
];

export function filterAiTargetLanguageAudioApprovalPacketsByTenant(
  packets: AiTargetLanguageAudioApprovalPacket[],
  tenantId: string,
): AiTargetLanguageAudioApprovalPacket[] {
  return packets.filter((packet) => packet.tenantId === tenantId);
}
