import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SurveyForm } from './components/survey/SurveyForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { LayoutDashboard, ClipboardList } from 'lucide-react';

function Nav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-2 rounded-2xl bg-[#0d1520]/90 backdrop-blur-md border border-white/10 shadow-2xl">
      <Link
        to="/"
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          pathname === '/'
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        <ClipboardList size={15} />
        Formulário
      </Link>
      <Link
        to="/dashboard"
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          pathname === '/dashboard'
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'text-gray-500 hover:text-gray-300'
        }`}
        aria-label="Painel de resultados"
      >
        <LayoutDashboard size={15} />
      </Link>
    </nav>
  );
}

function Background() {
  const { pathname } = useLocation();
  const isDashboard = pathname === '/dashboard';

  return (
    <>
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <img
          src="/background.png"
          alt=""
          className="w-full h-full object-cover object-center transition-all duration-700"
          style={{
            filter: isDashboard
              ? 'blur(6px) saturate(0.45) brightness(0.65)'
              : 'blur(0px) saturate(1) brightness(1)',
            transform: 'scale(1.05)',
          }}
        />
        {/* overlay: mais escuro e esverdeado no dashboard */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: isDashboard
              ? 'rgba(4, 10, 14, 0.80)'
              : 'rgba(7, 13, 23, 0.75)',
          }}
        />
      </div>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full bg-emerald-600/6 blur-[100px]" />
        <div className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full bg-teal-500/6 blur-[100px]" />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Background />

      <Nav />

      <Routes>
        <Route path="/" element={<SurveyForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}



