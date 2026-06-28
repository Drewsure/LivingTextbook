import { Card, StatusPill } from "@living-textbook/ui";
import type { UnitPayload } from "@living-textbook/content-model";

interface TeacherLaunchPanelProps {
  unit: UnitPayload;
}

export function TeacherLaunchPanel({ unit }: TeacherLaunchPanelProps) {
  const launchPath = "/launch/demo-unit-1";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Teacher Launch Protocol</p>
          <h2 className="mt-1 text-lg font-bold">{unit.unitMeta.theme}</h2>
        </div>
        <StatusPill label="Teacher-led" />
      </div>
      <div className="mt-5 grid gap-4">
        <ProtocolBlock label="Hook" value={unit.teacherLaunchProtocol.hook} />
        <ProtocolBlock label="Activity" value={unit.teacherLaunchProtocol.activity} />
        <ProtocolBlock label="Review" value={unit.teacherLaunchProtocol.review} />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="text-sm font-semibold">Classroom launch route</p>
          <p className="mt-1 text-sm text-slate-600">{launchPath}</p>
        </div>
        <a
          href={launchPath}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
        >
          Open student launch
        </a>
      </div>
    </Card>
  );
}

function ProtocolBlock({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-bold text-slate-500">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
    </section>
  );
}
