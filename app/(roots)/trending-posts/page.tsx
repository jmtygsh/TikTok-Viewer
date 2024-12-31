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

      {/* related topic*/}
      <div className="text-center my-8">
        <h3 className="mb-4 text-lg font-semibold">Related TikTok Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card */}
          <a href="/tiktok-video-downloader">
            <div className="flex items-center p-4 border border-red-300 shadow-sm rounded-md bg-white cursor-pointer hover:shadow-md transition-shadow duration-300">
              <div className="flex-shrink-0 mr-4">
                <img
                  src="assets/download-red.png"
                  alt="demo"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-medium text-sm">TikTok Video Downloader</p>
                <img
                  src="assets/r-arrow.png"
                  alt="click here"
                  width={20}
                  height={20}
                  className="ml-4"
                />
              </div>
            </div>
          </a>

          {/* Card */}
          <a href="#download">
            <div className="flex items-center p-4 border border-red-300 shadow-sm rounded-md bg-white cursor-pointer hover:shadow-md transition-shadow duration-300">
              <div className="flex-shrink-0 mr-4">
                <img
                  src="assets/cloud-download.webp"
                  alt="demo"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-medium text-sm">TikTok Video Downloader</p>
                <img
                  src="assets/r-arrow.png"
                  alt="click here"
                  width={20}
                  height={20}
                  className="ml-4"
                />
              </div>
            </div>
          </a>

          {/* Card */}
          <a href="#downlad">
            <div className="flex items-center p-4 border border-red-300 shadow-sm rounded-md bg-white cursor-pointer hover:shadow-md transition-shadow duration-300">
              <div className="flex-shrink-0 mr-4">
                <img
                  src="assets/cloud-download.webp"
                  alt="demo"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-medium text-sm">TikTok Video Downloader</p>
                <img
                  src="assets/r-arrow.png"
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

      {/* peragraphs  */}
      <div className="mx-auto mt-20 p-6 bg-black text-white">
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            How to use Anonymous TikTok Viewer
          </h2>
          <ol className="list-decimal ml-8 leading-relaxed space-y-3">
            <li>
              <strong className="font-semibold"></strong> Enter your favorite
              creator's username (not url) in the input box and press{" "}
              <strong className="font-semibold">Enter</strong>.
            </li>
            <li>
              <strong className="font-semibold"></strong> Wait for the data to
              load. Once ready, you’ll see video details like{" "}
              <strong className="font-semibold">likes</strong>,{" "}
              <strong className="font-semibold">views</strong>, and more. You
              can also download videos directly.
            </li>
            <li>
              <strong className="font-semibold"></strong> Each page initially
              loads 10 videos To view more, click the
              <strong className="font-semibold">"Load More"</strong> button. If
              you want to download videos using URLs, visit our
              <a
                href="/tiktok-video-downloader"
                className="text-blue-500 hover:text-blue-700 font-medium ml-1 underline"
              >
                TikTok Video Downloader
              </a>
              .
            </li>
          </ol>
        </div>
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fully Anonymous */}
            <div className="flex items-center gap-4">
              <img
                src="assets/anonymous.png"
                alt="Fully Anonymous"
                className="w-8 h-8 filter invert"
              />

              <div>
                <h3 className="text-lg font-semibold mb-2">Fully Anonymous</h3>
                <p>
                  Your browsing history, profile views, and downloads are{" "}
                  <strong>not saved</strong>.
                </p>
              </div>
            </div>

            {/* No Watermark */}
            <div className="flex items-center gap-4">
              <img
                src="assets/watermark-download.png"
                alt="No Watermark"
                className="w-8 h-8 filter invert"
              />
              <div>
                <h3 className="text-lg font-semibold mb-2">No Watermark</h3>
                <p>
                  Download videos directly from TikTok without the annoying
                  watermark.
                </p>
              </div>
            </div>

            {/* No Registration */}
            <div className="flex items-center gap-4">
              <img
                src="assets/no-registration.png"
                alt="No Registration"
                className="w-8 h-8 filter invert"
              />
              <div>
                <h3 className="text-lg font-semibold mb-2">No Registration</h3>
                <p>
                  No need to create an account, log in, or install any apps.
                  It’s completely hassle-free.
                </p>
              </div>
            </div>

            {/* HD Quality */}
            <div className="flex items-center gap-4">
              <img
                src="assets/hd-quality.png"
                alt="HD Quality"
                className="w-8 h-8 filter invert"
              />
              <div>
                <h3 className="text-lg font-semibold mb-2">HD Quality</h3>
                <p>
                  Enjoy videos in their original full resolution, viewable and
                  savable on any device.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full bg-white text-black p-10 rounded-md"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">
              1.Can I use the tool to view private TikTok accounts?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              No, our tool only allows viewing of publicly available TikTok
              videos and data. We respect user privacy and do not bypass
              TikTok's security settings.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base">
              2.Will anyone know that I’ve viewed or downloaded their TikTok
              video?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              Absolutely not. This tool ensures complete anonymity. Your
              activity is not logged, and there’s no trace left for the TikTok
              user.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base">
              3.Why do I need to load more posts manually?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              To optimize performance and load times, we display 10 videos per
              page by default. The "Load More" button lets you control how much
              content you want to explore at any time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-base">
              4.Can I use this tool on mobile devices?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              Yes, the tool is fully responsive and works seamlessly on mobile
              devices, tablets, and desktops. Whether you're on the go or at
              home, you can access it effortlessly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-base">
              5.What formats are available for downloaded videos?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              Videos are downloaded in their original format (usually MP4) with
              the highest resolution available, ensuring quality preservation.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-base">
              6.Is there a limit to how many videos I can view or download?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              There are no limits! You can view and download as many TikTok
              videos as you like, completely free.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-base">
              7.Does this tool work for TikTok videos from all regions?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              Yes, you can use this tool to view and download TikTok videos from
              any region, as long as they are publicly available.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-base">
              8.Does the tool store any of my personal data?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              No, we don’t collect or store any of your data. The tool operates
              without requiring login or registration, ensuring your complete
              privacy.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger className="text-base">
              9.Why is this tool free to use?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              We believe in providing value without barriers. The tool is
              supported through other means, ensuring it remains free for all
              users.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-10">
            <AccordionTrigger className="text-base">
              10.Is it legal to download TikTok videos anonymously?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              Downloading TikTok videos for personal use is generally
              acceptable. However, ensure you don’t violate TikTok’s terms of
              service or misuse the content without the creator’s permission.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Page;
