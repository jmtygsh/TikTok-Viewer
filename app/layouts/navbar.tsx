"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="dark:bg-black border-b-[1px]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image src="/assets/logo.webp" alt="Anoview logo" width={30} height={10}/>
          <span className="self-center text-2xl font-semibold whitespace-nowrap @dark:text-white text-black">
            Anoview
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-dropdown"
        >
          <ul
            className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg
  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 
  dark:bg-black md:dark:bg-black dark:border-gray-700 dark:text-white bg-white md:bg-transparent text-black"
          >
            {/* Tiktok Trends */}
            <li className="mb-4 md:mb-0 lg:mb-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="cursor-pointer hover:text-red-400 flex gap-2">
                    <Image
                      src="/assets/hastag.webp"
                      alt="Tiktok trends"
                      width={20}
                      height={10}
                    />
                    Tiktok trends
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="p-2 px-4">
                  <DropdownMenuItem asChild>
                    <Link href="/trending-posts" className="my-2">
                      <span className="flex items-center gap-2">
                        <Image
                          src="/assets/hot-deal.webp"
                          alt="trending posts"
                          className="w-5 h-5"
                          width={100}
                          height={100}
                        />
                        Trending Posts
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/trending-videos" className="my-2">
                      <span className="flex items-center gap-2">
                        <Image
                          src="/assets/video.png"
                          alt="Trending Videos"
                          className="w-5 h-5"
                          width={100}
                          height={100}
                        />
                        Trending Videos
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/trending-songs" className="my-2">
                      <span className="flex items-center gap-2">
                        <Image
                          src="/assets/music.webp"
                          alt="Trending Songs"
                          className="w-5 h-5"
                          width={100}
                          height={100}
                        />
                        Trending Songs
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/trending-hashtags" className="my-2">
                      <span className="flex items-center gap-2">
                        <Image
                          src="/assets/hastag.webp"
                          alt="Trending Hashtags"
                          className="w-5 h-5"
                          width={100}
                          height={100}
                        />
                        Trending Hashtags
                      </span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            {/* Tiktok Tools */}
            <li className="mb-4 md:mb-0 lg:mb-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="cursor-pointer hover:text-red-400 flex gap-2">
                    <Image
                      src="/assets/hot-deal.webp"
                      alt="Tiktok tools"
                      width={20}
                      height={10}
                    />
                    Tiktok tools
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="p-2 px-4">
                  <DropdownMenuItem asChild>
                    <Link href="/anonymous-tiktok-viewer" className="my-2">
                      <span className="flex items-center gap-2">
                        <Image
                          src="/assets/tik-tok.webp"
                          alt="Anonymous TikTok Viewer"
                          className="w-5 h-5"
                          width={100}
                          height={100}
                        />
                        Anonymous TikTok Viewer
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tiktok-video-downloader" className="my-2">
                      <span className="flex items-center gap-2">
                        <Image
                          src="/assets/tik-tok.webp"
                          alt="TikTok Video Downloader"
                          className="w-5 h-5"
                          width={100}
                          height={100}
                        />
                        TikTok Video Downloader
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link href="/tiktok-mp3-downloader" className="my-2">
                      <span className="flex items-center gap-2">
                        <Image
                          src="/assets/tik-tok.webp"
                          alt="TikTok Mp3/Audio Downloader"
                          className="w-5 h-5"
                          width={100}
                          height={100}
                        />
                        TikTok Mp3/Audio Downloader
                      </span>
                    </Link>
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
