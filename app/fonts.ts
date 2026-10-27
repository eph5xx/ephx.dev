import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

// One superfamily, so labels and code sit on the same skeleton as the text.
export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});
