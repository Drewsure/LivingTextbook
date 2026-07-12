import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleLaunchContext } from "@/data/sampleLaunchResolver";
import { PrintableWorksheetPreview } from "@/features/printables/PrintableWorksheetPreview";

export default async function PrintableWorksheetPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { tenant, contentPackage, unit, assistLanguagePlan } = resolveSampleLaunchContext(code);

  if (!unit) {
    notFound();
  }

  return (
    <AppShell tenant={tenant} compact>
      <PrintableWorksheetPreview
        contentPackage={contentPackage}
        unit={unit}
        launchCode={code}
        assistLanguagePlan={assistLanguagePlan}
      />
    </AppShell>
  );
}
