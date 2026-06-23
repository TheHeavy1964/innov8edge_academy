export interface Lesson {
  id: string;
  trackId: string;
  title: string;
  description: string;
  duration: string;
  humanModeContent?: string;
  examples?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  content: string;
}
