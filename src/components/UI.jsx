import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

export const currentViewAtom = atom("book"); // "book" hoặc "letters"

// List ảnh trong sach
const pictures = [
  "nam_1",
  "nam_2",
  "nam_3",
  "nam_4",
  "nghi_1",
  "nghi_2",
  "nghi_3",
  "nghi_4",
  "trieu_1",
  "trieu_2",
  "trieu_3",
  "trieu_4",
  "trieu_5",
  "trieu_6",
];

export const pageAtom = atom(0);
export const autoFlipEnabledAtom = atom(false);
export const shouldRotateBookAtom = atom(false);
// Hiển thị ảnh bìa trước và bìa sau
export const pages = [
  {
    front: "bìa_truoc",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const [autoFlipEnabled, setAutoFlipEnabled] = useAtom(autoFlipEnabledAtom);
  const [isAutoFlipping, setIsAutoFlipping] = useState(true);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [, setShouldRotateBook] = useAtom(shouldRotateBookAtom);

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  // Tự động lật trang khi bắt đầu
  useEffect(() => {
    if (!isAutoFlipping) return;

    let currentPage = 0;

    const autoFlip = () => {
      const totalPages = pages.length;

      // Lật từ đầu đến cuối
      if (currentPage < totalPages) {
        currentPage++;
        setPage(currentPage);
        // Lật trang tiếp theo sau 300ms
        setTimeout(autoFlip, 300);
      } else {
        // Đã đến trang cuối, dừng auto-flip và kích hoạt xoay sách
        setIsAutoFlipping(false);
        // Kích hoạt xoay sách
        setTimeout(() => {
          setShouldRotateBook(true);
        }, 800); // Đợi một chút trước khi bắt đầu xoay
      }
    };

    // Bắt đầu tự động lật sau 2 giây
    const startTimer = setTimeout(() => {
      autoFlip();
    }, 2000);

    return () => {
      clearTimeout(startTimer);
    };
  }, [isAutoFlipping, setPage, setShouldRotateBook]);

  return (
    <>
      <main className=" pointer-events-none select-none z-10 fixed  inset-0  flex justify-between flex-col">
        <div className="pointer-events-auto mt-10 ml-10">
          {/* <img
            className="w-20"
            src="/images/wawasensei-white.png"
            alt="K31 TIN MAT GOC"
          /> */}
        </div>
        {currentView === "book" && (
          <div className="w-full overflow-auto pointer-events-auto flex justify-center">
            <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
              <button
                className="border-white hover:bg-white/20 transition-all duration-300 px-8 py-4 rounded-full text-xl uppercase border-2 bg-black/30 text-white font-semibold"
                style={{ fontFamily: "'Dancing Script', cursive" }}
                onClick={() => {
                  setCurrentView("letters");
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
