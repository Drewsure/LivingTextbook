import { AppShell } from "@/components/layout/AppShell";
import { levelOneUnitOne } from "@/data/levelOneUnitOne";
import { sampleLaunchSession } from "@/data/sampleLaunchSession";
import { sampleMultimediaContentPackage } from "@/data/sampleMultimediaPackage";
import { TeacherAssistLanguagePanel } from "@/features/teacher/TeacherAssistLanguagePanel";
import { TeacherLaunchPanel } from "@/features/teacher/TeacherLaunchPanel";
import { TeacherMicrophonePracticePanel } from "@/features/teacher/TeacherMicrophonePracticePanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default function TeacherPage() {
  return (
    <AppShell tenant={ministarTenant}>
      <div className="grid gap-5">
        <TeacherLaunchPanel
          unit={levelOneUnitOne}
          launchSession={sampleLaunchSession}
          contentPackage={sampleMultimediaContentPackage}
        />
        <TeacherAssistLanguagePanel tenant={ministarTenant} />
        <TeacherMicrophonePracticePanel tenant={ministarTenant} />
      </div>
    </AppShell>
  );
}
