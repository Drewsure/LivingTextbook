import { Card, StatusPill } from "@living-textbook/ui";
import type { UnitPayload } from "@living-textbook/content-model";

interface GameSequenceProps {
  unit: UnitPayload;
}

const firstSliceSequence = [
  { title: "Flashcard Practice", engine: "Selection", purpose: "Introduce the 8 terms with low friction." },
  { title: "Memory Match", engine: "Pairing", purpose: "Reinforce term recognition after flashcards." },
  { title: "Training Academy", engine: "Selection", purpose: "Review missed vocabulary without failure language." },
];

export function GameSequence({ unit }: GameSequenceProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Game Sequence</h2>
          <p className="mt-1 text-sm text-slate-600">Data-driven mode order for {unit.unitMeta.theme}. No legacy game is promoted yet.</p>
        </div>
        <StatusPill label="Foundation" />
      </div>
      <div className="mt-5 grid gap-3">
        {firstSliceSequence.map((item, index) => (
          <article key={item.title} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[2rem_1fr_auto]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-700">{index + 1}</div>
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.purpose}</p>
            </div>
            <p className="text-sm font-semibold text-slate-500">{item.engine}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
