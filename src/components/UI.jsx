import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  // Tự động lật trang khi bắt đầu
  useEffect(() => {
    if (!isAutoFlipping) return;

    let currentPage = 0;
    let direction = 1; // 1 = tăng, -1 = giảm
    let hasReachedEnd = false;

    const autoFlip = () => {
      const totalPages = pages.length;

      if (!hasReachedEnd) {
        // Lật từ đầu đến cuối
        if (currentPage < totalPages) {
          currentPage++;
          setPage(currentPage);
        } else {
          hasReachedEnd = true;
          direction = -1;
          // Đợi một chút trước khi lật ngược lại
          setTimeout(() => {
            currentPage = totalPages;
            autoFlip();
          }, 700);
          return;
        }
      } else {
        // Lật ngược lại từ cuối về đầu
        if (currentPage > 0) {
          currentPage--;
          setPage(currentPage);
        } else {
          // Đã lật xong, cho phép người dùng tự lật
          setIsAutoFlipping(false);
          setAutoFlipEnabled(true);
          return;
        }
      }

      // Lật trang tiếp theo sau 500ms
      setTimeout(autoFlip, 300);
    };

    // Bắt đầu tự động lật sau 1 giây
    const startTimer = setTimeout(() => {
      autoFlip();
    }, 1000);

    return () => {
      clearTimeout(startTimer);
    };
  }, [isAutoFlipping, setPage, setAutoFlipEnabled]);

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
        <div className="w-full overflow-auto pointer-events-auto flex justify-center">
          <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
            {[...pages].map((_, index) => (
              <button
                key={index}
                className={`border-transparent hover:border-white transition-all duration-300  px-4 py-3 rounded-full  text-lg uppercase shrink-0 border ${
                  index === page
                    ? "bg-white/90 text-black"
                    : "bg-black/30 text-white"
                } ${!autoFlipEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (autoFlipEnabled) setPage(index);
                }}
                disabled={!autoFlipEnabled}
              >
                {index === 0 ? "Bìa" : `Trang ${index}`}
              </button>
            ))}
            <button
              className={`border-transparent hover:border-white transition-all duration-300  px-4 py-3 rounded-full  text-lg uppercase shrink-0 border ${
                page === pages.length
                  ? "bg-white/90 text-black"
                  : "bg-black/30 text-white"
              } ${!autoFlipEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (autoFlipEnabled) setPage(pages.length);
              }}
              disabled={!autoFlipEnabled}
            >
              Bìa sau
            </button>
          </div>
        </div>
      </main>

      {/* <div className="fixed inset-0 flex items-center -rotate-2 select-none">
        <div className="relative">
          <div className="bg-white/0  animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h1 className="shrink-0 text-white text-10xl font-black ">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-white text-13xl font-bold">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-transparent text-13xl font-bold outline-text italic">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
          </div>
          <div className="absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-8 px-8 w-max">
            <h1 className="shrink-0 text-white text-10xl font-black ">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-white text-13xl font-bold">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
            <h2 className="shrink-0 text-transparent text-13xl font-bold outline-text italic">
              Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11
            </h2>
          </div>
        </div>
      </div> */}
    </>
  );
};
