"use client";

import { useEffect, useState } from "react";

const TikTokVideoPlayer = ({
  videoUrls,
  coverImage,
}: {
  videoUrls: any;
  coverImage: any;
}) => {
  // console.log(videoUrls);

  const url = videoUrls;
  // Extract the query string from the URL
  const urlParams = new URLSearchParams(url.split("?")[1]);

  // Extract specific parameters
  const faid = urlParams.get("faid");
  const fileId = urlParams.get("file_id");
  const isPlayUrl = urlParams.get("is_play_url");
  const itemId = urlParams.get("item_id");
  const line = urlParams.get("line");
  const plyType = urlParams.get("ply_type");
  const signaturev3 = urlParams.get("signaturev3");
  const tk = urlParams.get("tk");
  const vidc = urlParams.get("vidc");
  const videoId = urlParams.get("video_id");

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const searchParams = new URLSearchParams({
    faid: faid,
    file_id: fileId,
    is_play_url: isPlayUrl,
    item_id: itemId,
    line: line,
    ply_type: plyType,
    signaturev3: signaturev3,
    tk: tk,
    vidc: vidc,
    video_id: videoId,
  });

  useEffect(() => {
    // Construct the URL for your backend API route
    const videoUrl = `/api/video?${searchParams.toString()}`;
    setVideoUrl(videoUrl);
  }, []);

  return (
    <div>
      {videoUrl ? (
        <video controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TikTokVideoPlayer;
