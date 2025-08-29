"use client";

import { useState } from "react";
import RoulettePro from "react-roulette-pro";
import "react-roulette-pro/dist/index.css";

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <RoulettePro
        prizes={prizes}
        prizeIndex={prizeIndex}
        start={start}
        onPrizeDefined={(prize: any) => {
          console.log("Bạn trúng:", prize);
          setStart(false); // reset lại cho lần quay tiếp theo
        }}
      />

      <button
        onClick={handleSpin}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700"
      >
        Quay!
      </button>
    </div>
  );
}
