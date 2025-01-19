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

export default function Home() {
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [inputData, setInputData] = useState(""); // Store username input
  const [searchResults, setSearchResults] = useState(null); // Store the fetched results
  const [errorMessage, setErrorMessage] = useState(""); // Store error message

  const fetchData = async () => {
    if (!inputData) return; // Avoid empty searches

    setLoading(true); // Start loading spinner
    setErrorMessage(""); // Clear previous error

    const category = "general";
    try {
      const requestSearch = await fetch(
        `/api/search?category=${category}&query=${inputData}`
      );

      if (!requestSearch.ok) {
        const errorText = await requestSearch.text();
        setErrorMessage(`Error: ${errorText}`);
        return;
      }

      const data = await requestSearch.json();
      setSearchResults(data); // Update the search results state
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred while fetching data.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Trigger fetchData when Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  console.log(searchResults);

  return (
    <div className="mt-20 flex flex-col items-center">
      {/* title of page  */}
      <div className="mb-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-center">Search Function</h1>
        <p className="text-center mt-4">
          Watch any TikTok video anonymously by entering the username of a
          TikTok account to access all videos from your favorite creator.
        </p>
      </div>

      {/* Input System */}
      <Input
        placeholder="Search"
        keypress={handleKeyDown} // Pass keydown handler
        loading={loading} // Pass loading state
        submit={fetchData} // Pass function to fetch data
        onInputChange={setInputData} // Capture input data in parent
      />

      {/* Loading and Error States */}
      {loading && <p className="text-gray-500 mt-2">Loading...</p>}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      <div className="mt-2 mb-8">
        <p className="text-sm">
          <i>
            Give it a try: <span className="text-pink-500">@mrbeast</span>,{" "}
            <span className="text-pink-500">@khaby.lame</span>
          </i>
        </p>
      </div>

      {/* Display Results */}
      {searchResults && (
        <div className="mt-8">
          {/* Render search results here */}
          <pre>{JSON.stringify(searchResults, null, 2)}</pre>
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
}
