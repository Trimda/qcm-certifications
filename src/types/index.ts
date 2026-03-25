export type Role = 'admin' | 'user' | 'contributor';
export type Topic = 'scrum' | 'devops' | 'safe';

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
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
  correctAnswer: string; // matches AnswerOption.id
}

export interface Qcm {
  id: string;
  title: string;
  description: string;
  topic: Topic;
  questions: Question[];
  createdBy: string; // User.id
  createdAt: string;
  updatedAt: string;
}
