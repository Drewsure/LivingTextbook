import { Card, StatusPill } from "@living-textbook/ui";
import type { UnitPayload } from "@living-textbook/content-model";
import { buildSentenceBuilderPreview } from "./textSpellingEngineAdapter";

interface SentenceBuilderEnginePreviewProps {
  unit: UnitPayload;
}

export function SentenceBuilderEnginePreview({ unit }: SentenceBuilderEnginePreviewProps) {
  const preview = buildSentenceBuilderPreview(unit);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Parent engine scaffold</p>
          <h2 className="mt-1 text-lg font-bold">{preview.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            A reusable text-spelling engine can power Sentence Builder, ordering, fill-in, spelling, and typing modes while preserving audio-first text, deterministic scoring, and standard events.
          </p>
        </div>
        <StatusPill label={preview.audioRequired ? "Audio required" : "Needs audio"} tone={preview.audioRequired ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {preview.rounds.map((round) => (
          <section key={round.roundId} className="rounded-lg border border-[var(--tenant-border)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{round.modeId}</p>
                <h3 className="mt-1 text-sm font-bold">{round.promptText}</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">Audio prompt: {round.promptAudioText}</p>
              </div>
              <StatusPill label={`${round.tiles.length} tiles`} tone="neutral" />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {round.tiles.map((tile) => (
                <span
                  key={tile.tileId}
                  className="inline-flex min-h-10 items-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-3 py-2 text-sm font-semibold text-[var(--tenant-text)]"
                >
                  {tile.label}
                </span>
              ))}
            </div>

            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
              Expected answer: <span className="font-semibold text-[var(--tenant-text)]">{round.expectedAnswer.join(" ")}</span>
            </p>
          </section>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
          <h3 className="text-sm font-bold">Standard events</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{preview.standardEvents.join(", ")}</p>
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
          <h3 className="text-sm font-bold">Integration notes</h3>
          <ul className="mt-2 grid gap-1 text-sm leading-6 text-[var(--tenant-muted)]">
            {preview.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}
