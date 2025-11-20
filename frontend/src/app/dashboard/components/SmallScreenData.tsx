"use client";

import { BrickWallFire, Podcast, School, Cable,ShieldUser,NotebookTabs } from "lucide-react";
import ImageSlider from "./ImageSlider";
import Link from "next/link";
const SmallScreenData = () => {


  const boxeButtons = [
    {
      pTag: "Campigns",
      icon: <BrickWallFire />,
      color: "bg-red-500/50",
      url:"/masters/campaign"
    
    },
    {
      pTag: "Follow Up",
      icon: <Podcast />,
      color: "bg-purple-500/50",
      url:"/followups/customer"
     
    },
       {
        pTag:"Schedule",
        icon:<School/>,
        color:"bg-teal-500/50",
        url:"/schedules"

    }, {
        pTag:"Task",
        icon: <Cable/>,
        color:"bg-green-500/50",
        url:"/task"
       
    },
       {
        pTag:"Customers",
        icon:<ShieldUser/>,
        color:"bg-blue-500/50",
        url:"/customer"
       
    }, {
        pTag:"Contacts",
        icon: <NotebookTabs/>,
        color:"bg-gray-500/50",
        url:"/contact"
    },
  ];

 
  return (
    <>
    <></>
    <ImageSlider/>
    <div className="bg-gray-200 flex flex-col">
        
      <div className="px-4">
        {/* ✅ Infinite Smooth Slider */}
        {/* <div className="relative w-full overflow-hidden bg-gray-900 py-4">
          <div
            ref={sliderRef}
            className={`flex ${
              isTransitioning ? "transition-transform duration-2000 ease-in-out" : ""
            }`}
            style={{
              transform: `translateX(-${imageIndex * 100}%)`,
            }}
          >
            {[...images, images[0]].map((src, i) => (
              <div key={i} className="shrink-0 w-full flex justify-center px-2">
                <div className="w-[300px] sm:w-[400px] md:w-[500px]">
                  <img
                    src={src}
                    alt={`slide-${i}`}
                    width={500}
                    height={300}
                    className="rounded-xl object-cover w-full h-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </div> */}
    
        {/* ✅ Button Grid */}
        <div className="grid grid-cols-2 gap-4 mt-4 w-full ">
          {boxeButtons.map((data, index) => (
            <Link
              key={index}
              href={data?.url??""}
             
              className="rounded-sm bg-cover bg-center bg-no-repeat min-h-[152px] bg-[url(https://i.rtings.com/assets/pages/OICDg5Ss/best-video-editing-laptops-20241015-medium.jpg?format=auto)]"
            >
              <div
                className={`${data.color} py-9 px-4 rounded-md flex flex-col h-full items-center justify-center`}
              >
                <div className="text-white text-4xl">{data.icon}</div>
                <p className="text-white mt-2 text-center">{data.pTag}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default SmallScreenData;
