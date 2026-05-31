import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Confetti from './Confetti';
import {
  AlertTriangle,
  Clock,
  ChefHat,
  Smartphone,
  CheckCircle2,
  Loader2,
  Sparkles,
  Zap,
  PlusCircle,
  Search,
  ShoppingBag,
  Check,
  Star,
  Leaf,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

type Profile = 'planner' | 'flexible' | 'emergency';

interface Product {
  id: string;
  name: string;
  emoji: string;
  expiry: string;
  isUrgent: boolean;
  category: 'Frais' | 'Légumes' | 'Épicerie' | 'Boissons';
}

const PRODUCTS: Product[] = [
  { id: 'poulet',  name: 'Poulet',        emoji: '🍗', expiry: '1 jour',      isUrgent: true,  category: 'Frais'    },
  { id: 'creme',   name: 'Crème',         emoji: '🥛', expiry: "Aujourd'hui", isUrgent: true,  category: 'Frais'    },
  { id: 'lait',    name: 'Lait',          emoji: '🥛', expiry: '3 jours',     isUrgent: false, category: 'Frais'    },
  { id: 'yaourt',  name: 'Yaourt',        emoji: '🍦', expiry: "Aujourd'hui", isUrgent: true,  category: 'Frais'    },
  { id: 'saumon',  name: 'Saumon',        emoji: '🐟', expiry: '1 jour',      isUrgent: true,  category: 'Frais'    },
  { id: 'viande',  name: 'Viande Hachée', emoji: '🥩', expiry: '2 jours',     isUrgent: true,  category: 'Frais'    },
  { id: 'oeufs',   name: 'Œufs',          emoji: '🥚', expiry: '5 jours',     isUrgent: false, category: 'Frais'    },
  { id: 'fromage', name: 'Fromage',       emoji: '🧀', expiry: '10 jours',    isUrgent: false, category: 'Frais'    },
  { id: 'jambon',  name: 'Jambon',        emoji: '🥓', expiry: '2 jours',     isUrgent: true,  category: 'Frais'    },
  { id: 'tomate',  name: 'Tomate',        emoji: '🍅', expiry: '2 jours',     isUrgent: true,  category: 'Légumes'  },
  { id: 'avocat',  name: 'Avocat',        emoji: '🥑', expiry: '1 jour',      isUrgent: true,  category: 'Légumes'  },
  { id: 'carotte', name: 'Carotte',       emoji: '🥕', expiry: '7 jours',     isUrgent: false, category: 'Légumes'  },
  { id: 'salade',  name: 'Salade',        emoji: '🥬', expiry: '2 jours',     isUrgent: true,  category: 'Légumes'  },
  { id: 'pomme',   name: 'Pomme',         emoji: '🍎', expiry: '15 jours',    isUrgent: false, category: 'Légumes'  },
  { id: 'banane',  name: 'Banane',        emoji: '🍌', expiry: '3 jours',     isUrgent: false, category: 'Légumes'  },
  { id: 'oignon',  name: 'Oignon',        emoji: '🧅', expiry: '30 jours',    isUrgent: false, category: 'Légumes'  },
  { id: 'pates',   name: 'Pâtes',         emoji: '🍝', expiry: '365 jours',   isUrgent: false, category: 'Épicerie' },
  { id: 'riz',     name: 'Riz',           emoji: '🍚', expiry: '365 jours',   isUrgent: false, category: 'Épicerie' },
  { id: 'pain',    name: 'Pain',          emoji: '🍞', expiry: '2 jours',     isUrgent: true,  category: 'Épicerie' },
  { id: 'miel',    name: 'Miel',          emoji: '🍯', expiry: 'Indéfini',    isUrgent: false, category: 'Épicerie' },
];

export interface BundleItem {
  name: string; emoji: string; qty: string; originalPrice: number; promoPrice?: number; isDlc: boolean;
}
export interface RecipeBundle {
  id: string; name: string; description: string; emoji: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile'; prepTime: string; items: BundleItem[];
}
export const RECIPE_BUNDLES: RecipeBundle[] = [
  {
    id: 'saumon-creme', name: 'Pâtes au Saumon Crémeux', emoji: '🍝',
    description: "Une recette réconfortante et raffinée combinant du saumon en DLC courte avec d’onctueux produits laitiers sauvés.",
    difficulty: 'Facile', prepTime: '20 min',
    items: [
      { name: 'Saumon',       emoji: '🐟', qty: '2 pavés',   originalPrice: 10.00, promoPrice: 5.00,  isDlc: true  },
      { name: 'Crème Fraîche',emoji: '🥛', qty: '20 cl',     originalPrice: 1.50,  promoPrice: 0.75,  isDlc: true  },
      { name: 'Pâtes',        emoji: '🍝', qty: '500g',      originalPrice: 1.50,                     isDlc: false },
      { name: 'Oignon',       emoji: '🧅', qty: '1 pièce',   originalPrice: 0.80,                     isDlc: false },
    ],
  },
  {
    id: 'burger-maison', name: 'Burger Gourmand Rifrutti', emoji: '🍔',
    description: 'Réalisez un véritable burger gourmand chez vous grâce à de la viande hachée de premier choix et des pains frais.',
    difficulty: 'Facile', prepTime: '15 min',
    items: [
      { name: 'Viande Hachée',emoji: '🥩', qty: '2 portions', originalPrice: 7.00, promoPrice: 3.50,  isDlc: true  },
      { name: 'Pain Burger',  emoji: '🍞', qty: '1 paquet',   originalPrice: 1.20, promoPrice: 0.60,  isDlc: true  },
      { name: 'Fromage',      emoji: '🧀', qty: '4 tranches', originalPrice: 4.00,                    isDlc: false },
      { name: 'Tomate',       emoji: '🍅', qty: '1 belle',    originalPrice: 2.00, promoPrice: 1.00,  isDlc: true  },
    ],
  },
  {
    id: 'carottes-poulet', name: 'Poêlée Vitaminée Poulet & Carottes', emoji: '🥕',
    description: 'Un bon plat de tous les jours équilibré, riche en fibres et protéines avec du bon filet de poulet français.',
    difficulty: 'Facile', prepTime: '25 min',
    items: [
      { name: 'Poulet Fermier', emoji: '🍗', qty: '2 portions', originalPrice: 6.80, promoPrice: 3.40, isDlc: true  },
      { name: 'Carotte',        emoji: '🥕', qty: '500g',       originalPrice: 1.20,                   isDlc: false },
      { name: 'Oignon',         emoji: '🧅', qty: '1 oignon',   originalPrice: 0.80,                   isDlc: false },
      { name: 'Salade Sachet',  emoji: '🥬', qty: '1 portion',  originalPrice: 1.50, promoPrice: 0.75, isDlc: true  },
    ],
  },
];

export interface FullMenuCourse {
  name: string; emoji: string; description: string; isDlc: boolean; isBakeryFinished?: boolean;
}
export interface FullMenu {
  id: string; name: string; description: string; emoji: string;
  price: number; originalPrice: number; badge: string;
  entree: FullMenuCourse; plat: FullMenuCourse; dessert: FullMenuCourse;
}
export const FULL_MENUS: FullMenu[] = [
  {
    id: 'menu-nordique', name: 'Menu Fraîcheur Nordique', emoji: '🍽️',
    description: 'Un repas complet poissonneux combinant avocat frais et pavé de saumon en DLC courte.',
    price: 11.20, originalPrice: 22.40, badge: 'Populaire',
    entree:  { name: "Entrée : Salade fraîche d'Avocat",           emoji: '🥑', description: 'Avocats gourmands de saison à consommer rapidement.',              isDlc: true },
    plat:    { name: 'Plat : Pavé de Saumon croustillant',         emoji: '🐟', description: "Nappé de crème fraîche pour un goût d'exception.",                isDlc: true },
    dessert: { name: 'Dessert : Tarte aux pommes croustillante',   emoji: '🍰', description: 'Prête à servir. Direct du rayon boulangerie !',                   isDlc: true, isBakeryFinished: true },
  },
  {
    id: 'menu-bistro', name: 'Menu Traditionnel Bistro', emoji: '🥩',
    description: 'Le charme de la simplicité : une belle assiette tomates-fromage suivie d\'un steak façon Rossini.',
    price: 8.90, originalPrice: 17.80, badge: 'Best-Seller',
    entree:  { name: 'Entrée : Caprese express',                        emoji: '🍅', description: 'Tomates juteuses accompagnées de tranches de fromage.',             isDlc: true },
    plat:    { name: 'Plat : Burger Maison ou Steak Haché',            emoji: '🍔', description: 'Préparé sur le pouce avec de la viande hachée triée du jour.',     isDlc: true },
    dessert: { name: 'Dessert : Yaourt Nature Bio & Miel',             emoji: '🥛', description: "Yaourt sauvé marié à la douceur d'un miel parfumé.",               isDlc: true, isBakeryFinished: false },
  },
  {
    id: 'menu-chic', name: 'Menu Printanier Chic', emoji: '✨',
    description: 'Une alliance légère et équilibrée construite autour de notre filet de poulet fermier.',
    price: 9.80, originalPrice: 19.64, badge: 'Nouveauté',
    entree:  { name: 'Entrée : Petite salade mixte aux œufs durs',     emoji: '🥚', description: 'Œufs plein air et sachet de salade craquante.',                    isDlc: true },
    plat:    { name: 'Plat : Filet de Poulet poêlé & Carottes',        emoji: '🍗', description: 'Mijoté gourmand aux carottes sucrées et oignons dorés.',            isDlc: true },
    dessert: { name: 'Dessert : Cannelé ou Moelleux brioché',          emoji: '🧁', description: 'Viennoiserie artisanale du chef préparée le matin même.',           isDlc: true, isBakeryFinished: true },
  },
];

/* ─── Local recipe fallback ──────────────────────────────── */
const generateLocalRecipe = (selectedNames: string[]): string => {
  const lower = (n: string) => n.toLowerCase();
  const has = (kw: string) => selectedNames.some(n => lower(n).includes(kw));

  const allIngredients = selectedNames.map(n => `- ${n}`).join('\n');
  const header = `> 📋 **Ingrédients à valoriser (${selectedNames.length}) :**\n${allIngredients}\n\n`;

  // Classify each ingredient by its cooking role
  const proteins = selectedNames.filter(n =>
    ['poulet', 'saumon', 'viande', 'jambon', 'œuf', 'oeuf'].some(k => lower(n).includes(k))
  );
  const dairy = selectedNames.filter(n =>
    ['crème', 'creme', 'lait', 'fromage', 'yaourt'].some(k => lower(n).includes(k))
  );
  const veggies = selectedNames.filter(n =>
    ['tomate', 'avocat', 'carotte', 'salade', 'oignon', 'pomme', 'banane'].some(k => lower(n).includes(k))
  );
  const pasta = selectedNames.filter(n => ['pâtes', 'pates'].some(k => lower(n).includes(k)));
  const rice  = selectedNames.filter(n => lower(n).includes('riz'));
  const bread = selectedNames.filter(n => lower(n).includes('pain'));
  const sweets = selectedNames.filter(n => lower(n).includes('miel'));

  // Choose the best-matching recipe title
  let title: string;
  if (has('saumon') && (has('crème') || has('creme')))          title = 'Tagliatelles Saumon-Crème Fraîche';
  else if (has('poulet') && has('carotte'))                      title = 'Sauté de Poulet & Carottes';
  else if (has('viande') && (has('tomate') || has('fromage')))  title = 'Burger Maison Gourmand';
  else if (has('jambon') && has('fromage'))                      title = 'Croque-Monsieur Gratiné';
  else if (has('tomate') && has('avocat'))                       title = 'Toast Avocat-Tomate';
  else if ((has('œuf') || has('oeuf')) && has('salade'))         title = 'Salade Niçoise Express';
  else if (has('yaourt') && has('miel'))                         title = 'Parfait Yaourt & Miel';
  else if (has('pain') && (has('tomate') || has('avocat') || has('fromage'))) title = 'Tartines Gourmandes';
  else if (has('saumon'))                                        title = 'Pavé de Saumon Poêlé';
  else if (has('poulet'))                                        title = 'Poulet Doré aux Herbes';
  else if (has('viande'))                                        title = 'Steak Haché Maison';
  else if (proteins.length > 0 && dairy.length > 0)             title = `${proteins[0]} à la Sauce Crémeuse`;
  else if (proteins.length > 0 && veggies.length > 0)           title = `${proteins[0]} Sauté aux Légumes`;
  else if (proteins.length > 0)                                  title = `${proteins[0]} Maison`;
  else if (veggies.length > 1)                                   title = 'Poêlée de Légumes Anti-Gaspillage';
  else if (dairy.length > 0 && sweets.length > 0)               title = 'Douceur Crémeuse au Miel';
  else title = `Recette Anti-Gaspillage — ${selectedNames.length} Ingrédient${selectedNames.length > 1 ? 's' : ''}`;

  // Build steps that ALWAYS reference every selected ingredient
  const steps: string[] = [];

  // Step 1: always lists everything
  steps.push(`**Rassemblez** tous vos ingrédients : ${selectedNames.join(', ')}. Préparez-les selon leur nature (lavez les légumes, découpez les protéines, mesurez les liquides).`);

  // Boil pasta or rice first
  if (pasta.length > 0) {
    steps.push(`**Faites cuire** ${pasta.join(' et ')} al dente dans une grande casserole d'eau bouillante salée selon les indications du paquet. Égouttez et réservez.`);
  }
  if (rice.length > 0) {
    steps.push(`**Préparez** ${rice.join(' et ')} : rincez-le puis cuisez-le dans le double de son volume d'eau salée, à couvert, 12 min. Réservez.`);
  }

  // Toast bread
  if (bread.length > 0) {
    steps.push(`**Toastez** ${bread.join(' et ')} au grille-pain ou sous le gril du four jusqu'à ce qu'il soit bien doré et croustillant.`);
  }

  // Sear proteins
  if (proteins.length > 0) {
    steps.push(`**Faites dorer** ${proteins.join(' et ')} dans une poêle avec un filet d'huile d'olive à feu moyen-vif, 4–6 min de chaque côté. Salez, poivrez et réservez au chaud.`);
  }

  // Cook veggies
  if (veggies.length > 0) {
    const vStr = veggies.join(', ');
    if (proteins.length > 0 && pasta.length === 0 && rice.length === 0) {
      steps.push(`**Remettez** les protéines dans la poêle et ajoutez ${vStr}. Faites sauter ensemble 5–7 min en remuant régulièrement.`);
    } else {
      steps.push(`**Faites revenir** ${vStr} à feu moyen dans une poêle huilée, 5–7 min jusqu'à ce que ce soit tendre et légèrement coloré.`);
    }
  }

  // Combine pasta/rice with the rest
  if ((pasta.length > 0 || rice.length > 0) && (proteins.length > 0 || veggies.length > 0)) {
    const base    = [...pasta, ...rice].join(' et ');
    const topping = [...proteins, ...veggies].join(', ');
    steps.push(`**Assemblez** : mélangez ${base} avec ${topping} dans la poêle ou dans un grand plat.`);
  }

  // Add dairy
  if (dairy.length > 0) {
    steps.push(`**Ajoutez** ${dairy.join(' et ')} à la préparation. Mélangez délicatement pour enrober les ingrédients. Laissez chauffer 2–3 min à feu doux.`);
  }

  // Sweet finishing touch
  if (sweets.length > 0) {
    steps.push(`**Finalisez** avec ${sweets.join(' et ')} : ajoutez en filet pour une touche sucrée-salée et mélangez.`);
  }

  steps.push(`**Goûtez**, rectifiez l'assaisonnement (sel, poivre, herbes aromatiques), dressez et servez aussitôt.`);

  const needsStarch = proteins.length > 0 && pasta.length === 0 && rice.length === 0 && bread.length === 0;
  const complement = needsStarch
    ? "Huile d'olive, sel, poivre, herbes aromatiques\n- Accompagnement au choix (pâtes, riz ou pain)"
    : "Huile d'olive, sel, poivre, herbes aromatiques";

  return `### 💡 ${title}\n${header}#### 🛒 Compléments nécessaires :\n- ${complement}\n#### 👨‍🍳 Préparation (15–20 min) :\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
};

/* ─── Main Component ─────────────────────────────────────── */
export default function B2CApp() {
  const [selectedIds, setSelectedIds]     = useState<string[]>([]);
  const [aiResponse, setAiResponse]       = useState<string>('');
  const [loading, setLoading]             = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [purchasedBundle, setPurchasedBundle] = useState<RecipeBundle | null>(null);
  const [isOrdering, setIsOrdering]       = useState<string | null>(null);
  const [purchasedMenu, setPurchasedMenu] = useState<FullMenu | null>(null);
  const [isOrderingMenu, setIsOrderingMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [showConfetti, setShowConfetti]   = useState(false);

  const categories = ['Tous', 'Frais', 'Légumes', 'Épicerie'];

  const orderBundle = (bundle: RecipeBundle) => {
    setIsOrdering(bundle.id);
    setTimeout(() => {
      setIsOrdering(null);
      setPurchasedBundle(bundle);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3200);
    }, 1000);
  };
  const orderMenu = (menu: FullMenu) => {
    setIsOrderingMenu(menu.id);
    setTimeout(() => {
      setIsOrderingMenu(null);
      setPurchasedMenu(menu);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3200);
    }, 1000);
  };
  const toggleProduct = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'Tous' || p.category === activeCategory;
    const matchesSearch   = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const generateAdvice = async (selectedProducts: string[]) => {
    if (selectedProducts.length === 0) { setAiResponse(''); return; }
    setLoading(true);
    const selectedNames = PRODUCTS.filter(p => selectedProducts.includes(p.id)).map(p => p.name);

    if (!process.env.GEMINI_API_KEY) {
      setTimeout(() => { setAiResponse(generateLocalRecipe(selectedNames)); setLoading(false); }, 400);
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const resp = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Tu es Rifrutti, un assistant anti-gaspillage alimentaire professionnel.

L'utilisateur a sélectionné ${selectedNames.length} ingrédient(s) à valoriser :
${selectedNames.map((n, i) => `${i + 1}. ${n}`).join('\n')}

RÈGLE ABSOLUE : Tu DOIS utiliser et mentionner explicitement CHACUN des ${selectedNames.length} ingrédients listés ci-dessus dans les étapes de préparation. Aucun ingrédient ne peut être omis ou ignoré.

Génère UNE recette complète en français qui intègre ces ${selectedNames.length} ingrédients. Format Markdown obligatoire :
### 💡 [Nom de la recette reflétant les ingrédients principaux]
> 📋 **Ingrédients à valoriser :**
${selectedNames.map(n => `> - ${n}`).join('\n')}
#### 🛒 Compléments nécessaires :
(ingrédients de placard à ajouter)
#### 👨‍🍳 Préparation (X min) :
(4–6 étapes numérotées, chaque action en **gras**, chaque étape mentionne explicitement les ingrédients utilisés)`,
      });
      setAiResponse((resp as any).text || generateLocalRecipe(selectedNames));
    } catch {
      setAiResponse(generateLocalRecipe(selectedNames));
    } finally { setLoading(false); }
  };

  useEffect(() => { generateAdvice(selectedIds); }, [selectedIds]);

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="space-y-12">
      <Confetti active={showConfetti} palette="amber" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Frigo Virtuel ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm border-2 border-pastel-pink/40 rounded-3xl p-6 shadow-xl shadow-pastel-pink/8 flex flex-col"
        >
          <div className="text-center mb-5">
            <h2 className="text-2xl font-black gradient-text-pink mb-1">Mon Réfrigérateur Intelligent</h2>
            <p className="text-pastel-muted text-sm">Inventaire Rifrutti — Synchronisation en temps réel</p>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pastel-muted" size={15} />
            <input
              type="text"
              placeholder="Rechercher un ingrédient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-pastel-bg/60 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pastel-pink/30 border border-transparent focus:border-pastel-pink/30 transition-all text-pastel-text placeholder-pastel-muted/60"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'relative px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap focus:outline-none',
                  activeCategory === cat ? 'text-white' : 'bg-pastel-bg text-pastel-text hover:bg-pastel-pink/10'
                )}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="frigo-cat-bg"
                    className="absolute inset-0 bg-gradient-to-r from-pastel-pink to-pastel-pink-hover rounded-full shadow-md shadow-pastel-pink/20"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5" title="Produits proches de leur date limite de consommation">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <AlertTriangle size={14} />
              </motion.div>
              DLC Courte
            </h3>
            <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold border border-red-100">
              {PRODUCTS.filter(p => p.isUrgent).length} alertes
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar">
            <AnimatePresence>
              {filteredProducts.map((product, i) => {
                const isSelected = selectedIds.includes(product.id);
                return (
                  <motion.button
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.03, type: 'spring', stiffness: 350, damping: 22 }}
                    whileHover={{ scale: isSelected ? 1.04 : 1.07, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => toggleProduct(product.id)}
                    className={cn(
                      'group relative p-3 rounded-2xl text-center transition-all flex flex-col items-center justify-center min-h-[90px] border-2',
                      isSelected
                        ? 'border-pastel-pink bg-gradient-to-br from-white to-pastel-pink/5 shadow-lg shadow-pastel-pink/18'
                        : 'border-transparent bg-pastel-bg/60 hover:border-pastel-blue/25 hover:bg-white/80'
                    )}
                  >
                    {/* Urgent dot */}
                    {product.isUrgent && !isSelected && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    {/* Selected check */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-pastel-pink rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                      >
                        <Check size={10} className="text-white" />
                      </motion.div>
                    )}
                    <motion.div
                      className="text-3xl mb-1"
                      whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      {product.emoji}
                    </motion.div>
                    <div className="text-[10px] font-bold text-pastel-text line-clamp-1">{product.name}</div>
                    <div className={cn(
                      'text-[8px] mt-1 px-1.5 py-0.5 rounded-full font-medium',
                      product.isUrgent ? 'text-red-500 bg-red-50' : 'text-pastel-muted bg-pastel-muted/8'
                    )}>
                      {product.expiry}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 pt-4 border-t border-pastel-pink/10 overflow-hidden"
              >
                <div className="flex justify-between items-center bg-gradient-to-r from-pastel-pink/8 to-transparent p-3 rounded-xl">
                  <span className="text-xs font-bold text-pastel-pink flex items-center gap-1.5">
                    <Sparkles size={13} className="fill-current" />
                    {selectedIds.length} ingrédient{selectedIds.length > 1 ? 's' : ''} sélectionné{selectedIds.length > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-[10px] font-bold text-pastel-muted hover:text-red-500 transition-colors"
                  >
                    Réinitialiser
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── AI Assistant ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.07 }}
          className="bg-white/80 backdrop-blur-sm border-2 border-pastel-blue/40 rounded-3xl p-8 shadow-xl shadow-pastel-blue/8 flex flex-col"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-2 bg-pastel-blue/10 rounded-xl text-pastel-blue">
              <Sparkles size={18} className="fill-current" />
            </div>
            <h2 className="text-2xl font-black gradient-text-blue">IA Culinaire Anti-Gaspillage</h2>
          </div>

          <div id="zone-recettes" className="flex-1 min-h-[220px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-4 py-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 border-3 border-pastel-blue/20 border-t-pastel-blue rounded-full"
                    style={{ borderWidth: 3 }}
                  />
                  <span className="text-xs text-pastel-muted font-medium">Génération de votre recette...</span>
                </motion.div>
              ) : selectedIds.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-pastel-bg/60 p-6 rounded-2xl border-l-4 border-pastel-pink text-center text-pastel-text text-sm leading-relaxed h-full flex flex-col items-center justify-center gap-3"
                >
                  <div className="text-4xl animate-float">🧑‍🍳</div>
                  <p>
                    <strong>Sélectionnez des produits</strong> proches de la péremption dans votre frigo virtuel.
                    <br /><br />
                    <span className="text-pastel-muted text-xs">L'IA génèrera une recette personnalisée avec vos ingrédients.</span>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="recipe"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-gradient-to-br from-pastel-bg/60 to-white p-6 rounded-2xl border-l-4 border-pastel-blue prose prose-sm max-w-none text-pastel-text"
                >
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ── Recipe Bundles ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white/80 backdrop-blur-sm border-2 border-pastel-pink/25 rounded-3xl p-8 shadow-xl shadow-pastel-pink/5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pastel-pink/10 text-pastel-pink mb-2 border border-pastel-pink/20">
              <Zap size={11} className="fill-current animate-pulse" /> COMPAGNON DE CUISINE RAPIDE
            </span>
            <h2 className="text-2xl font-black text-pastel-text">Paniers Recettes Anti-Gaspillage 🛒</h2>
            <p className="text-pastel-muted text-sm mt-1">Commandez un panier d'invendus triés du jour, combinés à des produits de placard.</p>
          </div>
          <div className="flex items-center gap-3 bg-[#f2f8f4] border border-[#d1e8db] px-4 py-2.5 rounded-2xl shrink-0">
            <span className="text-2xl animate-float-slow">🌱</span>
            <div>
              <div className="text-xs font-bold text-pastel-text">Moins de déchet, plus de goût</div>
              <p className="text-[10px] text-pastel-muted">1 lot réservé = 1 produit sauvé</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECIPE_BUNDLES.map((bundle, idx) => {
            const originalTotal = bundle.items.reduce((a, i) => a + i.originalPrice, 0);
            const promoTotal    = bundle.items.reduce((a, i) => a + (i.promoPrice ?? i.originalPrice), 0);
            const savings       = originalTotal - promoTotal;
            const pct           = Math.round((savings / originalTotal) * 100);
            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.08, type: 'spring', stiffness: 250, damping: 22 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className="bg-white border-2 border-transparent hover:border-pastel-pink/35 rounded-3xl p-6 flex flex-col justify-between transition-shadow hover:shadow-xl hover:shadow-pastel-pink/10 relative group overflow-hidden"
              >
                {/* Discount badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-br from-pastel-pink to-pastel-pink-hover text-white font-bold text-xs px-3 py-1 rounded-full shadow-md shadow-pastel-pink/25 z-10">
                  -{pct}%
                </div>
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-pastel-pink/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.span
                      className="text-4xl"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                      transition={{ duration: 0.4 }}
                    >
                      {bundle.emoji}
                    </motion.span>
                    <div>
                      <h3 className="font-bold text-pastel-text text-base leading-tight group-hover:text-pastel-pink transition-colors">{bundle.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-pastel-muted bg-pastel-bg px-2 py-0.5 rounded border border-gray-100 flex items-center gap-1">
                          <ChefHat size={9} /> {bundle.difficulty}
                        </span>
                        <span className="text-[10px] font-bold text-pastel-muted bg-pastel-bg px-2 py-0.5 rounded border border-gray-100 flex items-center gap-1">
                          <Clock size={9} /> {bundle.prepTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-pastel-muted leading-relaxed mb-4">{bundle.description}</p>
                  <div className="space-y-1.5 mb-5">
                    <div className="text-[10px] uppercase font-bold text-pastel-muted tracking-wider mb-1">Ingrédients inclus</div>
                    {bundle.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-pastel-bg/50 text-xs p-2 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span>{item.emoji}</span>
                          <span className="font-medium text-pastel-text">{item.name} <span className="text-pastel-muted text-[10px]">({item.qty})</span></span>
                        </div>
                        {item.isDlc ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase">DLC -50%</span>
                            <span className="font-bold text-pastel-text text-[11px]">{item.promoPrice?.toFixed(2)}€</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-bold text-pastel-muted bg-gray-50 px-1.5 py-0.5 rounded uppercase">Magasin</span>
                            <span className="font-medium text-pastel-text text-[11px]">{item.originalPrice.toFixed(2)}€</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="border-t border-dashed border-gray-200 pt-4 mb-4 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-pastel-muted line-through">Prix standard: {originalTotal.toFixed(2)}€</div>
                      <div className="text-xs font-bold text-pastel-pink">Économie: {savings.toFixed(2)}€</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase font-bold tracking-wider text-pastel-muted">Total Panier</div>
                      <div className="text-xl font-black text-pastel-text">{promoTotal.toFixed(2)}€</div>
                    </div>
                  </div>
                  <motion.button
                    disabled={isOrdering !== null}
                    onClick={() => orderBundle(bundle)}
                    whileHover={isOrdering ? {} : { scale: 1.03 }}
                    whileTap={isOrdering ? {} : { scale: 0.97 }}
                    className={cn(
                      'w-full font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md btn-shine',
                      isOrdering === bundle.id
                        ? 'bg-pastel-blue text-white shadow-pastel-blue/20'
                        : 'bg-gradient-to-r from-pastel-pink to-pastel-pink-hover text-white shadow-pastel-pink/20 cursor-pointer'
                    )}
                  >
                    {isOrdering === bundle.id
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Validation...</>
                      : <><ShoppingBag size={14} /> Commander ce Panier Recette</>}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Full Menus ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm border-2 border-pastel-blue/25 rounded-3xl p-8 shadow-xl shadow-pastel-blue/5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pastel-blue/10 text-pastel-blue mb-2 border border-pastel-blue/20">
              <ChefHat size={11} className="fill-current animate-pulse" /> EXPÉRIENCE MENU ANTI-GASPI COMPLET
            </span>
            <h2 className="text-2xl font-black text-pastel-text">Menus Anti-Gaspillage 🍽️</h2>
            <p className="text-pastel-muted text-sm mt-1">Entrée, plat et dessert composés exclusivement d'invendus du jour — jusqu'à 50% de réduction.</p>
          </div>
          <div className="flex items-center gap-3 bg-pastel-blue/8 border border-pastel-blue/15 px-4 py-2.5 rounded-2xl shrink-0">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-xs font-bold text-pastel-text">Entrée + Plat + Dessert</div>
              <p className="text-[10px] text-pastel-muted">Prix réduits d'au moins 50%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FULL_MENUS.map((menu, idx) => (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.08, type: 'spring', stiffness: 250, damping: 22 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="bg-white border-2 border-transparent hover:border-pastel-blue/35 rounded-3xl p-6 flex flex-col justify-between transition-shadow hover:shadow-xl hover:shadow-pastel-blue/10 relative group overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-gradient-to-br from-pastel-blue to-pastel-blue-hover text-white font-bold text-xs px-3 py-1 rounded-full shadow-md shadow-pastel-blue/25 z-10">
                {menu.badge}
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-pastel-blue/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <motion.span
                    className="text-4xl"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                    transition={{ duration: 0.4 }}
                  >
                    {menu.emoji}
                  </motion.span>
                  <div>
                    <h3 className="font-bold text-pastel-text text-base leading-tight group-hover:text-pastel-blue transition-colors">{menu.name}</h3>
                    <p className="text-[10px] text-pastel-muted font-bold mt-0.5">3 services • DLC Courte</p>
                  </div>
                </div>
                <p className="text-xs text-pastel-muted leading-relaxed mb-5">{menu.description}</p>

                <div className="space-y-2.5 mb-5">
                  {[
                    { course: menu.entree,  label: 'Entrée' },
                    { course: menu.plat,    label: 'Plat' },
                    { course: menu.dessert, label: 'Dessert' },
                  ].map(({ course, label }) => (
                    <div key={label} className="bg-pastel-bg/40 p-3 rounded-xl flex gap-3 items-start">
                      <span className="text-xl flex-shrink-0 mt-0.5">{course.emoji}</span>
                      <div>
                        <div className="font-bold text-xs text-pastel-text">{course.name}</div>
                        <p className="text-[10px] text-pastel-muted leading-tight mt-0.5">{course.description}</p>
                        {course.isBakeryFinished ? (
                          <span className="inline-block mt-1 text-[8px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase border border-amber-100">
                            Prêt à consommer 🥐
                          </span>
                        ) : (
                          <span className="inline-block mt-1 text-[8px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase">
                            DLC courte • Sauvé (-50%)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10">
                <div className="border-t border-dashed border-gray-200 pt-4 mb-4 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-pastel-muted line-through">Standard: {menu.originalPrice.toFixed(2)}€</div>
                    <div className="text-xs font-bold text-pastel-blue">Économisez 50% !</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] uppercase font-bold tracking-wider text-pastel-muted">Prix Menu Complet</div>
                    <div className="text-xl font-black text-pastel-text">{menu.price.toFixed(2)}€</div>
                  </div>
                </div>
                <motion.button
                  disabled={isOrderingMenu !== null}
                  onClick={() => orderMenu(menu)}
                  whileHover={isOrderingMenu ? {} : { scale: 1.03 }}
                  whileTap={isOrderingMenu ? {} : { scale: 0.97 }}
                  className={cn(
                    'w-full font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md btn-shine',
                    isOrderingMenu === menu.id
                      ? 'bg-pastel-pink text-white shadow-pastel-pink/20'
                      : 'bg-gradient-to-r from-pastel-blue to-pastel-blue-hover text-white shadow-pastel-blue/20 cursor-pointer'
                  )}
                >
                  {isOrderingMenu === menu.id
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Commande...</>
                    : <><ShoppingBag size={14} /> Réserver le Menu Complet</>}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Confirmation Modals ───────────────────────────────── */}
      <AnimatePresence>
        {(purchasedBundle || purchasedMenu) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 24 }}
              className={cn(
                'bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center border-4',
                purchasedBundle ? 'border-pastel-pink' : 'border-pastel-blue'
              )}
            >
              {/* Top gradient bar */}
              <div className={cn(
                'absolute top-0 inset-x-0 h-1.5',
                purchasedBundle
                  ? 'bg-gradient-to-r from-pastel-pink to-pastel-blue'
                  : 'bg-gradient-to-r from-pastel-blue to-pastel-pink'
              )} />

              {/* Background decoration */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-pastel-success/8 rounded-full blur-2xl pointer-events-none" />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.15 }}
                className="w-16 h-16 bg-[#f2f8f4] rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-[#d1e8db] shadow-md shadow-[#d1e8db]/50"
              >
                <Check className="w-7 h-7 text-[#4a7860]" />
              </motion.div>

              <h3 className="text-xl font-black text-pastel-text mb-2">
                {purchasedBundle ? 'Panier réservé ! 🎉' : 'Menu Complet Réservé ! 🎉'}
              </h3>
              <p className="text-xs text-pastel-muted px-4 mb-6 leading-relaxed">
                {purchasedBundle
                  ? <>Le lot recette <strong className="text-pastel-text">"{purchasedBundle.name}"</strong> est prêt pour vous dans votre magasin Rifrutti !</>
                  : <>Le menu anti-gaspi <strong className="text-pastel-text">"{purchasedMenu!.name}"</strong> est réservé et vous attend en click-and-collect !</>}
              </p>

              {/* Thank you message */}
              <div className="bg-[#f2f8f4] border border-[#d1e8db] p-5 rounded-2xl mb-5 flex flex-col items-center gap-3 text-center">
                <div className="text-3xl">🙏</div>
                <div>
                  <div className="font-bold text-[#3d6b54] text-sm mb-1">Merci pour votre commande !</div>
                  <p className="text-xs text-[#4a7860]/80 leading-relaxed">
                    Votre {purchasedBundle ? 'panier recette' : 'menu'} est bien pris en compte.
                    Nous le préparons avec soin pour vous. À très vite !
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setPurchasedBundle(null); setPurchasedMenu(null); }}
                className={cn(
                  'w-full font-bold text-xs py-3.5 rounded-2xl transition-all shadow-md cursor-pointer btn-shine',
                  purchasedBundle
                    ? 'bg-gradient-to-r from-pastel-pink to-pastel-pink-hover text-white shadow-pastel-pink/25'
                    : 'bg-gradient-to-r from-pastel-blue to-pastel-blue-hover text-white shadow-pastel-blue/25'
                )}
              >
                {purchasedBundle ? "Super, j'arrive au magasin !" : "Génial, je vais le chercher !"}
              </motion.button>
              <div className="flex gap-2 justify-center items-center text-[10px] text-pastel-muted mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5a8f70] animate-pulse"></span>
                <span>{purchasedBundle ? 'Panier mis de côté 48h au comptoir Rifrutti' : 'Préparé au comptoir frais Rifrutti'}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
