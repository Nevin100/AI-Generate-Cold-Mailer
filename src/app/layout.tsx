import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/Custom/theme-provider";
import Navbar from "@/components/Custom/Navbar/Navbar";
import Footer from "@/components/Custom/Footer/Footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "InteliMail - AI-Powered Cold Email Generator",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
