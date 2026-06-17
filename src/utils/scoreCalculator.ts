import { QuestionCategory, ReportCategory } from '@prisma/client';

export const NEGATIVE_CATEGORIES: QuestionCategory[] = [
  'ANXIETY',
  'STRESS',
  'MOOD',
  'SOCIAL',
];

const MIN_VALUE = 1;
const MAX_VALUE = 10;

export interface AnswerInput {
  questionId: string;
  value: number;
}

export interface QuestionInput {
  id: string;
  category: QuestionCategory;
}

export const isNegativeCategory = (category: QuestionCategory): boolean =>
  NEGATIVE_CATEGORIES.includes(category);

export const isValidAnswerValue = (value: number): boolean =>
  value >= MIN_VALUE && value <= MAX_VALUE;

export const normalizeValue = (value: number, category: QuestionCategory): number =>
  isNegativeCategory(category) ? 11 - value : value;

export const calculateOverallScore = (
  answers: AnswerInput[],
  questions: QuestionInput[],
): number => {
  if (answers.length === 0) return 5;

  let totalScore = 0;
  let count = 0;

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;
    if (!isValidAnswerValue(answer.value)) continue;
    totalScore += normalizeValue(answer.value, question.category);
    count++;
  }

  return count > 0 ? totalScore / count : 5;
};

export const categorizeScore = (score: number): ReportCategory => {
  if (score >= 8.0) return 'EXCELLENT';
  if (score >= 6.5) return 'GOOD';
  if (score >= 5.0) return 'MODERATE';
  if (score >= 3.5) return 'ATTENTION';
  return 'CRITICAL';
};