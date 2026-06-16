// "use client";

// import Link from "next/link";
// import { FileQuestion, ArrowLeft } from "lucide-react";

// export default function NotFound() {
//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center px-6">
//       <div className="text-center max-w-md">
//         <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
//           <FileQuestion className="w-10 h-10 text-accent" />
//         </div>
//         <h1 className="text-4xl font-bold text-text-primary mb-3">404</h1>
//         <p className="text-text-secondary mb-8">
//           The page you are looking for does not exist or has been moved.
//         </p>
//         <Link
//           href="/dashboard"
//           className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-black font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Go to Dashboard
//         </Link>
//       </div>
//     </div>
//   );
// }




"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  return null;
}