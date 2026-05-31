import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const inventoryData = [
  { name: 'Yaourt Nature Bio (Lot 8)',      category: 'transforme',       qty: 45,  price: 2.10,  dlc: '2023-10-28', status: 'OK'     },
  { name: 'Jambon Blanc (x4 tranches)',     category: 'transforme',       qty: 12,  price: 4.50,  dlc: '2023-10-26', status: 'URGENT' },
  { name: 'Steak Haché 5% (x2)',            category: 'matiere_premiere', qty: 8,   price: 5.90,  dlc: '2023-10-26', status: 'URGENT' },
  { name: 'Lait Demi-Écrémé (1L)',          category: 'matiere_premiere', qty: 120, price: 0.95,  dlc: '2024-03-15', status: 'OK'     },
  { name: 'Comté AOP 6 mois (250g)',        category: 'matiere_premiere', qty: 22,  price: 7.20,  dlc: '2023-11-10', status: 'OK'     },
  { name: 'Filet de Poulet (x2)',           category: 'matiere_premiere', qty: 15,  price: 6.80,  dlc: '2023-10-27', status: 'URGENT' },
  { name: 'Œufs Plein Air (x12)',           category: 'matiere_premiere', qty: 60,  price: 3.40,  dlc: '2023-11-05', status: 'OK'     },
  { name: 'Pavé de Saumon (x2)',            category: 'matiere_premiere', qty: 6,   price: 12.50, dlc: '2023-10-26', status: 'URGENT' },
  { name: 'Crème Fraîche Épaisse (20cl)',   category: 'matiere_premiere', qty: 35,  price: 1.65,  dlc: '2023-11-02', status: 'OK'     },
  { name: 'Salade Mixte Sachet',            category: 'transforme',       qty: 18,  price: 2.30,  dlc: '2023-10-27', status: 'URGENT' },
  { name: 'Lardons Fumés (200g)',           category: 'matiere_premiere', qty: 28,  price: 3.10,  dlc: '2023-11-12', status: 'OK'     },
  { name: 'Beurre Doux (250g)',             category: 'matiere_premiere', qty: 55,  price: 2.90,  dlc: '2024-01-20', status: 'OK'     },
  { name: 'Tarte aux Pommes (Indiv.)',      category: 'transforme',       qty: 9,   price: 4.20,  dlc: '2023-10-26', status: 'URGENT' },
];

const filterOptions = [
  { id: 'all',            label: 'Tous',              count: inventoryData.length },
  { id: 'matiere_premiere', label: 'Matières Premières', count: inventoryData.filter(i => i.category === 'matiere_premiere').length },
  { id: 'transforme',     label: 'Produits Transformés', count: inventoryData.filter(i => i.category === 'transforme').length },
];

export default function B2BInventory() {
  const [filterType, setFilterType] = React.useState<'all' | 'matiere_premiere' | 'transforme'>('all');

  const filteredData = inventoryData.filter(item => filterType === 'all' || item.category === filterType);
  const totalValue   = filteredData.reduce((acc, item) => acc + item.qty * item.price, 0);
  const urgentCount  = filteredData.filter(i => i.status === 'URGENT').length;

  return (
    <div className="space-y-8">

      {/* ── Header ────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package size={18} className="text-pastel-blue" />
            <span className="text-[10px] font-bold text-pastel-muted uppercase tracking-widest">Frigo Principal A2</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-1">
            <span className="gradient-text-blue">Gestion des Stocks</span>{' '}
            <span className="text-pastel-text">en Temps Réel</span>
          </h1>
          <p className="text-pastel-muted text-sm">Données de démonstration — synchronisation automatique</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Urgent badge */}
          {urgentCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.3 }}
              className="flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2.5 rounded-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle size={16} className="text-red-500" />
              </motion.div>
              <div>
                <div className="text-xs text-pastel-muted uppercase font-bold tracking-wider">Urgences</div>
                <div className="text-lg font-black text-red-600">{urgentCount} produits</div>
              </div>
            </motion.div>
          )}

          {/* Value card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.15 }}
            className="bg-white/80 backdrop-blur-sm border-2 border-pastel-blue/20 px-6 py-3 rounded-2xl shadow-xl shadow-pastel-blue/8"
          >
            <div className="text-xs text-pastel-muted uppercase font-bold tracking-wider mb-1">Valeur Filtrée</div>
            <motion.div
              key={totalValue}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black gradient-text-blue"
            >
              {totalValue.toFixed(2)} €
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* ── Filter Tabs ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex bg-white/70 backdrop-blur-sm p-1.5 rounded-2xl border border-white/80 shadow-sm w-fit max-w-full overflow-x-auto"
      >
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilterType(opt.id as any)}
            className={cn(
              'relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors focus:outline-none',
              filterType === opt.id ? 'text-white' : 'text-pastel-muted hover:text-pastel-text'
            )}
          >
            {filterType === opt.id && (
              <motion.div
                layoutId="inventory-filter-bg"
                className="absolute inset-0 bg-gradient-to-r from-pastel-blue to-pastel-blue-hover rounded-xl shadow-md shadow-pastel-blue/25"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {opt.label}
              <span className={cn(
                'ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full',
                filterType === opt.id ? 'bg-white/20' : 'bg-pastel-bg'
              )}>
                {opt.count}
              </span>
            </span>
          </button>
        ))}
      </motion.div>

      {/* ── Table ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.45 }}
        className="bg-white/80 backdrop-blur-sm border-2 border-pastel-blue/10 rounded-3xl overflow-hidden shadow-xl shadow-pastel-blue/5"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #5a8f70 0%, #4a7860 100%)' }}>
                {['Type de produit', 'Produit', 'Quantité', 'Prix Unit.', 'DLC (Péremption)', 'État'].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/90">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredData.map((item, i) => (
                  <motion.tr
                    key={item.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: i * 0.025, duration: 0.3 }}
                    whileHover={{ backgroundColor: 'rgba(247, 250, 255, 1)' }}
                    className={cn(
                      'transition-colors',
                      item.status === 'URGENT' ? 'bg-red-50/60' : ''
                    )}
                  >
                    <td className="px-6 py-3.5">
                      {item.category === 'matiere_premiere' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          Matière Première
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-600 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Produit Transformé (DLC)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-pastel-text text-sm">{item.name}</td>
                    <td className="px-6 py-3.5 text-pastel-text font-medium">{item.qty}</td>
                    <td className="px-6 py-3.5 text-pastel-text font-medium">{item.price.toFixed(2)} €</td>
                    <td className={cn(
                      'px-6 py-3.5 font-bold text-sm',
                      item.status === 'URGENT' ? 'text-red-600' : 'text-pastel-text'
                    )}>
                      {item.dlc}
                    </td>
                    <td className="px-6 py-3.5">
                      {item.status === 'URGENT' ? (
                        <motion.span
                          animate={{ scale: [1, 1.03, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-200"
                        >
                          <TrendingDown size={10} />
                          COURTE DLC
                        </motion.span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-[#f2f8f4] text-[#3d6b54] border border-[#d1e8db]">
                          <CheckCircle2 size={10} />
                          OK
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer summary bar */}
        <div className="px-6 py-3 bg-pastel-bg/30 border-t border-gray-100 flex items-center justify-between text-xs text-pastel-muted">
          <span className="font-medium">{filteredData.length} produits affichés</span>
          <span className="font-bold text-pastel-blue">Total : {totalValue.toFixed(2)} €</span>
        </div>
      </motion.div>
    </div>
  );
}
