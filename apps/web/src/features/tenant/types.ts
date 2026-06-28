export interface TenantConfig {
  id: string;
  displayName: string;
  curriculumName: string;
  rewardName: string;
  avatarFamilies: string[];
  brand: {
    primary: string;
    accent: string;
  };
}
