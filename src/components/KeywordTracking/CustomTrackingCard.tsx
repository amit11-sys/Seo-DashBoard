"use client";
import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';

import { usePathname } from "next/navigation";

function getRandomDarkGradient(): string {
  const randomChannel = () => Math.floor(Math.random() * 60); // 0–150 for dark tones
  const r1 = randomChannel();
  const g1 = randomChannel();
  const b1 = randomChannel();
  const r2 = randomChannel();
  const g2 = randomChannel();
  const b2 = randomChannel();
  return `linear-gradient(135deg, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}))`;
}
function getRandomDarkColor(): string {
  const randomChannel = () => Math.floor(Math.random() * 100 + 80); // now between 30–130
  const r = randomChannel();
  const g = randomChannel();
  const b = randomChannel();
  return `rgb(${r}, ${g}, ${b})`;
}


interface CustomTrackingCardProps {
 
    title: string;
    data:  any; 
      totalKeywords?: number;
     className?: string;
    
 
}

const CustomTrackingCard = ( {title, data, totalKeywords, ...prop}:CustomTrackingCardProps ) => {
    const pathname = usePathname();
   
  // console.log({data, title, prop},"data, title, prop");
  // const [bgGradient, setBgGradient] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');
  // console.log(textColor,"textColor");

 useEffect(() => {
  const color = getRandomDarkColor();
  if (color) setTextColor(color);
  else setTextColor("rgb(50, 50, 50)");
}, []);


  return (
    <div
      //  style={{ borderColor: textColor }}
      className={`cursor-pointer bg-white flex-1 shadow-xl rounded-3xl justify-center items-center flex flex-col hover:scale-[1.02] transition-all ease-linear duration-75 p-3 ${prop.className} `}
    >
      <div className="w-full flex justify-center items-end">
        <h1
      style={{ color: textColor }}
         className="text-center font-extrabold text-2xl">
          <CountUp duration={2} end={data} /> {pathname !== "/dashboard" && <span className="text-md">/</span>}  {totalKeywords}
        </h1>
      </div>
      <p className="flex text-black text-sm justify-center items-center mt-2">
        {title}
      </p>
    </div>
  );
};

export default CustomTrackingCard;
