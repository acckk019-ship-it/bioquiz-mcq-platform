import { transitionElementsQuiz } from './transitionElements';
import { chemicalAnalysisQuiz } from './chemicalAnalysis';
import { chemicalEquilibriumQuiz } from './chemicalEquilibrium';
import { electrochemistryQuiz } from './electrochemistry';
import { knowledgeGapsData } from './knowledgeGaps';

import { QuizData } from '../types';

const hardcodedQuizzes: QuizData[] = [
  { ...transitionElementsQuiz, subject: 'chemistry' },
  { ...chemicalAnalysisQuiz, subject: 'chemistry' },
  { ...chemicalEquilibriumQuiz, subject: 'chemistry' },
  { ...electrochemistryQuiz, subject: 'chemistry' },
];

export const getCustomQuizzes = (): QuizData[] => {
  try {
    const data = localStorage.getItem('custom_quizzes');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const allQuizzes = [...hardcodedQuizzes, ...getCustomQuizzes()];

export { knowledgeGapsData };
