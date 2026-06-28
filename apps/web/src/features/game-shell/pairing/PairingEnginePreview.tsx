import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId, UnitPayload } from "@living-textbook/content-model";
import { getGameModeCatalogItem } from "../gameModeCatalog";
import { createVocabularyPairingItems } from "./pairingEngineAdapter";
import { formatMode } from "@/features/student/studentLabels";

interface PairingEnginePreviewProps {
  unit: UnitPayload;
  gameMode: GameModeId;
}

export function PairingEnginePreview({ unit, gameMode }: PairingEnginePreviewProps) {
  const mode = getGameModeCatalogItem(gameMode);
  const pairingItems = createVocabularyPairingItems(unit);
  const engineLabel = mode?.engineId ?? unit.unitMeta.engineId;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Mode Shell</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            {mode?.label ?? formatMode(gameMode)} is connected to unit data, but full gameplay is still intentionally deferred.
          </p>
        </div>
        <StatusPill label="Data ready" tone="success" />
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <PreviewFact label="Parent engine" value={engineLabel} />
        <PreviewFact label="Pairing items" value={String(pairingItems.length)} />
        <PreviewFact label="Mode role" value={mode?.role ?? "reinforcement"} />
      </dl>
      <div className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
        <p className="text-sm font-semibold">First pair payload</p>
        <p className="mt-1 text-sm text-[var(--tenant-muted)]">
          {pairingItems[0]?.sourceText ?? "No term"} -> {pairingItems[0]?.targetText ?? "No target"}
        </p>
      </div>
    </Card>
  );
}

function PreviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold">{value}</dd>
    </div>
  );
}
