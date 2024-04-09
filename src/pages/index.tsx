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
  await ffmpeg.run(
    '-i', 'test.mp4',        // Input file
    '-t', '8.23',            // Duration of output GIF (8.23 seconds)
    '-ss', '0.0',            // Start time (0 seconds, beginning of input)
    '-vf', 'fps=30,scale=800:800:flags=lanczos',   // Set frame rate to 30 fps and resize to 800px width using Lanczos filter
    '-r', '30',
    '-loop', '0',            // Loop the GIF infinitely
    '-q:v', '1',             // Highest quality scale for the output GIF (1 is best quality)
    '-f', 'gif',             // Output format is GIF
    'out.gif'                // Output file name
  );
  // Read the result
  const data = ffmpeg.FS('readFile', 'out.gif');

  // Create a URL
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
 // setGif(url)
  save(url, "animation")
}



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
