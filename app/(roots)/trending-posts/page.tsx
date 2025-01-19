"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Page = () => {
  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [btnIndex, setBtnIndex] = useState(null);

  const videoRefs = useRef({});

  const fetchData = async (pageToFetch = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(`/api/trendingposts?page=${pageToFetch}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();

      if (append && resData) {
        setResData({
          ...responseData,
          data: {
            ...responseData.data,
            itemList: [...resData.data.itemList, ...responseData.data.itemList],
          },
        });
      } else {
        setResData(responseData);
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (resData?.data?.hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, true);
    }
  };

  const formatVideoUrl = (videoPlay) => {
    try {
      const urlParams = new URLSearchParams(videoPlay.split("?")[1]);
      const params = {
        faid: urlParams.get("faid") || "",
        file_id: urlParams.get("file_id") || "",
        is_play_url: urlParams.get("is_play_url") || "",
        item_id: urlParams.get("item_id") || "",
        line: urlParams.get("line") || "",
        ply_type: urlParams.get("ply_type") || "",
        signaturev3: urlParams.get("signaturev3") || "",
        tk: urlParams.get("tk") || "",
        vidc: urlParams.get("vidc") || "",
        video_id: urlParams.get("video_id") || "",
      };

      return `/api/video?${new URLSearchParams(params).toString()}`;
    } catch (error) {
      console.error("Error processing video details:", error);
      return null;
    }
  };

  const handlePlayVideo = (currentIndex) => {
    Object.values(videoRefs.current).forEach((video, index) => {
      if (index === currentIndex) {
        if (video.paused) {
          video.play(); // Play the selected video
        }
      } else {
        video.pause(); // Pause other videos
      }
    });
  };

  return (
    <div className="mt-20 flex flex-col items-center">
      {/* title of page  */}
      <div className="mb-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-center">Get trending posts</h1>
        <p className="text-center mt-4">
          Watch any TikTok video anonymously by entering the username of a
          TikTok account to access all videos from your favorite creator.
        </p>
      </div>

      <button
        className="bg-pink-500 hover:bg-pink-600 text-white 
      font-semibold text-sm 
      rounded-md transition py-3 px-5"
        onClick={fetchData}
      >
        Show trending posts
      </button>

      {loading && (
        <div className="mt-5 text-center text-blue-500 font-medium text-lg">
          Loading data, please wait...
        </div>
      )}

      {error && (
        <div className="mt-5 text-center text-red-500 font-medium text-lg">
          {error}
        </div>
      )}

      <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-6 p-5">
        {resData?.data?.itemList?.map((data, index) => {
          const videoPlay = data?.video?.bitrateInfo?.[0]?.PlayAddr?.UrlList[2];
          const proxyVideoUrl = formatVideoUrl(videoPlay);

          return (
            <div
              key={index}
              className="p-4 rounded-lg shadow-md border border-gray-200 bg-white flex flex-col"
            >
              <div className="flex items-center gap-4">
                <img
                  src={data?.author?.avatarLarger || "/assets/logo.webp"}
                  alt={`${data?.author?.uniqueId || "User"}'s avatar`}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base sm:text-lg font-semibold">
                      @{data?.author?.uniqueId || "Unknown"}
                    </p>
                    <p className="text-xs">
                      {data?.author?.verified ? (
                        <Image
                          src="/assets/checklist.webp"
                          alt="Verified"
                          width={16}
                          height={16}
                          className="inline-block"
                        />
                      ) : (
                        <Image
                          src="/assets/remove.webp"
                          alt="Not Verified"
                          width={16}
                          height={16}
                          className="inline-block"
                        />
                      )}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {data?.author?.signature || "No bio available"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-700 font-medium text-sm sm:text-base">
                  {data?.desc || "No Description"}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
                <p>Likes: {data?.stats?.diggCount || 0}</p>
                <p>Views: {data?.stats?.playCount || 0}</p>
                <p>Comments: {data?.stats?.commentCount || 0}</p>
                <p>Shares: {data?.stats?.shareCount || 0}</p>
                <p>Saves: {data?.stats?.collectCount || 0}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {data?.textExtra?.map((hashtag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-500 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    #{hashtag?.hashtagName}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                {proxyVideoUrl ? (
                  <div>
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      controls
                      onPlay={() => handlePlayVideo(index)}
                      className="rounded-md w-full h-48 sm:h-60 lg:h-64 object-cover bg-black"
                    >
                      <source src={proxyVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <a
                      href={proxyVideoUrl}
                      download={`${data.desc.substring(0, 20)}-anoview.com.mp4`}
                      onClick={(e) => {
                        setBtnIndex(index); // Set the current button index
                        setLoadingBtn(true); // Show loading indicator
                      }}
                      onMouseUp={() =>
                        setTimeout(() => setLoadingBtn(false), 3000)
                      }
                      className={`mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 ${
                        loadingBtn && btnIndex === index
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-pink-500 hover:bg-pink-600"
                      } text-white font-semibold text-sm rounded-md transition`}
                      disabled={loadingBtn && btnIndex === index}
                    >
                      <Image
                        src="/assets/cloud-download.webp"
                        alt="Download"
                        width={20}
                        height={20}
                      />
                      {btnIndex === index && loadingBtn
                        ? "Downloading..."
                        : "Download Now"}
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Video not available for download.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {resData?.data?.hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-7 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loadingMore ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}

      {/* Related topic*/}
      <div className="text-center mb-8">
        <h3 className="mb-4 text-lg font-semibold">Related TikTok Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card */}
          <a href="/anonymous-tiktok-viewer">
            <div className="flex items-center p-4 border border-red-300 shadow-sm rounded-md bg-white cursor-pointer hover:shadow-md transition-shadow duration-300">
              <div className="flex-shrink-0 mr-4">
                <img
                  src="/assets/eye-regular.svg"
                  alt="Anonymous Tiktok Viewer"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-medium text-sm">Anonymous Tiktok Viewer</p>
                <img
                  src="/assets/r-arrow.png"
                  alt="click here"
                  width={20}
                  height={20}
                  className="ml-4"
                />
              </div>
            </div>
          </a>

          <a href="/tiktok-video-downloader">
            <div className="flex items-center p-4 border border-red-300 shadow-sm rounded-md bg-white cursor-pointer hover:shadow-md transition-shadow duration-300">
              <div className="flex-shrink-0 mr-4">
                <img
                  src="/assets/circle-down-regular.svg"
                  alt="tiktok video downloader"
                  width={22}
                  height={22}
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-medium text-sm">TikTok Video Downloader</p>
                <img
                  src="/assets/r-arrow.png"
                  alt="click here"
                  width={20}
                  height={20}
                  className="ml-4"
                />
              </div>
            </div>
          </a>

          <a href="/trending-posts">
            <div className="flex items-center p-4 border border-red-300 shadow-sm rounded-md bg-white cursor-pointer hover:shadow-md transition-shadow duration-300">
              <div className="flex-shrink-0 mr-4">
                <img
                  src="/assets/hashtag-solid.svg"
                  alt="trending post"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-medium text-sm">Trending Posts</p>
                <img
                  src="/assets/r-arrow.png"
                  alt="click here"
                  width={20}
                  height={20}
                  className="ml-4"
                />
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
