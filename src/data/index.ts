import { knowledgeGapsData } from './knowledgeGaps';
import quizzesData from './quizzes.json';
import { QuizData } from '../types';

export const allQuizzes: QuizData[] = quizzesData as QuizData[];
export { knowledgeGapsData };
