import type { Metadata } from "next";
import { DemoProvider } from "@/components/store";
import { Header, Footer } from "@/components/shell";
import "./globals.css";
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
    <html lang="en">
      <body>
        <DemoProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </DemoProvider>
      </body>
    </html>
  );
}
