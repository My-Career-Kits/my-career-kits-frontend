"use client";
import Link from "next/link";
import { FileText, Mail, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "resume" | "cover-letter";
  title: string;
  date: string;
  href: string;
}

interface RecentActivityProps {
  items: ActivityItem[];
}

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-text-tertiary py-4 text-center">No recent activity</p>
      ) : (
        items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.04] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              {item.type === "resume" ? (
                <FileText className="w-4 h-4 text-accent" />
              ) : (
                <Mail className="w-4 h-4 text-accent" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors truncate">
                {item.title}
              </p>
              <p className="text-xs text-text-tertiary flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

