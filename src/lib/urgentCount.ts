// Shared source of truth for urgent product count
// Both the nav badge and the inventory page read from here

export const INVENTORY_DATA = [
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

export const URGENT_COUNT = INVENTORY_DATA.filter(i => i.status === 'URGENT').length;
