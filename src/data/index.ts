import { knowledgeGapsData } from './knowledgeGaps';
import quizzesData from './quizzes.json';
import subjectsData from './subjects.json';
import { QuizData, Subject } from '../types';

export const allQuizzes: QuizData[] = quizzesData as QuizData[];
export const allSubjects: Subject[] = subjectsData as Subject[];
export { knowledgeGapsData };
