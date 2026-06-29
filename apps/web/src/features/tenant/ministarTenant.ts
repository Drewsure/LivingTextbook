import type { TenantConfig } from "./types";

export const ministarTenant: TenantConfig = {
  id: "ministar",
  displayName: "MiniStar English Lab",
  curriculumName: "MiniStar English",
  rewardName: "Star Dust",
  avatarFamilies: ["starter-avatars"],
  featureEntitlements: {
    aiTutor: {
      enabled: false,
      packageTier: "premium",
      allowedLevels: [6, 7, 8],
      allowedModes: ["fix-my-sentence", "role-play", "review-coach"],
      monthlyUsageLimit: 0,
      teacherEnabled: false,
      schoolEnabled: false,
    },
  },
  brand: {
    primary: "#0f172a",
    primaryText: "#ffffff",
    primarySoft: "#e0f2fe",
    accent: "#2563eb",
    accentText: "#ffffff",
    accentSoft: "#dbeafe",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
    border: "#e2e8f0",
  },
};
