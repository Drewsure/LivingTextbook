export type ActivityPathwayCompatibilityStatus = "offered" | "planned" | "teacher-review" | "premium" | "blocked";
export type ActivityPathwayOutputKind = "student-game" | "printable" | "teacher-tool" | "premium-game";

export interface ActivityPathwayCompatibilityItem {
  itemId: string;
  label: string;
  outputKind: ActivityPathwayOutputKind;
  status: ActivityPathwayCompatibilityStatus;
  recommendedOrder?: number;
  sourcePayloadFit: string;
  targetLanguageTrigger: string;
  audioRequirement: string;
  reportingRequirement: string;
  compatibilityRule: string;
  nextStep: string;
}

export interface ActivityPathwayCompatibilityMatrix {
  matrixId: string;
  tenantId: string;
  contentPackageId: string;
  unitKey: string;
  label: string;
  summary: string;
  teacherPromise: string;
  items: ActivityPathwayCompatibilityItem[];
}

export const sampleActivityPathwayCompatibilityMatrix: ActivityPathwayCompatibilityMatrix = {
  matrixId: "sample-publisher-l1-u1-activity-pathways",
  tenantId: "sample-publisher",
  contentPackageId: "sample-publisher-l1-u1-package",
  unitKey: "sample-publisher:starter-english:L1:U1",
  label: "Activity pathway compatibility",
  summary:
    "This matrix defines which student games, printable outputs, and teacher tools are valid for the reviewed Unit 1 payload. It is the foundation alternative to a broad switch-template panel.",
  teacherPromise:
    "Teachers receive streamlined, pre-reviewed options for the unit theme. Extra conversions are allowed only when the payload, audio, scoring, reporting, and target-language rules fit.",
  items: [
    {
      itemId: "entry-flashcards",
      label: "Entry Flashcards",
      outputKind: "student-game",
      status: "offered",
      recommendedOrder: 1,
      sourcePayloadFit: "Uses the reviewed vocabulary terms, target sentences, teacher launch protocol, and audio cue plan.",
      targetLanguageTrigger: "Target-language card practice is required before progression; support language cannot unlock.",
      audioRequirement: "Every term, sentence, instruction, and completion control must be tap-to-speak.",
      reportingRequirement: "Reports entry_practice_completed and guidance/listen events without support-only mastery credit.",
      compatibilityRule: "Valid for every reviewed unit with 8-12 terms, exactly 2 target sentences, and audio support.",
      nextStep: "Keep as the required entry pathway for early pilot units.",
    },
    {
      itemId: "match-up",
      label: "Match Up",
      outputKind: "student-game",
      status: "offered",
      recommendedOrder: 2,
      sourcePayloadFit: "Best for vocabulary terms that can be matched from listening prompts to visible word cards.",
      targetLanguageTrigger: "Correct target-language matches drive progress; support-language taps remain support-only.",
      audioRequirement: "Listening prompts, word cards, instructions, and feedback must remain tap-to-hear.",
      reportingRequirement: "Reports round_shown, answer_submitted, answer_result, game_completed, and mastery_updated.",
      compatibilityRule: "Valid for reviewed vocabulary payloads with term-level audio and no unlicensed image dependency.",
      nextStep: "Use as the default visible pairing bridge before hidden Memory Match recall.",
    },
    {
      itemId: "memory-match",
      label: "Memory Match",
      outputKind: "student-game",
      status: "offered",
      recommendedOrder: 4,
      sourcePayloadFit: "Best for vocabulary terms or term/image pairs that can become deterministic card pairs.",
      targetLanguageTrigger: "Correct target-language matches drive progress and Training Academy recovery decisions.",
      audioRequirement: "Cards and feedback must remain tap-to-hear.",
      reportingRequirement: "Reports round_shown, answer_submitted, answer_result, game_completed, and mastery_updated.",
      compatibilityRule: "Valid when there are enough reviewed terms to form pairs and no unlicensed image dependency exists.",
      nextStep: "Use as the first reusable pairing-engine template.",
    },
    {
      itemId: "label-it",
      label: "Label It",
      outputKind: "student-game",
      status: "offered",
      recommendedOrder: 3,
      sourcePayloadFit: "Works when reviewed vocabulary terms can become diagram labels and the image has reviewed anchor points.",
      targetLanguageTrigger: "Target-language label placement counts; support-language labels remain support-only.",
      audioRequirement: "Every label, instruction, and feedback message must remain tap-to-hear.",
      reportingRequirement: "Reports standard pairing-engine placement, result, completion, and mastery update events.",
      compatibilityRule: "Valid only when a reviewed game_asset_manifest and label_anchor_record exist or when using the built-in reviewed placeholder asset.",
      nextStep: "Connect real uploaded images only after rights, alt text, safety, anchor, audio, and release gates are persisted.",
    },
    {
      itemId: "teacher-review-quiz",
      label: "Teacher Review Quiz",
      outputKind: "student-game",
      status: "offered",
      recommendedOrder: 5,
      sourcePayloadFit: "Works when reviewed terms and sentences can form clear prompts and answer choices.",
      targetLanguageTrigger: "Target-language prompt and answer choice submissions count; assist-language taps remain support-only.",
      audioRequirement: "Prompt, choices, feedback, and submit control require listen/replay support.",
      reportingRequirement: "Reports standard selection-engine answer and completion events.",
      compatibilityRule: "Valid when answer choices are unambiguous and teacher-approved.",
      nextStep: "Keep as the plain selection-engine review template before arcade skins.",
    },
    {
      itemId: "sentence-builder",
      label: "Sentence Builder",
      outputKind: "student-game",
      status: "offered",
      recommendedOrder: 8,
      sourcePayloadFit: "Uses exactly 2 reviewed target sentence structures split into learner-friendly word or phrase tiles.",
      targetLanguageTrigger: "Correct target-language sequence is the progress trigger.",
      audioRequirement: "Sentence model, instruction, word tiles, feedback, and submit control require audio support.",
      reportingRequirement: "Reports text-spelling submission, result, completion, and mastery update events.",
      compatibilityRule: "Valid when sentence segmentation is reviewed for the target language.",
      nextStep: "Extend segmentation rules before Japanese or non-space-delimited target languages.",
    },
    {
      itemId: "true-false",
      label: "True or False",
      outputKind: "student-game",
      status: "offered",
      recommendedOrder: 6,
      sourcePayloadFit: "Works for reviewed vocabulary terms that can form deterministic match or mismatch listening rounds.",
      targetLanguageTrigger: "Target-language listening prompt and visible card decision count; support-language taps remain support-only.",
      audioRequirement: "Prompt word, visible card, instructions, feedback, and decision controls require audio support.",
      reportingRequirement: "Reports standard selection-engine answer and completion events.",
      compatibilityRule: "Valid when the reviewed vocabulary list has enough terms to create clear mismatch pairs without AI-generated distractors.",
      nextStep: "Keep as a low-cost review pathway before adding broader template conversion options.",
    },
    {
      itemId: "type-answer",
      label: "Type Answer",
      outputKind: "student-game",
      status: "offered",
      recommendedOrder: 7,
      sourcePayloadFit: "Works for reviewed vocabulary terms where spelling expectations and accepted answers are teacher-approved.",
      targetLanguageTrigger: "Typed target-language answers count; support-language hints and taps remain support-only.",
      audioRequirement: "Prompt word, input instruction, feedback, and submit control require audio support.",
      reportingRequirement: "Reports standard text-spelling answer and completion events.",
      compatibilityRule: "Valid when reviewed vocabulary has clear typing forms and no unreviewed spelling variants are required.",
      nextStep: "Extend accepted-answer and segmentation rules before dictation, spelling variants, or Japanese target-language typing.",
    },
    {
      itemId: "speak-it",
      label: "Speak It Practice",
      outputKind: "student-game",
      status: "teacher-review",
      recommendedOrder: 9,
      sourcePayloadFit: "Works with reviewed vocabulary and target sentences as model audio prompts.",
      targetLanguageTrigger: "Teacher-approved speaking practice can contribute only under the package settings.",
      audioRequirement: "Model audio must be available before any record/replay action.",
      reportingRequirement: "Reports local practice events without upload, transcript, or AI score unless a premium policy exists.",
      compatibilityRule: "Valid only when teacher/school microphone approval is explicit.",
      nextStep: "Keep teacher-controlled until persistence, privacy, and microphone policy are accepted.",
    },
    {
      itemId: "printable-vocabulary-sheet",
      label: "Printable vocabulary sheet",
      outputKind: "printable",
      status: "planned",
      sourcePayloadFit: "Can project reviewed terms, assist glosses, QR code, and listening prompts into a classroom worksheet.",
      targetLanguageTrigger: "Printable practice should reinforce target-language terms; support language remains labelled support.",
      audioRequirement: "Printed QR or short link should resolve to the same reviewed audio cues.",
      reportingRequirement: "No automatic student progress unless launched through assignment QR or teacher-marked completion.",
      compatibilityRule: "Valid for reviewed packages after printable layout and PDF generation are built.",
      nextStep: "Add printable renderer after package versioning and route stability are in place.",
    },
    {
      itemId: "printable-sentence-practice",
      label: "Printable sentence practice",
      outputKind: "printable",
      status: "planned",
      sourcePayloadFit: "Can project the 2 reviewed target sentence structures into tracing, ordering, or fill-in formats.",
      targetLanguageTrigger: "Classroom or homework completion does not unlock digital progress unless teacher assignment policy says so.",
      audioRequirement: "Printed activity should reference listenable sentence models by QR or short code.",
      reportingRequirement: "No automatic report events until printable assignment workflows exist.",
      compatibilityRule: "Valid after printable/PDF rules are added to the package pipeline.",
      nextStep: "Define printable worksheet formats before implementing PDF output.",
    },
    {
      itemId: "balloon-pop",
      label: "Balloon Pop",
      outputKind: "premium-game",
      status: "premium",
      recommendedOrder: 10,
      sourcePayloadFit: "Works for short terms and distractors after selection-engine timing and accessibility rules are reviewed.",
      targetLanguageTrigger: "Correct target-language prompt selection drives score; background media remains support-only.",
      audioRequirement: "Prompts, wrong-answer feedback, and success feedback must remain clear above any music.",
      reportingRequirement: "Must emit standard selection-engine events before becoming student-facing.",
      compatibilityRule: "Valid only as a teacher-enabled or premium arcade skin after motion and difficulty settings exist.",
      nextStep: "Assign later as a strict prototype after parent-engine contracts are stable.",
    },
    {
      itemId: "word-search",
      label: "Word Search",
      outputKind: "printable",
      status: "blocked",
      sourcePayloadFit: "Requires plain text terms with puzzle-safe spelling and no image/audio-only dependency.",
      targetLanguageTrigger: "Would be support or review practice, not the entry progression gate.",
      audioRequirement: "Needs QR/audio companion if used with young learners.",
      reportingRequirement: "Printable-only use has no automatic reporting.",
      compatibilityRule: "Blocked until text-only printable puzzle rules and layout validation exist.",
      nextStep: "Add only after printable engine and text normalization rules are defined.",
    },
    {
      itemId: "crossword",
      label: "Crossword",
      outputKind: "printable",
      status: "blocked",
      sourcePayloadFit: "Requires plain text answers plus reviewed clues; unit terms alone are not enough.",
      targetLanguageTrigger: "Would be teacher review or homework practice, not a default unlock route.",
      audioRequirement: "Clues and answer terms need audio support if used in student-facing digital form.",
      reportingRequirement: "No automatic reporting until crossword is a supported interactive or assignment output.",
      compatibilityRule: "Crossword blocked unless the package has reviewed clue text and text-only puzzle validation.",
      nextStep: "Revisit after printable compatibility rules and clue-authoring workflow exist.",
    },
  ],
};
