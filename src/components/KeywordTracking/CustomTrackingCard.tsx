"use client"
import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';

function getRandomDarkGradient(): string {
  const randomChannel = () => Math.floor(Math.random() * 150); // 0–100 for dark tones
  const r1 = randomChannel();
  const g1 = randomChannel();
  const b1 = randomChannel();

  const r2 = randomChannel();
  const g2 = randomChannel();
  const b2 = randomChannel();

  return `linear-gradient(135deg, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}))`;
}

interface CustomTrackingCardProps {
  cardData: {
    title: string;
    data?: string[];
    type?: string;
  };
}

const CustomTrackingCard = ({ cardData }: CustomTrackingCardProps) => { 
  console.log(cardData,"cardata")
  const [bgGradient, setBgGradient] = useState<string>("");

  useEffect(() => {
    const randomGradient = getRandomDarkGradient();
    setBgGradient(randomGradient);
  }, []);

  return (
    <div
      style={{ background: bgGradient }}
      className="cursor-pointer flex-1 w-full shadow-[-5px_5px_12px_-2px_rgba(0,_0,_0,_0.65)] h-[75%] rounded-3xl justify-center items-center flex flex-col hover:scale-[1.02] transition-all ease-linear duration-75 p-3"
    >
      <div className="w-full flex justify-center items-end">
        <h1 className="text-center text-white font-extrabold text-4xl">
          <CountUp duration={3} end={Math.random() * 55} />
        </h1>
      </div>
      <p className="flex text-white text-2xl justify-center items-center mt-2">
        {cardData.title}
      </p>
    </div>
  );
};

export default CustomTrackingCard;
