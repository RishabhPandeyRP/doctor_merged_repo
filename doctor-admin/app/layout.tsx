// "use client"

import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import {Montserrat} from "next/font/google"
import { Metadata } from "next";
import { AuthProvider } from "@/context/AppContext";

export const metadata:Metadata = {
  title: "Admin",
  description: "Admin for Medcare",
  icons: "/favicon.svg",
};


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat"
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={montserrat.variable}>
      <body className="">
      <AuthProvider>
        <NavBar></NavBar>
        <div className="layout-content">
          {children}
        </div>
        <Footer></Footer>
        <Toaster position="top-right"></Toaster>
        </AuthProvider>
      </body>
    </html>
  );
}
