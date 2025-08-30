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

  // Default participants if none provided - expanded list for testing
  const defaultParticipants = [
    "Nguyễn Văn An",
    "Trần Thị Bình", 
    "Lê Văn Cường",
    "Phạm Thị Dung",
    "Hoàng Văn Em",
    "Vũ Thị Phương",
    "Đặng Văn Giang",
    "Bùi Thị Hoa",
    "Ngô Văn Inh",
    "Đỗ Thị Kim",
    "Lý Văn Long",
    "Hồ Thị Mai",
    "Võ Văn Nam",
    "Đinh Thị Oanh",
    "Tô Văn Phúc",
    "Lưu Thị Quỳnh",
    "Châu Văn Rồng",
    "Trịnh Thị Sinh",
    "Nguyễn Văn Tâm",
    "Lê Thị Uyên",
    "Phan Văn Vinh",
    "Vương Thị Xuân",
    "Đoàn Văn Yến",
    "Trần Thị Zương",
    "Lý Văn Anh",
    "Hồ Thị Bảo",
    "Võ Văn Cảnh",
    "Đinh Thị Duyên",
    "Tô Văn Đức",
    "Lưu Thị Hương",
    "Châu Văn Khải",
    "Trịnh Thị Lan",
    "Nguyễn Văn Minh",
    "Lê Thị Nga",
    "Phan Văn Oanh",
    "Vương Thị Phương",
    "Đoàn Văn Quân",
    "Trần Thị Rồng",
    "Lý Văn Sơn",
    "Hồ Thị Tuyết",
    "Võ Văn Uyên",
    "Đinh Thị Vân",
    "Tô Văn Xuân",
    "Lưu Thị Yến",
    "Châu Văn An",
    "Trịnh Thị Bình",
    "Nguyễn Văn Cường",
    "Lê Thị Dung",
    "Phan Văn Em",
    "Vương Thị Phương",
    "Đoàn Văn Giang",
    "Trần Thị Hoa",
    "Lý Văn Inh",
    "Hồ Thị Kim",
    "Võ Văn Long",
    "Đinh Thị Mai",
    "Tô Văn Nam",
    "Lưu Thị Oanh",
    "Châu Văn Phúc",
    "Trịnh Thị Quỳnh",
    "Nguyễn Văn Rồng",
    "Lê Thị Sinh",
    "Phan Văn Tâm",
    "Vương Thị Uyên",
    "Đoàn Văn Vinh",
    "Trần Thị Xuân",
    "Lý Văn Yến",
    "Hồ Thị Zương"
  ];

  const displayParticipants = participants.length > 0 ? participants : defaultParticipants;

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
      const randomIndex = Math.floor(Math.random() * displayParticipants.length);
      const targetScrollTop = randomIndex * totalItemHeight;
      
      // Thêm padding để tạo hiệu ứng mượt mà
      const extraScroll = 1000; // Scroll thêm để tạo hiệu ứng
      
      // Animation scroll
      list.scrollTo({
        top: targetScrollTop + extraScroll,
        behavior: 'smooth'
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
    <div className="w-full relative h-[56.25rem] overflow-hidden text-center text-[2rem] text-mediumspringgreen">
      <div className="absolute top-[calc(50%_-_280px)] left-[25.25rem] flex flex-row items-center justify-start gap-[1.5rem] text-[0.875rem] text-white">
        <div 
          ref={listRef}
          className="w-[11.25rem] flex flex-col items-end justify-start gap-[2rem] max-h-[22rem] overflow-y-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayParticipants.map((participant, index) => (
            <div 
              key={index}
              className="rounded-3xl border-darkgray border-solid border-[1px] box-border h-[2rem] flex flex-row items-center justify-center py-[0.5rem] px-[0.625rem] min-h-[2rem]"
            >
              <div className="flex-1 relative font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                <p className="m-0">{participant}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center justify-start">
          <div className="self-stretch w-[3.125rem] flex flex-col items-end justify-start gap-[1rem] max-h-[22rem] overflow-hidden">
            {displayParticipants.map((_, index) => (
              <div key={index} className="w-[2.5rem] relative h-[3rem]">
                <div className="absolute top-[-0.031rem] left-[-0.031rem] border-white border-solid border-t-[1px] box-border w-[2.563rem] h-[0.063rem]" />
                <div className="absolute top-[0.969rem] left-[0.594rem] border-gray-300 border-solid border-t-[1px] box-border w-[1.938rem] h-[0.063rem]" />
                <div className="absolute top-[1.969rem] left-[1.469rem] border-gray-300 border-solid border-t-[1px] box-border w-[1.063rem] h-[0.063rem]" />
                <div className="absolute top-[2.969rem] left-[0.594rem] border-gray-300 border-solid border-t-[1px] box-border w-[1.938rem] h-[0.063rem]" />
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
            <b className="relative text-[#02E09E]">{displayParticipants.length}</b>
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
          <b className="relative leading-[1.313rem]">{isSpinning ? 'ĐANG QUAY...' : 'SPIN'}</b>
        </button>
      </div>
    </div>
  );
};

export default Quay;
