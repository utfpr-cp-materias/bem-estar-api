import {
  calculateOverallScore,
  categorizeScore,
  isNegativeCategory,
  normalizeValue,
  isValidAnswerValue,
  NEGATIVE_CATEGORIES,
} from '../src/utils/scoreCalculator';
import { QuestionCategory } from '@prisma/client';

describe('scoreCalculator', () => {
  describe('isNegativeCategory', () => {
    it.each(NEGATIVE_CATEGORIES)('classifica %s como negativa', (cat) => {
      expect(isNegativeCategory(cat)).toBe(true);
    });

    it.each<QuestionCategory>(['EMOTIONAL_WELLBEING', 'ENERGY', 'CONCENTRATION', 'IMPROVEMENT_GOALS'])(
      'não classifica %s como negativa',
      (cat) => {
        expect(isNegativeCategory(cat)).toBe(false);
      },
    );
  });

  describe('normalizeValue', () => {
    it('mantém valor para categoria positiva (EMOTIONAL_WELLBEING)', () => {
      expect(normalizeValue(8, 'EMOTIONAL_WELLBEING')).toBe(8);
      expect(normalizeValue(1, 'EMOTIONAL_WELLBEING')).toBe(1);
      expect(normalizeValue(10, 'EMOTIONAL_WELLBEING')).toBe(10);
    });

    it('inverte valor para categoria negativa (ANXIETY) usando fórmula 11 - x', () => {
      expect(normalizeValue(10, 'ANXIETY')).toBe(1);
      expect(normalizeValue(1, 'ANXIETY')).toBe(10);
      expect(normalizeValue(5, 'ANXIETY')).toBe(6);
    });

    it('preserva o ponto médio (5.5) após inversão', () => {
      const mid = 5.5;
      expect(normalizeValue(mid, 'STRESS')).toBe(mid);
    });
  });

  describe('isValidAnswerValue', () => {
    it('aceita valores dentro do range 1-10', () => {
      expect(isValidAnswerValue(1)).toBe(true);
      expect(isValidAnswerValue(10)).toBe(true);
      expect(isValidAnswerValue(5.5)).toBe(true);
    });

    it('rejeita valores fora do range 1-10', () => {
      expect(isValidAnswerValue(0)).toBe(false);
      expect(isValidAnswerValue(11)).toBe(false);
      expect(isValidAnswerValue(-3)).toBe(false);
    });
  });

  describe('calculateOverallScore', () => {
    const questions = [
      { id: 'q1', category: 'EMOTIONAL_WELLBEING' as QuestionCategory },
      { id: 'q2', category: 'ANXIETY' as QuestionCategory },
      { id: 'q3', category: 'STRESS' as QuestionCategory },
      { id: 'q4', category: 'ENERGY' as QuestionCategory },
    ];

    it('retorna 5 (neutro) para vetor vazio de respostas', () => {
      expect(calculateOverallScore([], questions)).toBe(5);
    });

    it('média de respostas todas positivas (categorias positivas) sem inversão', () => {
      const answers = [
        { questionId: 'q1', value: 8 },
        { questionId: 'q4', value: 9 },
      ];
      expect(calculateOverallScore(answers, questions)).toBe(8.5);
    });

    it('respostas em categorias negativas são invertidas (10 vira 1)', () => {
      const answers = [
        { questionId: 'q2', value: 10 },
        { questionId: 'q3', value: 9 },
      ];
      expect(calculateOverallScore(answers, questions)).toBe(1.5);
    });

    it('combina categorias positivas e negativas corretamente', () => {
      const answers = [
        { questionId: 'q1', value: 8 },
        { questionId: 'q2', value: 9 },
        { questionId: 'q3', value: 8 },
        { questionId: 'q4', value: 7 },
      ];
      // q1=8 (positiva), q2 invertida=11-9=2, q3 invertida=11-8=3, q4=7 (positiva)
      // média = (8+2+3+7)/4 = 5
      expect(calculateOverallScore(answers, questions)).toBeCloseTo(5, 5);
    });

    it('ignora respostas cuja pergunta não foi encontrada', () => {
      const answers = [
        { questionId: 'q1', value: 8 },
        { questionId: 'fantasma', value: 10 },
      ];
      expect(calculateOverallScore(answers, questions)).toBe(8);
    });

    it('retorna 5 quando nenhuma resposta casa com perguntas conhecidas', () => {
      const answers = [{ questionId: 'fantasma', value: 10 }];
      expect(calculateOverallScore(answers, questions)).toBe(5);
    });
    
    it('ignora respostas com valor fora do range válido', () => {
      const answers = [
        { questionId: 'q1', value: 8 },
        { questionId: 'q2', value: 15 },
      ];
      expect(calculateOverallScore(answers, questions)).toBe(8);
    });
  });

  describe('categorizeScore', () => {
    it.each([
      [10.0, 'EXCELLENT'],
      [8.0, 'EXCELLENT'],
      [7.9, 'GOOD'],
      [6.5, 'GOOD'],
      [6.4, 'MODERATE'],
      [5.0, 'MODERATE'],
      [4.9, 'ATTENTION'],
      [3.5, 'ATTENTION'],
      [3.4, 'CRITICAL'],
      [0, 'CRITICAL'],
    ])('score %s → %s', (score, expected) => {
      expect(categorizeScore(score)).toBe(expected);
    });
  });
});