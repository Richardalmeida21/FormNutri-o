import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { questions } from '../../data/questions';
import { submitResponse } from '../../lib/supabase';
import type { SurveyResponse } from '../../types/survey';
import { WelcomeScreen } from './WelcomeScreen';
import { QuestionSlide } from './QuestionSlide';
import { SuccessScreen } from './SuccessScreen';
import { ProgressBar } from './ProgressBar';

type Step = 'welcome' | 'questions' | 'success';

type Answers = Record<number, string | string[]>;

export function SurveyForm() {
  const [step, setStep] = useState<Step>('welcome');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleStart() {
    setStep('questions');
  }

  function handleChange(val: string | string[]) {
    setAnswers((prev) => ({ ...prev, [current]: val }));
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setDirection(1);
      setCurrent((c) => c + 1);
    } else {
      handleSubmit();
    }
  }

  function handlePrev() {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  }

  async function handleSubmit() {
    // Anti-spam: bloqueia nova submissão do mesmo browser por 1 hora
    const SPAM_KEY = 'usf_survey_submitted_at';
    const COOLDOWN = 60 * 60 * 1000; // 1h em ms
    const last = localStorage.getItem(SPAM_KEY);
    if (last && Date.now() - parseInt(last) < COOLDOWN) {
      setStep('success'); // redireciona sem reenviar
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Omit<SurveyResponse, 'id' | 'created_at'> = {
        q1: (answers[0] as string) ?? '',
        q2: (answers[1] as string) ?? '',
        q3: (answers[2] as string) ?? '',
        q4: (answers[3] as string) ?? '',
        q5: (answers[4] as string) ?? '',
        q6: (answers[5] as string) ?? '',
        q7: (answers[6] as string[]) ?? [],
        q8: (answers[7] as string) ?? '',
        q9: (answers[8] as string) ?? '',
        q10: (answers[9] as string) ?? '',
        q11: (answers[10] as string) ?? '',
        q12: (answers[11] as string) ?? '',
      };
      await submitResponse(payload);
      localStorage.setItem('usf_survey_submitted_at', String(Date.now()));
    } catch (e) {
      console.error('Erro ao enviar:', e);
    } finally {
      setIsSubmitting(false);
      setStep('success');
    }
  }

  const currentValue = answers[current] ?? (questions[current]?.type === 'checkbox' ? [] : '');

  return (
    <>
      {step === 'questions' && (
        <ProgressBar current={current + 1} total={questions.length} />
      )}

      <AnimatePresence mode="wait">
        {step === 'welcome' && <WelcomeScreen key="welcome" onStart={handleStart} />}
        {step === 'questions' && (
          <QuestionSlide
            key={`q-${current}`}
            question={questions[current]}
            index={current}
            total={questions.length}
            direction={direction}
            value={currentValue}
            onChange={handleChange}
            onNext={handleNext}
            onPrev={handlePrev}
            isLast={current === questions.length - 1}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 'success' && <SuccessScreen key="success" />}
      </AnimatePresence>
    </>
  );
}
