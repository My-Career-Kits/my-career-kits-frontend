export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  bio: string | null;
}
export interface UserSettings {
  email_notif: boolean;
  job_alerts: boolean;
}
export interface ResumeListItem {
  uuid: string;
  title: string;
  score: number | null;
  created_at: string;
  updated_at: string;
}
export interface ResumeContent {
  personal_info: { name: string; email: string };
  summary: string;
  skills: string[];
  experience: Array<{
    job_title: string;
    company: string;
    duration: string;
    bullet_points: string[];
  }>;
  education: string[];
  projects: string[];
  certifications: string[];
  achievements: string[];
}
export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
  missing_keywords: string[];
  created_at: string;
}
export interface Resume {
  uuid: string;
  title: string;
  content: ResumeContent;
  analysis: ResumeAnalysis | null;
  created_at: string;
  updated_at: string;
}
export interface CoverLetterListItem {
  uuid: string;
  title: string;
  score: number | null;
  company_name: string;
  job_title: string;
  created_at: string;
  updated_at: string;
}
export interface CoverLetterContent {
  greeting: string;
  opening_paragraph: string;
  body_paragraphs: string[];
  closing_paragraph: string;
  sign_off: string;
}
export interface CoverLetterAnalysis {
  cover_letter_uuid: string;
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
  missing_keywords: string[];
  created_at: string;
}
export interface CoverLetter {
  uuid: string;
  title: string;
  company_name: string;
  job_title: string;
  content: CoverLetterContent;
  resume: number | null;
  analysis: CoverLetterAnalysis | null; // added — mirrors Resume.analysis
  created_at: string;
  updated_at: string;
  last_analysis_at: string | null;
}
export interface Job {
  job_id: number;
  title: string;
  company: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  salary: string;
  job_type: string;
  description: string;
  apply_url: string;
  posted_date: string;
}
export interface Pagination {
  total_results: number;
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_previous: boolean;
}
export interface JobSearchResult {
  pagination: Pagination;
  keywords: string;
  location: string;
  results: Job[];
}
export type ExperienceLevel = "Student" | "Fresher" | "Junior" | "Mid Level" | "Senior";
export interface ResumeGenerateInput {
  name?: string;
  email?: string;
  role: string;
  experience_level: ExperienceLevel;
  skills: string[];
  education: {
    degree: string;
    institution: string;
    graduation_year?: number;
  };
  projects?: string[];
  certifications?: string[];
  achievements?: string[];
}
export interface CoverLetterGenerateInput {
  job_title: string;
  company_name: string;
  job_description: string;
  resume_uuid?: string;
  name?: string;
  email?: string;
}
export type FooterConfig = {
  brand: {
    name: string;
    tagline: string;
  };
  countries: {
    code: string;
    label: string;
    flag: string;
  }[];
  nav: {
    platform: { label: string; href: string }[];
    company: { label: string; href: string }[];
    legal: { label: string; href: string }[];
  };
  legal: {
    companyNumber: string;
    registeredAddress: string;
    copyright: string;
  };
  social: {
    platform: "linkedin" | "x" | "instagram" | "facebook";
    href: string;
  }[];
};
