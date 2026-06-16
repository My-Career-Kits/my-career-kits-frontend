// "use client";

// import Link from "next/link";
// import { FileText, Mail, Briefcase, BarChart3, Plus, Search, PenLine } from "lucide-react";
// import PageTransition from "@/components/shared/PageTransition";
// import StatsCard from "@/components/dashboard/StatsCard";
// import RecentActivity from "@/components/dashboard/RecentActivity";
// import { useResumeList } from "@/hooks/useResumeList";
// import { useCoverLetterList } from "@/hooks/useCoverLetterList";
// import SkeletonCard from "@/components/shared/SkeletonCard";
// import ErrorAlert from "@/components/shared/ErrorAlert";

// export default function DashboardPage() {
//   const resumesQuery = useResumeList();
//   const coverLettersQuery = useCoverLetterList();

//   const recentResumes = resumesQuery.data?.slice(0, 3).map((r) => ({
//     id: r.id,
//     type: "resume" as const,
//     title: r.title,
//     date: r.updated_at,
//     href: `/resume/${r.id}`,
//   })) ?? [];

//   const recentCoverLetters = coverLettersQuery.data?.slice(0, 3).map((c) => ({
//     id: c.uuid,
//     type: "cover-letter" as const,
//     title: c.title,
//     date: c.updated_at,
//     href: `/cover-letter/${c.uuid}`,
//   })) ?? [];

//   const totalResumes = resumesQuery.data?.length ?? 0;
//   const totalCoverLetters = coverLettersQuery.data?.length ?? 0;

//   return (
//     <PageTransition>
//       <div className="max-w-6xl mx-auto space-y-8">
//         <div>
//           <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
//           <p className="text-text-secondary mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {resumesQuery.isLoading ? (
//             <>
//               <SkeletonCard />
//               <SkeletonCard />
//               <SkeletonCard />
//               <SkeletonCard />
//             </>
//           ) : (
//             <>
//               <StatsCard
//                 title="Total Resumes"
//                 value={totalResumes}
//                 icon={FileText}
//                 trend="+2 this week"
//                 trendUp
//               />
//               <StatsCard
//                 title="Total Cover Letters"
//                 value={totalCoverLetters}
//                 icon={Mail}
//                 trend="+1 this week"
//                 trendUp
//               />
//               <StatsCard
//                 title="Jobs Searched"
//                 value="12"
//                 icon={Briefcase}
//                 trend="Steady"
//                 trendUp={false}
//               />
//               <StatsCard
//                 title="Analysis Score Avg"
//                 value="87"
//                 icon={BarChart3}
//                 trend="+5%"
//                 trendUp
//               />
//             </>
//           )}
//         </div>

//         {/* Recent Activity */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {resumesQuery.isError ? (
//             <ErrorAlert
//               message="Failed to load resumes"
//               onRetry={() => resumesQuery.refetch()}
//             />
//           ) : (
//             <RecentActivity items={recentResumes} title="Recent Resumes" />
//           )}
//           {coverLettersQuery.isError ? (
//             <ErrorAlert
//               message="Failed to load cover letters"
//               onRetry={() => coverLettersQuery.refetch()}
//             />
//           ) : (
//             <RecentActivity items={recentCoverLetters} title="Recent Cover Letters" />
//           )}
//         </div>

//         {/* Quick Actions */}
//         <div>
//           <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <Link
//               href="/resume/generate"
//               className="group rounded-xl border border-border bg-surface p-6 hover:border-border-bright hover:shadow-[0_0_30px_rgba(0,194,255,0.08)] transition-all duration-200"
//             >
//               <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-3 group-hover:shadow-[0_0_20px_rgba(0,194,255,0.15)] transition-shadow">
//                 <Plus className="w-5 h-5 text-accent" />
//               </div>
//               <h3 className="text-sm font-semibold text-text-primary">Generate Resume</h3>
//               <p className="text-xs text-text-secondary mt-1">Create a new AI-powered resume</p>
//             </Link>

//             <Link
//               href="/cover-letter/generate"
//               className="group rounded-xl border border-border bg-surface p-6 hover:border-border-bright hover:shadow-[0_0_30px_rgba(0,194,255,0.08)] transition-all duration-200"
//             >
//               <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-3 group-hover:shadow-[0_0_20px_rgba(0,194,255,0.15)] transition-shadow">
//                 <PenLine className="w-5 h-5 text-accent" />
//               </div>
//               <h3 className="text-sm font-semibold text-text-primary">Write Cover Letter</h3>
//               <p className="text-xs text-text-secondary mt-1">Generate a tailored cover letter</p>
//             </Link>

//             <Link
//               href="/jobs"
//               className="group rounded-xl border border-border bg-surface p-6 hover:border-border-bright hover:shadow-[0_0_30px_rgba(0,194,255,0.08)] transition-all duration-200"
//             >
//               <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-3 group-hover:shadow-[0_0_20px_rgba(0,194,255,0.15)] transition-shadow">
//                 <Search className="w-5 h-5 text-accent" />
//               </div>
//               <h3 className="text-sm font-semibold text-text-primary">Search Jobs</h3>
//               <p className="text-xs text-text-secondary mt-1">Find your next opportunity</p>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </PageTransition>
//   );
// }











// 'use client'

// import Link from 'next/link'
// import { FileText, Mail, Briefcase, BarChart2, Plus, Search, ArrowRight } from 'lucide-react'
// import StatsCard from '@/components/dashboard/StatsCard'
// import RecentActivity from '@/components/dashboard/RecentActivity'
// import { useResumeList } from '@/hooks/useResumeList'
// import { useCoverLetterList } from '@/hooks/useCoverLetterList'

// export default function DashboardPage() {
//   const { data: resumes } = useResumeList()
//   const { data: coverLetters } = useCoverLetterList()

//   return (
//     <div className="space-y-8 max-w-6xl">
//       <div>
//         <h1 className="text-2xl font-bold text-[#F0F6FF] mb-1">Dashboard</h1>
//         <p className="text-[#8B9BB4]">Welcome back! Here&apos;s an overview of your career toolkit.</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard icon={FileText} title="Total Resumes" value={resumes?.length ?? 0} />
//         <StatsCard icon={Mail} title="Cover Letters" value={coverLetters?.length ?? 0} />
//         <StatsCard icon={Briefcase} title="Jobs Searched" value="—" />
//         <StatsCard icon={BarChart2} title="Avg ATS Score" value="—" />
//       </div>

//       {/* Quick Actions */}
//       <div>
//         <h2 className="text-lg font-semibold text-[#F0F6FF] mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {[
//             { href: '/resume/generate', icon: FileText, label: 'Generate Resume', desc: 'AI-powered resume builder' },
//             { href: '/cover-letter/generate', icon: Mail, label: 'Write Cover Letter', desc: 'Tailored to job descriptions' },
//             { href: '/jobs', icon: Search, label: 'Search Jobs', desc: 'Find opportunities near you' },
//           ].map((action) => (
//             <Link
//               key={action.href}
//               href={action.href}
//               className="group flex items-center gap-4 p-5 rounded-xl border border-[#1E2D45] bg-[#0D1321] hover:border-[#00C2FF]/50 hover:shadow-[0_0_30px_rgba(0,194,255,0.08)] transition-all"
//             >
//               <div className="w-11 h-11 rounded-xl bg-[#00C2FF]/10 border border-[#00C2FF]/20 flex items-center justify-center shrink-0 group-hover:bg-[#00C2FF]/20 transition-colors">
//                 <action.icon className="w-5 h-5 text-[#00C2FF]" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-[#F0F6FF] text-sm">{action.label}</p>
//                 <p className="text-xs text-[#8B9BB4]">{action.desc}</p>
//               </div>
//               <ArrowRight className="w-4 h-4 text-[#4A5568] group-hover:text-[#00C2FF] transition-colors shrink-0" />
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="rounded-xl border border-[#1E2D45] bg-[#0D1321] p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-semibold text-[#F0F6FF]">Recent Resumes</h3>
//             <Link href="/resume" className="text-xs text-[#00C2FF] hover:underline flex items-center gap-1">
//               View all <ArrowRight className="w-3 h-3" />
//             </Link>
//           </div>
//           <RecentActivity
//             items={resumes?.slice(0, 3).map(r => ({
//               id: r.uuid,
//               type: 'resume' as const,
//               title: r.title,
//               date: r.updated_at,
//               href: `/resume/${r.uuid}`,
//             })) ?? []}
//           />
//           {!resumes?.length && (
//             <Link href="/resume/generate" className="mt-3 flex items-center gap-2 text-sm text-[#00C2FF] hover:underline">
//               <Plus className="w-4 h-4" /> Generate your first resume
//             </Link>
//           )}
//         </div>

//         <div className="rounded-xl border border-[#1E2D45] bg-[#0D1321] p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-semibold text-[#F0F6FF]">Recent Cover Letters</h3>
//             <Link href="/cover-letter" className="text-xs text-[#00C2FF] hover:underline flex items-center gap-1">
//               View all <ArrowRight className="w-3 h-3" />
//             </Link>
//           </div>
//           <RecentActivity
//             items={coverLetters?.slice(0, 3).map(cl => ({
//               id: cl.uuid,
//               type: 'cover-letter' as const,
//               title: cl.title,
//               date: cl.updated_at,
//               href: `/cover-letter/${cl.uuid}`,
//             })) ?? []}
//           />
//           {!coverLetters?.length && (
//             <Link href="/cover-letter/generate" className="mt-3 flex items-center gap-2 text-sm text-[#00C2FF] hover:underline">
//               <Plus className="w-4 h-4" /> Write your first cover letter
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }



































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