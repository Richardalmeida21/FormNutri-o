import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckSquare } from 'lucide-react';
import type { Question } from '../../types/survey';

interface QuestionSlideProps {
  question: Question;
  index: number;
  total: number;
  direction: number;
  value: string | string[];
  onChange: (val: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  isLast: boolean;
  isSubmitting: boolean;
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
};

export function QuestionSlide({
  question,
  index,
  total,
  direction,
  value,
  onChange,
  onNext,
  onPrev,
  isLast,
  isSubmitting,
}: QuestionSlideProps) {
  const [otherText, setOtherText] = useState('');

  const isAnswered =
    question.type === 'checkbox'
      ? (value as string[]).length > 0
      : (value as string) !== '';

  function handleRadio(opt: string) {
    onChange(opt);
  }

  function handleCheckbox(opt: string) {
    const current = value as string[];
    if (current.includes(opt)) {
      onChange(current.filter((v) => v !== opt));
    } else {
      onChange([...current, opt]);
    }
  }

  function handleOtherRadio() {
    if (otherText.trim()) onChange(`Outro: ${otherText.trim()}`);
    else onChange('Outro:');
  }

  function handleOtherText(text: string) {
    setOtherText(text);
    if (text.trim()) onChange(`Outro: ${text.trim()}`);
    else onChange('Outro:');
  }

  const isOtherSelected = typeof value === 'string' && value.startsWith('Outro:');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-16 pb-8">
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={question.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-2xl"
        >
          {/* Question number */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            {question.type === 'checkbox' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/20 text-teal-400 text-xs font-medium">
                <CheckSquare size={11} />
                Múltipla escolha
              </span>
            )}
          </div>

          {/* Question text */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-8">
            {question.text}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-3 mb-8">
            {question.options.map((opt) => {
              const selected =
                question.type === 'checkbox'
                  ? (value as string[]).includes(opt)
                  : (value as string) === opt;
              return (
                <button
                  key={opt}
                  onClick={() =>
                    question.type === 'checkbox' ? handleCheckbox(opt) : handleRadio(opt)
                  }
                  className={`group flex items-center gap-4 w-full px-5 py-4 rounded-2xl border text-left transition-all duration-200 ${
                    selected
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-white/3 border-white/8 text-gray-300 hover:bg-white/6 hover:border-white/15 hover:text-white'
                  }`}
                >
                  {/* indicator */}
                  <span
                    className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                      selected ? 'border-emerald-400 bg-emerald-500' : 'border-white/20 group-hover:border-white/35'
                    }`}
                  >
                    {selected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 rounded-full bg-white"
                      />
                    )}
                  </span>
                  <span className="text-sm sm:text-base leading-snug">{opt}</span>
                </button>
              );
            })}

            {/* "Outro" option */}
            {question.hasOther && (
              <div
                onClick={handleOtherRadio}
                className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isOtherSelected
                    ? 'bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15'
                }`}
              >
                <span
                  className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    isOtherSelected ? 'border-emerald-400 bg-emerald-500' : 'border-white/20'
                  }`}
                >
                  {isOtherSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2.5 h-2.5 rounded-full bg-white"
                    />
                  )}
                </span>
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => handleOtherText(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Outro: escreva aqui..."
                  className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-gray-300 placeholder-gray-500"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {index > 0 && (
              <button
                onClick={onPrev}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
            )}

            <button
              onClick={onNext}
              disabled={!isAnswered || isSubmitting}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 transition-all duration-200 shadow-lg shadow-emerald-500/20 ml-auto"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Enviando...
                </>
              ) : isLast ? (
                <>
                  Enviar respostas
                  <CheckSquare size={16} />
                </>
              ) : (
                <>
                  Próxima
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {!isAnswered && (
            <p className="text-gray-600 text-xs mt-3 text-right">
              Selecione uma opção para continuar
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
