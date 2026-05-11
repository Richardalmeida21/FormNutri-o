import { motion } from 'framer-motion';
import { CheckCircle, Share2, Home } from 'lucide-react';

export function SuccessScreen() {
  const shareUrl = window.location.href.split('#')[0];

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'Pesquisa Saúde, Estética e Performance', url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => alert('Link copiado!'));
    }
  }

  function handleHome() {
    window.location.href = '/';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30"
      >
        <CheckCircle size={48} className="text-white" strokeWidth={2} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-4xl font-black text-white mb-3">Respostas enviadas!</h2>
        <p className="text-gray-400 text-lg max-w-md leading-relaxed mb-8">
          Obrigada pela participação! Suas respostas contribuem diretamente para nossa pesquisa
          acadêmica sobre saúde, estética e performance.
        </p>

        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={handleHome}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:opacity-90 transition-opacity text-sm font-semibold shadow-lg shadow-emerald-500/25"
          >
            <Home size={16} />
            Voltar ao início
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <Share2 size={16} />
            Compartilhar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
