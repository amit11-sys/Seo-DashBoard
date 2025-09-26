"use client";

import { useEffect, useState } from "react";

export default function Footer({ mainContainerId }: { mainContainerId: string }) {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const mainEl = document.getElementById(mainContainerId);
    if (!mainEl) return;

    const handleScroll = () => {
      const scrollTop = mainEl.scrollTop;
      const scrollHeight = mainEl.scrollHeight;
      const clientHeight = mainEl.clientHeight;

      // small tolerance for floating point / padding issues
      const atBottom = scrollTop + clientHeight >= scrollHeight - 5; 
      setShowFooter(atBottom);
    };

    // listen to scroll
    mainEl.addEventListener("scroll", handleScroll);

    // call once in case already at bottom
    handleScroll();

    return () => {
      mainEl.removeEventListener("scroll", handleScroll);
    };
  }, [mainContainerId]);

  if (!showFooter) return null;

  return (
    <footer className="w-full bg-[#273F4F] py-4 text-center text-sm text-white shadow-md transition-transform duration-300">
      <p className="mb-0">
        &copy; {new Date().getFullYear()} TrackScop. All rights reserved.{" "}
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/term-and-conditions`}
          target="_blank"
          className="text-white underline cursor-pointer"
        >
          Terms & Conditions
        </a>
        {" | "}
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`}
          target="_blank"
          className="text-white underline cursor-pointer"
        >
          Privacy Policy
        </a>
      </p>
    </footer>
  );
}
