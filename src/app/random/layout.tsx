import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "../../styles/globals.scss";
import { color } from "framer-motion";

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
        <main
          className="relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/bg-random.png)",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#08090D]"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex flex-col items-center justify-center" style={{paddingTop: '10px', marginBottom: '26px'}}>
                <Image src="/logo.png" alt="Logo" width={146} height={32} style={{marginBottom: '30px'}}/>
                <p style={{ color: '#02E09E', fontSize: '32px', fontWeight: '800', marginBottom: '6px' }}>GOLDEN SPIN</p>
                <p style={{fontWeight: '500', fontSize: '14px', color: 'white'}}>Every spin is a chance to unlock golden rewards on blockchain</p>
            </div>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
