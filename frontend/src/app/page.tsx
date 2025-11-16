"use client";
import Dashboard from "./dashboard/page";
import Navbar from "./component/Nav";
import Layout from "./layout";
import { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "./component/ProtectedRoutes";
import Admin from "./admin/page"

// app/page.tsx
/*


here i am, this is me 
i came into this world so wild and free
here i am so young and strong
right into the place where i blong...

it's a new world! its a new start
it's alive with the beating of a young heart 
it's a new day in new land, 
and it's waiting for me here i am...

oh , i its a new world it's a new start
it's alive with the beating of a young heart
yeah , it's a new day in a new land
and it's waiting for me here i am...

*/
export default function Page() {
  
    
  return <div>
     <Admin />
   </div>
}

