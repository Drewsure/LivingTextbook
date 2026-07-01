import { Card, StatusPill } from "@living-textbook/ui";
import type { UnitPayload } from "@living-textbook/content-model";
import { buildSelectionEnginePreview } from "./selectionEngineAdapter";

interface SelectionEnginePreviewProps {
  unit: UnitPayload;
}

export function SelectionEnginePreview({ unit }: SelectionEnginePreviewProps) {
  const preview = buildSelectionEnginePreview(unit);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Parent engine scaffold</p>
          <h2 className="mt-1 text-lg font-bold">{preview.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            A reusable selection engine can power quiz-style modes and future arcade skins while preserving audio-first prompts, standard events, and shared scoring.
          </p>
        </div>
        <StatusPill label={preview.audioRequired ? "Audio required" : "Needs audio"} tone={preview.audioRequired ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {preview.rounds.map((round) => (
          <section key={round.roundId} className="rounded-lg border border-[var(--tenant-border)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{round.skillFocus}</p>
                <h3 className="mt-1 text-sm font-bold">{round.promptText}</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">Audio prompt: {round.promptAudioText}</p>
              </div>
              <StatusPill label={`${round.options.length} options`} tone="neutral" />
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {round.options.map((option) => (
                <div
                  key={option.optionId}
                  className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm"
                >
                  <p className="font-semibold">{option.label}</p>
                  <p className="mt-1 text-xs text-[var(--tenant-muted)]">{option.isCorrect ? "Correct target" : "Distractor"}</p>
                </div>
              ))}
            </div>
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
