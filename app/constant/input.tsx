"use client";

import Image from "next/image";
import { useState } from "react";

export const Input = ({
  placeholder,
  keypress,
  loading,
  submit,
  onInputChange, // Add callback prop
}) => {
  const [inputData, setInputData] = useState("");

  // Notify parent when input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputData(value);
    onInputChange(value); // Notify the parent
  };

  return (
    <div className="relative flex items-center w-11/12 max-w-2xl">
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
        placeholder={placeholder}
        className="w-full pl-16 pr-[90px] py-3 border border-red-300 rounded-lg focus:outline-none text-gray-800"
        onChange={handleInputChange} // Call custom handler
        onKeyDown={keypress} // Pass keydown event
      />
      <button
        onClick={submit}
        disabled={!inputData || loading} // Disable button if input is empty or loading
        className={`absolute right-3 px-6 py-2 rounded-lg text-white font-semibold ${
          inputData && !loading
            ? "bg-blue-200 hover:bg-blue-300"
            : "bg-gray-100"
        }`}
      >
        {loading ? (
          <div className="w-5 h-5 border-4 border-t-4 border-black border-solid rounded-full animate-spin">
           i
          </div>
        ) : (
          <Image
            src="/assets/search.webp"
            alt="Search Logo"
            width={20}
            height={20}
          />
        )}
      </button>
    </div>
  );
};
