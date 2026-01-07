import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

function App() {
  // Đoạn code phat nhạc nền
  useEffect(() => {
    // const music = new Audio("/audios/music.mp3");
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
      <UI />
      <Loader />
      <Canvas shadows camera={{
          position: [-0.5, 1, window.innerWidth > 800 ? 4 : 9],
          fov: 45,
        }}>
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
    </>
  );
}

export default App;
