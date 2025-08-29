import Header from "@/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Random",
  description: "Website random",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main
          className="relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/bg.png)",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
