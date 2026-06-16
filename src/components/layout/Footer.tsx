"use client";

import Link from "next/link";
import { Linkedin, Facebook, Instagram, Sparkles } from "lucide-react";
import footerConfig from "@/config/footer.json";
import type { FooterConfig } from "@/types";

const config: FooterConfig = footerConfig;

const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="w-4 h-4" />,
  x: <XIcon />,
  instagram: <Instagram className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
};

export default function Footer() {
  return (
    <footer className="relative bg-surface/20 border-t border-border overflow-hidden">
      {/* Subtle top glow — matches hero/section aesthetic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[80px] bg-accent/4 blur-[60px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            {/* Logo — matches Navbar */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center group-hover:bg-accent/25 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
              </div>
              <span className="font-bold text-text-primary text-sm tracking-tight">
                {config.brand.name}
              </span>
            </Link>

            <p className="text-sm text-text-secondary leading-relaxed mb-5">
              {config.brand.tagline}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {config.countries.map((country) => (
                <span
                  key={country.code}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border border-border text-text-tertiary hover:border-border-bright hover:text-text-secondary transition-all cursor-default"
                >
                  <span>{country.flag}</span>
                  {country.label}
                </span>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary mb-4 uppercase tracking-widest">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {config.nav.platform.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary mb-4 uppercase tracking-widest">
              Company
            </h4>
            <ul className="space-y-2.5">
              {config.nav.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary mb-4 uppercase tracking-widest">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {config.nav.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-text-tertiary text-center md:text-left">
            <p>{config.legal.copyright}</p>
            <p className="mt-1">
              Company No. {config.legal.companyNumber} · {config.legal.registeredAddress}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {config.social.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-tertiary hover:text-accent hover:border-accent/30 hover:shadow-[0_0_10px_rgba(0,194,255,0.12)] transition-all"
              >
                {socialIcons[social.platform]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}