import { motion } from 'framer-motion';
import { ArrowRight, FlaskConical, Leaf, Users } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
    >
      {/* blobs de luz da welcome */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 justify-center mb-6 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 w-fit mx-auto">
          <img src="/logo.png" alt="Logo USF" className="h-12 w-auto object-contain" />
          <span className="text-sm font-semibold tracking-wider uppercase text-white">
            Universidade São Francisco - USF
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.1] mb-4 text-center">
          Saúde, Estética &amp; Performance
        </h1>
        <p className="text-white/90 text-lg max-w-xl leading-relaxed text-center mx-auto">
          Pesquisa com finalidade educacional desenvolvida por alunas dos cursos de{' '}
          <strong className="text-white">Nutrição</strong> e{' '}
          <strong className="text-white">Biomedicina</strong> da Universidade São Francisco.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-wrap gap-4 justify-center mb-10"
      >
        {[
          { icon: <Leaf size={16} />, label: 'Nutrição' },
          { icon: <FlaskConical size={16} />, label: 'Biomedicina' },
          { icon: <Users size={16} />, label: 'Fins Acadêmicos' },
        ].map((tag) => (
          <div
            key={tag.label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
          >
            {tag.icon}
            {tag.label}
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center gap-5"
      >
        <div className="relative w-72 sm:w-96 p-[1.5px] rounded-2xl overflow-hidden">
          {/* Beam 1 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-75">
            <div
              className="animate-spin-slow"
              style={{
                width: '200%',
                aspectRatio: '1 / 1',
                background:
                  'conic-gradient(from 0deg, transparent 0%, transparent 87%, #10b981 91%, #6ee7b7 93%, transparent 96%, transparent 100%)',
              }}
            />
          </div>
          {/* Beam 2 — gira ao contrário, se encontra com o 1 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-75">
            <div
              className="animate-spin-slow-reverse"
              style={{
                width: '200%',
                aspectRatio: '1 / 1',
                background:
                  'conic-gradient(from 180deg, transparent 0%, transparent 87%, #10b981 91%, #6ee7b7 93%, transparent 96%, transparent 100%)',
              }}
            />
          </div>
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-[14px] bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold text-lg overflow-hidden"
          >
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            Começar Pesquisa
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </motion.button>
        </div>

        {/* Info badges */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {[
            { emoji: '🔒', label: 'Anônimo' },
            { emoji: '⏱️', label: '~3 minutos' },
            { emoji: '📋', label: '12 perguntas' },
          ].map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold backdrop-blur-sm"
            >
              {item.emoji} {item.label}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
