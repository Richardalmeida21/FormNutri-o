import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import XLSXStyle from 'xlsx-js-style';
import { jsPDF } from 'jspdf';
import { fetchResponses, signOut, getSession } from '../../lib/supabase';
import type { SurveyResponse } from '../../types/survey';
import { DashboardLogin } from './DashboardLogin';
import { questions } from '../../data/questions';
import { Users, RefreshCw, Share2, BarChart2, Download, Calendar, LayoutList, LogOut, ChevronDown } from 'lucide-react';

const COLORS = ['#10b981', '#14b8a6', '#6ee7b7', '#34d399', '#a7f3d0', '#059669', '#0d9488', '#5eead4'];

interface ChartData {
  name: string;
  value: number;
}

function countField(responses: SurveyResponse[], key: keyof SurveyResponse): ChartData[] {
  const counts: Record<string, number> = {};
  for (const r of responses) {
    const val = r[key];
    if (Array.isArray(val)) {
      for (const v of val) {
        counts[v] = (counts[v] ?? 0) + 1;
      }
    } else if (typeof val === 'string' && val) {
      counts[val] = (counts[val] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

const QUESTION_KEYS: (keyof SurveyResponse)[] = [
  'q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12',
];

// Tipo fixo por questão — independente de quantas opções aparecem
// 'donut' | 'hbar' (horizontal) | 'vbar' (vertical)
const QUESTION_CHART_TYPES: ('donut' | 'hbar' | 'vbar')[] = [
  'donut', // Q1  faixa etária
  'vbar',  // Q2  frequência de consumo
  'vbar',  // Q3  progresso lento
  'donut', // Q4  diferencia suplementos
  'hbar',  // Q5  motivo anabolizantes
  'vbar',  // Q6  riscos
  'donut', // Q7  efeitos colaterais (múltipla escolha)
  'hbar',  // Q8  ouviu conversas
  'vbar',  // Q9  tentação
  'donut', // Q10 fonte de informação
  'hbar',  // Q11 alimentação natural suficiente
  'vbar',  // Q12 avaliação da alimentação
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: ChartData }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1520]/95 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm shadow-2xl">
      <p className="text-gray-300 max-w-[200px] leading-snug">{payload[0].payload.name}</p>
      <p className="text-emerald-400 font-bold mt-1">{payload[0].value} respostas</p>
    </div>
  );
}


interface ChartCardProps {
  title: string;
  data: ChartData[];
  index: number;
  chartType: 'donut' | 'hbar' | 'vbar';
}

function ChartCard({ title, data, index, chartType }: ChartCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!data.length) return null;

  const total = data.reduce((s, d) => s + d.value, 0);
  const activeValue = data[activeIndex]?.value ?? data[0].value;
  const topPct = total > 0 ? Math.round(activeValue / total * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-2xl p-5 border border-white/10 backdrop-blur-md"
      style={{ background: 'rgba(13, 21, 32, 0.65)' }}
    >
      {/* Cabeçalho com número da questão */}
      <div className="flex items-start gap-3 mb-5">
        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-xs font-bold text-emerald-400">
          {index + 1}
        </span>
        <h3 className="text-sm font-semibold text-gray-200 leading-snug">{title}</h3>
      </div>

      {chartType === 'hbar' && (
        <ResponsiveContainer width="100%" height={Math.max(160, data.length * 44)}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) => v.length > 24 ? v.slice(0, 24) + '…' : v}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={28}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {chartType === 'vbar' && (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + '…' : v}
              angle={-30}
              textAnchor="end"
            />
            <YAxis tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {chartType === 'donut' && (
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={82}
                innerRadius={52}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, i) => setActiveIndex(i)}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    opacity={activeIndex === i ? 1 : 0.72}
                    style={{ outline: 'none', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Label central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-white tabular-nums">{topPct}%</span>
            <span className="text-[10px] text-gray-500 mt-0.5">{activeValue} resp.</span>
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
        {data.map((d, i) => {
          const pct = total > 0 ? Math.round(d.value / total * 100) : 0;
          return (
            <div
              key={i}
              className="flex items-center gap-2.5 text-xs cursor-pointer group"
              onMouseEnter={() => chartType === 'donut' && setActiveIndex(i)}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="flex-1 text-gray-400 group-hover:text-gray-200 transition-colors leading-snug">{d.name}</span>
              <span className="text-gray-500 tabular-nums">{d.value}</span>
              <span className="font-semibold text-emerald-400 tabular-nums w-9 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'charts' | 'text'>('charts');
  const [authed, setAuthed] = useState<boolean | null>(null); // null = verificando
  const [exportOpen, setExportOpen] = useState(false);

  // Verifica sessão ao montar
  useEffect(() => {
    getSession().then(session => setAuthed(!!session));
  }, []);

  async function handleLogout() {
    await signOut();
    setAuthed(false);
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchResponses();
      setResponses(data);
    } catch {
      setError('Não foi possível carregar os dados. Verifique a configuração do Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Só busca dados depois que a autenticação for confirmada
  useEffect(() => { if (authed) load(); }, [load, authed]);

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'Resultados da Pesquisa', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Link do painel copiado!'));
    }
  }

  function handleExportCSV() {
    if (!responses.length) return;

    // Stats por pergunta
    const stats = QUESTION_KEYS.map((key, i) => {
      const counts: Record<string, number> = {};
      let total = 0;
      for (const r of responses) {
        const v = r[key];
        const vals = Array.isArray(v) ? v : [v ?? ''];
        for (const val of vals) {
          if (!val) continue;
          counts[val] = (counts[val] ?? 0) + 1;
          total++;
        }
      }
      const entries = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([label, votes]) => ({ label, votes, pct: total > 0 ? Math.round(votes / total * 100) : 0 }));
      return { question: questions[i].text, total, entries };
    });

    // Helpers xlsx-js-style (suporta estilos no browser gratuitamente)
    type CD = { v: string | number; t: string; s: object; z?: string };
    const solidFill = (rgb: string) => ({ patternType: 'solid', fgColor: { rgb }, bgColor: { rgb } });
    const mkFont    = (bold?: boolean, sz = 11, color = '1F2937', italic?: boolean) =>
      ({ bold, sz, italic, color: { rgb: color } });
    const mkAlign   = (horizontal = 'left', wrapText = false) => ({ horizontal, vertical: 'center', wrapText });
    const mkBorder  = (rgb: string, style = 'thin') => {
      const s = { style, color: { rgb } };
      return { top: s, bottom: s, left: s, right: s };
    };
    const mkC = (v: string | number, s: object, z?: string): CD =>
      ({ v, t: typeof v === 'number' ? 'n' : 's', s, z });
    const empty4 = (): CD[] => [0, 1, 2, 3].map(() => mkC('', {}));

    const rows: CD[][] = [];
    const merges: { s: { r: number; c: number }; e: { r: number; c: number } }[] = [];

    // Linha 0 — Título (mesclado A:D)
    merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } });
    rows.push([
      mkC('PESQUISA: SAÚDE, ESTÉTICA & PERFORMANCE', {
        font: mkFont(true, 16, 'FFFFFF'),
        fill: solidFill('064E3B'),
        alignment: mkAlign('center'),
        border: mkBorder('047857', 'medium'),
      }),
      mkC('', { fill: solidFill('064E3B'), border: mkBorder('047857', 'medium') }),
      mkC('', { fill: solidFill('064E3B'), border: mkBorder('047857', 'medium') }),
      mkC('', { fill: solidFill('064E3B'), border: mkBorder('047857', 'medium') }),
    ]);

    // Linha 1 — Subtítulo (mesclado A:D)
    merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 3 } });
    rows.push([
      mkC('Nutrição & Biomedicina  ·  Universidade São Francisco (USF)', {
        font: mkFont(false, 11, 'A7F3D0', true),
        fill: solidFill('065F46'),
        alignment: mkAlign('center'),
      }),
      mkC('', { fill: solidFill('065F46') }),
      mkC('', { fill: solidFill('065F46') }),
      mkC('', { fill: solidFill('065F46') }),
    ]);

    rows.push(empty4());

    // Linhas de metadados
    const metaData: [string, string | number][] = [
      ['Total de respostas', responses.length],
      ['Data de exportação', new Date().toLocaleString('pt-BR')],
      ['Total de perguntas', 12],
    ];
    for (const [label, val] of metaData) {
      rows.push([
        mkC(label, { font: mkFont(false, 11), fill: solidFill('F9FAFB'), alignment: mkAlign('left'), border: mkBorder('E5E7EB') }),
        mkC(val,   { font: mkFont(true, 11, '065F46'), fill: solidFill('F9FAFB'), alignment: mkAlign('center'), border: mkBorder('E5E7EB') }),
        mkC('', { fill: solidFill('F9FAFB') }),
        mkC('', { fill: solidFill('F9FAFB') }),
      ]);
    }

    rows.push(empty4());
    rows.push(empty4());

    // Seção por pergunta
    for (let qi = 0; qi < stats.length; qi++) {
      const s = stats[qi];
      const maxPct = s.entries.length > 0 ? Math.max(...s.entries.map(e => e.pct)) : 0;
      const R = rows.length;

      // Cabeçalho Q (A:C mesclado)
      merges.push({ s: { r: R, c: 0 }, e: { r: R, c: 2 } });
      rows.push([
        mkC(`Q${qi + 1}   ${s.question}`, {
          font: mkFont(true, 11, 'FFFFFF'),
          fill: solidFill('047857'),
          alignment: mkAlign('left', true),
          border: mkBorder('059669', 'medium'),
        }),
        mkC('', { fill: solidFill('047857'), border: mkBorder('059669', 'medium') }),
        mkC('', { fill: solidFill('047857'), border: mkBorder('059669', 'medium') }),
        mkC(`${s.total} resp.`, {
          font: mkFont(false, 10, 'A7F3D0'),
          fill: solidFill('047857'),
          alignment: mkAlign('right'),
          border: mkBorder('059669', 'medium'),
        }),
      ]);

      // Sub-cabeçalho das colunas
      rows.push([
        mkC('Opção de resposta', { font: mkFont(true, 10, '064E3B'), fill: solidFill('D1FAE5'), alignment: mkAlign('left'),   border: mkBorder('6EE7B7') }),
        mkC('Votos',             { font: mkFont(true, 10, '064E3B'), fill: solidFill('D1FAE5'), alignment: mkAlign('center'), border: mkBorder('6EE7B7') }),
        mkC('%',                 { font: mkFont(true, 10, '064E3B'), fill: solidFill('D1FAE5'), alignment: mkAlign('center'), border: mkBorder('6EE7B7') }),
        mkC('Distribuição',      { font: mkFont(true, 10, '064E3B'), fill: solidFill('D1FAE5'), alignment: mkAlign('left'),   border: mkBorder('6EE7B7') }),
      ]);

      // Linhas de opções
      s.entries.forEach((e, j) => {
        const bg = j % 2 === 0 ? 'FFFFFF' : 'F0FDF4';
        const isTop = e.pct === maxPct;
        const bar = '█'.repeat(Math.max(1, Math.round(e.pct / 5)));
        rows.push([
          mkC(e.label, { font: mkFont(isTop, 10, isTop ? '065F46' : '374151'), fill: solidFill(bg), alignment: mkAlign('left'),   border: mkBorder('D1FAE5') }),
          mkC(e.votes, { font: mkFont(isTop, 10, isTop ? '065F46' : '374151'), fill: solidFill(bg), alignment: mkAlign('center'), border: mkBorder('D1FAE5') }),
          mkC(e.pct,   { font: mkFont(isTop, 10, isTop ? '059669' : '374151'), fill: solidFill(bg), alignment: mkAlign('center'), border: mkBorder('D1FAE5') }, '0"%"'),
          mkC(bar,     { font: mkFont(false,  9, isTop ? '059669' : '6EE7B7'), fill: solidFill(bg),                               border: mkBorder('D1FAE5') }),
        ]);
      });

      rows.push(empty4());
      rows.push(empty4());
    }

    // Montar worksheet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ws: any = {};
    rows.forEach((row, R) => {
      row.forEach((cd, C) => {
        const addr = XLSXStyle.utils.encode_cell({ r: R, c: C });
        ws[addr] = { v: cd.v, t: cd.t, s: cd.s };
        if (cd.z) ws[addr].z = cd.z;
      });
    });
    ws['!ref']    = XLSXStyle.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length - 1, c: 3 } });
    ws['!cols']   = [{ wch: 62 }, { wch: 22 }, { wch: 9 }, { wch: 26 }];
    // Altura dinâmica: calcula linhas necessárias pelo texto da célula A (col 0)
    ws['!rows']   = rows.map((row, i) => {
      if (i === 0) return { hpx: 34 };
      const cellVal = String(row[0]?.v ?? '');
      const charsPerLine = 80; // aprox. para fonte 11 em col largura 62
      const lineCount = Math.ceil(cellVal.length / charsPerLine) || 1;
      return { hpx: Math.max(20, lineCount * 16) };
    });
    ws['!merges'] = merges;

    const wb = XLSXStyle.utils.book_new();
    XLSXStyle.utils.book_append_sheet(wb, ws, 'Resumo da Pesquisa');
    XLSXStyle.writeFile(wb, `resumo_pesquisa_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  function handleExportPDF() {
    if (!responses.length) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const PW = 210; // largura A4
    const ML = 14;  // margem esquerda
    const CW = PW - ML * 2; // largura do conteúdo
    const LINE = 5.5; // espaçamento entre linhas
    let y = 0;

    // Paleta
    const C = {
      darkGreen:  [6,  78, 59]  as [number,number,number],
      midGreen:   [4, 120, 87]  as [number,number,number],
      lightGreen: [6,  95, 70]  as [number,number,number],
      pale:       [209,250,229] as [number,number,number],
      white:      [255,255,255] as [number,number,number],
      gray1:      [31, 41, 55]  as [number,number,number],
      gray2:      [107,114,128] as [number,number,number],
      rowEven:    [240,253,244] as [number,number,number],
      barGreen:   [16,185,129]  as [number,number,number],
    };

    const addPage = () => { doc.addPage(); y = 0; };
    const checkY = (needed: number) => { if (y + needed > 282) addPage(); };

    // ── Cabeçalho ────────────────────────────────────────────────────────
    doc.setFillColor(...C.darkGreen);
    doc.rect(0, 0, PW, 22, 'F');
    doc.setTextColor(...C.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('PESQUISA: SAÚDE, ESTÉTICA & PERFORMANCE', PW / 2, 10, { align: 'center' });
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(167, 243, 208);
    doc.text('Nutrição & Biomedicina  ·  Universidade São Francisco (USF)', PW / 2, 17, { align: 'center' });
    y = 28;

    // ── Metadados ────────────────────────────────────────────────────────
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(ML, y, CW, 18, 2, 2, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(ML, y, CW, 18, 2, 2, 'S');
    const metaItems = [
      ['Total de respostas', String(responses.length)],
      ['Data de exportação', new Date().toLocaleString('pt-BR')],
      ['Total de perguntas', '12'],
    ];
    metaItems.forEach(([label, val], i) => {
      const mx = ML + 4 + i * (CW / 3);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...C.gray2);
      doc.text(label, mx, y + 7);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...C.midGreen);
      doc.text(val, mx, y + 13);
    });
    y += 24;

    // ── Estatísticas por pergunta ────────────────────────────────────────
    const stats = QUESTION_KEYS.map((key, i) => {
      const counts: Record<string, number> = {};
      let total = 0;
      for (const r of responses) {
        const v = r[key];
        const vals = Array.isArray(v) ? v : [v ?? ''];
        for (const val of vals) {
          if (!val) continue;
          counts[val] = (counts[val] ?? 0) + 1;
          total++;
        }
      }
      return {
        question: questions[i].text,
        total,
        entries: Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(([label, votes]) => ({ label, votes, pct: total > 0 ? Math.round(votes / total * 100) : 0 })),
      };
    });

    stats.forEach((s, qi) => {
      const rowH = 7;
      const headerH = 10;
      const subH = 6.5;
      const needed = headerH + subH + s.entries.length * rowH + 8;
      checkY(needed);

      // Cabeçalho da pergunta
      doc.setFillColor(...C.midGreen);
      doc.roundedRect(ML, y, CW, headerH, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...C.white);
      const qLabel = `Q${qi + 1}  ${s.question}`;
      const qLines = doc.splitTextToSize(qLabel, CW - 28);
      // Se mais de 1 linha, expande o rect
      if (qLines.length > 1) {
        const extraH = (qLines.length - 1) * LINE;
        doc.setFillColor(...C.midGreen);
        doc.roundedRect(ML, y, CW, headerH + extraH, 1.5, 1.5, 'F');
        doc.text(qLines, ML + 3, y + 6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(167, 243, 208);
        doc.text(`${s.total} resp.`, ML + CW - 3, y + 6, { align: 'right' });
        y += headerH + extraH;
      } else {
        doc.text(qLabel, ML + 3, y + 6.5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(167, 243, 208);
        doc.text(`${s.total} resp.`, ML + CW - 3, y + 6.5, { align: 'right' });
        y += headerH;
      }

      // Sub-cabeçalho das colunas
      doc.setFillColor(...C.pale);
      doc.rect(ML, y, CW, subH, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.darkGreen);
      doc.text('Opção de resposta', ML + 3, y + 4.5);
      doc.text('Votos', ML + CW * 0.68, y + 4.5, { align: 'center' });
      doc.text('%',     ML + CW * 0.78, y + 4.5, { align: 'center' });
      doc.text('Distribuição', ML + CW * 0.90, y + 4.5, { align: 'center' });
      y += subH;

      // Linhas de opções
      const maxPct = s.entries.length > 0 ? Math.max(...s.entries.map(e => e.pct)) : 0;
      s.entries.forEach((e, j) => {
        checkY(rowH + 2);
        const isTop = e.pct === maxPct;
        const bg: [number,number,number] = j % 2 === 0 ? C.white : C.rowEven;
        doc.setFillColor(...bg);
        doc.rect(ML, y, CW, rowH, 'F');

        doc.setFont('helvetica', isTop ? 'bold' : 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...(isTop ? C.darkGreen : C.gray1));
        // Label da opção (truncar se necessário)
        const labelLines = doc.splitTextToSize(e.label, CW * 0.62);
        doc.text(labelLines[0], ML + 3, y + 4.8);

        doc.setFont('helvetica', isTop ? 'bold' : 'normal');
        doc.setTextColor(...(isTop ? C.darkGreen : C.gray1));
        doc.text(String(e.votes), ML + CW * 0.68, y + 4.8, { align: 'center' });
        doc.setTextColor(...(isTop ? [5,150,105] as [number,number,number] : C.gray1));
        doc.text(`${e.pct}%`, ML + CW * 0.78, y + 4.8, { align: 'center' });

        // Barra de progresso
        const barX = ML + CW * 0.83;
        const barW = CW * 0.15;
        const barH = 3;
        const barY = y + (rowH - barH) / 2;
        doc.setFillColor(209, 250, 229);
        doc.roundedRect(barX, barY, barW, barH, 0.5, 0.5, 'F');
        if (e.pct > 0) {
          doc.setFillColor(...C.barGreen);
          doc.roundedRect(barX, barY, barW * (e.pct / 100), barH, 0.5, 0.5, 'F');
        }
        y += rowH;
      });

      // Linha divisória
      doc.setDrawColor(209, 250, 229);
      doc.line(ML, y, ML + CW, y);
      y += 6;
    });

    // ── Rodapé em todas as páginas ────────────────────────────────────────
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFillColor(...C.darkGreen);
      doc.rect(0, 288, PW, 10, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(167, 243, 208);
      doc.text(`Pesquisa USF  ·  Nutrição & Biomedicina  ·  ${new Date().toLocaleDateString('pt-BR')}`, ML, 293);
      doc.text(`Página ${p} / ${totalPages}`, PW - ML, 293, { align: 'right' });
    }

    doc.save(`relatorio_pesquisa_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  const kpis = [
    {
      label: 'Total de respostas',
      value: responses.length,
      icon: <Users size={20} />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Perguntas',
      value: 12,
      icon: <BarChart2 size={20} />,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
    },
    {
      label: 'Respostas hoje',
      value: responses.filter(
        (r) => r.created_at && new Date(r.created_at).toDateString() === new Date().toDateString()
      ).length,
      icon: <RefreshCw size={20} />,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Última resposta',
      value: responses[0]?.created_at
        ? new Date(responses[0].created_at).toLocaleDateString('pt-BR')
        : '—',
      icon: <Calendar size={20} />,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
  ];

  // Guard: verificando sessão
  if (authed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Guard: não autenticado → tela de login
  if (!authed) {
    return <DashboardLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen px-4 pt-4 pb-24">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="mb-4">
          {/* Linha 1: logo + título */}
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo.png" alt="USF" className="h-9 w-auto object-contain flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-[0.15em] text-emerald-400 uppercase">
                Painel de Resultados
              </span>
              <h1 className="text-base sm:text-2xl font-black text-white leading-tight">
                Universidade São Francisco
              </h1>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center gap-1.5 flex-nowrap">
            <button
              onClick={load}
              title="Atualizar"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm whitespace-nowrap"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>

            {/* Dropdown Exportar */}
            <div className="relative">
              <button
                onClick={() => setExportOpen(o => !o)}
                title="Exportar"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm whitespace-nowrap"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Exportar</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${exportOpen ? 'rotate-180' : ''}`} />
              </button>
              {exportOpen && (
                <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[160px] rounded-xl bg-[#0d1520] border border-white/10 shadow-2xl overflow-hidden">
                  <button
                    onClick={() => { handleExportCSV(); setExportOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-all text-left"
                  >
                    <Download size={13} className="text-emerald-400" />
                    Exportar Excel
                  </button>
                  <div className="h-px bg-white/5" />
                  <button
                    onClick={() => { handleExportPDF(); setExportOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-all text-left"
                  >
                    <Download size={13} className="text-teal-400" />
                    Exportar PDF
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleShare}
              title="Compartilhar"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all text-sm font-semibold whitespace-nowrap"
            >
              <Share2 size={14} />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
            <button
              onClick={handleLogout}
              title="Sair"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all text-sm whitespace-nowrap"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((k, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 border border-white/10 backdrop-blur-md"
              style={{ background: 'rgba(13, 21, 32, 0.65)' }}
            >
              <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center ${k.color} mb-3`}>
                {k.icon}
              </div>
              <div className={`text-2xl font-black tabular-nums ${k.color}`}>{k.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Toggle Visualização */}
      <div className="max-w-6xl mx-auto flex items-center gap-3 mb-2">
        <span className="text-white text-xs font-medium flex items-center gap-1.5">
          <LayoutList size={13} /> Visualização
        </span>
        <div className="flex rounded-xl border border-white/10 overflow-hidden backdrop-blur-md" style={{ background: 'rgba(13,21,32,0.6)' }}>
          <button
            onClick={() => setViewMode('charts')}
            className={`px-4 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'charts'
                ? 'bg-emerald-500/25 text-white border-r border-emerald-500/30'
                : 'text-white hover:text-white border-r border-white/10'
            }`}
          >
            Gráficos
          </button>
          <button
            onClick={() => setViewMode('text')}
            className={`px-4 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'text'
                ? 'bg-emerald-500/25 text-white'
                : 'text-white hover:text-white'
            }`}
          >
            Texto
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="max-w-6xl mx-auto">
        {loading && (
          <div className="text-center py-20 text-gray-500">
            <svg className="animate-spin w-8 h-8 mx-auto mb-4 text-emerald-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Carregando dados...
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-sm max-w-md mx-auto">{error}</p>
            <p className="text-gray-600 text-xs mt-2">
              Configure o arquivo <code className="text-gray-400">.env</code> com suas credenciais do Supabase.
            </p>
          </div>
        )}

        {!loading && !error && responses.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>Nenhuma resposta ainda.</p>
            <p className="text-sm mt-1 text-gray-600">Compartilhe o formulário para começar a coletar dados.</p>
          </div>
        )}

        {!loading && !error && responses.length > 0 && viewMode === 'charts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUESTION_KEYS.map((key, i) => {
              const data = countField(responses, key);
              const q = questions[i];
              return (
                <ChartCard
                  key={key}
                  title={q.text}
                  data={data}
                  index={i}
                  chartType={QUESTION_CHART_TYPES[i]}
                />
              );
            })}
          </div>
        )}

        {!loading && !error && responses.length > 0 && viewMode === 'text' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUESTION_KEYS.map((key, qi) => {
              const counts: Record<string, number> = {};
              let total = 0;
              for (const r of responses) {
                const v = r[key];
                const vals = Array.isArray(v) ? v : [v ?? ''];
                for (const val of vals) {
                  if (!val) continue;
                  counts[val] = (counts[val] ?? 0) + 1;
                  total++;
                }
              }
              const entries = Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .map(([label, votes]) => ({ label, votes, pct: total > 0 ? Math.round(votes / total * 100) : 0 }));
              const maxPct = entries.length > 0 ? Math.max(...entries.map(e => e.pct)) : 0;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qi * 0.04 }}
                  className="rounded-2xl overflow-hidden border border-white/10 flex flex-col"
                  style={{ background: 'rgba(13,21,32,0.65)' }}
                >
                  {/* Cabeçalho */}
                  <div className="flex items-start justify-between gap-2 px-4 py-3 border-b border-white/8" style={{ background: 'rgba(4,120,87,0.18)' }}>
                    <span className="text-[10px] font-black text-emerald-500 shrink-0 mt-0.5 tracking-wide">Q{qi + 1}</span>
                    <span className="text-xs font-semibold text-white/90 flex-1 leading-snug">{questions[qi].text}</span>
                    <span className="text-[10px] text-emerald-500/60 shrink-0 mt-0.5 tabular-nums">{total}</span>
                  </div>
                  {/* Opções */}
                  <div className="flex flex-col divide-y divide-white/5">
                    {entries.map((e, j) => {
                      const isTop = e.pct === maxPct;
                      return (
                        <div key={j} className="flex items-center gap-3 px-4 py-2.5">
                          {/* Label */}
                          <span className={`flex-1 text-xs leading-snug truncate ${isTop ? 'text-white font-semibold' : 'text-gray-400'}`}>
                            {e.label}
                          </span>
                          {/* % badge */}
                          <span className={`text-xs tabular-nums font-bold shrink-0 ${isTop ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {e.pct}%
                          </span>
                          {/* Barra */}
                          <div className="w-20 shrink-0">
                            <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${isTop ? 'bg-emerald-400' : 'bg-emerald-800'}`}
                                style={{ width: `${e.pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
