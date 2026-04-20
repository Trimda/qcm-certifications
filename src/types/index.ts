export type Role = 'admin' | 'user' | 'contributor';
export type Topic = 'scrum' | 'devops' | 'safe';
export type SupportedLang = 'fr' | 'en';
export type AnswerMode = 'single' | 'multiple' | 'mixed';

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
  /** string for single-answer, string[] for multiple-answer questions */
  correctAnswer: string | string[];
  /** When true, user must select all correct answers (checkbox mode) */
  isMultiple?: boolean;
}

export interface Qcm {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  topic: Topic;
  /** How answers are presented during practice. Default: 'single' */
  answerMode?: AnswerMode;
  questions: Question[];
  createdBy: string; // User.id
  isPrivate?: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface UserScore {
  userId: string;
  qcmId: string;
  bestScore: number; // percentage 0-100
  rating?: number;  // 1–5 stars
  updatedAt: string;
}

export type AchievementTrigger =
  | 'first_qcm_done'
  | 'perfect_score'
  | 'streak_7_days'
  | 'first_qcm_created'
  | 'complete_N_qcms'
  | 'rocket_click'
  | 'manual';

export interface Achievement {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  /** Phosphor icon name without the "Icon" suffix, e.g. "Trophy", "Rocket" */
  icon: string;
  /** CSS color value, e.g. "#FFE600" */
  color: string;
  /** If true, badge is completely hidden until unlocked */
  secret: boolean;
  /** If true and badge is locked, description is replaced with mystery text */
  descriptionHidden: boolean;
  /** Only one user can unlock this badge */
  unique: boolean;
  /** Can be unlocked multiple times — level increases each time */
  stackable: boolean;
  active: boolean;
  availableFrom?: string;
  availableTo?: string;
  trigger: AchievementTrigger | null;
  triggerThreshold?: number;
  createdAt: string;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
  level?: number;
}