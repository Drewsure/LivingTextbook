import { Card, StatusPill } from "@living-textbook/ui";
import type {
  UnitGameOffer,
  UnitGameOfferAvailability,
  UnitGameOfferMap,
  UnitGameOfferReadiness,
} from "@/data/sampleUnitGameOfferMap";

interface UnitGameOfferMapPanelProps {
  map: UnitGameOfferMap;
}

const availabilityTone: Record<UnitGameOfferAvailability, "neutral" | "success" | "warning"> = {
  required: "success",
  optional: "neutral",
  premium: "warning",
  "teacher-only": "warning",
  hidden: "neutral",
  blocked: "neutral",
};

const availabilityLabel: Record<UnitGameOfferAvailability, string> = {
  required: "Required",
  optional: "Optional",
  premium: "Premium",
  "teacher-only": "Teacher only",
  hidden: "Hidden",
  blocked: "Blocked",
};

const readinessTone: Record<UnitGameOfferReadiness, "neutral" | "success" | "warning"> = {
  ready: "success",
  "needs-review": "warning",
  blocked: "neutral",
};

const readinessLabel: Record<UnitGameOfferReadiness, string> = {
  ready: "Ready",
  "needs-review": "Review",
  blocked: "Blocked",
};

export function UnitGameOfferMapPanel({ map }: UnitGameOfferMapPanelProps) {
  const requiredCount = map.offers.filter((offer) => offer.availability === "required").length;
  const premiumCount = map.offers.filter((offer) => offer.availability === "premium").length;
  const blockedCount = map.offers.filter((offer) => offer.readiness === "blocked").length;
  const teacherControlCount = map.offers.reduce((total, offer) => total + offer.teacherControls.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Game offer map</p>
          <h2 className="mt-1 text-lg font-bold">{map.label}</h2>
          <p className="mt-1 break-words text-xs font-semibold text-[var(--tenant-muted)]">
            {map.tenantId} / {map.contentPackageId}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{map.summary}</p>
        </div>
        <StatusPill label={`${map.offers.length} offers`} tone="success" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Decision rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{map.decisionRule}</p>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <OfferMetric label="Required" value={String(requiredCount)} tone="success" />
        <OfferMetric label="Premium" value={String(premiumCount)} tone={premiumCount > 0 ? "warning" : "neutral"} />
        <OfferMetric label="Blocked" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
        <OfferMetric label="Teacher controls" value={String(teacherControlCount)} tone="neutral" />
      </div>

      <div className="mt-5 grid gap-3">
        {map.offers.map((offer) => (
          <GameOfferCard key={offer.offerId} offer={offer} />
        ))}
      </div>
    </Card>
  );
}

function OfferMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function GameOfferCard({ offer }: { offer: UnitGameOffer }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {offer.unitLabel} / {offer.engineId} engine / {offer.family}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{offer.label}</h3>
          <p className="mt-1 break-words text-xs font-semibold text-[var(--tenant-muted)]">
            {offer.launchRoute ?? "No student route until reviewed"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={availabilityLabel[offer.availability]} tone={availabilityTone[offer.availability]} />
          <StatusPill label={readinessLabel[offer.readiness]} tone={readinessTone[offer.readiness]} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <OfferBlock title="Audio" items={[offer.audioRequirement]} tone="success" />
        <OfferBlock title="Media" items={[offer.mediaRequirement]} tone="neutral" />
        <OfferBlock title="Teacher controls" items={offer.teacherControls} tone="warning" />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Evidence</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{offer.evidence}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {offer.nextStep}
          </p>
        </section>
        <OfferBlock title="Not allowed yet" items={offer.notAllowedYet} tone="warning" />
      </div>
    </article>
  );
}

function OfferBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
