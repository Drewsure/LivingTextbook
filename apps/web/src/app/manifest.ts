import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Living Textbook",
    short_name: "LivingTextbook",
    description: "White-label learning portal for reviewed textbook units, games, multimedia, and teacher-led progression.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    categories: ["education", "games", "productivity"],
    icons: [
      {
        src: "/icons/living-textbook-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
