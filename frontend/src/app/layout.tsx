"use client";

import "./globals.css";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./component/Nav";
import { AppSidebar } from "../components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "../components/ui/separator";
import ProtectedRoute from "./component/ProtectedRoutes";
import { AuthProvider } from "@/context/AuthContext";
import { Poppins,Manrope,Schibsted_Grotesk } from 'next/font/google'
import { CustomerImportProvider } from "@/context/CustomerImportContext";
import { ContactImportProvider } from "@/context/ContactImportContext";
 
const poppins = Schibsted_Grotesk({
  weight:'400',
  subsets: ['latin'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname === "/";

  return (
    <html lang="en" className={`min-h-screen w-full overflow-x-hidden ${poppins.className}`}>
      <body className="min-h-screen w-full bg-violet-100 overflow-x-hidden">
        <AuthProvider>
          <CustomerImportProvider>
            <ContactImportProvider>
          {isAdminPage ? (
            <main className="min-h-screen ">{children}</main>
          ) : (
            <ProtectedRoute>
              <SidebarProvider>
                <div className="flex min-h-screen w-full overflow-hidden">
                  {/* Sidebar */}
                  <AppSidebar />

                  {/* Main Area */}
                  <SidebarInset className="flex flex-col flex-1 min-h-screen overflow-hidden">
                    {/* Navbar */}
                    <header className="flex items-center gap-2 shrink-0 bg-white text-gray-800 px-4 shadow-sm z-10">
                      <div className="flex items-center gap-2 max-md:hidden">
                        <SidebarTrigger className="-ml-1 cursor-pointer" />
                        <Separator
                          orientation="vertical"
                          className="mr-2 data-[orientation=vertical]:h-4"
                        />
                      </div>

                      <div className="ml-auto w-full">
                        <Navbar />
                      </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto bg-violet-100">
                      {/* Mobile Sidebar Trigger */}
                      <div className="flex items-center gap-2 max-w-[100px] md:hidden mt-4 ml-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                          orientation="vertical"
                          className="mr-2 data-[orientation=vertical]:h-4"
                        />
                      </div>

                      {/* Actual Page */}
                      <div className="p-8 max-md:p-2">{children}</div>
                    </main>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          )}
          </ContactImportProvider>
          </CustomerImportProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
