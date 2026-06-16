"use client";

import { ExternalLink, MapPin, DollarSign, Calendar } from "lucide-react";
import type { Job } from "@/types";
import BadgePill from "@/components/shared/BadgePill";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 hover:border-border-bright hover:shadow-[0_0_30px_rgba(0,194,255,0.08)] transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{job.title}</h3>
          <p className="text-sm text-text-secondary mt-0.5">{job.company}</p>
        </div>
        <BadgePill
          label={job.job_type}
          variant={job.job_type === "Full Time" ? "success" : "default"}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary mb-4">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {job.location}
        </span>
        {(job.salary_min || job.salary_max) && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            {job.salary_min && job.salary_max
              ? `${job.salary} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
              : job.salary_min
              ? `${job.salary} ${job.salary_min.toLocaleString()}+`
              : `${job.salary} Up to ${job.salary_max?.toLocaleString()}`}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(job.posted_date).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-text-secondary line-clamp-3 mb-4 leading-relaxed">
        {job.description}
      </p>

      <a
        href={job.apply_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        View & Apply
      </a>
    </div>
  );
}
