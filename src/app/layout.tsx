import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import ClientProviders from "@/providers/ClientProviders";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "MyCareerKits — AI-Powered Career Platform",
  description: "Build resumes, find jobs, write cover letters with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}





