"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="w-full bg-[#0C0C0C] text-white flex items-center justify-between px-5 py-2.5 fixed z-10">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={146}
          height={32}
          className="hidden sm:flex object-contain mr-[60px]"
        />
        <Image
          src="/logo-mobile.png"
          alt="Logo"
          width={23}
          height={30}
          className="object-contain sm:hidden"
        />
        <nav className="hidden sm:flex space-x-[30px] md:space-x-[60px] text-sm">
          <Link href="#" className="font-normal text-white">
            Probability Settings
          </Link>
          <Link href="#" className="font-normal text-white">
            Spin History
          </Link>
        </nav>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <nav className="absolute left-0 right-0 top-full mt-0 w-full bg-white text-gray-800 shadow-lg px-4 sm:hidden">
          <Link
            href="#"
            className="py-[0.875rem] text-xs text-black hover:bg-gray-100 flex items-center"
          >
            <Image
              src="/Guide.png"
              alt="Guide"
              width={14}
              height={14}
              className="inline-block mr-2"
            />
            Guide
          </Link>
          <hr />
          <Link
            href="#"
            className="flex items-center py-[0.875rem] text-xs text-black hover:bg-gray-100"
          >
            <Image
              src="/Rewards.png"
              alt="Rewards"
              width={14}
              height={14}
              className="inline-flex items-center mr-2"
            />
            Rewards
          </Link>
          <hr />
          <Link
            href="#"
            className="flex items-center py-[0.875rem] text-xs text-black hover:bg-gray-100"
          >
            <Image
              src="/Bittworld.png"
              alt="BITTWORLD DEX"
              width={14}
              height={14}
              className="inline-block mr-2"
            />
            BITTWORLD DEX
          </Link>
          <hr />
        </nav>
      )}
    </header>
  );
}
