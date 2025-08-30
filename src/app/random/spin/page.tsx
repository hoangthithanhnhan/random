"use client";

import { useState, useEffect } from "react";
import Quay from "@/components/Random";

export default function RoulettePage() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Lấy danh sách người tham gia từ localStorage (từ trang /random)
  useEffect(() => {
    const savedParticipants = localStorage.getItem("participants");
    if (savedParticipants) {
      try {
        const parsed = JSON.parse(savedParticipants);
        // Flatten mảng 2D thành 1D và lọc bỏ các ô trống
        const flatParticipants = parsed
          .flat()
          .filter((name: string) => name.trim() !== "");
        setParticipants(flatParticipants);
      } catch (error) {
        console.error("Error parsing participants:", error);
      }
    }
  }, []);

  const handleSpinComplete = () => {
    // Kiểm tra xem có dữ liệu từ trang /random không
    if (participants.length === 0) {
      alert(
        "Chưa có danh sách người tham gia! Vui lòng quay lại trang /random để nhập danh sách."
      );
      return;
    }

    setIsSpinning(true);

    // Chọn ngẫu nhiên người thắng từ danh sách đã nhập
    const randomIndex = Math.floor(Math.random() * participants.length);
    const selectedWinner = participants[randomIndex];

    // Hiển thị kết quả sau khi animation hoàn thành
    setTimeout(() => {
      setWinner(selectedWinner);
      setIsSpinning(false);
    }, 500);
  };

  return (
    <div>
      <Quay participants={participants} onSpin={handleSpinComplete} />

      {/* Overlay cho kết quả */}
      {winner && !isSpinning && (
        <div className="fixed inset-0 bg-[#08090D] bg-opacity-70 flex items-center justify-center z-50">
          <div
            className="rounded-lg text-center sm:w-full sm:h-full  w-md h-md bg-cover bg-center bg-no-repeat flex items-center justify-center flex-col"
            style={{ backgroundImage: "url(/modal-winner.png)" }}
          >
            <p className="bg-[linear-gradient(180deg,_#88898E_0%,_#B8B9BE_36.06%,_#F7F7F7_58.17%,_#737172_84.62%)] bg-clip-text text-transparent font-medium text-xl">
              CONGRATULATIONS
            </p>
            <p className="text-[4rem] font-medium text-white mb-[5.5rem] break-words">
              {winner}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setWinner(null);
                  handleSpinComplete();
                }}
                className="bg-[var(--color-primary)] text-white py-[0.84375rem] px-[3.59375rem] rounded-lg hover:bg-green-600 transition-colors font-bold text-base"
              >
                CONTINUE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading khi đang quay */}
      {isSpinning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-xl">Đang quay số...</p>
            <p className="text-sm text-gray-600 mt-2">
              Vui lòng chờ trong giây lát
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
