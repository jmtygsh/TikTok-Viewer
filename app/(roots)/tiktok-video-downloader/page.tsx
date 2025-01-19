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

      {/* peragraphs  */}
      <div className="mx-auto mt-20 p-6 bg-white text-black w-full">
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            How to Download TikTok Video
          </h2>
          <ol className="list-decimal ml-8 leading-relaxed space-y-3">
            <li>
              <strong>Locate the TikTok Video:</strong> Open the TikTok app or
              visit the TikTok website to find the video you want to download.
              Make sure it’s the exact video you wish to save, and ensure it’s
              publicly accessible.
            </li>
            <li>
              <strong>Copy the Video Link:</strong> Once you've selected the
              video, tap the <em>"Share"</em> button. This button is represented
              by an arrow icon located at the bottom right or near the top of
              the video. From the sharing options, select <em>"Copy Link."</em>{" "}
              This will copy the unique URL of the video to your clipboard.
            </li>
            <li>
              <strong>Go to the TikTok Video Downloader:</strong> Open your
              browser and visit <em>anoview.com</em>. Once on the site, navigate
              to the TikTok video downloader tool.
            </li>
            <li>
              <strong>Paste the Link:</strong> In the input field provided on
              the downloader page, paste the link you copied earlier. You can do
              this by right-clicking (on desktop) and selecting <em>"Paste"</em>{" "}
              or tapping and holding (on mobile) to bring up the paste option.
            </li>
            <li>
              <strong>Start the Download Process:</strong> After pasting the
              link, press the <em>"Enter"</em> key or click the download button
              on the site. The downloader will process the link and fetch the
              video for download.
            </li>
            <li>
              <strong>Choose Your Download Option:</strong> Once the video is
              fetched, you’ll see download options, which may include
              downloading with or without a watermark. Select your preferred
              option and click the download button to save the video.
            </li>
            <li>
              <strong>Access Your Downloaded Video:</strong> After the download
              is complete, the video will be saved to your device. By default,
              it’s usually located in your browser’s <em>"Downloads"</em> folder
              unless you’ve specified a different destination. You can now enjoy
              or share your saved TikTok video anytime!
            </li>
          </ol>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full bg-[#FFF5F5] text-black p-10 rounded-md shadow-sm border"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">
              1. Is there a limit on downloading TikTok videos?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              There is currently no limit on downloading videos; you can
              download them without a watermark. However, some videos still do
              have watermarks. In the future, the goal is to transition to an
              entirely watermark-free experience.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base">
              2. Where are my video files saved after I download them?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              When you download a TikTok video, it typically saves in the
              Downloads folder. To change this, you can adjust your browser
              settings to manually choose the destination folder for your files.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base">
              3. How do I download TikTok videos on my phone?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              TikTok videos can be downloaded using your browser. Simply copy
              the video link from the TikTok app, paste it into the downloader,
              and follow the instructions. Ensure your browser allows downloads
              to proceed smoothly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-base">
              4. Can I download TikTok videos without an account?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              Yes, you don’t need a TikTok account to download videos. Simply
              paste the video link into the downloader and proceed with the
              download.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-base">
              5. Do downloaded TikTok videos retain their original quality?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              Yes, videos are downloaded in the best quality available based on
              the source video. However, downloading without a watermark might
              slightly alter the resolution in rare cases.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-base">
              6. Is downloading TikTok videos safe?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              Downloading videos from our platform is safe and secure. We
              prioritize your privacy and ensure the process is free from
              malware or unnecessary ads.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-base">
              7. Are TikTok video downloads free?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              Yes, downloading TikTok videos using our platform is completely
              free.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-base">
              8. Can I download private TikTok videos?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              Unfortunately, private TikTok videos cannot be downloaded as they
              are restricted by the uploader's privacy settings.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger className="text-base">
              9. Why do some videos still have watermarks?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              While our system removes most watermarks, there may be some cases
              where it cannot completely remove them due to video complexity or
              recent TikTok updates.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-10">
            <AccordionTrigger className="text-base">
              10. Does this work on all devices and browsers?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              Yes, our downloader is compatible with most devices and popular
              browsers, including Chrome, Firefox, Safari, and Edge.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Page;
