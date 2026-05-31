import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ShoppingBasket, Zap, Info, Package, Leaf } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { URGENT_COUNT } from '@/src/lib/urgentCount';
import B2BDashboard from './components/B2BDashboard';
import B2BPresentation from './components/B2BPresentation';
import B2CApp from './components/B2CApp';
import B2BInventory from './components/B2BInventory';

type Tab = 'pro-presentation' | 'pro-adopted' | 'inventory' | 'client';

const tabs: { id: Tab; label: string; icon: React.ElementType; color: 'blue' | 'pink'; badge?: number }[] = [
  { id: 'pro-presentation', label: 'Présentation Pro',   icon: Info,           color: 'blue' },
  { id: 'pro-adopted',      label: 'Console Partenaire', icon: LayoutDashboard,color: 'blue' },
  { id: 'inventory',        label: 'Inventaire B2B',     icon: Package,        color: 'blue', badge: URGENT_COUNT },
  { id: 'client',           label: 'Mon Frigo Client',   icon: ShoppingBasket, color: 'pink' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('pro-presentation');

  return (
    <div className="min-h-screen text-pastel-text font-sans selection:bg-pastel-pink/30">

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 glass border-b border-white/60 shadow-sm shadow-pastel-blue/10">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5 shrink-0"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-pastel-pink/25 btn-shine"
              style={{
                background: 'linear-gradient(135deg, #5a8f70 0%, #4a7860 100%)',
              }}
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Zap className="text-white w-5 h-5 fill-current drop-shadow" />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight gradient-text-main">Rifrutti</span>
              <span className="text-[9px] font-semibold text-pastel-muted uppercase tracking-widest">Plateforme Anti-Gaspillage</span>
            </div>
          </motion.div>

          {/* Tab Bar */}
          <motion.div
            className="flex flex-wrap md:flex-nowrap bg-white/60 backdrop-blur-sm p-1 rounded-2xl border border-white/80 shadow-inner gap-0.5 max-w-full justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-xl transition-colors font-bold text-xs sm:text-sm whitespace-nowrap focus:outline-none',
                    isActive ? 'text-white' : 'text-pastel-muted hover:text-pastel-text'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-bg"
                      className={cn(
                        'absolute inset-0 rounded-xl',
                        tab.color === 'pink'
                          ? 'bg-gradient-to-r from-pastel-pink to-pastel-pink-hover shadow-lg shadow-pastel-pink/30'
                          : 'bg-gradient-to-r from-pastel-blue to-pastel-blue-hover shadow-lg shadow-pastel-blue/30'
                      )}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon size={14} />
                    {tab.label}
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                        className={cn(
                          'min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center leading-none',
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-red-500 text-white shadow-sm shadow-red-400/40'
                        )}
                      >
                        <motion.span
                          animate={{ scale: isActive ? 1 : [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        >
                          {tab.badge}
                        </motion.span>
                      </motion.span>
                    )}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Eco badge */}
          <motion.div
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold text-[#4a7860] bg-[#f2f8f4] border border-[#d1e8db]"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Leaf size={11} className="fill-current" />
            Zéro gaspillage
          </motion.div>
        </div>
      </nav>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            exit={  { opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {activeTab === 'pro-presentation' && <B2BPresentation />}
            {activeTab === 'pro-adopted'      && <B2BDashboard />}
            {activeTab === 'inventory'        && <B2BInventory />}
            {activeTab === 'client'           && <B2CApp />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-pastel-blue/10 py-10 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5a8f70, #4a7860)' }}>
              <Zap className="text-white w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-pastel-muted text-xs font-medium">© 2026 Rifrutti — Tech for a Greener Future</span>
          </div>
          <div className="flex gap-6 text-xs text-pastel-muted">
            {['Privacy', 'Terms', 'API Docs'].map(link => (
              <motion.a
                key={link}
                href="#"
                className="hover:text-pastel-pink transition-colors relative group"
                whileHover={{ y: -1 }}
              >
                {link}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-pastel-pink transition-all group-hover:w-full" />
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
