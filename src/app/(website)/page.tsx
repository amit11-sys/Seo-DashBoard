"use client";
import Header from "@/components/Common/Header";
import LiveKeywordTracking from "@/components/LiveKeywordTracking";
import { useState } from "react";
type Props = {};

export default function Home({
  children,
}: Props & { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <>
      <div className="w-screen relative">
        <LiveKeywordTracking />
      </div>
    </>
  );
}
