"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  // const [showFooter, setShowFooter] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY || document.documentElement.scrollTop;
  //     const windowHeight = window.innerHeight;
  //     const docHeight = document.documentElement.scrollHeight;

  //     const atBottom = scrollTop + windowHeight >= docHeight - 50;
  //     setShowFooter(atBottom);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   window.addEventListener("resize", handleScroll);
  //   handleScroll(); // initial check

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //     window.removeEventListener("resize", handleScroll);
  //   };
  // }, []);

  return (
    <footer
      className={`w-full   bg-gray-100 py-4 text-center text-sm text-gray-600 shadow-md transition-transform duration-300 pointer-events-none 
       }`}
    >
      <p className="mb-0">
        &copy; {new Date().getFullYear()} TrackScop. All rights reserved.{" "}
        <Link href="/term-and-conditions" className="text-blue-600 underline">
          Terms & Conditions
        </Link>{" "}
        |{" "}
        <Link href="/privacy-policy" className="text-blue-600 underline">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
}
