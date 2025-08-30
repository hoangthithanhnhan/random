"use client";

import { useState, useEffect } from "react";
import Quay from "@/components/Random";

export default function RoulettePage() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Lấy danh sách người tham gia từ localStorage (nếu có)
  useEffect(() => {
    const savedParticipants = localStorage.getItem('participants');
    if (savedParticipants) {
      try {
        const parsed = JSON.parse(savedParticipants);
        // Flatten mảng 2D thành 1D và lọc bỏ các ô trống
        const flatParticipants = parsed.flat().filter((name: string) => name.trim() !== '');
        setParticipants(flatParticipants);
      } catch (error) {
        console.error('Error parsing participants:', error);
      }
    }
  }, []);

  const handleSpin = () => {
    // Sử dụng danh sách mặc định nếu không có dữ liệu từ localStorage
    const currentParticipants = participants.length > 0 ? participants : [];
    
    if (currentParticipants.length === 0) {
      alert('Chưa có người tham gia! Sử dụng danh sách mặc định.');
      return;
    }

    setIsSpinning(true);
    
    // Chọn ngẫu nhiên người thắng
    const randomIndex = Math.floor(Math.random() * currentParticipants.length);
    const selectedWinner = currentParticipants[randomIndex];
    
    // Giả lập thời gian quay
    setTimeout(() => {
      setWinner(selectedWinner);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div>
      <Quay participants={participants} />
      
      {/* Test button để trigger spin */}
      <div className="fixed top-4 right-4 z-20">
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors"
        >
          {isSpinning ? 'Đang quay...' : 'Test SPIN'}
        </button>
      </div>

      {/* Info panel */}
      <div className="fixed top-4 left-4 z-20 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-bold mb-2">Thông tin test</h3>
        <p className="text-sm mb-1">Tổng người tham gia: <span className="font-bold text-blue-600">{participants.length || 'Sử dụng danh sách mặc định'}</span></p>
        <p className="text-xs text-gray-600">Click nút "Test SPIN" để quay số</p>
      </div>
      
      {/* Overlay cho kết quả */}
      {winner && !isSpinning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">🎉 Kết quả quay số</h2>
            <p className="text-xl text-green-600 mb-4">Người thắng:</p>
            <p className="text-3xl font-bold text-blue-600 mb-6 break-words">{winner}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setWinner(null)}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={() => {
                  setWinner(null);
                  handleSpin();
                }}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Quay lại
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
            <p className="text-sm text-gray-600 mt-2">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      )}
    </div>
  );
}
