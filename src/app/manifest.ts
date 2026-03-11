import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "E.ON Conference Companion",
    short_name: "Conference",
    description: "Private conference companion for invited E.ON event attendees and organizers.",
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
