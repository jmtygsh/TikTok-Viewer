"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Hashtag {
  hashtagName?: string;
}

interface Post {
  textExtra?: Hashtag[];
}

interface Stats {
  followerCount?: number;
  heart?: number;
  videoCount?: number;
  followingCount?: number;
}

interface User {
  avatarMedium?: string;
  uniqueId?: string;
  verified?: boolean;
  signature?: string;
  bioLink?: {
    link?: string;
  };
}

interface UserInfo {
  user?: User;
  stats?: Stats;
}

interface VideoDetail {
  videos: string;
  videoCover: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  musics: string;
  hashtags: number;
  hashtagsList: string[];
}

interface TikTokData {
  data?: {
    userInfo?: UserInfo;
    authorData?: {
      userInfo?: UserInfo;
      authorPostData?: {
        itemList?: Post[];
      };
    };
    authorPostData?: {
      itemList?: Post[];
    };
  };
}

const Page = () => {
  const [ttData, setTtData] = useState<TikTokData | null>(null);
  const [inputData, setInputData] = useState(""); // Store username input
  const [show, setShow] = useState(false); // State to control rendering of data
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Function to get or generate a unique client ID
  const getClientId = () => {
    let clientId = sessionStorage.getItem("client-id");
    if (!clientId) {
      clientId = Date.now().toString(); // Generate a unique ID
      sessionStorage.setItem("client-id", clientId);
    }
    return clientId;
  };

  const fetchData = async (cursor?: string, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const clientId = getClientId();
      if (!inputData && !isLoadMore) {
        console.warn("Username is empty.");
        return;
      }

      let username;
      if (!inputData) {
        username = sessionStorage.getItem("username");
      } else {
        username = inputData;
      }

      console.log(`username 1: ${username}`);
      console.log(`client ID 1: ${clientId}`);

      setLoading(true); // Start loading

      const baseEndPoint = process.env.NEXT_PUBLIC_BASE_URL;

      const response = await fetch(
        `${baseEndPoint}/api/view?client_id=${clientId}&username=${username}${
          cursor ? `&cursor=${cursor}` : ""
        }`
      );
      const data = await response.json();

      console.log(data);

      if (response.ok) {
        if (!isLoadMore) {
          setShow(true);
          sessionStorage.setItem("username", username);
          setTtData(data); // Initial data load
        } else {
          // Append new data for "Load More"
          setTtData((prevData) => {
            const existingItemList =
              prevData?.data?.authorPostData?.itemList || [];
            const newItemList = data?.data?.authorPostData?.itemList || [];
            return {
              ...prevData,
              data: {
                ...prevData?.data,
                authorPostData: {
                  ...prevData?.data?.authorPostData,
                  itemList: [...existingItemList, ...newItemList],
                },
              },
            };
          });
        }
        setNextCursor(data.data.nextCursor || null); // Update cursor
      } else {
        console.log("Failed to fetch data");
      }
    } catch (e) {
      console.log("Error fetching data:", e); // Log any errors
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Trigger fetchData when Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  useEffect(() => {
    const fetchDataFromSession = async () => {
      const clientId = sessionStorage.getItem("client-id");
      const username = sessionStorage.getItem("username");

      console.log(`username : ${username}`);
      console.log(`client ID : ${clientId}`);

      if (!clientId || !username) {
        setShow(false);
        return;
      }

      try {
        const baseEndPoint = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(
          `${baseEndPoint}/api/view?client_id=${clientId}&username=${username}`
        );
        const data = await response.json();
        setTtData(data);
        setShow(true);
        setNextCursor(data.data?.authorPostData?.cursor || null); // Initialize cursor from session data
      } catch (e) {
        console.log("Error fetching data from session:", e);
      }
    };

    fetchDataFromSession();
  }, []); // Empty dependency array to run only once when the component mounts

  const user = ttData?.data?.authorData?.userInfo?.user;
  const stats = ttData?.data?.authorData?.userInfo?.stats;

  // collecting hashtags
  const hashtags =
    ttData?.data?.authorPostData?.itemList?.flatMap(
      (post: Post) =>
        (post.textExtra || [])
          .filter((hashtag: Hashtag) => hashtag?.hashtagName) // Ensure `hashtagName` exists
          .map((hashtag: Hashtag) => hashtag.hashtagName.trim()) // Extract and trim `hashtagName`
          .filter((hashtagName: string) => hashtagName !== "") // Remove empty strings
    ) || [];

  const counts: Record<string, number> = {}; // Declare counts object with string keys and number values
  for (const item of hashtags) {
    counts[item] = (counts[item] || 0) + 1; // Increment count or initialize to 1
  }

  const videoDetails: VideoDetail[] =
    ttData?.data?.authorPostData?.itemList?.map((vDetail: any) => {
      // Ensure safe access to video play URL
      let videoPlay =
        vDetail?.video?.bitrateInfo?.[0]?.PlayAddr?.UrlList?.[2] || "";
      // If there is no valid URL, return empty video URL
      if (!videoPlay) {
        return {
          videos: "",
          videoCover: "",
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          saves: 0,
          musics: "",
          hashtags: 0,
          hashtagsList: [],
          engageRate: 0,
        };
      }

      // Extract query parameters from the URL, ensure URL is valid
      try {
        const urlParams = new URLSearchParams(videoPlay.split("?")[1]);

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

        // Construct video URL with query parameters
        const searchParams = new URLSearchParams({
          faid: faid || "",
          file_id: fileId || "",
          is_play_url: isPlayUrl || "",
          item_id: itemId || "",
          line: line || "",
          ply_type: plyType || "",
          signaturev3: signaturev3 || "",
          tk: tk || "",
          vidc: vidc || "",
          video_id: videoId || "",
        });

        // proxy video
        const videoUrl = `/api/video?${searchParams.toString()}`;

        // Extract video cover and stats, with safe access to avoid null values
        const videoCover = vDetail?.video?.dynamicCover || "";
        const videoView = vDetail?.stats?.playCount || 0;
        const videoLike = vDetail?.stats?.diggCount || 0;
        const videoComment = vDetail?.stats?.commentCount || 0;
        const videoShare = vDetail?.stats?.shareCount || 0;
        const videoSave = vDetail?.stats?.collectCount || 0;

        // Calculate total engagements and engagement rate, handling division by zero
        const totalEngagements =
          videoLike + videoComment + videoShare + videoSave;
        const engagementRate =
          videoView > 0 ? (totalEngagements / videoView) * 100 : 0;

        // Extract music URL, ensuring safety
        const videoMusic = vDetail?.music?.playUrl || "";

        // Handle text extra hashtags safely
        const videoHashtagsCount = vDetail?.textExtra?.length || 0;
        const videoHashtags = (vDetail?.textExtra || [])
          .filter((hashtag: any) => hashtag?.hashtagName)
          .map((hashtag: any) => hashtag.hashtagName.trim())
          .filter((hashtagName: string) => hashtagName !== "");

        return {
          videos: videoUrl, // Use the proxied video URL
          videoCover: videoCover,
          views: videoView,
          likes: videoLike,
          comments: videoComment,
          shares: videoShare,
          saves: videoSave,
          musics: videoMusic,
          hashtags: videoHashtagsCount,
          hashtagsList: videoHashtags,
          engageRate: engagementRate,
        };
      } catch (error) {
        console.log("Error processing video details:", error);
        return {
          videos: "",
          videoCover: "",
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          saves: 0,
          musics: "",
          hashtags: 0,
          hashtagsList: [],
          engageRate: 0,
        };
      }
    }) || [];

  console.log(ttData);

  console.log(`nextCursor : ${nextCursor}`);

  return (
    <div className="mt-20 flex flex-col items-center">
      {/* title of page  */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Anonymous TikTok Viewer
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Watch any public videos anonymously with ease using our viewer.
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
        <span className="absolute left-12 text-gray-500 text-base">@</span>
        <input
          type="text"
          placeholder="Enter username"
          className="w-full pl-16 pr-[90px] py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-800"
          onChange={(e) => setInputData(e.target.value)}
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

      {/* User Info Display */}
      {show && ttData?.data?.authorData?.userInfo?.user && (
        <div className="text-center rounded-lg p-6 max-w-xl mx-auto mb-8">
          <div className="flex flex-col items-center">
            <img
              className="mt-4 rounded-full border-2 border-gray-300 shadow-sm"
              src={user?.avatarMedium || "/default-avatar.png"}
              alt="Avatar"
              width={80}
              height={80}
            />
            <div className="flex items-center justify-center mt-4">
              <h2 className="text-lg font-semibold text-gray-800 mr-2">
                @{user?.uniqueId || "Unknown User"}
              </h2>
              {user?.verified ? (
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
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-gray-700 text-sm">
              {user?.signature || "No signature available"}
            </p>
            <a
              href={user?.bioLink?.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-blue-500 text-sm hover:underline"
            >
              {user?.bioLink?.link || "No link found"}
            </a>
          </div>
        </div>
      )}

      {/* Stats Display */}
      {show && stats && (
        <div className="p-4 m-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-center text-sm text-gray-700 mb-8">
            <div>
              <p className="font-semibold text-gray-400 my-2 text-center">
                Total Followers
              </p>
              <p className="text-2xl font-extrabold mt-2">
                {stats.followerCount?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="md:border-l md:border-gray-300 md:pl-4">
              <p className="font-semibold text-gray-400 my-2 text-center">
                Total Likes
              </p>
              <p className="text-2xl font-extrabold mt-2">
                {stats.heart?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="md:border-l md:border-gray-300 md:pl-4">
              <p className="font-semibold text-gray-400 my-2 text-center">
                Total Videos
              </p>
              <p className="text-2xl font-extrabold mt-2">
                {stats.videoCount?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="md:border-l md:border-gray-300 md:pl-4">
              <p className="font-semibold text-gray-400 my-2 text-center">
                Following
              </p>
              <p className="text-2xl font-extrabold mt-2">
                {stats.followingCount?.toLocaleString() || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center mb-8">
            <div className="p-4 w-full md:w-[48%]">
              <h2 className="font-extrabold text-gray-700 mb-4 border-b-2">
                Hashtags
              </h2>
              <div className="flex flex-wrap gap-3 ">
                {hashtags.map((hashtag: string, index: number) => (
                  <p
                    key={index}
                    className="underline cursor-pointer text-gray-600"
                  >
                    #{hashtag}
                  </p>
                ))}
              </div>
            </div>
            <div className="p-4 w-full md:w-[48%]">
              <h2 className="font-extrabold text-gray-700 mb-4 border-b-2">
                Most Used Hashtags
              </h2>
              <div className="flex flex-wrap gap-3">
                {Object.entries(counts).map(([hashtag, count]) => (
                  <p
                    key={hashtag}
                    className="text-gray-600 bg-blue-100 hover:underline cursor-pointer"
                  >
                    <span>#{hashtag}</span>
                    <span>({count})</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2 w-full m-auto">
            {videoDetails.map((video, index) => (
              <div
                key={`video-${index}`}
                className="border rounded-md p-4 bg-white"
              >
                {video.videos ? (
                  <div key={video.videos}>
                    <video
                      controls
                      // poster={video.videoCover}
                      className="w-full rounded-md"
                      preload="metadata"
                      playsInline
                    >
                      <source src={video.videos} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    <div className="mt-4 flex justify-center">
                      <a
                        className="w-full bg-pink-400 
                        px-3 py-2 rounded-md outline-none text-center
                         flex justify-center gap-2 items-center"
                        href={video.videos}
                        download="video.mp4"
                      >
                        <Image
                          src="/assets/cloud-download.webp"
                          alt="download now"
                          width={20}
                          height={10}
                        />
                        Download Now
                      </a>
                    </div>

                    <div className="mt-2 flex justify-center text-gray-700 text-center bg-green-400 rounded-md p-2">
                      <p>Engagement Rate:</p>
                      <p>{video.engageRate.toFixed(2)}%</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-500 text-center mt-96">
                    Not available
                  </p>
                )}

                <div className="text-gray-700 flex mt-4 flex-wrap gap-4 justify-center">
                  <p>
                    <span className="font-bold">Views:</span>
                    {video.views.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">Likes:</span>
                    {video.likes.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">Comments:</span>
                    {video.comments.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">Shares:</span>
                    {video.shares.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">Saves:</span>
                    {video.saves.toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 text-gray-700">
                  <p className="text-center">
                    <span className="font-bold">Hashtag Count:</span>
                    {video.hashtags.toLocaleString()}
                  </p>
                  <div className="text-center mt-2">
                    <p className="font-bold">Hashtags:</p>
                    <div>
                      {video.hashtagsList.length > 0 ? (
                        video.hashtagsList.join(", ")
                      ) : (
                        <p className="text-red-500 text-center">None</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-8 flex justify-center">
            {nextCursor && (
              <button
                onClick={() => fetchData(nextCursor, true)}
                disabled={loadingMore}
                className="mt-10 bg-button-color text-center text-black bg-blue-400  py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {loadingMore ? "Loading more..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto mt-20 p-6 bg-white">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            How to use Anonymous TikTok Viewer
          </h2>
          <ol className="list-decimal ml-8 text-gray-700 leading-relaxed space-y-3">
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
                className="w-8 h-8"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Fully Anonymous
                </h3>
                <p className="text-gray-600">
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
                className="w-8 h-8"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Watermark
                </h3>
                <p className="text-gray-600">
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
                className="w-8 h-8"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Registration
                </h3>
                <p className="text-gray-600">
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
                className="w-8 h-8"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  HD Quality
                </h3>
                <p className="text-gray-600">
                  Enjoy videos in their original full resolution, viewable and
                  savable on any device.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full bg-green-300 p-10 rounded-md">
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


// 1732592309739