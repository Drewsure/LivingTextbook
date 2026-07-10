export type ActiveRouteGroup = "core" | "ministar" | "sample-publisher" | "stable-qr";

export interface ActiveRouteMatrixItem {
  routeId: string;
  group: ActiveRouteGroup;
  label: string;
  path: string;
  status: "active-scaffold" | "active-demo";
  note: string;
}

export const sampleActiveRouteMatrix: ActiveRouteMatrixItem[] = [
  {
    routeId: "home",
    group: "core",
    label: "Home",
    path: "/",
    status: "active-scaffold",
    note: "Tenant/package overview and dashboard entry.",
  },
  {
    routeId: "teacher",
    group: "core",
    label: "Teacher launch",
    path: "/teacher",
    status: "active-scaffold",
    note: "Teacher protocol and demo route shortcuts.",
  },
  {
    routeId: "teacher-intake",
    group: "core",
    label: "Teacher intake",
    path: "/teacher/intake",
    status: "active-scaffold",
    note: "Admin review surface for package, route, policy, and backend planning.",
  },
  {
    routeId: "ministar-launch",
    group: "ministar",
    label: "MiniStar launch",
    path: "/launch/demo-unit-1",
    status: "active-scaffold",
    note: "Student flashcards, game unlock, and recommended path.",
  },
  {
    routeId: "ministar-training-sentences",
    group: "ministar",
    label: "MiniStar sentence recovery",
    path: "/training/demo-unit-1?focus=sentence-review",
    status: "active-scaffold",
    note: "Focused Training Academy route.",
  },
  {
    routeId: "ministar-media-playlist",
    group: "ministar",
    label: "MiniStar media playlist",
    path: "/media/playlist-ministar-l1-u1-greetings",
    status: "active-scaffold",
    note: "Reviewed playlist route for package-linked audio and video metadata.",
  },
  {
    routeId: "partner-launch",
    group: "sample-publisher",
    label: "Sample publisher launch",
    path: "/launch/partner-demo-unit-1",
    status: "active-scaffold",
    note: "White-label student launch for the sample publisher package.",
  },
  {
    routeId: "partner-training-sentences",
    group: "sample-publisher",
    label: "Sample publisher sentence recovery",
    path: "/training/partner-demo-unit-1?focus=sentence-review",
    status: "active-scaffold",
    note: "White-label focused Training Academy route.",
  },
  {
    routeId: "partner-media-playlist",
    group: "sample-publisher",
    label: "Sample publisher media playlist",
    path: "/media/playlist-sample-publisher-l1-u1-routines",
    status: "active-scaffold",
    note: "White-label reviewed playlist route for package-linked audio and video metadata.",
  },
  {
    routeId: "sample-stable-qr",
    group: "stable-qr",
    label: "Sample stable QR alias",
    path: "/q/tenant/sample-publisher/series/starter-english/book/level-1/unit/unit-1/activity/hello-friends/language/en/edition/2026/version/1.0.0",
    status: "active-demo",
    note: "Active QR registry alias, not a direct media file.",
  },
];
