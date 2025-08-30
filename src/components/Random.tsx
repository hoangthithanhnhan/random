import type { NextPage } from "next";
import Image from "next/image";
import { useState, useRef } from "react";

interface RandomProps {
  participants?: string[];
  onSpin?: () => void;
}

const Quay: NextPage<RandomProps> = ({ participants = [], onSpin }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Tạo hiệu ứng scroll
    if (listRef.current) {
      const list = listRef.current;
      const itemHeight = 32; // Chiều cao mỗi item (2rem = 32px)
      const gap = 32; // Khoảng cách giữa các item (2rem = 32px)
      const totalItemHeight = itemHeight + gap;

      // Tính toán vị trí scroll ngẫu nhiên
      const randomIndex = Math.floor(Math.random() * participants.length);
      const targetScrollTop = randomIndex * totalItemHeight;

      // Thêm padding để tạo hiệu ứng mượt mà
      const extraScroll = 1000; // Scroll thêm để tạo hiệu ứng

      // Animation scroll
      list.scrollTo({
        top: targetScrollTop + extraScroll,
        behavior: "smooth",
      });

      // Dừng animation sau 3 giây
      setTimeout(() => {
        setIsSpinning(false);
        if (onSpin) {
          onSpin();
        }
      }, 3000);
    }
  };

  return (
    <div className="w-full relative h-[56.25rem] overflow-hidden text-center text-[2rem] text-mediumspringgreen flex justify-center items-center">
      <div className="absolute top-[calc(50%_-_280px)] left-[25.25rem] flex flex-row items-center justify-start gap-[1.5rem] text-[0.875rem] text-white">
        <div
          ref={listRef}
          className="w-[11.25rem] flex flex-col items-end justify-start gap-[2rem] max-h-[42rem] overflow-y-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {participants.map((participant, index) => (
            <div
              key={index}
              className="rounded-3xl border-darkgray border-solid border-[1px] box-border h-[2rem] flex flex-row items-center justify-center py-[0.5rem] px-[0.625rem] min-h-[2rem] max-w-[11.25rem]"
            >
              <div className="relative font-medium w-full">
                <p className="m-0 overflow-hidden text-white whitespace-nowrap text-ellipsis">{participant}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center justify-start">
          <div className="self-stretch w-[3.125rem] flex flex-col items-end justify-start gap-[2rem] max-h-[42rem] overflow-hidden">
            {participants.map((_, index) => (
              <div key={index} className="w-[2.5rem] relative h-[3rem]">
                <div className="absolute top-[0.969rem] left-[-0.031rem] border-gray-300 border-solid border-t-[1px] box-border w-[2.563rem] h-[0.063rem]" />
                <div className="absolute top-[-0.031rem] left-[0.594rem] border-[#FFFFFF33] border-solid border-t-[1px] box-border w-[1.938rem] h-[0.063rem]" />
                <div className="absolute top-[1.969rem] left-[1.469rem]  border-[#FFFFFF33] border-solid border-t-[1px] box-border w-[1.063rem] h-[0.063rem]" />
                <div className="absolute top-[2.969rem] left-[0.594rem] border-[#FFFFFF33] border-solid border-t-[1px] box-border w-[1.938rem] h-[0.063rem]" />
              </div>
            ))}
          </div>
        </div>
        <Image
          className="w-[2.75rem] relative h-[40.375rem]"
          width={44}
          height={646}
          sizes="100vw"
          alt=""
          src="/union.png"
        />
      </div>
      <div className="absolute top-[calc(50%_-_94px)] left-[48.125rem] w-[12.5rem] flex flex-col items-center justify-start gap-[3.125rem] text-left text-[2.5rem]">
        <div className="w-[5.5rem] flex flex-col items-center justify-start gap-[0.25rem]">
          <div className="self-stretch flex flex-row items-center justify-start gap-[0.75rem]">
            <b className="relative text-[#02E09E]">{participants.length}</b>
            <Image
              className="w-[1.5rem] relative h-[1.5rem]"
              width={24}
              height={24}
              sizes="100vw"
              alt=""
              src="/user-plus.png"
            />
          </div>
          <div className="self-stretch relative text-[1.25rem] font-medium text-white text-center">
            Value
          </div>
        </div>
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="self-stretch shadow-[0px_0px_4px_rgba(178,_176,_176,_0.25)] rounded-lg bg-seagreen h-[3rem] flex flex-row items-center justify-center py-[0.375rem] px-[1.5rem] box-border text-[1rem] text-white bg-[var(--color-primary)] hover:bg-[#007a56] transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <b className="relative leading-[1.313rem]">
            {isSpinning ? "SPINING..." : "SPIN"}
          </b>
        </button>
      </div>
    </div>
  );
};

export default Quay;
