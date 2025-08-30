import Image from "next/image";

export default function RandomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/bg.png)" }}
    >
      {/* Header */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-[10px] mb-[26px]">
        <Image src="/logo.png" alt="Logo" width={146} height={32} className="mb-[30px]" />
        <p className="sm:text-[32px] text-[24px] text-[#02E09E] font-extrabold mb-[6px]">
          GOLDEN SPIN
        </p>
        <p className="font-medium text-[14px] text-white text-center">
          Every spin is a chance to unlock golden rewards on blockchain
        </p>
      </div>

      {/* Nội dung page */}
      {children}
    </main>
  );
}
