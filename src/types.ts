export interface Explanation {
  en: string;
  ar: string;
}

export interface Question {
  question_en: string;
  question_ar: string;
  options_en: string[];
  options_ar: string[];
  correctIndex: number;
  explanation: Explanation;
}

export type Subject = 'chemistry' | 'biology' | 'physics';
export type ContentType = 'quiz' | 'html';

export interface QuizData {
  id: string;
  title_en: string;
  title_ar: string;
  subject?: Subject;
  type?: ContentType;
  htmlContent?: string;
  questions: Question[];
}

export interface KnowledgeGap {
  question_en: string;
  question_ar: string;
  options_en: string[];
  options_ar: string[];
  correctIndex: number;
  userAnsIndex: number | null;
  explanation: Explanation;
  keyWords: { en: string; ar: string }[];
}

export interface GapsData {
  [topic: string]: KnowledgeGap[];
}
