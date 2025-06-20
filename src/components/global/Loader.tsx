"use client";

import { useLoader } from "@/hooks/useLoader";

const Loader = () => {
  const { loading } = useLoader();

  if (!loading) return null; // Don't render if not loading

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
