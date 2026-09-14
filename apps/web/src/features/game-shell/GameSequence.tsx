import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId, UnitPayload } from "@living-textbook/content-model";
import type { UnitGameOfferMap } from "@/data/sampleUnitGameOfferMap";
import { gameModeCatalog } from "./gameModeCatalog";

interface GameSequenceProps {
  unit: UnitPayload;
  offerMap?: UnitGameOfferMap;
}

interface SequenceItem {
  label: string;
  engineId: string;
  role: string;
  summary: string;
}

const canonicalModeOrder: GameModeId[] = [
  "flashcards",
  "match-up",
  "label-it",
  "memory-match",
  "quiz",
  "true-false",
  "type-answer",
  "spelling-practice",
  "fill-in-the-blank",
  "balloon-pop",
  "sentence-builder",
  "speak-it",
];

function buildSequenceItems(offerMap?: UnitGameOfferMap): SequenceItem[] {
  const curatedOffers = offerMap?.offers
    .filter((offer) => Boolean(gameModeCatalog[offer.gameMode]))
    .sort((left, right) => (left.recommendedOrder ?? Number.MAX_SAFE_INTEGER) - (right.recommendedOrder ?? Number.MAX_SAFE_INTEGER));
  const modes = curatedOffers && curatedOffers.length > 0
    ? curatedOffers.map((offer) => ({ offer, mode: gameModeCatalog[offer.gameMode] }))
    : canonicalModeOrder.map((gameMode) => ({ offer: undefined, mode: gameModeCatalog[gameMode] }));

  return [
    ...modes.map(({ offer, mode }) => ({
      label: offer?.label ?? mode.label,
      engineId: offer?.engineId ?? mode.engineId,
      role: mode.role,
      summary: mode.summary,
    })),
    {
      label: "Training Academy",
      engineId: "selection",
      role: "review",
      summary: "Review missed vocabulary without failure language.",
    },
  ];
}

export function GameSequence({ unit: _unit, offerMap }: GameSequenceProps) {
  const sequence = buildSequenceItems(offerMap);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Game Sequence</h2>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">Data-driven canonical mode order for {_unit.unitMeta.theme}. External Phaser candidates remain review-only.</p>
        </div>
        <StatusPill label="Foundation" />
      </div>
      <div className="mt-5 grid gap-3">
        {sequence.map((item, index) => (
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
