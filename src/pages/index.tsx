import useStore from "@/helpers/store";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { createGIF } from 'gifshot';
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";



import { useRef, useEffect, useState } from "react";

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

const generateGIF = (videoUrl, gifSize,  setProgress) => {
  const options = {
      video: videoUrl,
      gifWidth: gifSize.width,
      gifHeight: gifSize.height,
      numWorkers: 3,
      frameDuration: 1 / 30,
      numFrames: 232,
      sampleInterval: 20, 
      // interval: 0.1, 
      progressCallback: e => setProgress(parseInt(e * 100))
  };

  createGIF(options, obj => {
      if (!obj.error) {
          var image = obj.image;
          save(image, "sample")
          setProgress(0);
      }
  });
}

const convertToGif = async (videoUrl) => {
  console.log(videoUrl, "opopopopopo")
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
  save(url, "dfdfdfdfsf")
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
    console.log(videoUrl, "00000000000000")
    if (videoUrl !=="" && starting) {
      console.log("hhhhhhhhhhhhhh", videoUrl)
      //  generateGIF(videoUrl, gifSize, setProgress);
        convertToGif(videoUrl)
        save(videoUrl, "video")
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
