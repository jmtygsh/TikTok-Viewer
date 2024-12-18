"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const Page = () => {
  const [inputData, setInputData] = useState("");
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [data, setData] = useState<any>(null); // Store fetched data

  const [downloadUrl, setDownloadUrl] = useState(""); // Store generated download URL
  const [fileName, setFileName] = useState(""); // Store the filename

  // Handle input URL change
  const filterUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    // use for production
    // const value = e.target.value.trim();

    //use for development right now...on production remove
    const value =
      "https://www.tiktok.com/@satoyu727/video/7410086453222345992?is_from_webapp=1&sender_device=pc"; // Trim extra spaces

    setInputData(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  // Fetch video data from API
  const fetchData = async () => {
    if (!inputData) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/download?videourl=${inputData}`);
      const result = await response.json();

      // Handle the video download URL and generate the blob URL
      const videoUrl = result.data.itemInfo.itemStruct.video.downloadAddr;
      handleVideoDownload(videoUrl);

      console.log(result);

      setData(result.data.itemInfo.itemStruct); // Save the TikTok item data
    } catch (error) {
      console.error("Error fetching data:", error);
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
    <>
      <div className="my-20 flex flex-col items-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            TikTok Video Downloader
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Download any public videos anonymously with ease using our TikTok
            video downloader.
          </p>
        </div>

        {/* Input System */}
        <div className="relative flex items-center w-11/12 max-w-2xl mb-8">
          <div className="absolute left-3 flex items-center">
            <Image
              src="/assets/tik-tok.webp"
              alt="Anoview Search Logo"
              width={20}
              height={20}
            />
          </div>
          <span className="absolute left-9 text-gray-300">|</span>
          <span className="absolute left-12 text-gray-500 text-lg">@</span>
          <input
            type="text"
            placeholder="Enter username"
            className="w-full pl-16 pr-[90px] py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-800"
            onChange={filterUrl}
            onKeyDown={handleKeyDown} // Add event listener for the Enter key
          />
          <button
            onClick={fetchData}
            disabled={!inputData || loading} // Disable button while loading
            className={`absolute right-3 px-6 py-2 rounded-lg text-white font-semibold ${
              inputData && !loading
                ? "bg-blue-200 hover:bg-blue-300"
                : "bg-gray-100"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-4 border-black border-solid rounded-full animate-spin">
                i
              </div> // Loading spinner
            ) : (
              <Image
                src="/assets/search.webp"
                alt="Anoview Search Logo"
                width={20}
                height={20}
              />
            )}
          </button>
        </div>


        {/* Display Video Details */}
        {data && (
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
        )}
      </div>
    </>
  );
};

export default Page;
