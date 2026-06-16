"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Sparkles,
  FileText,
  Mail,
  BarChart3,
  Briefcase,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: FileText,
    title: "AI Resume Builder",
    description:
      "Generate professional resumes tailored to your experience and target role in seconds.",
    badge: "Most Popular",
  },
  {
    icon: Mail,
    title: "Cover Letter Generator",
    description:
      "Write compelling, personalized cover letters that match job descriptions perfectly.",
    badge: null,
  },
  {
    icon: BarChart3,
    title: "ATS Analyzer",
    description:
      "Get instant feedback on how well your resume passes applicant tracking systems.",
    badge: "New",
  },
  {
    icon: Briefcase,
    title: "Job Search",
    description:
      "Search thousands of jobs across the UK, US, Canada, and Australia.",
    badge: null,
  },
  {
    icon: TrendingUp,
    title: "Career Insights",
    description:
      "Track your progress and get actionable recommendations to improve your chances.",
    badge: null,
  },
  {
    icon: Globe,
    title: "Multi-Market Support",
    description:
      "Tailored formats and conventions for every major English-speaking job market.",
    badge: null,
  },
];

const steps = [
  {
    number: "01",
    title: "Enter Your Details",
    description:
      "Tell us about your experience, skills, and target role in a guided flow that takes under 5 minutes.",
    icon: FileText,
  },
  {
    number: "02",
    title: "AI Generates Content",
    description:
      "Our model crafts professional resumes and cover letters tuned to your industry and seniority.",
    icon: Zap,
  },
  {
    number: "03",
    title: "Download & Apply",
    description:
      "Export as PDF, track applications, and land more interviews with every document.",
    icon: CheckCircle2,
  },
];



const testimonials = [
  {
    quote:
      "I landed three interviews within a week of using MyCareerKits. The ATS analyzer alone was worth it.",
    name: "Sarah K.",
    role: "Product Manager, London",
    initials: "SK",
  },
  {
    quote:
      "The AI understood exactly what I was trying to convey. My resume went from generic to genuinely impressive.",
    name: "Marcus T.",
    role: "Software Engineer, Toronto",
    initials: "MT",
  },
  {
    quote:
      "As a career coach, I recommend this to all my clients. The output quality is consistently excellent.",
    name: "Priya N.",
    role: "Career Coach, Sydney",
    initials: "PN",
  },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-[0_1px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center group-hover:bg-accent/25 transition-colors">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <span className="font-bold text-text-primary text-base tracking-tight">
            MyCareerKits
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How It Works"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border hover:border-border-bright rounded-lg transition-all"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-semibold text-black bg-accent rounded-lg hover:bg-accent-dark transition-all shadow-[0_0_16px_rgba(0,194,255,0.25)] hover:shadow-[0_0_24px_rgba(0,194,255,0.45)]"
          >
            Get started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary p-1"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6 space-y-4">
          {["Features", "How It Works"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-text-secondary hover:text-text-primary py-2"
            >
              {item}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <Link
              href="/login"
              className="text-center px-4 py-2.5 text-sm font-medium text-text-secondary border border-border rounded-lg"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-center px-4 py-2.5 text-sm font-semibold text-black bg-accent rounded-lg"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,194,255,0.08),transparent)]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
              backgroundSize: "72px 72px",
            }}
          />
          {/* Glows */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/6 rounded-full blur-[130px]" />
          <div className="absolute top-1/2 right-1/5 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[110px]" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-xs font-semibold tracking-wide uppercase mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Career Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-[80px] font-extrabold tracking-[-0.03em] leading-[1.05] mb-6"
          >
            <span className="text-gradient">Land the job</span>
            <br />
            <span className="text-text-primary">you actually want.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-generated resumes, cover letters, and ATS analysis — built for candidates
            who refuse to blend in.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-black font-bold text-base hover:bg-accent-dark transition-all shadow-[0_0_32px_rgba(0,194,255,0.3)] hover:shadow-[0_0_48px_rgba(0,194,255,0.5)]"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-all text-base"
            >
              Log in to your account
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-text-tertiary"
          >
            No credit card required · Free forever plan available
          </motion.p>

          {/* App mockup */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-16 mx-auto max-w-2xl"
          >
            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
              {/* Window chrome */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/50 bg-surface/60">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 flex items-center gap-2 bg-background/50 border border-border/40 rounded-md px-3 py-1.5">
                  <Shield className="w-3 h-3 text-success/70 shrink-0" />
                  <span className="text-xs text-text-tertiary font-mono truncate">
                    mycareerkit.ai
                    <span className="text-text-secondary">/resume/builder</span>
                  </span>
                </div>
              </div>
              {/* Content skeleton */}
              <div className="p-6 space-y-4 bg-background/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-5 w-1/3 bg-accent/15 rounded-lg" />
                  <div className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
                    ATS Score: 94
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-3 w-[90%] bg-white/5 rounded" />
                  <div className="h-3 w-[80%] bg-white/5 rounded" />
                </div>
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    <div className="h-3 w-[70%] bg-success/10 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    <div className="h-3 w-[55%] bg-success/10 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <div className="h-3 w-[65%] bg-accent/10 rounded" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="px-3 py-1 rounded-full bg-success/15 text-success text-xs font-semibold">
                    Strong match
                  </div>
                  <div className="px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">
                    Ready to export
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-text-tertiary"
          >
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-accent/60" />
              SOC 2 compliant
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success/60" />
              10,000+ resumes generated
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent/60" />
              Rated 4.9 ★ by users
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6 border-y border-border bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "10,000+", label: "Resumes Generated" },
              { value: "95%", label: "ATS Pass Rate" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-accent mb-1">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-text-tertiary uppercase tracking-widest">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight mb-4">
              Everything to{" "}
              <span className="text-gradient">land the job</span>
            </h2>
            <p className="text-text-secondary max-w-md mx-auto">
              One platform for every stage of the job search — from first draft to final offer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 border border-border/60 hover:border-accent/20 hover:shadow-[0_0_40px_rgba(0,194,255,0.06)] transition-all duration-300 group relative overflow-hidden"
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                    {feature.badge}
                  </span>
                )}
                <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(0,194,255,0.15)] transition-shadow">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 px-6 bg-surface/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight mb-4">
              Three steps to your{" "}
              <span className="text-gradient">next role</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glass-card rounded-2xl p-6 border border-border/60 flex gap-6 items-start hover:border-accent/20 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-accent/60 uppercase tracking-widest leading-none">
                    Step
                  </span>
                  <span className="text-xl font-extrabold text-accent leading-tight">
                    {step.number}
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-bold text-text-primary mb-1.5">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              Loved by candidates
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col gap-4"
              >
                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-tertiary">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-xs font-semibold tracking-wide uppercase mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Get started today
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight mb-5 leading-tight">
              Your next job is one{" "}
              <span className="text-gradient">great resume</span> away.
            </h2>
            <p className="text-text-secondary mb-10 max-w-lg mx-auto">
              Join 10,000+ professionals who accelerated their job search with MyCareerKits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-black font-bold text-base hover:bg-accent-dark transition-all shadow-[0_0_32px_rgba(0,194,255,0.3)] hover:shadow-[0_0_48px_rgba(0,194,255,0.5)]"
              >
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-all text-base"
              >
                Already have an account? Log in
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}