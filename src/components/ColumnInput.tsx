"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Tooltip } from "@heroui/react";
import { useRouter } from "next/navigation";

const InputColumns = () => {
  const router = useRouter();

  const maxLinesPerColumn = 26;
  const [columns, setColumns] = useState<string[][]>(
    Array(4)
      .fill(null)
      .map(() => Array(maxLinesPerColumn).fill(""))
  );

  // helper: clean text
  const cleanText = (s: string) => s.replace(/\u00A0/g, " ").trim();
  const isEmptyLine = (s: string | undefined | null) =>
    !s || cleanText(s) === "";

  const isColumnFull = (col: string[]) =>
    col.every((line) => !isEmptyLine(line));

const TOTAL_LINES = maxLinesPerColumn * 4;
const flattenColumns = (cols: string[][]) => cols.flat();
const chunkColumns = (flat: string[]) => {
  const result: string[][] = [];
  for (let i = 0; i < flat.length; i += maxLinesPerColumn) {
    result.push(flat.slice(i, i + maxLinesPerColumn));
  }
  return result;
};

  // nhập 1 dòng
  const handleInputChange = (
    colIndex: number,
    lineIndex: number,
    value: string
  ) => {
    let flat = flattenColumns(columns);
    const index = colIndex * maxLinesPerColumn + lineIndex;

    if (isEmptyLine(value)) {
      // xoá → dồn toàn bộ phần tử sau lên
      flat.splice(index, 1);
      flat.push("");
    } else {
      // chặn nhập nếu cột trước chưa full
      if (
        colIndex > 0 &&
        !isColumnFull(columns[colIndex - 1]) &&
        !isEmptyLine(value)
      ) {
        return;
      }

      // bắt buộc nhập theo thứ tự
      const isPreviousFilled = flat
        .slice(0, index)
        .every((line) => !isEmptyLine(line));
      if (!isPreviousFilled && !isEmptyLine(value)) {
        return;
      }

      flat[index] = cleanText(value);
    }

    const newColumns = chunkColumns(flat);
    setColumns(newColumns);
  };

  // paste nhiều dòng
  const handlePaste = (
    colIndex: number,
    event: React.ClipboardEvent<HTMLDivElement>
  ) => {
    if (colIndex > 0 && !isColumnFull(columns[colIndex - 1])) {
      event.preventDefault();
      return;
    }

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
          if (isColumnFull(newColumns[currentColIndex - 1])) {
            newColumns.push(Array(maxLinesPerColumn).fill(""));
          } else {
            break;
          }
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

  const getFirstEmptyLine = (colIndex: number) => {
    const col = columns[colIndex];
    const idx = col.findIndex((line) => isEmptyLine(line));
    return idx === -1 ? col.length : idx;
  };

  // ép focus
  const handleFocus = (
    e: React.FocusEvent<HTMLDivElement>,
    colIndex: number,
    lineIndex: number
  ) => {
    const firstEmpty = getFirstEmptyLine(colIndex);
    const currentLine = columns[colIndex][lineIndex];

    if (isEmptyLine(currentLine) && lineIndex !== firstEmpty) {
      e.preventDefault();
      const target = document.getElementById(
        `line-${colIndex}-${firstEmpty}`
      ) as HTMLElement | null;
      target?.focus();
      setCaretToEnd(target);
      return;
    }

    const el = e.currentTarget;
    if (isEmptyLine(el.textContent ?? "")) {
      setCaretToEnd(el);
    }
  };

  // Enter để xuống dòng
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
          if (!isColumnFull(columns[colIndex])) return;

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

  useEffect(() => {
    const swiperEl = document.querySelector(".swiper") as any;
    if (!swiperEl || !swiperEl.swiper) return;

    const swiper = swiperEl.swiper;
    const updateNav = () => {
      const currentIndex = swiper.activeIndex;
      const canGoNext = isColumnFull(columns[currentIndex]);
      const nextEl = swiper.navigation?.nextEl as HTMLElement;
      if (nextEl) {
        if (!canGoNext) {
          nextEl.classList.remove("swiper-button-disabled");
          nextEl.setAttribute("aria-disabled", "true");
        } else {
          nextEl.classList.remove("swiper-button-disabled");
          nextEl.removeAttribute("aria-disabled");
        }
      }
    };

    swiper.on("slideChange", updateNav);
    updateNav(); // chạy lần đầu
    return () => {
      swiper.off("slideChange", updateNav);
    };
  }, [columns]);

  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div className="relative p-4 pb-10 sm:px-[80px] sm:py-0">
          {/* Total count */}
          <div className="text-center sm:text-right font-semibold flex justify-center sm:justify-end text-white mb-3 sm:mb-4">
            <Image
              src="/total.png"
              alt="icon-list"
              width={24}
              height={16}
              className="mr-[5px] object-cover"
            />
            <p className="text-white">TOTAL {getTotalLines()}</p>
          </div>

          {/* Navigation btns */}
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

          {/* Swiper */}
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
                return `<span class="${className} custom-bullet swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"></span>`;
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
            style={{ width: "100%", maxWidth: "100%" }}
          >
            {columns.map((column, colIndex) => (
              <SwiperSlide key={colIndex}>
                <div className="rounded-lg shadow-lg overflow-hidden">
                  <div
                    className="flex justify-center items-center bg-[#F0F0F0]"
                    style={{
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      padding: "8px",
                    }}
                  >
                    <Image
                      src={
                        colIndex === 0 || isColumnFull(columns[colIndex - 1])
                          ? "/people.png"
                          : "/people-disable.png"
                      }
                      alt="icon-list"
                      width={16}
                      height={16}
                      style={{ marginRight: 5 }}
                    />
                    <div
                      className={`text-sm font-medium ${
                        colIndex === 0 || isColumnFull(columns[colIndex - 1])
                          ? "text-[var(--color-primary)]"
                          : "text-[#A1A1A1]"
                      }`}
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
                          contentEditable={
                            colIndex === 0 ||
                            isColumnFull(columns[colIndex - 1])
                          }
                          suppressContentEditableWarning
                          onFocus={(e) => handleFocus(e, colIndex, lineIndex)}
                          onInput={(e) => {
                            if (
                              !(
                                colIndex === 0 ||
                                isColumnFull(columns[colIndex - 1])
                              )
                            ) {
                              e.currentTarget.blur();
                              return;
                            }
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
                            cursor:
                              colIndex === 0 ||
                              isColumnFull(columns[colIndex - 1])
                                ? "text"
                                : "not-allowed",
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
        <button
          onClick={() => router.push("/random/spin")}
          className="bg-[var(--color-primary)] text-white border-none rounded-[8px] py-[7.5px] px-[63.5px] sm:py-[14px] sm:px-[75px] font-[700] cursor-pointer mt-[23px]"
        >
          START
        </button>
      </div>
    </>
  );
};

export default InputColumns;
