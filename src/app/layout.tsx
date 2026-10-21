import { MarketProvider } from "@/components/market-store";
import { Suspense } from "react";
import { StyleReview } from "@/components/style-review";
import type { Metadata } from "next";
import { DemoProvider } from "@/components/store";
import { Header, Footer } from "@/components/shell";
import "./globals.css";
import "./colour-review.css";
import "./exchange-design.css";
import "./sound-world.css";
import "./design-directions.css";
import "./kinetic-review.css";
export const metadata: Metadata = {
  title: {
    default: "SONIC EXCHANGE — A new frequency for music",
    template: "%s | SONIC EXCHANGE",
  },
  description:
    "Discover the culture, support independent artists and explore a connected music ecosystem. Interactive demonstration.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-look="electric">
      <body>
        <DemoProvider>
          <MarketProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <Suspense fallback={null}>
              <StyleReview />
            </Suspense>
          </MarketProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
