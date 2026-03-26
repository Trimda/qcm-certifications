export type Role = 'admin' | 'user' | 'contributor';
export type Topic = 'scrum' | 'devops' | 'safe';
export type SupportedLang = 'fr' | 'en';

/** Bilingual string stored in QCM data */
export interface LocalizedText {
  fr: string;
  en: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // omitted in client responses
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AnswerOption {
  id: string;
  text: LocalizedText;
}

export interface Question {
  id: string;
  text: LocalizedText;
  options: AnswerOption[];
  correctAnswer: string; // matches AnswerOption.id
}

export interface Qcm {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  topic: Topic;
  questions: Question[];
  createdBy: string; // User.id
  createdAt: string;
  updatedAt: string;
}
