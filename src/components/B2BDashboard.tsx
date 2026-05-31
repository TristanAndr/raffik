import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Confetti from './Confetti';
import {
  TrendingUp,
  Wallet,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  Download,
  BarChart3,
  RefreshCw,
  FileSpreadsheet,
  FileDown,
  Info,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

/* ─── Stat Card ────────────────────────────────────────────── */
const StatCard = ({ title, value, subtext, trend, icon: Icon, color, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.95 }}
    animate={{ opacity: 1, y: 0,  scale: 1 }}
    transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 22 }}
    whileHover={{ y: -4, scale: 1.015 }}
    className="bg-white/80 backdrop-blur-sm border-2 border-pastel-blue/15 p-6 rounded-2xl shadow-lg shadow-pastel-blue/5 relative overflow-hidden group cursor-default"
  >
    {/* Background glow */}
    <div className={cn('absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-70', color.glow)} />

    <div className="flex justify-between items-start mb-4 relative z-10">
      <motion.div
        className={cn('p-3 rounded-xl', color.bg)}
        whileHover={{ rotate: [0, -8, 8, 0] }}
        transition={{ duration: 0.4 }}
      >
        <Icon className={cn('w-5 h-5', color.text)} />
      </motion.div>
      {trend && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.08 + 0.2, type: 'spring' }}
          className={cn(
            'text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm',
            trend > 0 ? 'bg-[#e0efea] text-[#3d6b54]' : 'bg-red-100 text-red-600'
          )}
        >
          <TrendingUp size={11} className={trend < 0 ? 'rotate-180' : ''} />
          {trend > 0 ? '+' : ''}{trend}%
        </motion.span>
      )}
    </div>

    <h3 className="text-pastel-muted text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 relative z-10">{title}</h3>
    <div className="text-2xl sm:text-3xl font-black text-pastel-text mb-1.5 relative z-10">{value}</div>
    <p className="text-pastel-muted text-[10px] sm:text-xs flex items-center gap-1.5 relative z-10">
      <span className="w-1.5 h-1.5 rounded-full bg-[#5a8f70] animate-pulse flex-shrink-0"></span>
      {subtext}
    </p>
  </motion.div>
);

/* ─── Suggestion Row ───────────────────────────────────────── */
const SuggestionItem = ({ id, name, emoji, expiry, discount, count, isPushed, onPush }: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    className={cn(
      'flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border-2 transition-all gap-4',
      isPushed
        ? 'bg-[#f2f8f4] border-[#c5dfd3] shadow-sm shadow-[#c5dfd3]/50'
        : 'bg-pastel-bg/40 border-transparent hover:border-pastel-pink/25 hover:bg-white hover:shadow-sm'
    )}
  >
    <div className="flex items-center gap-4">
      <motion.div
        whileHover={{ scale: 1.15, rotate: 5 }}
        className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-100 flex-shrink-0"
      >
        {emoji}
      </motion.div>
      <div>
        <h4 className="font-extrabold text-sm sm:text-base text-pastel-text">
          {name} <span className="text-pastel-muted font-normal text-xs sm:text-sm">({count} unités)</span>
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <Clock size={11} className={expiry === "Aujourd'hui" ? 'text-red-500' : 'text-amber-500'} />
          <span className={cn('text-xs font-bold', expiry === "Aujourd'hui" ? 'text-red-500' : 'text-amber-500')}>
            Périme {expiry}
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
      <div className="text-left sm:text-right">
        <div className="text-[9px] text-pastel-muted uppercase font-bold tracking-wider">Réduction active</div>
        <div className={cn(
          'font-extrabold text-sm px-2.5 py-0.5 rounded-lg inline-block',
          isPushed ? 'bg-[#e0efea] text-[#3d6b54]' : 'bg-red-50 text-red-600'
        )}>
          -{discount}%
        </div>
      </div>
      <motion.button
        disabled={isPushed}
        onClick={() => onPush(id)}
        whileHover={isPushed ? {} : { scale: 1.05, y: -1 }}
        whileTap={isPushed ? {} : { scale: 0.95 }}
        className={cn(
          'px-4 py-2 rounded-full text-xs font-bold shadow-md transition-all shrink-0 btn-shine',
          isPushed
            ? 'bg-[#e0efea] text-[#3d6b54] border border-[#c5dfd3] cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-pastel-pink to-pastel-pink-hover text-white shadow-pastel-pink/20 cursor-pointer'
        )}
      >
        {isPushed ? '✅ Offre Diffusée' : "Diffuser l'Offre"}
      </motion.button>
    </div>
  </motion.div>
);

/* ─── Report Record ────────────────────────────────────────── */
const ReportRecord = ({ name, date, size }: any) => {
  const [downloading, setDownloading] = useState(false);

  const triggerDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      const content = `Date,Item,Gain,Saved(kg)\n2026-05,Total,1240,310`;
      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `${name.toLowerCase().replace(/ /g, '_')}.csv`);
      a.click();
    }, 1200);
  };

  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="flex items-center justify-between p-3.5 bg-pastel-bg/30 rounded-xl border border-gray-100 hover:border-pastel-blue/30 hover:bg-white transition-all text-xs group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-pastel-blue/8 rounded-lg flex items-center justify-center text-pastel-blue group-hover:bg-pastel-blue/15 transition-colors">
          <FileSpreadsheet size={15} />
        </div>
        <div>
          <div className="font-bold text-pastel-text">{name}</div>
          <div className="text-[10px] text-pastel-muted">{date} • {size}</div>
        </div>
      </div>
      <motion.button
        onClick={triggerDownload}
        disabled={downloading}
        whileHover={downloading ? {} : { scale: 1.05 }}
        whileTap={downloading ? {} : { scale: 0.95 }}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border-2 transition-all text-[10px]',
          downloading
            ? 'border-pastel-blue bg-pastel-blue/10 text-pastel-blue'
            : 'border-gray-150 text-pastel-text hover:border-pastel-blue hover:text-pastel-blue bg-white cursor-pointer'
        )}
      >
        {downloading ? (
          <><RefreshCw size={11} className="animate-spin" /> Génération...</>
        ) : (
          <><Download size={11} /> Télécharger</>
        )}
      </motion.button>
    </motion.div>
  );
};

/* ─── Main Component ───────────────────────────────────────── */
export default function B2BDashboard() {
  const [activeRange, setActiveRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [hoveredDataIndex, setHoveredDataIndex] = useState<number | null>(null);
  const [pushedOffers, setPushedOffers] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [apiLogs, setApiLogs] = useState<string[]>([
    '09:12 - Connexion établie avec la caisse principale #01',
    '09:18 - Scan intelligent : détection de 12 filets de Poulet DLC saine',
    '09:30 - Notification géolocalisée envoyée à 128 clients proches',
  ]);

  const handlePushOffer = (id: string, name: string) => {
    setPushedOffers((prev) => [...prev, id]);
    const t = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setApiLogs((prev) => [`${t} - OFFRE POUSSÉE : "${name}" sponsorisée à -50% dans le secteur`, ...prev]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3200);
  };

  const chartsData = {
    week: [
      { label: 'Lun', saved: 12,  cash: 85,   color: '#b0d5be' },
      { label: 'Mar', saved: 18,  cash: 120,  color: '#7ab598' },
      { label: 'Mer', saved: 15,  cash: 105,  color: '#b0d5be' },
      { label: 'Jeu', saved: 28,  cash: 164,  color: '#5a8f70' },
      { label: 'Ven', saved: 32,  cash: 198,  color: '#4a7860' },
      { label: 'Sam', saved: 25,  cash: 145,  color: '#5a8f70' },
      { label: 'Dim', saved: 12,  cash: 78,   color: '#b0d5be' },
    ],
    month: [
      { label: 'Sem 1', saved: 85,  cash: 480,  color: '#b0d5be' },
      { label: 'Sem 2', saved: 110, cash: 620,  color: '#5a8f70' },
      { label: 'Sem 3', saved: 95,  cash: 540,  color: '#7ab598' },
      { label: 'Sem 4', saved: 142, cash: 845,  color: '#4a7860' },
    ],
    quarter: [
      { label: 'Janvier',  saved: 320, cash: 1800, color: '#b0d5be' },
      { label: 'Février',  saved: 290, cash: 1650, color: '#7ab598' },
      { label: 'Mars',     saved: 410, cash: 2340, color: '#5a8f70' },
      { label: 'Avril',    saved: 480, cash: 2900, color: '#4a7860' },
    ],
  };

  const currentChart = chartsData[activeRange];
  const maxVal = Math.max(...currentChart.map((d) => d.saved)) * 1.15;

  return (
    <div className="space-y-12">
      <Confetti active={showConfetti} palette="green" />

      {/* ── Header ────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pastel-blue/10 pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5 justify-center sm:justify-start">
            <motion.span
              className="w-2.5 h-2.5 rounded-full bg-[#5a8f70]"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] font-bold text-pastel-muted uppercase tracking-wider font-mono">
              Console Partenaire Active • ID: #RIF-PARIS-12
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-pastel-text text-center sm:text-left">
            Rapports & <span className="gradient-text-blue">Tarification Dynamique</span>
          </h1>
        </div>
        <div className="flex gap-2 justify-center shrink-0">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-bold border border-[#d1e8db] flex items-center gap-2 text-[#3d6b54] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#5a8f70] animate-pulse"></span>
            Caisse Connectée
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              const t = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              setApiLogs((prev) => [`${t} - Synchronisation forcée : 0 défauts répertoriés`, ...prev]);
            }}
            className="p-2 sm:px-3 sm:py-2 bg-gradient-to-r from-pastel-blue to-pastel-blue-hover text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md shadow-pastel-blue/20 btn-shine"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Rafraîchir</span>
          </motion.button>
        </div>
      </motion.header>

      {/* ── Stat Cards ────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          index={0}
          title="Denrées Préservées"
          value="142.3 kg"
          subtext="Mise à jour en temps réel"
          trend={12.4}
          icon={TrendingUp}
          color={{ bg: 'bg-[#f2f8f4]', text: 'text-[#4a7860]', glow: 'bg-[#c5dfd3]' }}
        />
        <StatCard
          index={1}
          title="Revenus Capturés"
          value="845.20 €"
          subtext="Ventes d'invendus triés"
          trend={8.2}
          icon={Wallet}
          color={{ bg: 'bg-pastel-blue/15', text: 'text-pastel-blue', glow: 'bg-pastel-blue/30' }}
        />
        <StatCard
          index={2}
          title="Stocks en Péremption"
          value="124.50 €"
          subtext="Valeur à traiter — DLC critique"
          trend={-15.0}
          icon={AlertTriangle}
          color={{ bg: 'bg-red-50', text: 'text-red-500', glow: 'bg-red-200' }}
        />
      </section>

      {/* ── Two Columns ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: AI Pricing Engine */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-7 bg-white/80 backdrop-blur-sm border-2 border-pastel-blue/12 rounded-3xl p-6 sm:p-8 shadow-xl shadow-pastel-blue/5 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-pastel-pink to-pastel-pink-hover text-white rounded-xl shadow-md shadow-pastel-pink/25">
                <Sparkles size={17} className="fill-current" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-pastel-text">Moteur de Tarification Intelligente</h2>
                <p className="text-[10px] text-pastel-muted">Prenez des actions correctives instantanées</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {[
              { id: 'yog-1',    emoji: '🥛', name: 'Lot de Yaourts Bio Nature',             count: 30, expiry: "Aujourd'hui", discount: 50 },
              { id: 'poulet-1', emoji: '🍗', name: 'Ailes de Poulet Fermier Label Rouge',   count: 12, expiry: 'Demain',      discount: 30 },
              { id: 'salade-1', emoji: '🥬', name: 'Sachets de Salade Mélangée Croquante',  count: 15, expiry: "Aujourd'hui", discount: 40 },
            ].map((item) => (
              <SuggestionItem
                key={item.id}
                {...item}
                isPushed={pushedOffers.includes(item.id)}
                onPush={(id: string) => handlePushOffer(id, item.name)}
              />
            ))}
          </div>

          {/* Live Console */}
          <div className="mt-8 pt-6 border-t border-pastel-blue/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-pastel-text mb-3 flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-pastel-blue"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Journal d'Activité en Temps Réel
            </h3>
            <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 font-mono text-[9px] sm:text-[10px] space-y-1.5 h-32 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {apiLogs.map((log, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx}
                    className="truncate border-l-2 border-pastel-blue/40 pl-2 py-0.5"
                    style={{ color: idx === 0 ? '#7ab598' : '#94a3b8' }}
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Reports & Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          id="pro-full-report"
          className="lg:col-span-5 bg-white/80 backdrop-blur-sm border-2 border-pastel-blue/12 rounded-3xl p-6 sm:p-8 shadow-xl shadow-pastel-blue/5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-pastel-blue to-pastel-blue-hover text-white rounded-xl shadow-md shadow-pastel-blue/25">
                <BarChart3 size={17} />
              </div>
              <h2 className="text-base font-extrabold text-pastel-text">Rapport Complet 📊</h2>
            </div>
            {/* Range Toggle */}
            <div className="flex items-center gap-0.5 bg-pastel-bg p-1 rounded-xl border border-gray-100">
              {[{ id: 'week', label: 'Sem' }, { id: 'month', label: 'Mois' }, { id: 'quarter', label: 'Trim' }].map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setActiveRange(r.id as any); setHoveredDataIndex(null); }}
                  className={cn(
                    'relative text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors',
                    activeRange === r.id ? 'text-white' : 'text-pastel-muted hover:text-pastel-text cursor-pointer'
                  )}
                >
                  {activeRange === r.id && (
                    <motion.div
                      layoutId="chart-range-bg"
                      className="absolute inset-0 bg-pastel-blue rounded-lg shadow-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-pastel-muted text-xs mb-5">
            Survolez chaque barre pour inspecter les détails.
          </p>

          {/* Bar Chart */}
          <div className="relative border border-slate-100 bg-gradient-to-b from-pastel-bg/20 to-white/50 rounded-2xl p-4 mb-6 flex-1 min-h-[180px]">
            <div className="h-44 w-full flex items-end justify-between gap-2 pt-8">
              {currentChart.map((h, i) => {
                const pct = (h.saved / maxVal) * 100;
                const isHovered = hoveredDataIndex === i;
                return (
                  <div
                    key={`${activeRange}-${i}`}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer"
                    onMouseEnter={() => setHoveredDataIndex(i)}
                    onMouseLeave={() => setHoveredDataIndex(null)}
                  >
                    <div className="w-full relative flex justify-center items-end h-full">
                      <motion.div
                        className="w-full sm:w-8 rounded-t-lg relative overflow-hidden"
                        style={{
                          backgroundColor: h.color,
                          boxShadow: isHovered ? `0 -6px 24px ${h.color}99` : 'none',
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: i * 0.05 }}
                      >
                        {/* Shine on hover */}
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-white/20"
                          />
                        )}
                      </motion.div>
                    </div>
                    <span className="text-[9px] font-bold text-pastel-muted">{h.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Tooltip */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center bg-white/90 backdrop-blur border border-pastel-blue/10 p-2 rounded-xl text-[10px] pointer-events-none shadow-sm">
              <AnimatePresence mode="wait">
                {hoveredDataIndex !== null ? (
                  <motion.div
                    key="data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex w-full justify-between items-center"
                  >
                    <div className="font-bold text-pastel-text">{currentChart[hoveredDataIndex].label}</div>
                    <div className="flex gap-3">
                      <span className="text-[#4a7860] font-bold">♻️ {currentChart[hoveredDataIndex].saved} kg</span>
                      <span className="text-pastel-pink font-bold">💶 {currentChart[hoveredDataIndex].cash} €</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex w-full justify-between items-center"
                  >
                    <div className="flex items-center gap-1 text-pastel-muted font-medium">
                      <Info size={11} className="text-pastel-blue" />
                      Survolez une barre
                    </div>
                    <span className="font-bold text-pastel-blue font-mono text-[9px]">LIVE</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Downloads */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-pastel-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileDown size={13} /> Bilans certifiés mensuels
            </h3>
            <ReportRecord name="Bilan RSE - Avril 2026"         date="Publié le 01/05 • Valide RSE" size="1.2 MB .CSV" />
            <ReportRecord name="Synthèse Financière - Q1 2026"  date="Publié le 15/04 • Fiscal"      size="4.8 MB .CSV" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
