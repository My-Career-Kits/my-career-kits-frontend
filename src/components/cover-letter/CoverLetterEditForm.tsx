// "use client";

// import { useState } from "react";
// import { Pencil, Check, X } from "lucide-react";
// import type { CoverLetterContent } from "@/types";

// interface CoverLetterEditFormProps {
//   content: CoverLetterContent;
//   onSave: (content: CoverLetterContent) => void;
//   onCancel: () => void;
// }

// export default function CoverLetterEditForm({ content, onSave, onCancel }: CoverLetterEditFormProps) {
//   const [formData, setFormData] = useState<CoverLetterContent>(content);

//   const updateField = <K extends keyof CoverLetterContent>(
//     field: K,
//     value: CoverLetterContent[K]
//   ) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <label className="block text-sm text-text-secondary mb-1.5">Greeting</label>
//         <input
//           type="text"
//           value={formData.greeting}
//           onChange={(e) => updateField("greeting", e.target.value)}
//           className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
//         />
//       </div>

//       <div>
//         <label className="block text-sm text-text-secondary mb-1.5">Opening Paragraph</label>
//         <textarea
//           value={formData.opening_paragraph}
//           onChange={(e) => updateField("opening_paragraph", e.target.value)}
//           rows={4}
//           className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] resize-none"
//         />
//       </div>

//       {formData.body_paragraphs.map((paragraph, i) => (
//         <div key={i}>
//           <label className="block text-sm text-text-secondary mb-1.5">
//             Body Paragraph {i + 1}
//           </label>
//           <textarea
//             value={paragraph}
//             onChange={(e) => {
//               const newParagraphs = [...formData.body_paragraphs];
//               newParagraphs[i] = e.target.value;
//               updateField("body_paragraphs", newParagraphs);
//             }}
//             rows={5}
//             className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] resize-none"
//           />
//         </div>
//       ))}

//       <div>
//         <label className="block text-sm text-text-secondary mb-1.5">Closing Paragraph</label>
//         <textarea
//           value={formData.closing_paragraph}
//           onChange={(e) => updateField("closing_paragraph", e.target.value)}
//           rows={4}
//           className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] resize-none"
//         />
//       </div>

//       <div>
//         <label className="block text-sm text-text-secondary mb-1.5">Sign Off</label>
//         <input
//           type="text"
//           value={formData.sign_off}
//           onChange={(e) => updateField("sign_off", e.target.value)}
//           className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
//         />
//       </div>

//       <div className="flex gap-3 pt-4">
//         <button
//           onClick={() => onSave(formData)}
//           className="px-5 py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
//         >
//           Save Changes
//         </button>
//         <button
//           onClick={onCancel}
//           className="px-5 py-2.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-all"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState } from "react";
import type { CoverLetterContent } from "@/types";

interface CoverLetterEditFormProps {
  content: CoverLetterContent;
  onSave: (content: CoverLetterContent) => void;
  onCancel: () => void;
}

export default function CoverLetterEditForm({ content, onSave, onCancel }: CoverLetterEditFormProps) {
  const [formData, setFormData] = useState<CoverLetterContent>(content);

  const updateField = <K extends keyof CoverLetterContent>(
    field: K,
    value: CoverLetterContent[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="greeting" className="block text-sm text-text-secondary mb-1.5">Greeting</label>
        <input
          id="greeting"
          type="text"
          value={formData.greeting}
          onChange={(e) => updateField("greeting", e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
        />
      </div>

      <div>
        <label htmlFor="opening_paragraph" className="block text-sm text-text-secondary mb-1.5">Opening Paragraph</label>
        <textarea
          id="opening_paragraph"
          value={formData.opening_paragraph}
          onChange={(e) => updateField("opening_paragraph", e.target.value)}
          rows={4}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] resize-none"
        />
      </div>

      {formData.body_paragraphs.map((paragraph, i) => (
        <div key={i}>
          <label htmlFor={`body_paragraph_${i}`} className="block text-sm text-text-secondary mb-1.5">
            Body Paragraph {i + 1}
          </label>
          <textarea
            id={`body_paragraph_${i}`}
            value={paragraph}
            onChange={(e) => {
              const newParagraphs = [...formData.body_paragraphs];
              newParagraphs[i] = e.target.value;
              updateField("body_paragraphs", newParagraphs);
            }}
            rows={5}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] resize-none"
          />
        </div>
      ))}

      <div>
        <label htmlFor="closing_paragraph" className="block text-sm text-text-secondary mb-1.5">Closing Paragraph</label>
        <textarea
          id="closing_paragraph"
          value={formData.closing_paragraph}
          onChange={(e) => updateField("closing_paragraph", e.target.value)}
          rows={4}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] resize-none"
        />
      </div>

      <div>
        <label htmlFor="sign_off" className="block text-sm text-text-secondary mb-1.5">Sign Off</label>
        <input
          id="sign_off"
          type="text"
          value={formData.sign_off}
          onChange={(e) => updateField("sign_off", e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => onSave(formData)}
          className="px-5 py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}