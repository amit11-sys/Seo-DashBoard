import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup';



function getBalancedLightColor(): string {
  const randomChannel = () => Math.floor(160 + Math.random() * 70); // 160–230

  const r = randomChannel();
  const g = randomChannel();
  const b = randomChannel();

  return `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}`;
}
type KeywordData = {
  keywordData?: KeywordData[]

}

const CustomTrackingCard = ({keywordData}:KeywordData) => {
   const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    const randomColor = getBalancedLightColor();
    setBgColor(randomColor);
  }, []);
  
  return (
    <>
      <div   
      // style={{ backgroundColor: bgColor }} 
      className=" cursor-pointer flex-1  h-full  rounded-3xl justify-center items-center flex flex-col   hover:scale-[1.02] transition-all ease-linear  duration-75 p-3">

          <div className="w-full flex justify-center items-end">
            <h1 className='text-center text-black font-bold text-4xl'><CountUp duration={3} end={Math.random()*55} /></h1>
          </div>
            <p className='flex text-black text-2xl justify-center items-center'> 
             
               Keywords Up</p>
         
        
        
      </div>
    
    </>
  )
}

export default CustomTrackingCard