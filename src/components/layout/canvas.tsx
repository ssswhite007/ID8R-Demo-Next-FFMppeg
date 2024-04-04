import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { A11yAnnouncer } from "@react-three/a11y";
import { OrbitControls, Preload } from "@react-three/drei";

import useStore from "@/helpers/store";

const Controls = () => {
  const control = useRef(null);
  return <OrbitControls ref={control} />;
};
const CanvasWrapper = ({ children }) => {

  const ref = useRef();

  const {
    setCanvasRef
  } = useStore();

  useEffect(() =>{
    if(ref.current){
      setCanvasRef(ref.current)
    }
  }, [ref])
  return (
    <>
    <div style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: "500px",
                    height: "500px",
                    transform: "translate(-50%, -50%)",
                }}>
    <Canvas
        // Is this deprecated or typed wrong? Ignoring for now.
        // @ts-ignore
        ref = {ref}
        mode="concurrent"
        shadows
        gl={{
            preserveDrawingBuffer: true,
            outputEncoding: 3000, // THREE.sRGBEncoding
            toneMapping: 301, // THREE.ACESFilmicToneMapping
            toneMappingExposure: 1.25,
        }}
        camera={{ position: [0, 0, 3.22643], fov: 45, near: 1, far: 1000 }}
        style={{
          position: "absolute",
          top: 0,
        }}
      >
        {/* <Stats /> */}
        <Controls />
        <Preload all />
        {children}
      </Canvas>
    </div>

      <A11yAnnouncer />
    </>
  );
};

export default CanvasWrapper;
