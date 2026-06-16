"use client";

import type { ResumeContent } from "@/types";

interface ResumePreviewProps {
  content: ResumeContent;
}

export default function ResumePreview({ content }: ResumePreviewProps) {
  return (
    <div className="bg-white text-gray-900 rounded-xl p-8 shadow-lg max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {content.personal_info.name}
        </h1>
        <p className="text-sm text-gray-600 mt-1">{content.personal_info.email}</p>
      </div>

      {/* Summary */}
      {content.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">{content.summary}</p>
        </div>
      )}

      {/* Skills */}
      {content.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {content.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {content.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {exp.job_title}
                  </h3>
                  <span className="text-xs text-gray-500">{exp.duration}</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{exp.company}</p>
                <ul className="list-disc list-inside space-y-1">
                  {exp.bullet_points.map((point, j) => (
                    <li key={j} className="text-xs text-gray-700 leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {content.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
            Education
          </h2>
          <ul className="space-y-1">
            {content.education.map((edu, i) => (
              <li key={i} className="text-sm text-gray-700">
                {edu}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Projects */}
      {content.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
            Projects
          </h2>
          <ul className="space-y-1">
            {content.projects.map((proj, i) => (
              <li key={i} className="text-sm text-gray-700">
                {proj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {content.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
            Certifications
          </h2>
          <ul className="space-y-1">
            {content.certifications.map((cert, i) => (
              <li key={i} className="text-sm text-gray-700">
                {cert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {content.achievements.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
            Achievements
          </h2>
          <ul className="space-y-1">
            {content.achievements.map((ach, i) => (
              <li key={i} className="text-sm text-gray-700">
                {ach}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
