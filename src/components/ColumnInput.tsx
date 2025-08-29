"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const InputColumns = () => {
  const [columns, setColumns] = useState<string[]>(["", "", "", ""]);
  const maxLinesPerColumn = 26;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // theo dõi vị trí cột đầu tiên đang hiển thị

  const countLines = (text: string) =>
    text.split("\n").filter((l) => l.trim() !== "").length;

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    const lines = value.split("\n");

    if (lines.length > maxLinesPerColumn) {
      const truncated = lines.slice(0, maxLinesPerColumn).join("\n");
      const remaining = lines.slice(maxLinesPerColumn).join("\n");

      const newColumns = [...columns];
      newColumns[index] = truncated;

      if (index === columns.length - 1) {
        newColumns.push(remaining); // thêm cột mới nếu đã ở cột cuối
      } else {
        newColumns[index + 1] =
          (newColumns[index + 1] || "") + "\n" + remaining;
      }

      setColumns(newColumns);
    } else {
      const newColumns = [...columns];
      newColumns[index] = value;
      setColumns(newColumns);
    }
  };

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");
    const lines = pasteData.split("\n").filter((line) => line.trim() !== "");

    let currentIndex = index;
    let newColumns = [...columns];

    lines.forEach((line) => {
      let currentColumn = newColumns[currentIndex] || "";
      let currentLines = countLines(currentColumn);

      if (currentLines >= maxLinesPerColumn) {
        currentIndex++;
        if (currentIndex >= newColumns.length) {
          newColumns.push("");
        }
        currentColumn = newColumns[currentIndex] || "";
      }

      currentColumn = currentColumn ? currentColumn + "\n" + line : line;
      newColumns[currentIndex] = currentColumn;
    });

    setColumns(newColumns);
  };

  // Slide đến cột cụ thể
  const slideToColumn = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * (window.innerWidth * 0.2118), // 21.18vw mỗi cột
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      slideToColumn(newIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < columns.length - 4) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      slideToColumn(newIndex);
    }
  };
  // Hàm đếm tổng số dòng
  const getTotalLines = () => {
    return columns.reduce(
      (acc, col) => acc + col.split("\n").filter(Boolean).length,
      0
    );
  };

  return (
    <>
      <div className="relative w-full overflow-hidden">
        {/* Container scroll ngang */}
        <div ref={scrollRef} className="overflow-x-hidden">
          <div
            className="text-right font-semibold flex justify-end"
            style={{
              color: "white",
              paddingRight: "80px",
              marginBottom: "14px",
            }}
          >
            <Image
              src="/total.png"
              alt="icon-list"
              width={24}
              height={16}
              className="mr-[5px] object-cover"
            />
            <p className="text-white">TOTAL {getTotalLines()}</p>
          </div>
          <div className="relative px-16" >
            {/* Nút navigation tùy chỉnh */}
            <div
              className="swiper-button-prev custom-nav"
              style={{
                position: "absolute",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 20,
                cursor: "pointer",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            ></div>
            <div
              className="swiper-button-next custom-nav"
              style={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 20,
                cursor: "pointer",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            ></div>

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next",
              }}
              spaceBetween={20}
              slidesPerView={1}
              loop={false}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
            >
              {columns.map((content, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="rounded-lg shadow-lg overflow-hidden mx-2"
                    style={{ width: "full", minWidth: "21.18vw" }}
                  >
                    {/* Header */}
                    <div
                      className="flex justify-center items-center bg-[#F0F0F0]"
                      style={{
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        padding: "8px",
                      }}
                    >
                      <Image
                        src="/people.png"
                        alt="icon-list"
                        width={16}
                        height={16}
                        style={{ marginRight: 5 }}
                      />
                      <div
                        className="text-sm font-medium"
                        style={{ color: "var(--color-primary)" }}
                      >
                        {countLines(content)}
                      </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                      className="w-full h-[608px] text-white resize-none focus:outline-none text-center custom-scroll"
                      value={content}
                      onChange={(e) => handleInputChange(index, e)}
                      onPaste={(e) => handlePaste(index, e)}
                      rows={1}
                      style={{
                        lineHeight: "22.5px",
                        minHeight: "24rem",
                        backgroundColor: "#BABABA80",
                        borderBottomLeftRadius: "12px",
                        borderBottomRightRadius: "12px",
                        color: "white",
                        fontSize: "14px",
                        padding: "8px 12px",
                        border: "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div
            className="flex w-full justify-between"
            style={{ paddingLeft: "80px", paddingRight: "80px" }}
          ></div>
        </div>
      </div>

      {/* Nút START */}
      <div className="flex justify-center items-center mt-6">
        <button
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "14px 75px",
            fontWeight: "700",
            cursor: "pointer",
            marginTop: "23px",
          }}
        >
          START
        </button>
      </div>
    </>
  );
};

export default InputColumns;
