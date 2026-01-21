import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export const currentViewAtom = atom("intro"); // "intro", "book" hoặc "letters"

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
export const autoFlipEnabledAtom = atom(true); // Cho phép người dùng lật tay ngay từ đầu
export const shouldRotateBookAtom = atom(false);
// Hiển thị ảnh bìa trước và bìa sau
export const pages = [
  {
    front: "bia_truoc",
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
  back: "bia_sau",
});

export const UI = () => {
  const [page] = useAtom(pageAtom);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);

  // Phát âm thanh khi lật trang
  useEffect(() => {
    const audio = new Audio("/audio/page-flip-01a.mp3");
    audio.play();
  }, [page]);

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
                className="golden-next-button px-8 py-4 rounded-full text-xl uppercase font-bold"
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
