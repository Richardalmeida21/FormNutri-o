import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogIn } from 'lucide-react';
import { signIn } from '../../lib/supabase';

interface Props {
  onSuccess: () => void;
}

export function DashboardLogin({ onSuccess }: Props) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      onSuccess();
    } catch {
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-screen px-6"
    >
      <div className="w-full max-w-sm">
        {/* Ícone + título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 mb-4">
            <Lock size={22} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Painel Restrito</h1>
          <p className="text-sm text-gray-500">Acesso exclusivo para pesquisadoras</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            autoComplete="email"
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
          />

          {error && (
            <p className="text-xs text-red-400 text-center py-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all mt-1"
          >
            <LogIn size={15} />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
