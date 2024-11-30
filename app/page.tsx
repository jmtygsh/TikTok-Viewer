"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState<string | undefined>(undefined);

  // useEffect(() => {
  //   const fetchVideo = async () => {
  //     const proxyUrl = "http://localhost:3000/api/video";
  //     try {
  //       const response = await fetch(
  //         `${proxyUrl}?faid=1988&file_id=cec1d7a515de4539b5100c3a6366adab&is_play_url=1&item_id=7393752589927501087&line=0&ply_type=2&signaturev3=dmlkZW9faWQ7ZmlsZV9pZDtpdGVtX2lkLmI3NjkzMzAxOTk4OGFjM2E3MjA1YWI0MDI2NmVhY2Ex&tk=tt_chain_token&vidc=useast8&video_id=v15044gf0000cqdu2r7og65kacq496s0`
  //       );
  //       if (!response.ok) throw new Error("Failed to fetch video");

  //       const blob = await response.blob();
  //       const videoUrl = URL.createObjectURL(blob);
  //       console.log(videoUrl); // You can use this in the <video> element
  //       setUrl(videoUrl);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

    // let newVideoUrl = video.videos.slice(38);
    // const proxyUrl = "http://localhost:3000/api/video";
    // const response = await fetch(`${proxyUrl}?${newVideoUrl}`);
    // if (!response.ok) throw new Error("Failed to fetch video");

    // const blob = await response.blob();
    // const videoUrl = URL.createObjectURL(blob);
    // console.log(videoUrl); // You can use this in the <video> element

  //   fetchVideo();
  // }, []); 

  return (
    <main className="flex items-center p-4 w-full dark:bg-black">
      <h1>debug test</h1>
      {/* {url ? (
        <video controls className="w-full rounded-lg mb-4">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Loading video...</p>
      )} */}
    </main>
  );
}
