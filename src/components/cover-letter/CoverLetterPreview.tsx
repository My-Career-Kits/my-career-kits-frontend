"use client";

import type { CoverLetterContent } from "@/types";

interface CoverLetterPreviewProps {
  content: CoverLetterContent;
}

export default function CoverLetterPreview({ content }: CoverLetterPreviewProps) {
  return (
    <div className="bg-white text-gray-900 rounded-xl p-10 shadow-lg max-w-3xl mx-auto min-h-[600px]">
      <div className="space-y-6">
        <p className="text-sm text-gray-700">{content.greeting}</p>

        <p className="text-sm leading-relaxed text-gray-700">
          {content.opening_paragraph}
        </p>

        {content.body_paragraphs.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-gray-700">
            {paragraph}
          </p>
        ))}

        <p className="text-sm leading-relaxed text-gray-700">
          {content.closing_paragraph}
        </p>

        <div className="pt-4">
          <p className="text-sm text-gray-700">{content.sign_off}</p>
        </div>
      </div>
    </div>
  );
}