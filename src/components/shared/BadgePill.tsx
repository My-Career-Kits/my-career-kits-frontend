"use client";

interface BadgePillProps {
  label: string;
  variant?: "default" | "success" | "warning" | "danger" | "accent";
}

export default function BadgePill({ label, variant = "default" }: BadgePillProps) {
  const variants = {
    default: "bg-surface-elevated border-border text-text-secondary",
    success: "bg-success/10 border-success/30 text-success",
    warning: "bg-warning/10 border-warning/30 text-warning",
    danger: "bg-danger/10 border-danger/30 text-danger",
    accent: "bg-accent/10 border-accent/30 text-accent",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {label}
    </span>
  );
}
