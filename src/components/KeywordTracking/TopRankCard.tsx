"use client";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { usePathname } from "next/navigation";

function getRandomDarkColor(): string {
  const randomChannel = () => Math.floor(Math.random() * 150 + 60);
  const r = randomChannel();
  const g = randomChannel();
  const b = randomChannel();
  return `rgb(${r}, ${g}, ${b})`;
}

interface Stat {
  title: string;
  data: number;
  id: number;
}

interface CustomTrackingCardProps {
  title: string;
  data: Stat[];
  totalKeywords?: number;
  className?: string;
}

const TopRankCard = ({
  title,
  data,
  totalKeywords,
  ...prop
}: CustomTrackingCardProps) => {
  const pathname = usePathname();
  const [textColor, setTextColor] = useState<string>("");
const [colors, setColors] = useState<string[]>([]);
useEffect(() => {
  if (data?.length) {
    setColors(data.map(() => getRandomDarkColor()));
  }
}, [data]);

  return (
    <div
      className={`cursor-pointer border-none  flex-1 flex flex-col p-4  transition-all ease-linear duration-75 ${prop.className}`}
    >
      {/* <h2 className="text-lg font-bold text-gray-700 mb-3 text-center">
        {title}
      </h2> */}

    <div className="flex border-none  bg-transparent py-3 justify-evenly gap-3 w-full overflow-x-auto">
  {Array.isArray(data) &&
    data?.length > 0 &&
    data.map((item, index) => (
      <div
        key={item.id}
        className=" aspect-square w-40 hover:scale-[1.04]  transition-all ease-linear duration-75    flex-shrink-0 flex flex-col justify-center items-center p-2  rounded-xl shadow-lg"
      >
        <h1
          style={{ color: colors[index] }}
          className="font-extrabold text-2xl text-center"
        >
          <CountUp duration={2} end={item.data} />{" "}
          {item.title === "Keywords Up" ? null : (
            <>
              {pathname !== "/dashboard" && <span className="text-sm">/</span>}{" "}
              {totalKeywords}
            </>
          )}
        </h1>
        <p className="text-sm text-gray-600 mt-1 text-center">{item.title}</p>
      </div>
    ))}
</div>

    </div>
  );
};

export default TopRankCard;
