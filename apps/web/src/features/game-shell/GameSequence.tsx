import { Card, StatusPill } from "@living-textbook/ui";
import type { UnitPayload } from "@living-textbook/content-model";
import { gameModeCatalog } from "./gameModeCatalog";

interface GameSequenceProps {
  unit: UnitPayload;
}

interface SequenceItem {
  label: string;
  engineId: string;
  role: string;
  summary: string;
}

const flashcards = gameModeCatalog.flashcards;
const matchUp = gameModeCatalog["match-up"];
const memoryMatch = gameModeCatalog["memory-match"];
const quiz = gameModeCatalog.quiz;
const balloonPop = gameModeCatalog["balloon-pop"];
const sentenceBuilder = gameModeCatalog["sentence-builder"];
const speakIt = gameModeCatalog["speak-it"];

const firstSliceSequence: SequenceItem[] = [
  {
    label: flashcards?.label ?? "Flashcard Practice",
    engineId: flashcards?.engineId ?? "selection",
    role: flashcards?.role ?? "entry-practice",
    summary: flashcards?.summary ?? "Introduce the unit terms with low-friction recognition before any scored game pressure.",
  },
  {
    label: matchUp?.label ?? "Match Up",
    engineId: matchUp?.engineId ?? "pairing",
    role: matchUp?.role ?? "reinforcement",
    summary: matchUp?.summary ?? "Match listening prompts to reviewed vocabulary word cards.",
  },
  {
    label: memoryMatch?.label ?? "Memory Match",
    engineId: memoryMatch?.engineId ?? "pairing",
    role: memoryMatch?.role ?? "reinforcement",
    summary: memoryMatch?.summary ?? "Reinforce term recognition after flashcards through pair finding and recall.",
  },
  {
    label: quiz?.label ?? "Quiz",
    engineId: quiz?.engineId ?? "selection",
    role: quiz?.role ?? "assessment",
    summary: quiz?.summary ?? "Check vocabulary and target sentence understanding with audio-supported selected responses.",
  },
  {
    label: balloonPop?.label ?? "Balloon Pop",
    engineId: balloonPop?.engineId ?? "selection",
    role: balloonPop?.role ?? "reinforcement",
    summary: balloonPop?.summary ?? "Use short audio-supported vocabulary prompts in an arcade selection skin.",
  },
  {
    label: sentenceBuilder?.label ?? "Sentence Builder",
    engineId: sentenceBuilder?.engineId ?? "text-spelling",
    role: sentenceBuilder?.role ?? "reinforcement",
    summary: sentenceBuilder?.summary ?? "Build the two approved target sentence patterns from unit-safe word parts and audio cues.",
  },
  {
    label: speakIt?.label ?? "Speak It",
    engineId: speakIt?.engineId ?? "selection",
    role: speakIt?.role ?? "reinforcement",
    summary: speakIt?.summary ?? "Practice listening and oral repetition with teacher-controlled, audio-first prompts.",
  },
  {
    label: "Training Academy",
    engineId: "selection",
    role: "review",
    summary: "Review missed vocabulary without failure language.",
  },
];

export function GameSequence({ unit }: GameSequenceProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Game Sequence</h2>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">Data-driven mode order for {unit.unitMeta.theme}. No legacy game is promoted yet.</p>
        </div>
        <StatusPill label="Foundation" />
      </div>
      <div className="mt-5 grid gap-3">
        {firstSliceSequence.map((item, index) => (
          <article key={item.label} className="grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 sm:grid-cols-[2rem_1fr_auto]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--tenant-surface)] text-sm font-bold text-[var(--tenant-text)]">{index + 1}</div>
            <div>
              <h3 className="font-semibold">{item.label}</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{item.summary}</p>
            </div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">{item.engineId}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
