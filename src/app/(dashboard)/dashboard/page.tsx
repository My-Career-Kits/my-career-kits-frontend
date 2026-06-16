


'use client'

import Link from 'next/link'
import { FileText, Mail, BarChart2, TrendingUp, Plus, Search, ArrowRight } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { useResumeList } from '@/hooks/useResumeList'
import { useCoverLetterList } from '@/hooks/useCoverLetterList'

export default function DashboardPage() {
  const { data: resumes } = useResumeList()
  const { data: coverLetters } = useCoverLetterList()

  // Avg Resume ATS
//   const scoredResumes = resumes?.filter(r => r.score !== null) ?? []
  const scoredResumes = resumes?.filter(r => r.score !== null && r.score > 0) ?? []

  const avgResumeScore = scoredResumes.length
    ? Math.round(scoredResumes.reduce((sum, r) => sum + (r.score ?? 0), 0) / scoredResumes.length)
    : null

  // Avg Cover Letter ATS — same pattern, score now on list item
    // const scoredCLs = coverLetters?.filter(cl => cl.score !== null) ?? []
    const scoredCLs = coverLetters?.filter(cl => cl.score !== null && cl.score > 0) ?? []

  const avgCLScore = scoredCLs.length
    ? Math.round(scoredCLs.reduce((sum, cl) => sum + (cl.score ?? 0), 0) / scoredCLs.length)
    : null

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
        <p className="text-text-secondary">Welcome back! Here&apos;s an overview of your career toolkit.</p>
      </div>

      {/* Stats — 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={FileText}
          title="Total Resumes"
          value={resumes?.length ?? 0}
        />
        <StatsCard
          icon={Mail}
          title="Cover Letters"
          value={coverLetters?.length ?? 0}
        />
        <StatsCard
          icon={BarChart2}
          title="Avg Resume ATS"
          value={avgResumeScore !== null ? `${avgResumeScore}/100` : '—'}
          trend={
            scoredResumes.length
              ? `${scoredResumes.length}/${resumes?.length ?? 0} analysed`
              : 'No analyses yet'
          }
          trendUp={scoredResumes.length > 0}
        />
        <StatsCard
          icon={TrendingUp}
          title="Avg Cover Letter ATS"
          value={avgCLScore !== null ? `${avgCLScore}/100` : '—'}
          trend={
            scoredCLs.length
              ? `${scoredCLs.length}/${coverLetters?.length ?? 0} analysed`
              : coverLetters?.length
              ? 'No analyses yet'
              : undefined
          }
          trendUp={scoredCLs.length > 0}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/resume/generate', icon: FileText, label: 'Generate Resume', desc: 'AI-powered resume builder' },
            { href: '/cover-letter/generate', icon: Mail, label: 'Write Cover Letter', desc: 'Tailored to job descriptions' },
            { href: '/jobs', icon: Search, label: 'Search Jobs', desc: 'Find opportunities near you' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-4 p-5 rounded-xl border border-border bg-surface hover:border-accent/50 hover:shadow-[0_0_30px_rgba(0,194,255,0.08)] transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <action.icon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm">{action.label}</p>
                <p className="text-xs text-text-secondary">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Recent Resumes</h3>
            <Link href="/resume" className="text-xs text-accent hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <RecentActivity
            items={resumes?.slice(0, 3).map(r => ({
              id: r.uuid,
              type: 'resume' as const,
              title: r.title,
              date: r.updated_at,
              href: `/resume/${r.uuid}`,
            })) ?? []}
          />
          {!resumes?.length && (
            <Link href="/resume/generate" className="mt-3 flex items-center gap-2 text-sm text-accent hover:underline">
              <Plus className="w-4 h-4" /> Generate your first resume
            </Link>
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Recent Cover Letters</h3>
            <Link href="/cover-letter" className="text-xs text-accent hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <RecentActivity
            items={coverLetters?.slice(0, 3).map(cl => ({
              id: cl.uuid,
              type: 'cover-letter' as const,
              title: cl.title,
              date: cl.updated_at,
              href: `/cover-letter/${cl.uuid}`,
            })) ?? []}
          />
          {!coverLetters?.length && (
            <Link href="/cover-letter/generate" className="mt-3 flex items-center gap-2 text-sm text-accent hover:underline">
              <Plus className="w-4 h-4" /> Write your first cover letter
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}