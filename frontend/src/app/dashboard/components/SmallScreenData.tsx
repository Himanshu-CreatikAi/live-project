"use client";

import { BrickWallFire, Podcast, School, Cable,ShieldUser,NotebookTabs } from "lucide-react";
import ImageSlider from "./ImageSlider";
import Link from "next/link";
const SmallScreenData = () => {


  const boxeButtons = [
    {
      pTag: "Campigns",
      icon: <BrickWallFire />,
      color: " backdrop-blur-[2px] bg-red-600/50",
      url:"/masters/campaign"
    
    },
    {
      pTag: "Customer",
      icon: <Podcast />,
      color: "backdrop-blur-[2px] bg-purple-600/50",
      url:"/customer"
     
    },
       {
        pTag:"Followups",
        icon:<School/>,
        color:"backdrop-blur-[2px] bg-teal-600/50",
        url:"/followups/customer"

    }, {
        pTag:"Contact",
        icon: <Cable/>,
        color:" backdrop-blur-[2px] bg-green-600/50",
        url:"/contact"
       
    },
       {
        pTag:"Task",
        icon:<ShieldUser/>,
        color:" backdrop-blur-[2px] bg-blue-600/50",
        url:"/task"
       
    }, {
        pTag:"Status Type",
        icon: <NotebookTabs/>,
        color:"backdrop-blur-[2px] bg-gray-600/50",
        url:"/masters/status-type"
    },
  ];

  

 
  return (
    <>
    <></>
    <ImageSlider/>
    <div className=" flex flex-col mb-4">
        
      <div className="px-4">
    
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
                <div className="text-white text-6xl">{data.icon}</div>
                <p className="text-white mt-2 text-lg text-center">{data.pTag}</p>
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
