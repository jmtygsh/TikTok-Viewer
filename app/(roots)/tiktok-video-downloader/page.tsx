"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/app/constant/input";

const Page = () => {
  const [inputData, setInputData] = useState("");
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [data, setData] = useState<any>(null); // Store fetched data
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(""); // Store generated download URL
  const [fileName, setFileName] = useState(""); // Store the filename

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  // Fetch video data from API
  const fetchData = async () => {
    if (!inputData) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/videodownload?videourl=${inputData}`);
      const result = await response.json();

      // Handle the video download URL and generate the blob URL
      const videoUrl = result.data.itemInfo.itemStruct.video.downloadAddr;
      handleVideoDownload(videoUrl);

      console.log(result);

      setData(result.data.itemInfo.itemStruct); // Save the TikTok item data
    } catch (error) {
      console.log("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle video download and create blob URL
  const handleVideoDownload = async (videoUrl: string) => {
    console.log(videoUrl);
    if (!videoUrl) return;

    try {
      // Fetch video as a Blob
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      // Extract filename from URL or provide default name
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "tiktok-video.mp4"; // Default filename

      // Extract title part from filename (if available)
      const titleStart = filename.indexOf("-") + 1;
      const title = filename.slice(titleStart);
      if (title) {
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, "_");
        const customFilename = `anoview.com-${sanitizedTitle.slice(0, 10)}.mp4`;
        setFileName(customFilename);
      } else {
        setFileName(filename); // Fallback to default filename
      }

      // Set the download URL
      setDownloadUrl(downloadUrl);
    } catch (error) {
      console.error("Error processing video download:", error);
    }
  };

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="mb-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-center">
          TikTok Video Downloader
        </h1>
        <p className="text-center mt-4">
          Download any public videos anonymously with ease using our TikTok
          video downloader.
        </p>
      </div>

      {/* Input System */}
      <Input
        placeholder="Enter video link"
        keypress={handleKeyDown} // Pass keydown handler
        loading={loading} // Pass loading state
        submit={fetchData} // Pass function to fetch data
        onInputChange={setInputData} // Capture input data in parent
      />
      <div className="mt-2 mb-8">
        <p className="text-sm">
          <i className="hidden md:flex">
            Give it a try:
            <span className="text-pink-500">
              https://www.tiktok.com/@catgivry/video/7225557882765348139
            </span>
          </i>
        </p>
      </div>

      {/* show error  */}
      <p className="text-sm mb-8">
        <i className="text-red-500">{error}</i>
      </p>

      {loading ? (
        // Show a loading spinner or placeholder
        <div className="flex justify-center mb-8">
          <p className="text-red-500">Loading...</p>
        </div>
      ) : (
        // Show content when not loading
        data && (
          <div className="w-full max-w-2xl rounded-lg p-6">
            <div className="flex justify-center items-center mb-4">
              <img
                src={data.author.avatarThumb}
                alt="Author Avatar"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="ml-4">
                <p className="font-semibold">{data.author.nickname}</p>
                <p className="text-gray-500">@{data.author.uniqueId}</p>
              </div>
            </div>

            <div className="w-full md:w-[90%] m-auto">
              <p>{data.video.downloadAddr}</p>
              <div className="rounded-md p-4">
                {data.video.downloadAddr ? (
                  <div>
                    <video
                      controls
                      className="w-[25rem] m-auto rounded-md"
                      preload="metadata"
                      playsInline
                    >
                      <source src={data.video.downloadAddr} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <p className="text-red-500 text-center">No video available</p>
                )}

                <div className="text-gray-700 flex mt-12 flex-wrap gap-4 justify-center">
                  <p>
                    <span className="font-bold">Views:</span>
                    {data.stats.playCount.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">Likes:</span>
                    {data.stats.diggCount.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">Comments:</span>
                    {data.stats.commentCount.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">Shares:</span>
                    {data.stats.shareCount.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">Saves:</span>
                    {data.stats.collectCount.toLocaleString()}
                  </p>
                </div>

                <div className="mt-8 flex justify-center">
                  {data.video.downloadAddr ? (
                    <a
                      className="bg-pink-600 w-full text-white 
                    px-3 py-2 rounded-md outline-none text-center
                     flex justify-center gap-2 items-center"
                      href={downloadUrl}
                      download={fileName}
                    >
                      <Image
                        src="/assets/cloud-download.webp"
                        alt="download now"
                        width={20}
                        height={10}
                      />
                      Download Now
                    </a>
                  ) : (
                    <a
                      className="bg-red-600 w-full text-white 
                  px-3 py-2 rounded-md outline-none text-center
                   flex justify-center gap-2 items-center"
                    >
                      <Image
                        src="/assets/logo.webp"
                        alt="download now"
                        width={20}
                        height={10}
                      />
                      Not Available
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* related topic*/}
      <div className="text-center mb-8">
        <h3 className="mb-4 text-lg font-semibold">Related TikTok Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card */}
          <a href="/anonymous-tiktok-viewer">
            <div className="flex items-center p-4 border border-red-300 shadow-sm rounded-md bg-white cursor-pointer hover:shadow-md transition-shadow duration-300">
              <div className="flex-shrink-0 mr-4">
                <img
                  src="assets/video.png"
                  alt="demo"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-medium text-sm">Anonymous TikTok Viewer</p>
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

