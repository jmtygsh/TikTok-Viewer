"use client";

import { useState } from "react";
import Link from "next/link";
import { navLists } from "@/app/constant/data";
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
    <nav className="dark:bg-black bg-red-50 border-b-2">
      <div className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="assets/logo.webp"
            className="h-8"
            alt="Anoview logo"
          />
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
            {navLists.map((nav) => {
              return (
                <li key={nav.id} className="mb-4 md:mb-0 lg:mb-0">
                  {nav.a ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="cursor-pointer hover:text-red-400 flex gap-2">
                         
                          <Image src={nav.nameImage} alt="nav.name" width={20} height={10}/>
                          {nav.name}
                        </span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="p-2 px-4">
                        {["a", "b", "c", "d"].map((key) => {
                          const item = nav[key];
                          if (item) {
                            return (
                              <DropdownMenuItem asChild key={key}>
                                <Link href={item.url} className="my-2">
                                  <span className="flex items-center gap-2">
                                    {/* Check if item.icon is an image or emoji */}
                                    {typeof item.icon === "string" &&
                                    item.icon.startsWith("/") ? (
                                      <img
                                        src={item.icon}
                                        alt={item.label}
                                        className="w-5 h-5"
                                      />
                                    ) : (
                                      <span>{item.icon}</span> // Render emoji or text icon
                                    )}
                                    {item.label}
                                  </span>
                                </Link>
                              </DropdownMenuItem>
                            );
                          }
                          return null;
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href="/" className="cursor-pointer">
                      Home
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
