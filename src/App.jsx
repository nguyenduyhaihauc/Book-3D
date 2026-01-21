import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Experience } from "./components/Experience";
import { UI, currentViewAtom } from "./components/UI";
import { Letters } from "./components/Letters";
import TetMemoriesIntro from "./components/Intro";

function App() {
  const [currentView] = useAtom(currentViewAtom);
  const [backgroundImage, setBackgroundImage] = useState("");

  // Xử lý responsive background
  useEffect(() => {
    const updateBackground = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Điện thoại
        setBackgroundImage("url(/images/bg_thu_dien_thoai.jpg)");
      } else if (width >= 768 && width < 1024) {
        // iPad
        setBackgroundImage("url(/images/bg_thu_ipad.jpg)");
      } else {
        // Laptop và màn hình lớn
        setBackgroundImage("url(/images/bg_book.jpg)");
      }
    };

    updateBackground();
    window.addEventListener("resize", updateBackground);
    
    return () => window.removeEventListener("resize", updateBackground);
  }, []);
 
  // Đoạn code phat nhạc nền
  useEffect(() => {
    // const music = new Audio("/audio/music.mp3");
    // music.loop = true;
    // music.volume = 0.35;
    // music.play().catch(() => {});
    // return () => {
    //   music.pause();
    //   music.currentTime = 0;
    // };
  }, []);

  return (
    <>
      {currentView === "intro" && <TetMemoriesIntro />}
      {currentView === "book" && (
        <>
          <UI />
          <Loader />
          <Canvas
            shadows
            camera={{
              position: [-0.5, 1, window.innerWidth > 800 ? 4 : 9],
              fov: 45,
            }}
            style={{
              backgroundImage: backgroundImage,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <group position-y={0}>
              <Suspense fallback={null}>
                <Experience />
              </Suspense>
            </group>
          </Canvas>
        </>
      )}
      {currentView === "letters" && <Letters />}
    </>
  );
}

export default App;
