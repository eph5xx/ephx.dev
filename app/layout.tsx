import type { Metadata } from "next";
import { plexMono, plexSans } from "@/app/fonts";
import { MotionProvider } from "@/components/providers/motion-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { PROFILE, SITE_NAME } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ephx.dev"),
  title: {
    default: PROFILE.name,
    template: `%s | ${SITE_NAME}`,
  },
  description: PROFILE.description,
  openGraph: {
    images: ["/og-default.png"],
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <MotionProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-12 py-6 md:py-8 lg:py-10">
            <main className="flex flex-1 flex-col">{children}</main>
            <SiteFooter />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
