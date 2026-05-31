import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Shuffle, 
  AlertTriangle, 
  Refrigerator, 
  Clock, 
  ChefHat, 
  Smartphone,
  CheckCircle2,
  Loader2,
  Sparkles,
  Zap,
  Info,
  PlusCircle,
  Search,
  ShoppingBag,
  Tag,
  ArrowRight,
  Check
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
  // Frais
  { id: 'poulet', name: 'Poulet', emoji: '🍗', expiry: '1 jour', isUrgent: true, category: 'Frais' },
  { id: 'creme', name: 'Crème', emoji: '🥛', expiry: 'Aujourd\'hui', isUrgent: true, category: 'Frais' },
  { id: 'lait', name: 'Lait', emoji: '🥛', expiry: '3 jours', isUrgent: false, category: 'Frais' },
  { id: 'yaourt', name: 'Yaourt', emoji: '🍦', expiry: 'Aujourd\'hui', isUrgent: true, category: 'Frais' },
  { id: 'saumon', name: 'Saumon', emoji: '🐟', expiry: '1 jour', isUrgent: true, category: 'Frais' },
  { id: 'viande', name: 'Viande Hachée', emoji: '🥩', expiry: '2 jours', isUrgent: true, category: 'Frais' },
  { id: 'oeufs', name: 'Œufs', emoji: '🥚', expiry: '5 jours', isUrgent: false, category: 'Frais' },
  { id: 'fromage', name: 'Fromage', emoji: '🧀', expiry: '10 jours', isUrgent: false, category: 'Frais' },
  { id: 'jambon', name: 'Jambon', emoji: '🥓', expiry: '2 jours', isUrgent: true, category: 'Frais' },
  
  // Légumes
  { id: 'tomate', name: 'Tomate', emoji: '🍅', expiry: '2 jours', isUrgent: true, category: 'Légumes' },
  { id: 'avocat', name: 'Avocat', emoji: '🥑', expiry: '1 jour', isUrgent: true, category: 'Légumes' },
  { id: 'carotte', name: 'Carotte', emoji: '🥕', expiry: '7 jours', isUrgent: false, category: 'Légumes' },
  { id: 'salade', name: 'Salade', emoji: '🥬', expiry: '2 jours', isUrgent: true, category: 'Légumes' },
  { id: 'pomme', name: 'Pomme', emoji: '🍎', expiry: '15 jours', isUrgent: false, category: 'Légumes' },
  { id: 'banane', name: 'Banane', emoji: '🍌', expiry: '3 jours', isUrgent: false, category: 'Légumes' },
  { id: 'oignon', name: 'Oignon', emoji: '🧅', expiry: '30 jours', isUrgent: false, category: 'Légumes' },
  
  // Épicerie
  { id: 'pates', name: 'Pâtes', emoji: '🍝', expiry: '365 jours', isUrgent: false, category: 'Épicerie' },
  { id: 'riz', name: 'Riz', emoji: '🍚', expiry: '365 jours', isUrgent: false, category: 'Épicerie' },
  { id: 'pain', name: 'Pain', emoji: '🍞', expiry: '2 jours', isUrgent: true, category: 'Épicerie' },
  { id: 'miel', name: 'Miel', emoji: '🍯', expiry: 'Indéfini', isUrgent: false, category: 'Épicerie' },
];

export interface BundleItem {
  name: string;
  emoji: string;
  qty: string;
  originalPrice: number;
  promoPrice?: number;
  isDlc: boolean;
}

export interface RecipeBundle {
  id: string;
  name: string;
  description: string;
  emoji: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  prepTime: string;
  items: BundleItem[];
}

export const RECIPE_BUNDLES: RecipeBundle[] = [
  {
    id: 'saumon-creme',
    name: 'Pâtes au Saumon Crémeux',
    description: 'Une recette réconfortante et raffinée combinant du saumon en DLC courte avec d’onctueux produits laitiers sauvés.',
    emoji: '🍝',
    difficulty: 'Facile',
    prepTime: '20 min',
    items: [
      { name: 'Saumon', emoji: '🐟', qty: '2 pavés', originalPrice: 10.00, promoPrice: 5.00, isDlc: true },
      { name: 'Crème Fraîche', emoji: '🥛', qty: '20 cl', originalPrice: 1.50, promoPrice: 0.75, isDlc: true },
      { name: 'Pâtes', emoji: '🍝', qty: '500g', originalPrice: 1.50, isDlc: false },
      { name: 'Oignon', emoji: '🧅', qty: '1 pièce', originalPrice: 0.80, isDlc: false },
    ]
  },
  {
    id: 'burger-maison',
    name: 'Burger Gourmand Rifrutti',
    description: 'Réalisez un véritable burger gourmand chez vous grâce à de la viande hachée de premier choix et des pains frais de la veille.',
    emoji: '🍔',
    difficulty: 'Facile',
    prepTime: '15 min',
    items: [
      { name: 'Viande Hachée', emoji: '🥩', qty: '2 portions', originalPrice: 7.00, promoPrice: 3.50, isDlc: true },
      { name: 'Pain Burger', emoji: '🍞', qty: '1 paquet', originalPrice: 1.20, promoPrice: 0.60, isDlc: true },
      { name: 'Fromage', emoji: '🧀', qty: '4 tranches', originalPrice: 4.00, isDlc: false },
      { name: 'Tomate', emoji: '🍅', qty: '1 belle tomate', originalPrice: 2.00, promoPrice: 1.00, isDlc: true },
    ]
  },
  {
    id: 'carottes-poulet',
    name: 'Poêlée Vitaminée Poulet & Carottes',
    description: 'Un bon plat de tous les jours équilibré, riche en fibres et protéines avec du bon filet de poulet français.',
    emoji: '🥕',
    difficulty: 'Facile',
    prepTime: '25 min',
    items: [
      { name: 'Poulet Fermier', emoji: '🍗', qty: '2 portions', originalPrice: 6.80, promoPrice: 3.40, isDlc: true },
      { name: 'Carotte', emoji: '🥕', qty: '500g', originalPrice: 1.20, isDlc: false },
      { name: 'Oignon', emoji: '🧅', qty: '1 oignon', originalPrice: 0.80, isDlc: false },
      { name: 'Salade Sachet', emoji: '🥬', qty: '1 portion', originalPrice: 1.50, promoPrice: 0.75, isDlc: true },
    ]
  }
];

export interface FullMenuCourse {
  name: string;
  emoji: string;
  description: string;
  isDlc: boolean;
  isBakeryFinished?: boolean;
}

export interface FullMenu {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  originalPrice: number;
  badge: string;
  entree: FullMenuCourse;
  plat: FullMenuCourse;
  dessert: FullMenuCourse;
}

export const FULL_MENUS: FullMenu[] = [
  {
    id: 'menu-nordique',
    name: 'Menu Fraîcheur Nordique',
    description: 'Un repas complet poissonneux combinant avocat frais et pavé de saumon en DLC courte avec une superbe tarte à notre façon.',
    emoji: '🍽️',
    price: 11.20,
    originalPrice: 22.40,
    badge: 'Populaire',
    entree: {
      name: 'Entrée : Salade fraîche d\'Avocat',
      emoji: '🥑',
      description: 'Avocats gourmands de saison à consommer rapidement.',
      isDlc: true
    },
    plat: {
      name: 'Plat : Pavé de Saumon croustillant sur son lit de pâtes',
      emoji: '🐟',
      description: 'Nappé de crème fraîche pour un goût d\'exception.',
      isDlc: true
    },
    dessert: {
      name: 'Dessert : Tarte aux pommes croustillante',
      emoji: '🍰',
      description: 'Prête à servir. Produit déjà terminé, direct du rayon boulangerie !',
      isDlc: true,
      isBakeryFinished: true
    }
  },
  {
    id: 'menu-bistro',
    name: 'Menu Traditionnel Bistro',
    description: 'Le charme de la simplicité : une belle assiette gourmande tomates-fromage suivie d\'un steak façon Rossini.',
    emoji: '🥩',
    price: 8.90,
    originalPrice: 17.80,
    badge: 'Best-Seller',
    entree: {
      name: 'Entrée : Caprese express',
      emoji: '🍅',
      description: 'Tomates juteuses parfumées accompagnées de tranches de fromage.',
      isDlc: true
    },
    plat: {
      name: 'Plat : Burger Maison ou Steak Haché caramélisé aux lardons',
      emoji: '🍔',
      description: 'Préparé sur le pouce avec de la viande hachée triée du jour et oignons.',
      isDlc: true
    },
    dessert: {
      name: 'Dessert : Yaourt Nature Bio & Miel crémeux',
      emoji: '🥛',
      description: 'Yaourt sauvé marié à la douceur d\'un miel parfumé.',
      isDlc: true,
      isBakeryFinished: false
    }
  },
  {
    id: 'menu-chic',
    name: 'Menu Printanier Chic',
    description: 'Une alliance légère et équilibrée construite autour de notre filet de poulet fermier et d\'un dessert de boulanger.',
    emoji: '✨',
    price: 9.80,
    originalPrice: 19.64,
    badge: 'Nouveauté',
    entree: {
      name: 'Entrée : Petite salade mixte aux œufs durs',
      emoji: '🥚',
      description: 'Œufs plein air de notre frigo et sachet de salade craquante.',
      isDlc: true
    },
    plat: {
      name: 'Plat : Filet de Poulet poêlé & Émincé de carottes',
      emoji: '🍗',
      description: 'Mijoté gourmand aux carottes sucrées et oignons dorés.',
      isDlc: true
    },
    dessert: {
      name: 'Dessert : Cannelé ou Moelleux brioché',
      emoji: '🧁',
      description: 'Viennoiserie artisanale du chef préparée le matin même.',
      isDlc: true,
      isBakeryFinished: true
    }
  }
];

export default function B2CApp() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [purchasedBundle, setPurchasedBundle] = useState<RecipeBundle | null>(null);
  const [isOrdering, setIsOrdering] = useState<string | null>(null);
  const [purchasedMenu, setPurchasedMenu] = useState<FullMenu | null>(null);
  const [isOrderingMenu, setIsOrderingMenu] = useState<string | null>(null);

  const categories = ['Tous', 'Frais', 'Légumes', 'Épicerie'];
  const [searchQuery, setSearchQuery] = useState('');

  const orderBundle = (bundle: RecipeBundle) => {
    setIsOrdering(bundle.id);
    setTimeout(() => {
      setIsOrdering(null);
      setPurchasedBundle(bundle);
    }, 1000);
  };

  const orderMenu = (menu: FullMenu) => {
    setIsOrderingMenu(menu.id);
    setTimeout(() => {
      setIsOrderingMenu(null);
      setPurchasedMenu(menu);
    }, 1000);
  };

  const toggleProduct = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'Tous' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const generateLocalRecipe = (selectedNames: string[]): string => {
    const mainIngredient = selectedNames[0] || "vos ingrédients frais";
    const allIngredientsText = selectedNames.join(' et ');
    
    let recipeTitle = `Poêlée Gourmande à base de ${mainIngredient}`;
    let recipeDesc = `Une recette rapide et conviviale pour sublimer vos produits en DLC courte (${allIngredientsText}) sans faire de gaspillage.`;
    let steps = [
      "Préparez vos ingrédients frais en les coupant en petits dés.",
      "Faites chauffer une poêle à feu moyen avec de l'huile ou du beurre, puis faites revenir vos ingrédients d'abord.",
      "Ajoutez des pâtes, du riz blanc ou accompagnez d'une tranche de pain grillé pour un plat complet."
    ];
    let pantry = ["Huile d'olive ou beurre", "Sel, poivre et herbes aromatiques de placard", "Accompagnement de votre choix (riz, pâtes, etc.)"];

    const hasSaumon = selectedNames.some(n => n.toLowerCase().includes('saumon'));
    const hasPoulet = selectedNames.some(n => n.toLowerCase().includes('poulet'));
    const hasJambon = selectedNames.some(n => n.toLowerCase().includes('jambon'));
    const hasFromage = selectedNames.some(n => n.toLowerCase().includes('fromage'));

    if (hasSaumon) {
      recipeTitle = `Pâtes au Saumon Crémé`;
      recipeDesc = `Un classique indémodable et crémeux pour savourer votre saumon en évitant tout gaspillage.`;
      pantry = ["Pâtes de votre choix (300g)", "Crème fraîche liquide - 2 cuillères à soupe", "Ail ou fines herbes"];
      steps = [
        "Cuisez vos pâtes dans une casserole d'eau chaude salée selon les indications.",
        "Saisissez le saumon coupé en cubes à la poêle bien chaude pendant 4 minutes.",
        "Ajoutez la crème et mélangez directement avec vos pâtes égouttées."
      ];
    } else if (hasPoulet) {
      recipeTitle = `Poêlée Suprême au Poulet`;
      recipeDesc = `Un sauté rapide de filet de poulet, relevé avec quelques herbes du placard.`;
      pantry = ["Huile de cuisson", "Un oignon émincé", "Optionnel : sauce soja ou curry en poudre"];
      steps = [
        "Émincez le blanc de poulet en fines tranches.",
        "Saisissez dans une poêle chaude avec de l'huile et les oignons pendant 6 minutes.",
        "Ajoutez du riz d'accompagnement et une pincée d'épices pour parfaire le tout."
      ];
    } else if (hasJambon || hasFromage) {
      recipeTitle = `Gratin Express Jambon-Fromage`;
      recipeDesc = `Une superbe option fondante pour transformer votre jambon et vos fromages mûrs.`;
      pantry = ["Pâtes ou pommes de terre cuites", "Une noisette de beurre", "Un peu de sel et de muscade"];
      steps = [
        "Préchauffez votre four en mode gril ou préparez à la poêle à feu doux.",
        "Mélangez le jambon effiloché avec vos restes de fromage et de féculents.",
        "Faites fondre le tout jusqu'à ce que ce soit croustillant et délicieusement doré."
      ];
    } else if (selectedNames.some(n => n.toLowerCase().includes('tomate')) || selectedNames.some(n => n.toLowerCase().includes('avocat'))) {
      recipeTitle = `Bruschettas Vitaminées`;
      recipeDesc = `Une collation fraîche et croquante idéale pour savourer vos légumes et avocats mûrs à point.`;
      pantry = ["Tranches de pain (frais ou de la veille)", "Un filet d'huile d'olive", "Une gousse d'ail"];
      steps = [
        "Frottez le pain toasté avec de l'ail et arrosez d'huile d'olive.",
        "Déshabillez et coupez la tomate et l'avocat en cubes, puis parsemez sur le pain.",
        "Dégustez immédiatement tel quel ou ajoutez une touche de sel."
      ];
    }

    return `### 💡 ${recipeTitle}

> 📝 **Description :** ${recipeDesc}

#### 🛒 Ingrédients de base requis :
${pantry.map(p => `- ${p}`).join('\n')}

#### 👨‍🍳 Étapes de préparation rapide :
${steps.map((s, idx) => `${idx + 1}. **${s.substring(0, Math.min(25, s.length))}** : ${s}`).join('\n')}`;
  };

  const generateAdvice = async (selectedProducts: string[]) => {
    if (selectedProducts.length === 0) {
      setAiResponse("");
      return;
    }

    setLoading(true);
    const selectedItems = PRODUCTS.filter(p => selectedProducts.includes(p.id));
    const selectedNames = selectedItems.map(p => p.name);

    if (!process.env.GEMINI_API_KEY) {
      setTimeout(() => {
        setAiResponse(generateLocalRecipe(selectedNames));
        setLoading(false);
      }, 400);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const selectedItems = PRODUCTS.filter(p => selectedProducts.includes(p.id));
      const selectedNames = selectedItems.map(p => p.name);
      
      const model = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Tu es un assistant anti-gaspillage alimentaire intelligent nommé Rifrutti. 
        Ingrédients sélectionnés par l'utilisateur (proches de la péremption) : ${selectedNames.join(', ')}.
        
        Donne une suggestion de recette courte et percutante.
        Réponds en français, avec un ton encourageant et moderne. Utilise du Markdown. 
        Structure ta réponse comme ceci :
        - 💡 Titre avec emoji
        - 📝 Petite description
        - 🛒 Liste des produits de base nécessaires (Épicerie longue)
        - 👨‍🍳 Étape unique de préparation`,
      });

      const response = await model;
      setAiResponse(response.text || generateLocalRecipe(selectedNames));
    } catch (error) {
      console.warn("API Call Failed, fallback to local recipe generator:", error);
      setAiResponse(generateLocalRecipe(selectedNames));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIds.length > 0) {
      generateAdvice(selectedIds);
    } else {
      setAiResponse("");
    }
  }, [selectedIds]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Frigo Virtuel */}
        <div className="bg-white border-2 border-pastel-pink rounded-3xl p-6 shadow-xl shadow-pastel-pink/5 flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-pastel-pink mb-1">Mon Assistant Frigo</h2>
            <p className="text-pastel-muted text-sm italic">Inventaire Rifrutti synchronisé</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pastel-muted" size={16} />
            <input 
              type="text"
              placeholder="Rechercher un ingrédient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-pastel-bg rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pastel-pink/30 border-transparent focus:border-pastel-pink/30 transition-all text-pastel-text"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pastel-muted hover:text-pastel-danger"
              >
                <CheckCircle2 size={14} className="rotate-45" />
              </button>
            )}
          </div>

          {/* Categories Bar */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                  activeCategory === cat 
                    ? "bg-pastel-pink text-white shadow-md shadow-pastel-pink/20" 
                    : "bg-pastel-bg text-pastel-text hover:bg-pastel-pink/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-pastel-danger uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={16} /> 
              DLC Courte
            </h3>
            <span className="text-[10px] bg-pastel-danger/10 text-pastel-danger px-2 py-0.5 rounded-full font-bold">
              {PRODUCTS.filter(p => p.isUrgent).length} alertes
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                className={cn(
                  "group relative bg-pastel-bg border-2 p-3 rounded-2xl text-center transition-all active:scale-95 flex flex-col items-center justify-center min-h-[90px]",
                  selectedIds.includes(product.id) 
                    ? "border-pastel-pink bg-white shadow-lg shadow-pastel-pink/20 scale-[1.02]" 
                    : "border-transparent hover:border-pastel-blue/30"
                )}
              >
                {product.isUrgent && !selectedIds.includes(product.id) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-pastel-danger rounded-full animate-pulse border-2 border-white" />
                )}
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">{product.emoji}</div>
                <div className="text-[10px] font-bold text-pastel-text line-clamp-1">{product.name}</div>
                <div className={cn(
                  "text-[8px] mt-1 px-1.5 rounded-full font-medium",
                  product.isUrgent ? "text-pastel-danger bg-pastel-danger/5" : "text-pastel-muted bg-pastel-muted/5"
                )}>
                  {product.expiry}
                </div>
              </button>
            ))}
          </div>

          {selectedIds.length > 0 && (
            <div className="mt-6 pt-4 border-t border-pastel-pink/10">
              <div className="flex justify-between items-center bg-pastel-pink/5 p-3 rounded-xl">
                <span className="text-xs font-bold text-pastel-pink">{selectedIds.length} ingrédients sélectionnés</span>
                <button 
                  onClick={() => setSelectedIds([])}
                  className="text-[10px] font-bold text-pastel-muted hover:text-pastel-danger underline"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Assistant */}
        <div className="bg-white border-2 border-pastel-blue rounded-3xl p-8 shadow-xl shadow-pastel-blue/5">
          <h2 className="text-2xl font-bold text-pastel-blue text-center mb-8">L'Assistant IA Anti-Gaspi</h2>
          
          <div id="zone-recettes" className="min-h-[200px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-pastel-blue animate-spin" />
              </div>
            ) : selectedIds.length === 0 ? (
              <div className="bg-pastel-bg p-6 rounded-2xl border-l-8 border-pastel-pink text-center text-pastel-text">
                Veuillez sélectionner des produits proches de la péremption dans votre frigo virtuel.<br /><br />L'IA complétera votre recette avec des produits non-DLC.
              </div>
            ) : (
              <div className="bg-pastel-bg p-6 rounded-2xl border-l-8 border-pastel-blue prose prose-sm max-w-none">
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: Recettes Complètes Clé en main */}
      <div className="bg-white border-2 border-pastel-pink/30 rounded-3xl p-8 shadow-xl shadow-pastel-pink/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pastel-pink/10 text-pastel-pink mb-2">
              <Zap size={12} className="fill-current animate-pulse" /> COMPAGNON DE CUISINE RAPIDE
            </span>
            <h2 className="text-2xl font-bold text-pastel-text">Lots de "Recettes Complètes" en 1 Clic 🛒</h2>
            <p className="text-pastel-muted text-sm mt-1">
              Éco-responsables et économiques : commandez un pack d'invendus triés du jour combinés avec des compléments de placard !
            </p>
          </div>
          <div className="flex items-center gap-4 bg-pastel-success/10 border border-pastel-success/20 px-4 py-2.5 rounded-2xl shrink-0">
            <span className="text-2xl">🌱</span>
            <div>
              <div className="text-xs font-bold text-pastel-text">Moins de déchet, plus de goût</div>
              <p className="text-[10px] text-pastel-muted">1 lot réservé = 1 produit sauvé de la benne</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECIPE_BUNDLES.map(bundle => {
            const originalTotal = bundle.items.reduce((acc, item) => acc + item.originalPrice, 0);
            const promoTotal = bundle.items.reduce((acc, item) => acc + (item.promoPrice !== undefined ? item.promoPrice : item.originalPrice), 0);
            const savings = originalTotal - promoTotal;
            const savingsPercentage = Math.round((savings / originalTotal) * 100);

            return (
              <div 
                key={bundle.id} 
                className="bg-pastel-bg/20 border-2 border-transparent hover:border-pastel-pink/40 rounded-3xl p-6 flex flex-col justify-between transition-all hover:shadow-lg relative group overflow-hidden"
              >
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-pastel-pink text-white font-bold text-xs px-3 py-1 rounded-full shadow-md shadow-pastel-pink/20 z-10">
                  -{savingsPercentage}%
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{bundle.emoji}</span>
                    <div>
                      <h3 className="font-bold text-pastel-text text-base leading-tight group-hover:text-pastel-pink transition-colors">{bundle.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold text-pastel-muted bg-white px-2 py-0.5 rounded border border-gray-100 flex items-center gap-1">
                          <ChefHat size={10} /> {bundle.difficulty}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-pastel-muted bg-white px-2 py-0.5 rounded border border-gray-100 flex items-center gap-1">
                          <Clock size={10} /> {bundle.prepTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-pastel-muted leading-relaxed mb-4">{bundle.description}</p>

                  <div className="space-y-2 mb-6">
                    <div className="text-[10px] uppercase font-bold text-pastel-muted tracking-wider">Ingrédients inclus dans le Lot</div>
                    {bundle.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white text-xs p-2 rounded-xl border border-gray-100 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <span>{item.emoji}</span>
                          <span className="font-medium text-pastel-text">{item.name} <span className="text-pastel-muted text-[10px]">({item.qty})</span></span>
                        </div>
                        {item.isDlc ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase">DLC (-50%)</span>
                            <span className="font-bold text-pastel-text text-[11px]">{item.promoPrice?.toFixed(2)}€</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-bold text-pastel-muted bg-gray-50 px-1.5 py-0.5 rounded uppercase font-sans">Magasin</span>
                            <span className="font-medium text-pastel-text text-[11px]">{item.originalPrice.toFixed(2)}€</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
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

                  <button 
                    disabled={isOrdering !== null}
                    onClick={() => orderBundle(bundle)}
                    className={cn(
                      "w-full font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md",
                      isOrdering === bundle.id
                        ? "bg-pastel-blue text-white"
                        : "bg-pastel-pink hover:bg-pastel-pink-hover text-white shadow-pastel-pink/20 cursor-pointer"
                    )}
                  >
                    {isOrdering === bundle.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Validation...
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} /> Acheter ce Lot Recette
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: Idées de Repas Entiers (Menus Anti-Gaspi Complets) */}
      <div className="bg-white border-2 border-pastel-blue/30 rounded-3xl p-8 shadow-xl shadow-pastel-blue/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pastel-blue/10 text-pastel-blue mb-2">
              <ChefHat size={12} className="fill-current animate-pulse" /> EXPÉRIENCE MENU ANTI-GASPI COMPLET
            </span>
            <h2 className="text-2xl font-bold text-pastel-text">Menus Complets Anti-Gaspi Clé en Main 🍽️</h2>
            <p className="text-pastel-muted text-sm mt-1">
              Savourez un repas entier (entrée, plat et dessert) préparé à base d'invendus du jour et de délices prêts à déguster !
            </p>
          </div>
          <div className="flex items-center gap-4 bg-pastel-blue/10 border border-pastel-blue/20 px-4 py-2.5 rounded-2xl shrink-0">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-xs font-bold text-pastel-text">Entrée + Plat + Dessert</div>
              <p className="text-[10px] text-pastel-muted">Prix réduits d'au moins 50% sur le lot entier</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FULL_MENUS.map(menu => {
            return (
              <div 
                key={menu.id} 
                className="bg-pastel-bg/20 border-2 border-transparent hover:border-pastel-blue/40 rounded-3xl p-6 flex flex-col justify-between transition-all hover:shadow-lg relative group overflow-hidden"
              >
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-pastel-blue text-white font-bold text-xs px-3 py-1 rounded-full shadow-md shadow-pastel-blue/20 z-10">
                  {menu.badge}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{menu.emoji}</span>
                    <div>
                      <h3 className="font-bold text-pastel-text text-base leading-tight group-hover:text-pastel-blue transition-colors">{menu.name}</h3>
                      <p className="text-[10px] text-pastel-muted font-bold font-sans mt-0.5">3 services • DLC Courte</p>
                    </div>
                  </div>

                  <p className="text-xs text-pastel-muted leading-relaxed mb-6">{menu.description}</p>

                  <div className="space-y-4 mb-6">
                    {/* Entrée */}
                    <div className="bg-white p-3 rounded-xl border border-gray-100 flex gap-3 items-start text-left">
                      <span className="text-2xl mt-0.5">{menu.entree.emoji}</span>
                      <div>
                        <div className="font-bold text-xs text-pastel-text">{menu.entree.name}</div>
                        <p className="text-[10px] text-pastel-muted leading-tight mt-0.5">{menu.entree.description}</p>
                        <span className="inline-block mt-1 text-[8px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase">
                          DLC courte • Sauvé (-50%)
                        </span>
                      </div>
                    </div>

                    {/* Plat */}
                    <div className="bg-white p-3 rounded-xl border border-gray-100 flex gap-3 items-start text-left">
                      <span className="text-2xl mt-0.5">{menu.plat.emoji}</span>
                      <div>
                        <div className="font-bold text-xs text-pastel-text">{menu.plat.name}</div>
                        <p className="text-[10px] text-pastel-muted leading-tight mt-0.5">{menu.plat.description}</p>
                        <span className="inline-block mt-1 text-[8px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase">
                          DLC courte • Sauvé (-50%)
                        </span>
                      </div>
                    </div>

                    {/* Dessert */}
                    <div className="bg-white p-3 rounded-xl border border-gray-100 flex gap-3 items-start text-left">
                      <span className="text-2xl mt-0.5">{menu.dessert.emoji}</span>
                      <div>
                        <div className="font-bold text-xs text-pastel-text">{menu.dessert.name}</div>
                        <p className="text-[10px] text-pastel-muted leading-tight mt-0.5">{menu.dessert.description}</p>
                        {menu.dessert.isBakeryFinished ? (
                          <span className="inline-block mt-1 text-[8px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase border border-amber-100">
                            Prêt à consommer • Rayon Boulangerie 🥐
                          </span>
                        ) : (
                          <span className="inline-block mt-1 text-[8px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase">
                            DLC courte • Sauvé
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
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

                  <button 
                    disabled={isOrderingMenu !== null}
                    onClick={() => orderMenu(menu)}
                    className={cn(
                      "w-full font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md",
                      isOrderingMenu === menu.id
                        ? "bg-pastel-pink text-white"
                        : "bg-pastel-blue hover:bg-pastel-blue/90 text-white shadow-pastel-blue/20 cursor-pointer"
                    )}
                  >
                    {isOrderingMenu === menu.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Commande...
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} /> Réserver le Menu Complet
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONFIRMATION / SUCCESS MODAL (Click & Collect) */}
      <AnimatePresence>
        {purchasedBundle && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-4 border-pastel-pink rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
            >
              {/* Confetti styling background accent */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pastel-pink to-pastel-blue" />
              
              <div className="w-16 h-16 bg-pastel-success/20 text-pastel-text rounded-full flex items-center justify-center mx-auto mb-4 border border-green-300">
                <Check className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="text-xl font-bold text-pastel-text mb-2">Panier réservé ! 🎉</h3>
              <p className="text-xs text-pastel-muted px-4 mb-6 leading-relaxed">
                Le lot recette <strong className="text-pastel-text font-bold">"{purchasedBundle.name}"</strong> a été réservé et est prêt pour vous dans votre magasin Rifrutti !
              </p>

              {/* Simulated QR Code reservation details */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-6 flex flex-col items-center">
                <div className="w-32 h-32 bg-white border-2 border-slate-200 p-2 rounded-xl shadow-sm mb-3 flex items-center justify-center">
                  {/* Decorative pixel/QR simulation */}
                  <div className="grid grid-cols-4 gap-1.5 w-full h-full opacity-80">
                    <div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div>
                    <div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-white"></div>
                    <div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div>
                    <div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-pastel-muted uppercase tracking-widest mb-1">Code de retrait</div>
                <div className="text-base font-mono font-extrabold text-pastel-text tracking-widest bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
                  RIFRU-{Math.floor(1000 + Math.random() * 9000)}
                </div>
              </div>

              {/* Order breakdown */}
              <div className="bg-pastel-bg/50 rounded-2xl p-4 text-left space-y-2 mb-6">
                <div className="text-[10px] uppercase font-bold text-pastel-muted tracking-wider mb-1 font-sans">Résumé du Lot</div>
                <div className="text-xs text-pastel-text flex justify-between">
                  <span>🛍️ Ingrédients réguliers:</span>
                  <span className="font-bold">{purchasedBundle.items.filter(i => !i.isDlc).map(i => i.emoji).join(' ')}</span>
                </div>
                <div className="text-xs text-pastel-text flex justify-between">
                  <span>📉 Produits DLC Sauvés:</span>
                  <span className="font-bold text-red-500">{purchasedBundle.items.filter(i => i.isDlc).map(i => i.emoji).join(' ')}</span>
                </div>
                <div className="text-xs text-pastel-text flex justify-between border-t border-dashed border-gray-200 pt-2 font-bold font-sans">
                  <span>À payer en Click & Collect:</span>
                  <span className="text-pastel-pink text-sm">
                    {purchasedBundle.items.reduce((acc, item) => acc + (item.promoPrice !== undefined ? item.promoPrice : item.originalPrice), 0).toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button 
                  onClick={() => setPurchasedBundle(null)}
                  className="w-full bg-pastel-pink hover:bg-pastel-pink-hover text-white font-bold text-xs py-3.5 rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                >
                  Super, j'arrive au magasin !
                </button>
                <div className="flex gap-2 justify-center items-center text-[10px] text-pastel-muted font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-pastel-success animate-pulse"></span>
                  <span>Panier mis de côté 48h au comptoir Rifrutti</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {purchasedMenu && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-4 border-pastel-blue rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
            >
              {/* Confetti styling background accent */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pastel-blue to-pastel-pink" />
              
              <div className="w-16 h-16 bg-pastel-success/20 text-pastel-text rounded-full flex items-center justify-center mx-auto mb-4 border border-green-300">
                <Check className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="text-xl font-bold text-pastel-text mb-2">Menu Complet Réservé ! 🎉</h3>
              <p className="text-xs text-pastel-muted px-4 mb-6 leading-relaxed">
                Le menu anti-gaspi <strong className="text-pastel-text font-bold">"{purchasedMenu.name}"</strong> est réservé avec succès et vous attend en click-and-collect !
              </p>

              {/* Simulated QR Code reservation details */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-6 flex flex-col items-center">
                <div className="w-32 h-32 bg-white border-2 border-slate-200 p-2 rounded-xl shadow-sm mb-3 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-1.5 w-full h-full opacity-80">
                    <div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div>
                    <div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div>
                    <div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-white"></div>
                    <div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-pastel-muted uppercase tracking-widest mb-1">Code de retrait</div>
                <div className="text-base font-mono font-extrabold text-pastel-text tracking-widest bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
                  RIF-MENU-{Math.floor(100 + Math.random() * 900)}
                </div>
              </div>

              {/* Order breakdown */}
              <div className="bg-pastel-bg/50 rounded-2xl p-4 text-left space-y-2 mb-6">
                <div className="text-[10px] uppercase font-bold text-pastel-muted tracking-wider mb-1 font-sans">Composition du Menu</div>
                <div className="text-xs text-pastel-text flex justify-between">
                  <span>🥗 Entrée :</span>
                  <span className="font-bold">{purchasedMenu.entree.name}</span>
                </div>
                <div className="text-xs text-pastel-text flex justify-between">
                  <span>🍽️ Plat :</span>
                  <span className="font-bold">{purchasedMenu.plat.name}</span>
                </div>
                <div className="text-xs text-pastel-text flex justify-between">
                  <span>🍰 Dessert :</span>
                  <span className="font-bold text-amber-600">{purchasedMenu.dessert.name}</span>
                </div>
                <div className="text-xs text-pastel-text flex justify-between border-t border-dashed border-gray-200 pt-2 font-bold font-sans">
                  <span>Total Click & Collect :</span>
                  <span className="text-pastel-blue text-sm">
                    {purchasedMenu.price.toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button 
                  onClick={() => setPurchasedMenu(null)}
                  className="w-full bg-pastel-blue hover:bg-pastel-blue/90 text-white font-bold text-xs py-3.5 rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                >
                  Génial, je vais le chercher !
                </button>
                <div className="flex gap-2 justify-center items-center text-[10px] text-pastel-muted font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-pastel-success animate-pulse"></span>
                  <span>Préparé au comptoir frais Rifrutti</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

