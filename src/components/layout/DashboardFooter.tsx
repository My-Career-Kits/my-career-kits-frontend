"use client";

import Link from "next/link";

export default function DashboardFooter() {
  return (
    <footer className="border-t border-border mt-8">
      <div className="px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-text-tertiary">
          © {new Date().getFullYear()} MyCareerKits. A product of Shenmibox Ltd.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="text-xs text-text-tertiary hover:text-accent transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-text-tertiary hover:text-accent transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/cookies"
            className="text-xs text-text-tertiary hover:text-accent transition-colors"
          >
            Cookie Policy
          </Link>
          <Link
            href="/contact"
            className="text-xs text-text-tertiary hover:text-accent transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}