import React from 'react';
import { motion } from 'motion/react';
import { Package, AlertTriangle, CheckCircle2, Search, Filter, Download } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const inventoryData = [
  { name: 'Yaourt Nature Bio (Lot 8)', category: 'transforme', qty: 45, price: 2.10, dlc: '2023-10-28', status: 'OK' },
  { name: 'Jambon Blanc (x4 tranches)', category: 'transforme', qty: 12, price: 4.50, dlc: '2023-10-26', status: 'URGENT' },
  { name: 'Steak Haché 5% (x2)', category: 'matiere_premiere', qty: 8, price: 5.90, dlc: '2023-10-26', status: 'URGENT' },
  { name: 'Lait Demi-Écrémé (1L)', category: 'matiere_premiere', qty: 120, price: 0.95, dlc: '2024-03-15', status: 'OK' },
  { name: 'Comté AOP 6 mois (250g)', category: 'matiere_premiere', qty: 22, price: 7.20, dlc: '2023-11-10', status: 'OK' },
  { name: 'Filet de Poulet (x2)', category: 'matiere_premiere', qty: 15, price: 6.80, dlc: '2023-10-27', status: 'URGENT' },
  { name: 'Œufs Plein Air (x12)', category: 'matiere_premiere', qty: 60, price: 3.40, dlc: '2023-11-05', status: 'OK' },
  { name: 'Pavé de Saumon (x2)', category: 'matiere_premiere', qty: 6, price: 12.50, dlc: '2023-10-26', status: 'URGENT' },
  { name: 'Crème Fraîche Épaisse (20cl)', category: 'matiere_premiere', qty: 35, price: 1.65, dlc: '2023-11-02', status: 'OK' },
  { name: 'Salade Mixte Sachet', category: 'transforme', qty: 18, price: 2.30, dlc: '2023-10-27', status: 'URGENT' },
  { name: 'Lardons Fumés (200g)', category: 'matiere_premiere', qty: 28, price: 3.10, dlc: '2023-11-12', status: 'OK' },
  { name: 'Beurre Doux (250g)', category: 'matiere_premiere', qty: 55, price: 2.90, dlc: '2024-01-20', status: 'OK' },
  { name: 'Tarte aux Pommes (Indiv.)', category: 'transforme', qty: 9, price: 4.20, dlc: '2023-10-26', status: 'URGENT' }
];

export default function B2BInventory() {
  const [filterType, setFilterType] = React.useState<'all' | 'matiere_premiere' | 'transforme'>('all');

  const filteredData = inventoryData.filter(item => {
    if (filterType === 'all') return true;
    return item.category === filterType;
  });

  const totalValue = filteredData.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-pastel-text mb-2">Inventaire Connecté</h1>
          <p className="text-pastel-muted">Frigo Principal A2 (Données de démonstration)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border-2 border-pastel-blue/20 px-6 py-3 rounded-2xl shadow-xl shadow-pastel-blue/5">
            <div className="text-xs text-pastel-muted uppercase font-bold tracking-wider mb-1">Valeur Filtrée</div>
            <div className="text-2xl font-bold text-pastel-blue">{totalValue.toFixed(2)} €</div>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border-2 border-pastel-blue/15 w-fit max-w-full overflow-x-auto">
        <button
          onClick={() => setFilterType('all')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
            filterType === 'all'
              ? "bg-pastel-blue text-white shadow"
              : "text-pastel-muted hover:text-pastel-text hover:bg-pastel-bg/50"
          )}
        >
          Tous ({inventoryData.length})
        </button>
        <button
          onClick={() => setFilterType('matiere_premiere')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
            filterType === 'matiere_premiere'
              ? "bg-pastel-blue text-white shadow"
              : "text-pastel-muted hover:text-pastel-text hover:bg-pastel-bg/50"
          )}
        >
          Matières Premières ({inventoryData.filter(i => i.category === 'matiere_premiere').length})
        </button>
        <button
          onClick={() => setFilterType('transforme')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
            filterType === 'transforme'
              ? "bg-pastel-blue text-white shadow"
              : "text-pastel-muted hover:text-pastel-text hover:bg-pastel-bg/50"
          )}
        >
          Produits Transformés ({inventoryData.filter(i => i.category === 'transforme').length})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-pastel-blue/10 rounded-3xl overflow-hidden shadow-xl shadow-pastel-blue/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pastel-blue text-white">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Type de produit</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Produit (Fictif)</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Quantité</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Prix Unit.</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">DLC (Péremption)</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">État</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={cn(
                    "hover:bg-pastel-bg transition-colors",
                    item.status === 'URGENT' && "bg-pastel-danger/5"
                  )}
                >
                  <td className="px-6 py-4">
                    {item.category === 'matiere_premiere' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100">
                        Matière Première
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-600 border border-amber-100">
                        Produit Transformé (DLC)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-pastel-text">{item.name}</td>
                  <td className="px-6 py-4 text-pastel-text">{item.qty}</td>
                  <td className="px-6 py-4 text-pastel-text">{item.price.toFixed(2)} €</td>
                  <td className={cn(
                    "px-6 py-4 font-bold",
                    item.status === 'URGENT' ? "text-red-700" : "text-pastel-text"
                  )}>
                    {item.dlc}
                  </td>
                  <td className="px-6 py-4">
                    {item.status === 'URGENT' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-100 text-red-700">
                        COURTE DLC
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-green-100 text-green-700">
                        OK
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
