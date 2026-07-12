import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleFrontDoorContext } from "@/data/sampleFrontDoorResolver";
import { FrontDoorEntryFlow } from "@/features/access/FrontDoorEntryFlow";

export default async function FrontDoorEntryPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  const context = resolveSampleFrontDoorContext(tenantId);
  const unit = context?.unit;

  if (!context || !unit) {
    notFound();
  }

  return (
    <AppShell tenant={context.tenant} compact>
      <FrontDoorEntryFlow
        tenant={context.tenant}
        unit={unit}
        contentPackage={context.contentPackage}
        launchSession={context.launchSession}
        progression={context.progression}
        sessionSettings={context.sessionSettings}
        accessPolicy={context.accessPolicy}
        expectedEntryCode={context.expectedEntryCode}
        expectedUserCode={context.expectedUserCode}
        allowedUserCodes={context.allowedUserCodes}
      />
    </AppShell>
  );
}
