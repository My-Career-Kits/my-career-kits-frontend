// "use client";
// import { usePathname } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import { ChevronRight, User } from "lucide-react";

// function getBreadcrumbs(pathname: string) {
//   const parts = pathname.split("/").filter(Boolean);
//   if (parts.length === 0) return [{ label: "Dashboard", href: "/dashboard" }];
//   const breadcrumbs = [];
//   let currentPath = "";
//   for (const part of parts) {
//     currentPath += `/${part}`;
//     const label = part
//       .replace(/-/g, " ")
//       .replace(/\b\w/g, (l) => l.toUpperCase());
//     breadcrumbs.push({ label, href: currentPath });
//   }
//   return breadcrumbs;
// }

// export default function Topbar() {
//   const pathname = usePathname();
//   const { user } = useAuth();
//   const breadcrumbs = getBreadcrumbs(pathname);

//   return (
//     <header className="h-16 border-b border-border bg-background flex items-center justify-between pl-16 pr-6 lg:px-6 sticky top-0 z-30">
//       {/* Breadcrumbs */}
//       <nav className="flex items-center gap-1.5 text-sm overflow-hidden">
//         {breadcrumbs.map((crumb, i) => (
//           <div key={crumb.href} className="flex items-center gap-1.5 min-w-0">
//             {i > 0 && <ChevronRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />}
//             <span
//               className={`truncate ${
//                 i === breadcrumbs.length - 1
//                   ? "text-text-primary font-medium"
//                   : "text-text-secondary hover:text-text-primary transition-colors"
//               }`}
//             >
//               {crumb.label}
//             </span>
//           </div>
//         ))}
//       </nav>

//       {/* User */}
//       <div className="flex items-center gap-3 flex-shrink-0">
//         <div className="flex items-center gap-2.5">
//           <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
//             <User className="w-4 h-4 text-accent" />
//           </div>
//           <div className="hidden sm:block">
//             <p className="text-sm font-medium text-text-primary">
//               {user?.name || user?.email || "User"}
//             </p>
//             <p className="text-xs text-text-secondary">{user?.email}</p>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }












"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { ChevronRight, User, Sun, Moon } from "lucide-react";

function getBreadcrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [{ label: "Dashboard", href: "/dashboard" }];
  const breadcrumbs = [];
  let currentPath = "";
  for (const part of parts) {
    currentPath += `/${part}`;
    const label = part
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    breadcrumbs.push({ label, href: currentPath });
  }
  return breadcrumbs;
}

export default function Topbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { query: settingsQuery, mutation: settingsMutation } = useSettings();
  const breadcrumbs = getBreadcrumbs(pathname);
  const currentTheme = settingsQuery.data.theme;

  const handleThemeToggle = () => {
    const next = currentTheme === "dark" ? "light" : "dark";
    settingsMutation.mutate(next);
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between pl-16 pr-6 lg:px-6 sticky top-0 z-30">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm overflow-hidden">
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.href} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />}
            {/* UPDATED: non-last crumbs are now clickable links */}
            {i === breadcrumbs.length - 1 ? (
              <span className="truncate text-text-primary font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="truncate text-text-secondary hover:text-text-primary transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Theme toggle */}
        <button
          onClick={handleThemeToggle}
          className="w-9 h-9 rounded-lg border border-border bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-bright transition-all"
          aria-label="Toggle theme"
        >
          {currentTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <div className="w-px h-6 bg-border" />
        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
            <User className="w-4 h-4 text-accent" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text-primary">
              {user?.name || user?.email || "User"}
            </p>
            <p className="text-xs text-text-secondary">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}