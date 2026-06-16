"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { ResumeContent } from "@/types";

interface ResumeEditFormProps {
  content: ResumeContent;
  onSave: (content: ResumeContent) => void;
  onCancel: () => void;
}

export default function ResumeEditForm({ content, onSave, onCancel }: ResumeEditFormProps) {
  const [formData, setFormData] = useState<ResumeContent>(content);

  const updateField = <K extends keyof ResumeContent>(
    field: K,
    value: ResumeContent[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addListItem = (field: "education" | "projects" | "certifications" | "achievements") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const updateListItem = (
    field: "education" | "projects" | "certifications" | "achievements",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeListItem = (
    field: "education" | "projects" | "certifications" | "achievements",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Name</label>
          <input
            type="text"
            value={formData.personal_info.name}
            onChange={(e) =>
              updateField("personal_info", {
                ...formData.personal_info,
                name: e.target.value,
              })
            }
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Email</label>
          <input
            type="email"
            value={formData.personal_info.email}
            onChange={(e) =>
              updateField("personal_info", {
                ...formData.personal_info,
                email: e.target.value,
              })
            }
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
          />
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm text-text-secondary mb-1.5">Summary</label>
        <textarea
          value={formData.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          rows={4}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] resize-none"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm text-text-secondary mb-1.5">Skills</label>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20"
            >
              {skill}
              <button
                onClick={() =>
                  updateField(
                    "skills",
                    formData.skills.filter((_, idx) => idx !== i)
                  )
                }
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm text-text-secondary mb-1.5">Experience</label>
        <div className="space-y-3">
          {formData.experience.map((exp, i) => (
            <div key={i} className="p-3 rounded-lg border border-border bg-background">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <input
                  type="text"
                  value={exp.job_title}
                  onChange={(e) => {
                    const newExp = [...formData.experience];
                    newExp[i] = { ...exp, job_title: e.target.value };
                    updateField("experience", newExp);
                  }}
                  placeholder="Job Title"
                  className="bg-surface border border-border rounded px-2 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => {
                    const newExp = [...formData.experience];
                    newExp[i] = { ...exp, company: e.target.value };
                    updateField("experience", newExp);
                  }}
                  placeholder="Company"
                  className="bg-surface border border-border rounded px-2 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={exp.duration}
                onChange={(e) => {
                  const newExp = [...formData.experience];
                  newExp[i] = { ...exp, duration: e.target.value };
                  updateField("experience", newExp);
                }}
                placeholder="Duration"
                className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none mb-2"
              />
              <textarea
                value={exp.bullet_points.join("\n")}
                onChange={(e) => {
                  const newExp = [...formData.experience];
                  newExp[i] = { ...exp, bullet_points: e.target.value.split("\n") };
                  updateField("experience", newExp);
                }}
                placeholder="Bullet points (one per line)"
                rows={3}
                className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Reusable list fields */}
      {(["education", "projects", "certifications", "achievements"] as const).map(
        (field) => (
          <div key={field}>
            <label className="block text-sm text-text-secondary mb-1.5 capitalize">
              {field}
            </label>
            <div className="space-y-2">
              {formData[field].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(field, i, e.target.value)}
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                  <button
                    onClick={() => removeListItem(field, i)}
                    className="text-text-tertiary hover:text-danger"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => addListItem(field)}
              className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add {field.slice(0, -1)}
            </button>
          </div>
        )
      )}

      {/* Actions */}
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
