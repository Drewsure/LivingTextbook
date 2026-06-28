import { Button, Card, StatusPill } from "@living-textbook/ui";
import type { UnitPayload } from "@living-textbook/content-model";
import type { TenantConfig } from "@/features/tenant/types";

interface StudentLaunchFlowProps {
  launchCode: string;
  tenant: TenantConfig;
  unit: UnitPayload;
}

export function StudentLaunchFlow({ launchCode, tenant, unit }: StudentLaunchFlowProps) {
  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Launch code {launchCode}</p>
            <h2 className="mt-1 text-2xl font-bold">{tenant.displayName} practice entry</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Start with flashcards, then unlock the next recommended game after practice is complete.
            </p>
          </div>
          <StatusPill label="QR ready" tone="success" />
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-bold">Flashcard Practice</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {unit.pedagogicalPayload.vocabularyTerms.map((term) => (
            <div key={term} className="flex min-h-20 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-lg font-bold">
              {term}
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <Button>Mark practice complete</Button>
        </div>
      </Card>
    </div>
  );
}
