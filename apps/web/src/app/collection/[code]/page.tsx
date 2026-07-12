import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleLaunchContext } from "@/data/sampleLaunchResolver";
import { CollectionGalleryPanel } from "@/features/rewards/CollectionGalleryPanel";
import { starterRewardCatalog } from "@/features/rewards/rewardCatalog";

interface CollectionPageProps {
  params: Promise<{ code: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { code } = await params;
  const { tenant, progression, launchSession } = resolveSampleLaunchContext(code);

  return (
    <AppShell tenant={tenant}>
      <CollectionGalleryPanel
        tenant={tenant}
        progression={progression}
        catalog={starterRewardCatalog}
        launchCode={launchSession.launchCode}
      />
    </AppShell>
  );
}
