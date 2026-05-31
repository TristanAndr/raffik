import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ShoppingBasket, Zap, Bell, User, Info, Package } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import B2BDashboard from './components/B2BDashboard';
import B2BPresentation from './components/B2BPresentation';
import B2CApp from './components/B2CApp';
import B2BInventory from './components/B2BInventory';

type Tab = 'pro-presentation' | 'pro-adopted' | 'inventory' | 'client';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('pro-presentation');

  return (
    <div className="min-h-screen bg-pastel-bg text-pastel-text font-sans selection:bg-pastel-pink/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-pastel-blue px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-pastel-pink rounded-xl flex items-center justify-center shadow-lg shadow-pastel-pink/20">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-pastel-text">Rifrutti</span>
          </div>

          <div className="flex flex-wrap md:flex-nowrap bg-white p-1 rounded-2xl md:rounded-full border-2 border-pastel-blue/20 gap-1 md:gap-0 max-w-full justify-center">
            <button
              onClick={() => setActiveTab('pro-presentation')}
              className={cn(
                "flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-xl md:rounded-full transition-all font-bold text-xs sm:text-sm whitespace-nowrap",
                activeTab === 'pro-presentation' 
                  ? "bg-pastel-blue text-white shadow-lg shadow-pastel-blue/20" 
                  : "text-pastel-muted hover:text-pastel-text hover:bg-pastel-bg"
              )}
            >
              <Info size={16} />
              Présentation Pro
            </button>
            <button
              onClick={() => setActiveTab('pro-adopted')}
              className={cn(
                "flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-xl md:rounded-full transition-all font-bold text-xs sm:text-sm whitespace-nowrap",
                activeTab === 'pro-adopted' 
                  ? "bg-pastel-blue text-white shadow-lg shadow-pastel-blue/20" 
                  : "text-pastel-muted hover:text-pastel-text hover:bg-pastel-bg"
              )}
            >
              <LayoutDashboard size={16} />
              Console Partenaire
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={cn(
                "flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-xl md:rounded-full transition-all font-bold text-xs sm:text-sm whitespace-nowrap",
                activeTab === 'inventory' 
                  ? "bg-pastel-blue text-white shadow-lg shadow-pastel-blue/20" 
                  : "text-pastel-muted hover:text-pastel-text hover:bg-pastel-bg"
              )}
            >
              <Package size={16} />
              Inventaire B2B
            </button>
            <button
              onClick={() => setActiveTab('client')}
              className={cn(
                "flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-xl md:rounded-full transition-all font-bold text-xs sm:text-sm whitespace-nowrap",
                activeTab === 'client' 
                  ? "bg-pastel-pink text-white shadow-lg shadow-pastel-pink/20" 
                  : "text-pastel-muted hover:text-pastel-text hover:bg-pastel-bg"
              )}
            >
              <ShoppingBasket size={16} />
              Mon Frigo Client
            </button>
          </div>

          {/* Removed top right notification/profile icon group as part of removing authorization/identification requests */}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === 'pro-presentation' && <B2BPresentation />}
            {activeTab === 'pro-adopted' && <B2BDashboard />}
            {activeTab === 'inventory' && <B2BInventory />}
            {activeTab === 'client' && <B2CApp />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-pastel-blue/10 py-12 mt-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-pastel-muted text-sm">
            © 2026 Rifrutti. Tech for a Greener Future.
          </div>
          <div className="flex gap-6 text-sm text-pastel-muted">
            <a href="#" className="hover:text-pastel-pink transition-colors">Privacy</a>
            <a href="#" className="hover:text-pastel-pink transition-colors">Terms</a>
            <a href="#" className="hover:text-pastel-pink transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
