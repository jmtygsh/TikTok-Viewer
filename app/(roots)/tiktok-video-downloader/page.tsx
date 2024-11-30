"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
const page = () => {
  const [inputData, setInputData] = useState(""); // Store username input
  const [loading, setLoading] = useState(false); // State for loading spinner

  // Correctly typing the event object
  const filterUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if(!value) {
        return "empty";
    }

    let searchHttpsUrl = value.search("https://www.tiktok.com");

    if(!searchHttpsUrl) {
        return "Not a valid url"
    } else {
        setInputData(value);
    }


  };

  // Trigger fetchData when Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchData();
      console.log("enter");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/download?videourl=${inputData}`);
      const data = await response.json();
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="my-20 flex flex-col items-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Tiktok Video Downloader Without Watermark
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Download any public videos anonymously with ease using our tiktok
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
            placeholder="paste video link"
            className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-800"
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
      </div>
    </>
  );
};

export default page;

// https://www.tiktok.com/@kinziebinzz/video/7420545151229136174?is_from_webapp=1&sender_device=pc
