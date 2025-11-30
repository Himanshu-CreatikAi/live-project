"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrickWallFire, Podcast, School, Cable,ShieldUser,NotebookTabs } from "lucide-react";

import Link from "next/link";
const data = [
  {
      title: "Campaign",
      url: "/masters/campaign",
      icon: <BrickWallFire size={16}/>,
    },
    {
     title: "Customer",
      url: "/customer",
      icon: <Podcast size={16}/>,
    },
    {
     title: "FollowUp",
      url: "/FollowUps/customer",
      icon: <School size={16}/>,
    },
     {
     title: "Status Type",
      url: "/masters/status-type",
      icon: <NotebookTabs size={16}/>,
    },
    {
     title: "Contact",
      url: "/Contact",
      icon:  <Cable size={16}/>,
    },
    {
     title: "Task",
      url: "/Task",
      icon: <ShieldUser size={16}/>,
    },
   
]
export default function MobileHamburger() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);


  // Close on outside click + ESC
  useEffect(() => {
    function handleClick(e: MouseEvent) {
     if (
  menuRef.current &&
  !menuRef.current.contains(e.target as Node) &&
  buttonRef.current &&
  !buttonRef.current.contains(e.target as Node)
) {
  setOpen(false);
}

    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <>
    
    <div className=" sm:hidden grid place-items-center"> 
      {/* Only MOBILE screen — md:hidden */}

      {/* Hamburger Button */}
   <button
  ref={buttonRef}
  onClick={() => setOpen(!open)}
  className="ml-2 relative z-[999] outline-0 w-8 h-8 flex items-center justify-center"
>
  <motion.div
    initial={false}
    animate={open ? "open" : "closed"}
    className="relative w-6 h-6"
  >
    {/* Top line */}
    <motion.span
      style={{ transformOrigin: "center center" }}
      variants={{
        open: { rotate: 45, y: 0 },
        closed: { rotate: 0, y: -7 },
      }}
      transition={{ duration: 0.28 }}
      className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-[3px] bg-white rounded"
    />

    {/* Middle line */}
    <motion.span
      style={{ transformOrigin: "center center" }}
      variants={{
        open: { opacity: 0, scaleX: 0.9 },
        closed: { opacity: 1, scaleX: 1 },
      }}
      transition={{ duration: 0.18 }}
      className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-[3px] bg-white rounded"
    />

    {/* Bottom line */}
    <motion.span
      style={{ transformOrigin: "center center" }}
      variants={{
        open: { rotate: -45, y: 0 },
        closed: { rotate: 0, y: 7 },
      }}
      transition={{ duration: 0.28 }}
      className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-[3px] bg-white rounded"
    />
  </motion.div>
</button>



      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[52px] inset-0 z-40 bg-black/70"

            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slider Menu (TOP → DOWN) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            ref={menuRef}
            initial={{ y: -250, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 180,
                damping: 18,
              },
            }}
            exit={{
              y: -250,
              opacity: 0,
              transition: { duration: 0.2 },
            }}
            className=" absolute top-[52px] left-0 right-0 mx-auto w-full z-50 bg-cyan-500/70 backdrop-blur-[10px] "
          >
            <div className=" flex justify-center items-center">
               <ul className="flex flex-col gap-2 p-3 ">
              {data.map((item, index)=>{
                return <li 
                key={index} 
                className="px-2   rounded-md text-white flex justify-center ">
                  <Link href={item.url} className="flex items-center text-left  w-full " onClick={()=>setOpen(!open)}>
                  <span className="text-sm  pr-3">{item.icon}</span>
                  <span>{item.title}</span>
                  </Link>
                  </li>
              })}
            </ul>
            </div>
           
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
