// "use client";

// import { CheckCircle, AlertTriangle } from "lucide-react";
// import type { ResumeAnalysis } from "@/types";
// import ScoreRing from "@/components/shared/ScoreRing";
// import BadgePill from "@/components/shared/BadgePill";

// interface ResumeAnalysisPanelProps {
//   analysis: ResumeAnalysis;
// }

// export default function ResumeAnalysisPanel({ analysis }: ResumeAnalysisPanelProps) {
//   return (
//     <div className="space-y-8">
//       {/* Score */}
//       <div className="flex justify-center">
//         <ScoreRing score={analysis.score} />
//       </div>

//       {/* Strengths */}
//       {analysis.strengths.length > 0 && (
//         <div>
//           <h3 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
//             <CheckCircle className="w-4 h-4" />
//             Strengths
//           </h3>
//           <ul className="space-y-2">
//             {analysis.strengths.map((strength, i) => (
//               <li
//                 key={i}
//                 className="flex items-start gap-2 text-sm text-text-secondary"
//               >
//                 <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
//                 {strength}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Improvements */}
//       {analysis.improvements.length > 0 && (
//         <div>
//           <h3 className="text-sm font-semibold text-warning mb-3 flex items-center gap-2">
//             <AlertTriangle className="w-4 h-4" />
//             Improvements
//           </h3>
//           <ul className="space-y-2">
//             {analysis.improvements.map((improvement, i) => (
//               <li
//                 key={i}
//                 className="flex items-start gap-2 text-sm text-text-secondary"
//               >
//                 <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
//                 {improvement}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Keywords Found */}
//       {analysis.keywords.length > 0 && (
//         <div>
//           <h3 className="text-sm font-semibold text-accent mb-3">
//             Keywords Found
//           </h3>
//           <div className="flex flex-wrap gap-2">
//             {analysis.keywords.map((keyword, i) => (
//               <BadgePill key={i} label={keyword} variant="accent" />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Missing Keywords */}
//       {analysis.missing_keywords.length > 0 && (
//         <div>
//           <h3 className="text-sm font-semibold text-danger mb-3">
//             Missing Keywords
//           </h3>
//           <div className="flex flex-wrap gap-2">
//             {analysis.missing_keywords.map((keyword, i) => (
//               <BadgePill key={i} label={keyword} variant="danger" />
//             ))}
//           </div>
//         </div>
//       )}

//       <p className="text-xs text-text-tertiary">
//         Analyzed {new Date(analysis.created_at).toLocaleDateString()}
//       </p>
//     </div>
//   );
// }




"use client";

import { CheckCircle, AlertTriangle } from "lucide-react";
import type { ResumeAnalysis } from "@/types";
import ScoreRing from "@/components/shared/ScoreRing";
import BadgePill from "@/components/shared/BadgePill";

interface ResumeAnalysisPanelProps {
  analysis: ResumeAnalysis;
}

export default function ResumeAnalysisPanel({ analysis }: ResumeAnalysisPanelProps) {
  // Defensive guard: if analysis is undefined/incomplete (e.g. during refetch), render nothing
  if (!analysis?.score) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <ScoreRing score={analysis.score} />
      </div>

      {analysis.strengths?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.improvements?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-warning mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Improvements
          </h3>
          <ul className="space-y-2">
            {analysis.improvements.map((improvement, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.keywords?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-accent mb-3">Keywords Found</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword, i) => (
              <BadgePill key={i} label={keyword} variant="accent" />
            ))}
          </div>
        </div>
      )}

      {analysis.missing_keywords?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-danger mb-3">Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_keywords.map((keyword, i) => (
              <BadgePill key={i} label={keyword} variant="danger" />
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-text-tertiary">
        Analyzed {new Date(analysis.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}