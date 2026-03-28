import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ConferenceCompanion",
    short_name: "Companion",
    description: "Privater Konferenzbegleiter für eingeladene Teilnehmer und Organisatoren.",
    start_url: "/guest",
    display: "standalone",
    background_color: "#f5f1ea",
    theme_color: "#111315",
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
