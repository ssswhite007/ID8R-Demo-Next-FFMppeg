import useStore from "@/helpers/store";
import dynamic from "next/dynamic";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";



import {  useEffect, useState } from "react";

const ffmpeg = createFFmpeg({ log: true });
// import Shader from '@/components/canvas/ShaderExample/ShaderExample'

// Prefer dynamic import for production builds
// But if you have issues and need to debug in local development
// comment these out and import above instead
// https://github.com/pmndrs/react-three-next/issues/49


const save = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}

const convertToGif = async (videoUrl) => {
  // save(videoURL, "video")
  // Write the file to memory 
  ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(videoUrl));

  // Run the FFMpeg command
  await ffmpeg.run('-i', 'test.mp4', '-t', '7.12', '-ss', '0.0',  '-vf', 'scale=400:400',  '-r', '30', '-q:v', '2','-f', 'gif', 'out.gif');

  // Read the result
  const data = ffmpeg.FS('readFile', 'out.gif');

  // Create a URL
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
 // setGif(url)
  save(url, "animation")
}

const Shader = dynamic(
  () => import("@/components/canvas/ShaderExample/ShaderExample"),
  {
    ssr: false,
  }
);

const Frame = dynamic(() => import("@/components/canvas/Frame"), {
  ssr: false,
});

// DOM elements here
const DOM = (props) => {

  const {
    canvasRef,
  } = props;

  const [starting, setStarting] = useState(false);

  const {
    videoUrl,
    setProgress,
    gifSize,
    setGIFSize,
  } = useStore();


  const load = async () => {
    await ffmpeg.load();
  }

  useEffect(() => {
    load();
  }, [])


  useEffect(() => {
    if (videoUrl !=="" && starting) {
      //  generateGIF(videoUrl, gifSize, setProgress);
        convertToGif(videoUrl)
        setStarting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [videoUrl, starting])

  const exportGIF = () =>{
      setStarting(true);
  }
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => exportGIF()}
      >
        Export
      </button>
    </div>
  );
};

// Canvas/R3F components here
const R3F = () => {
  // Example of using the router to change pages
  // It can also be inside R3F component (see `two.tsx` and `Box.tsx`)
  const { router } = useStore();
  const handleOnClick = () => {
    router.push("/two");
  };

  return (
    <>
    <Frame />
    </>
  );
};

export default function Page() {
  return (
    <>
      <DOM />
      <R3F />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Welcome!",
    },
  };
}
