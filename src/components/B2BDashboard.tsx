import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Wallet, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  Download, 
  Calendar, 
  BarChart3, 
  RefreshCw,
  FileSpreadsheet,
  FileDown,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Single Stat Card Comp
const StatCard = ({ title, value, subtext, trend, icon: Icon, color }: any) => (
  <div className="bg-white border-2 border-pastel-blue/20 p-6 rounded-2xl shadow-xl shadow-pastel-blue/5 relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", color.bg)}>
        <Icon className={cn("w-6 h-6", color.text)} />
      </div>
      {trend && (
        <span className={cn(
          "text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm", 
          trend > 0 ? "bg-pastel-success text-pastel-text" : "bg-pastel-danger/20 text-pastel-danger"
        )}>
          <TrendingUp size={12} className={trend < 0 ? "rotate-180" : ""} />
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-pastel-muted text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
    <div className="text-2xl sm:text-3xl font-black text-pastel-text mb-1">{value}</div>
    <p className="text-pastel-muted text-[10px] sm:text-xs flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
      {subtext}
    </p>
  </div>
);

// Suggestion Row Comp for Interactive Pricing
const SuggestionItem = ({ id, name, emoji, expiry, discount, count, isPushed, onPush }: any) => (
  <div className={cn(
    "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border-2 transition-all gap-4",
    isPushed 
      ? "bg-pastel-success/10 border-pastel-success/30" 
      : "bg-pastel-bg/40 border-transparent hover:border-pastel-pink/30 hover:bg-white"
  )}>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">
        {emoji}
      </div>
      <div>
        <h4 className="font-extrabold text-sm sm:text-base text-pastel-text">
          {name} <span className="text-pastel-muted font-normal text-xs sm:text-sm">({count} unités)</span>
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <Clock size={12} className={expiry === 'Aujourd\'hui' ? "text-red-500" : "text-amber-500"} />
          <span className={cn("text-xs font-bold", expiry === 'Aujourd\'hui' ? "text-red-500" : "text-amber-500")}>
            Périme {expiry}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
      <div className="text-left sm:text-right">
        <div className="text-[9px] text-pastel-muted uppercase font-bold tracking-wider">Réduction active</div>
        <div className={cn(
          "font-extrabold text-sm px-2 py-0.5 rounded inline-block",
          isPushed ? "bg-pastel-success text-pastel-text" : "bg-pastel-danger/10 text-pastel-danger"
        )}>
          -{discount}%
        </div>
      </div>
      <button 
        disabled={isPushed}
        onClick={() => onPush(id)}
        className={cn(
          "px-4 py-2 rounded-full text-xs font-bold shadow-md transition-all active:scale-95 shrink-0",
          isPushed 
            ? "bg-pastel-success/20 text-pastel-text border border-pastel-success/30 cursor-not-allowed" 
            : "bg-pastel-pink hover:bg-pastel-pink-hover text-white shadow-pastel-pink/15 cursor-pointer"
        )}
      >
        {isPushed ? "Sponsorisé ✅" : "Pousser l'offre"}
      </button>
    </div>
  </div>
);

// Historical Report Record Comp
const ReportRecord = ({ name, date, size, downloadUrl }: any) => {
  const [downloading, setDownloading] = useState(false);
  
  const triggerDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Beautiful mock download
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
    <div className="flex items-center justify-between p-4 bg-pastel-bg/20 rounded-xl border border-gray-100 hover:border-pastel-blue/30 hover:bg-white transition-all text-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-pastel-blue/5 rounded-lg flex items-center justify-center text-pastel-blue">
          <FileSpreadsheet size={16} />
        </div>
        <div>
          <div className="font-bold text-pastel-text">{name}</div>
          <div className="text-[10px] text-pastel-muted">{date} • {size}</div>
        </div>
      </div>
      <button 
        onClick={triggerDownload}
        disabled={downloading}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border-2 transition-all active:scale-95 text-[10px]",
          downloading 
            ? "border-pastel-blue bg-pastel-blue/10 text-pastel-blue" 
            : "border-gray-150 text-pastel-text hover:border-pastel-blue hover:text-pastel-blue bg-white cursor-pointer"
        )}
      >
        {downloading ? (
          <>
            <RefreshCw size={12} className="animate-spin" />
            Génération...
          </>
        ) : (
          <>
            <Download size={12} />
            Télécharger
          </>
        )}
      </button>
    </div>
  );
};

export default function B2BDashboard() {
  const [activeRange, setActiveRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [hoveredDataIndex, setHoveredDataIndex] = useState<number | null>(null);
  const [pushedOffers, setPushedOffers] = useState<string[]>([]);
  const [apiLogs, setApiLogs] = useState<string[]>([
    "09:12 - Connexion établie avec la caisse principale #01",
    "09:18 - Scan intelligent : détection de 12 filets de Poulet DLC saine",
    "09:30 - Notification géolocalisée envoyée à 128 clients proches",
  ]);

  // Handle mock dynamic product pushes
  const handlePushOffer = (id: string, name: string) => {
    setPushedOffers(prev => [...prev, id]);
    const cleanTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setApiLogs(prev => [
      `${cleanTime} - OFFRE POUSSÉE : "${name}" sponsorisée à -50% dans le secteur`,
      ...prev
    ]);
  };

  // SVG Chart data
  const chartsData = {
    week: [
      { label: 'Lun', saved: 12, cash: 85, color: '#fca5a5' },
      { label: 'Mar', saved: 18, cash: 120, color: '#93c5fd' },
      { label: 'Mer', saved: 15, cash: 105, color: '#fca5a5' },
      { label: 'Jeu', saved: 28, cash: 164, color: '#93c5fd' },
      { label: 'Ven', saved: 32, cash: 198, color: '#a7f3d0' },
      { label: 'Sam', saved: 25, cash: 145, color: '#a7f3d0' },
      { label: 'Dim', saved: 12, cash: 78, color: '#93c5fd' }
    ],
    month: [
      { label: 'Sem 1', saved: 85, cash: 480, color: '#93c5fd' },
      { label: 'Sem 2', saved: 110, cash: 620, color: '#a7f3d0' },
      { label: 'Sem 3', saved: 95, cash: 540, color: '#fca5a5' },
      { label: 'Sem 4', saved: 142, cash: 845, color: '#a7f3d0' }
    ],
    quarter: [
      { label: 'Janvier', saved: 320, cash: 1800, color: '#93c5fd' },
      { label: 'Février', saved: 290, cash: 1650, color: '#fca5a5' },
      { label: 'Mars', saved: 410, cash: 2340, color: '#a7f3d0' },
      { label: 'Avril', saved: 480, cash: 2900, color: '#a7f3d0' }
    ]
  };

  const currentChart = chartsData[activeRange];
  const maxVal = Math.max(...currentChart.map(d => d.saved)) * 1.15;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Console Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pastel-blue/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 justify-center sm:justify-start">
            <span className="w-2.5 h-2.5 rounded-full bg-pastel-success animate-pulse"></span>
            <span className="text-[10px] font-bold text-pastel-muted uppercase tracking-wider font-mono">
              Console Partenaire Active • ID: #RIF-PARIS-12
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-pastel-text text-center sm:text-left">
            Rapports & Tarification Dynamique
          </h1>
        </div>
        <div className="flex gap-2 justify-center shrink-0">
          <div className="bg-white px-4 py-2 rounded-xl text-xs font-bold border border-gray-150 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pastel-success"></span>
            Caisse Connectée
          </div>
          <button 
            onClick={() => {
              const cleanTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              setApiLogs(prev => [`${cleanTime} - Synchronisation forcée : 0 défauts répertoriés`, ...prev]);
            }}
            className="p-2 sm:px-3 sm:py-2 bg-pastel-blue text-white rounded-xl text-xs font-bold hover:bg-pastel-blue/90 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 shadow"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Rafraîchir</span>
          </button>
        </div>
      </header>

      {/* Real-Time statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Nourriture Sauvée" 
          value="142.3 kg" 
          subtext="Mise à jour en temps réel"
          trend={12.4}
          icon={TrendingUp}
          color={{ bg: 'bg-pastel-success/25', text: 'text-pastel-text' }}
        />
        <StatCard 
          title="Revenus Capturés" 
          value="845.20 €" 
          subtext="Ventes d'invendus triés"
          trend={8.2}
          icon={Wallet}
          color={{ bg: 'bg-pastel-blue/20', text: 'text-pastel-text' }}
        />
        <StatCard 
          title="Alerte Stock Critique" 
          value="124.50 €" 
          subtext="Valeur restante en DLC courte"
          trend={-15.0} // good trend representing lower waste left on shelf
          icon={AlertTriangle}
          color={{ bg: 'bg-pastel-danger/25', text: 'text-pastel-danger' }}
        />
      </section>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Deep Dynamic Inventory Actions & AI Suggestions */}
        <div className="lg:col-span-7 bg-white border-2 border-pastel-blue/15 rounded-3xl p-6 sm:p-8 shadow-xl shadow-pastel-blue/5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-pastel-pink text-white rounded-xl">
                  <Sparkles size={18} className="fill-current" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-pastel-text">Moteur de Tarification Intelligente</h2>
                  <p className="text-[10px] sm:text-xs text-pastel-muted">Prenez des actions correctives instantanées sur vos dates courtes</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <SuggestionItem 
                id="yog-1"
                emoji="🥛"
                name="Lot de Yaourts Bio Nature"
                count={30}
                expiry="Aujourd'hui"
                discount={50}
                isPushed={pushedOffers.includes('yog-1')}
                onPush={(id: string) => handlePushOffer(id, 'Yaourts Bio')}
              />
              <SuggestionItem 
                id="poulet-1"
                emoji="🍗"
                name="Ailes de Poulet Fermier Label Rouge"
                count={12}
                expiry="Demain"
                discount={30}
                isPushed={pushedOffers.includes('poulet-1')}
                onPush={(id: string) => handlePushOffer(id, 'Ailes de Poulet')}
              />
              <SuggestionItem 
                id="salade-1"
                emoji="🥬"
                name="Sachets de Salade Mélangée Croquante"
                count={15}
                expiry="Aujourd'hui"
                discount={40}
                isPushed={pushedOffers.includes('salade-1')}
                onPush={(id: string) => handlePushOffer(id, 'Salade Mélangée')}
              />
            </div>
          </div>

          {/* Connected Live Stream Output Console */}
          <div className="mt-8 pt-6 border-t border-pastel-blue/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-pastel-text mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pastel-blue animate-ping"></span>
              Fils d'événements et Sync locale
            </h3>
            <div className="bg-pastel-bg/50 p-3 sm:p-4 rounded-xl border border-gray-100 font-mono text-[9px] sm:text-[10px] text-pastel-text space-y-1.5 h-32 overflow-y-auto">
              <AnimatePresence>
                {apiLogs.map((log, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={idx} 
                    className="truncate hover:text-pastel-blue transition-colors border-l-2 border-pastel-blue/20 pl-2 py-0.5"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Rapport Complet & Analytics */}
        <div id="pro-full-report" className="lg:col-span-5 bg-white border-2 border-pastel-blue/15 rounded-3xl p-6 sm:p-8 shadow-xl shadow-pastel-blue/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-pastel-blue text-white rounded-xl">
                  <BarChart3 size={18} />
                </span>
                <h2 className="text-lg font-extrabold text-pastel-text">Rapport Complet 📊</h2>
              </div>
              
              {/* Filter controls */}
              <div className="flex items-center gap-1 bg-pastel-bg p-1 rounded-xl">
                {[
                  { id: 'week', label: 'Sem' },
                  { id: 'month', label: 'Mois' },
                  { id: 'quarter', label: 'Trim' },
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRange(r.id as any);
                      setHoveredDataIndex(null);
                    }}
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all",
                      activeRange === r.id 
                        ? "bg-pastel-blue text-white shadow-sm" 
                        : "text-pastel-muted hover:text-pastel-text cursor-pointer"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-pastel-muted text-xs mb-6">
              Analysez l'évolution de la nourriture sauvée et des gains perçus par mois. Survolez chaque segment pour inspecter les détails journaliers.
            </p>

            {/* Premium Interactive SVG Chart */}
            <div className="relative border border-slate-100 bg-pastel-bg/10 rounded-2xl p-4 mb-6">
              <div className="h-44 w-full flex items-end justify-between gap-2 pt-6">
                {currentChart.map((h, i) => {
                  const percentage = (h.saved / maxVal) * 100;
                  const isHovered = hoveredDataIndex === i;
                  return (
                    <div 
                      key={i} 
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group transition-all cursor-pointer"
                      onMouseEnter={() => setHoveredDataIndex(i)}
                      onMouseLeave={() => setHoveredDataIndex(null)}
                    >
                      {/* Bar portion */}
                      <div className="w-full relative flex justify-center items-end h-full">
                        <motion.div 
                          className="w-full sm:w-8 rounded-t-lg transition-all"
                          style={{ 
                            height: `${percentage}%`,
                            backgroundColor: h.color,
                            boxShadow: isHovered ? '0 10px 15px -3px rgba(147, 197, 253, 0.4)' : 'none'
                          }}
                          initial={{ height: 0 }}
                          animate={{ height: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-pastel-muted">{h.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic tooltip box inside the chart */}
              <div className="absolute top-2 left-2 right-2 flex justify-between items-center bg-white/90 backdrop-blur border border-pastel-blue/10 p-2 rounded-xl text-[10px] pointer-events-none transition-all duration-200">
                {hoveredDataIndex !== null ? (
                  <>
                    <div className="font-bold text-pastel-text">{currentChart[hoveredDataIndex].label}</div>
                    <div className="flex gap-4">
                      <span className="text-green-600 font-bold">♻️ {currentChart[hoveredDataIndex].saved} kg</span>
                      <span className="text-pastel-pink font-bold">💶 {currentChart[hoveredDataIndex].cash} €</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1 text-pastel-muted font-medium">
                      <Info size={12} className="text-pastel-blue" />
                      Glissez sur une barre pour voir le détail
                    </div>
                    <span className="font-bold text-pastel-blue font-mono">LIVE FEEDBACK</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Historical Download list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-pastel-muted uppercase tracking-wider mb-2 flex items-center gap-1">
              <FileDown size={14} /> Bilans certifiés mensuels
            </h3>
            <div className="space-y-2">
              <ReportRecord name="Bilan RSE - Avril 2026" date="Publié le 01/05 • Valide RSE" size="1.2 MB .CSV" />
              <ReportRecord name="Synthèse Financière - Q1 2026" date="Publié le 15/04 • Fiscal" size="4.8 MB .CSV" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
