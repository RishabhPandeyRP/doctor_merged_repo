import "./globals.css";
import NavBar from "@/components/NavBar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AppContext";
import { Montserrat } from "next/font/google";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Medcare",
  description: "Book appointment with your favourite doctor",
  icons: "/favicon.svg",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
  variable: "--font-montserrat", 
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <AuthProvider>
          <NavBar></NavBar>
          {children}
          <Footer></Footer>
          <Toaster position="top-right"></Toaster>
        </AuthProvider>
      </body>
    </html>
  );
}
