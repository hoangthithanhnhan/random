"use client";

import { useState } from "react";
import Quay from "@/components/Random";

export default function RoulettePage() {
  const prizes = [
    { id: 1, image: "/images/prize1.png" },
    { id: 2, image: "/images/prize2.png" },
    { id: 3, image: "/images/prize3.png" },
    { id: 4, image: "/images/prize4.png" },
  ];

  const [prizeIndex, setPrizeIndex] = useState(0);
  const [start, setStart] = useState(false);

  const handleSpin = () => {
    // chọn ngẫu nhiên 1 ô
    const newIndex = Math.floor(Math.random() * prizes.length);
    setPrizeIndex(newIndex);

    // bật quay
    setStart(true);
  };

  return (
    <Quay />
  );
}
