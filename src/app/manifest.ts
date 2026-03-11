import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ConferenceCompanion",
    short_name: "Companion",
    description: "Private conference companion for invited attendees and organizers.",
    start_url: "/guest",
    display: "standalone",
    background_color: "#eef2ec",
    theme_color: "#163224",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        purpose: "maskable",
        type: "image/svg+xml",
      },
    ],
  };
}
