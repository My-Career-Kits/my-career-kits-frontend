// import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";
// import { Toaster } from "sonner";
// import "./globals.css";
// import ClientProviders from "@/providers/ClientProviders";

// export const metadata: Metadata = {
//   title: "MyCareerKits — AI-Powered Career Platform",
//   description: "Build resumes, write cover letters, search jobs, and grow with AI-powered tools.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" data-scroll-behavior="smooth">
//       <body
//         className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-background text-text-primary min-h-screen`}
//       >
//         <ClientProviders>
//           {children}
//         </ClientProviders>
//         <Toaster richColors theme="dark" position="top-right" />
//       </body>
//     </html>
//   );
// }






// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className="dark">
//       <body>
//         {children}
//       </body>
//     </html>
//   );
// }




// import type { Metadata } from "next";
// import ClientProviders from "@/providers/ClientProviders";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "MyCareerKits — AI-Powered Career Platform",
//   description: "Build resumes, find jobs, write cover letters with AI.",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className="dark">
//       <body>
//         <ClientProviders>
//           {children}
//         </ClientProviders>
//       </body>
//     </html>
//   );
// }


















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





