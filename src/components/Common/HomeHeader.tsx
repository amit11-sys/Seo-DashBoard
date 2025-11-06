"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { logoutUser } from "@/actions/user";
import { set } from "mongoose";
export default function HomeHeader() {
  // Simulate login state (replace with your actual auth logic)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("accessToken");
    setIsLoggedIn(!!token);
  }, []);
  console.log(isLoggedIn);

  // ✅ Handle login/logout actions
  const handleAuthClick = async () => {
    if (isLoggedIn) {
      console.log('in if');
      
      const logout=await logoutUser();
      if(logout){
        setIsLoggedIn(false);
      }
    } else {
      console.log('in else');
      
      router.push("/sign-in");
      //   setIsLoggedIn(true);
      // console.log("User logged in");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#273F4F] backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="flex items-center gap-3 px-6 py-3 rounded-full text-white text-2xl font-bold tracking-wide shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
          >
            <MdDashboard className="text-white text-4xl drop-shadow-sm" />
            <span className="flex items-center">
              Track
              <span className="text-orange-500 text-4xl font-extrabold px-1">
                S
              </span>
              cop
            </span>
            <FaMagnifyingGlassChart className="text-white text-3xl drop-shadow-sm" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {/* <Link href="#about" className="hover:text-blue-200 transition">
            About
          </Link>
          <Link href="#contact" className="hover:text-blue-200 transition">
            Contact
          </Link> */}
           {isLoggedIn && (
              <Link
                href="/dashboard"
                className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-full shadow hover:bg-blue-100 transition"
              >
                Dashboard
              </Link>
            )}
          <button
            onClick={handleAuthClick}
            className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-full shadow hover:bg-blue-100 transition"
          >
            {isLoggedIn ? "Log Out" : "Sign In"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue-900/95 backdrop-blur-md border-t border-blue-700">
          <div className="flex flex-col items-center space-y-4 py-6">
            {/* <Link
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-200"
            >
              About
            </Link>
            <Link
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-200"
            >
              Contact
            </Link> */}
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-full shadow hover:bg-blue-100 transition"
                onClick={() => setMenuOpen(false)}
              >
                Go to Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                handleAuthClick();
                setMenuOpen(false);
              }}
              className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-full shadow hover:bg-blue-100 transition"
            >
              {isLoggedIn ? "Log Out" : "Sign In"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
