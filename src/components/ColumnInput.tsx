"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Tooltip } from "@heroui/react";

const InputColumns = () => {
  const [columns, setColumns] = useState<string[][]>(
    Array(4)
      .fill([])
      .map(() => Array(26).fill(""))
  );
  const maxLinesPerColumn = 26;

  // helper: clean text
  const cleanText = (s: string) => s.replace(/\u00A0/g, " ").trim();
  const isEmptyLine = (s: string | undefined | null) =>
    !s || cleanText(s) === "";

  const handleInputChange = (
    colIndex: number,
    lineIndex: number,
    value: string
  ) => {
    const isPreviousLinesFilled = columns[colIndex]
      .slice(0, lineIndex)
      .every((line) => !isEmptyLine(line));

    if (!isPreviousLinesFilled && !isEmptyLine(value)) {
      return;
    }

    const newColumns = [...columns];
    newColumns[colIndex][lineIndex] = cleanText(value);
    setColumns(newColumns);
  };

  // paste nhiều dòng
  const handlePaste = (
    colIndex: number,
    event: React.ClipboardEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");
    const rawLines = pasteData.split(/\r?\n/);
    const lines = rawLines.map((l) => cleanText(l)).filter((l) => l !== "");
    if (lines.length === 0) return;

    const newColumns = [...columns];
    let currentColIndex = colIndex;
    let currentLineIndex = 0;
    while (
      currentLineIndex < maxLinesPerColumn &&
      !isEmptyLine(newColumns[currentColIndex][currentLineIndex])
    ) {
      currentLineIndex++;
    }

    for (const ln of lines) {
      if (currentLineIndex >= maxLinesPerColumn) {
        currentColIndex++;
        currentLineIndex = 0;
        if (currentColIndex >= newColumns.length) {
          newColumns.push(Array(maxLinesPerColumn).fill(""));
        }
      }
      newColumns[currentColIndex][currentLineIndex] = ln;
      currentLineIndex++;
    }

    setColumns(newColumns);
  };

  // đặt caret ở cuối
  function setCaretToEnd(el: HTMLElement | null) {
    if (!el) return;
    const range = document.createRange();
    const sel = window.getSelection();
    try {
      range.selectNodeContents(el);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    } catch {}
  }

  // tìm dòng trống đầu tiên trong cột
  const getFirstEmptyLine = (colIndex: number) => {
    const col = columns[colIndex];
    const idx = col.findIndex((line) => isEmptyLine(line));
    return idx === -1 ? col.length : idx;
  };

  // focus handler: ép focus về dòng trống đầu tiên,
  // nhưng vẫn cho edit các dòng đã nhập
  const handleFocus = (
    e: React.FocusEvent<HTMLDivElement>,
    colIndex: number,
    lineIndex: number
  ) => {
    const firstEmpty = getFirstEmptyLine(colIndex);
    const currentLine = columns[colIndex][lineIndex];

    // Nếu dòng này trống và chưa phải dòng trống đầu tiên -> ép focus về dòng trống đầu tiên
    if (isEmptyLine(currentLine) && lineIndex !== firstEmpty) {
      e.preventDefault();
      const target = document.getElementById(
        `line-${colIndex}-${firstEmpty}`
      ) as HTMLElement | null;
      target?.focus();
      setCaretToEnd(target);
      return;
    }

    // Ngược lại (dòng có chữ hoặc đúng dòng trống đầu tiên) thì cho edit/focus bình thường
    const el = e.currentTarget;
    if (isEmptyLine(el.textContent ?? "")) {
      setCaretToEnd(el);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    colIndex: number,
    lineIndex: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      if (lineIndex + 1 < maxLinesPerColumn) {
        const nextLine = document.getElementById(
          `line-${colIndex}-${lineIndex + 1}`
        ) as HTMLElement | null;
        nextLine?.focus();
        setTimeout(() => setCaretToEnd(nextLine), 0);
      } else {
        if (colIndex + 1 < columns.length) {
          const nextColFirstLine = document.getElementById(
            `line-${colIndex + 1}-0`
          ) as HTMLElement | null;
          nextColFirstLine?.focus();
          setTimeout(() => setCaretToEnd(nextColFirstLine), 0);
        } else {
          const newColumns = [...columns, Array(maxLinesPerColumn).fill("")];
          setColumns(newColumns);
          setTimeout(() => {
            const newLine = document.getElementById(
              `line-${colIndex + 1}-0`
            ) as HTMLElement | null;
            newLine?.focus();
            setCaretToEnd(newLine);
          }, 0);
        }
      }
    }
  };

  const getTotalLines = () =>
    columns.reduce(
      (acc, col) => acc + col.filter((line) => !isEmptyLine(line)).length,
      0
    );

  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div className="relative p-4 pb-10 sm:px-16">
          <div className="text-center sm:text-right font-semibold flex justify-center sm:justify-end text-white mb-3 sm:mb-4 mr-2.5">
            <Image
              src="/total.png"
              alt="icon-list"
              width={24}
              height={16}
              className="mr-[5px] object-cover"
            />
            <p className="text-white">TOTAL {getTotalLines()}</p>
          </div>
          <div className="sm:block hidden">
            <div
              className="swiper-button-prev custom-nav"
              style={{
                position: "absolute",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 20,
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
                color: "white",
              }}
            ></div>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              renderBullet: (index, className) => {
                return `<span class="${className} custom-bullet"></span>`;
              },
            }}
            spaceBetween={20}
            slidesPerView={1}
            loop={false}
            breakpoints={{
              768: { slidesPerView: 2, pagination: false },
              1024: { slidesPerView: 3, pagination: false },
              1280: { slidesPerView: 4, pagination: false },
            }}
          >
            {columns.map((column, colIndex) => (
              <SwiperSlide key={colIndex}>
                <div className="rounded-lg shadow-lg overflow-hidden mx-2 min-w-[21.18vw]">
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
                      {column.filter((line) => !isEmptyLine(line)).length}
                    </div>
                  </div>

                  <div
                    className="h-[608px] bg-[#BABABA80] rounded-b-lg p-2 custom-scroll"
                    style={{
                      fontSize: "14px",
                      lineHeight: "22.5px",
                      overflowY: "auto",
                    }}
                    onPaste={(e) => handlePaste(colIndex, e)}
                  >
                    {column.map((line, lineIndex) => (
                      <Tooltip
                        key={lineIndex}
                        content={line}
                        showArrow
                        isDisabled={isEmptyLine(line)}
                        className="max-w-[400px] h-full bg-[var(--color-primary)] text-white rounded-md px-2 py-1 text-sm"
                      >
                        <div
                          id={`line-${colIndex}-${lineIndex}`}
                          className="relative w-full h-[22.5px] overflow-hidden text-white text-center whitespace-nowrap text-ellipsis"
                          contentEditable
                          suppressContentEditableWarning
                          onFocus={(e) => handleFocus(e, colIndex, lineIndex)} // 👈 update chỗ này
                          onInput={(e) => {
                            const el = e.currentTarget;
                            handleInputChange(
                              colIndex,
                              lineIndex,
                              el.textContent || ""
                            );
                            requestAnimationFrame(() => {
                              const node = document.getElementById(
                                `line-${colIndex}-${lineIndex}`
                              ) as HTMLElement | null;
                              setCaretToEnd(node);
                            });
                          }}
                          onKeyDown={(e) =>
                            handleKeyDown(e, colIndex, lineIndex)
                          }
                          style={{
                            padding: "0 8px",
                            cursor: "text",
                            outline: "none",
                          }}
                        >
                          {isEmptyLine(line) ? "\u00A0" : line}
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-pagination flex justify-center mt-[14px] sm:hidden" />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <button className="bg-[var(--color-primary)] text-white border-none rounded-[8px] py-[7.5px] px-[63.5px] sm:py-[14px] sm:px-[75px] font-[700] cursor-pointer mt-[23px]">
          START
        </button>
      </div>
    </>
  );
};

export default InputColumns;
