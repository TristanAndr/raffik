import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Wallet, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Zap, 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Globe
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-pastel-blue/10 last:border-0 hover:bg-pastel-bg/10 rounded-xl transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-4 flex justify-between items-center text-left hover:text-pastel-blue transition-colors focus:outline-none"
      >
        <span className="font-bold text-pastel-text text-sm sm:text-base">{question}</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-pastel-blue shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-pastel-muted shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-4 text-pastel-muted text-xs sm:text-sm leading-relaxed animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function B2BPresentation() {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(35000);
  const [storeType, setStoreType] = useState<string>('supermarket');
  const [demoRequested, setDemoRequested] = useState(false);

  // Multiplier effects based on store type for realistic simulation
  const getMultipliers = () => {
    switch (storeType) {
      case 'grocery':
        return { earnings: 0.12, foodSaved: 5.5, co2: 13.8 };
      case 'hypermarket':
        return { earnings: 0.16, foodSaved: 7.2, co2: 18.0 };
      case 'supermarket':
      default:
        return { earnings: 0.14, foodSaved: 6.3, co2: 15.8 };
    }
  };

  const multipliers = getMultipliers();
  
  // Real calculations
  const expectedEarnings = Math.round(monthlyRevenue * multipliers.earnings);
  const expectedFoodSaved = Math.round(monthlyRevenue * multipliers.foodSaved / 100);
  const expectedCO2Saved = Math.round(expectedFoodSaved * multipliers.co2);

  const handleStoreTypeChange = (type: string, defaultRevenue: number) => {
    setStoreType(type);
    setMonthlyRevenue(defaultRevenue);
  };

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pastel-blue/10 text-pastel-blue">
          <Zap size={12} className="fill-current" /> PARTENAIRES RIFRUTTI B2B
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-pastel-text leading-tight">
          Prêt à numériser votre rayon frais ?
        </h1>
        <p className="text-pastel-muted text-sm sm:text-base lg:text-lg max-w-xl mx-auto">
          Rejoignez le mouvement anti-gaspillage en optimisant vos invendus grâce à notre plateforme intelligente de tarification dynamique.
        </p>
      </section>

      {/* Interactive Simulator Section */}
      <section className="bg-white border-2 border-pastel-blue/20 rounded-3xl p-6 sm:p-8 shadow-xl shadow-pastel-blue/5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
            <div className="p-2 bg-pastel-blue rounded-lg text-white">
              <Calculator size={20} />
            </div>
            <h2 className="text-xl font-bold text-pastel-text">Simulateur d’Impact et de Performance</h2>
          </div>
          
          <p className="text-pastel-muted text-xs sm:text-sm text-center lg:text-left mb-8">
            Estimez dès aujourd'hui ce que vous pouvez gagner, sauver et réduire en émissions de CO2 en rejoignant notre communauté de commerces éco-responsables.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <label className="block text-xs font-bold text-pastel-muted uppercase tracking-wider mb-3">
                  Type de commerce
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'grocery', label: 'Épicerie', value: 12000 },
                    { id: 'supermarket', label: 'Supermarché', value: 45000 },
                    { id: 'hypermarket', label: 'Hypermarché', value: 180000 },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleStoreTypeChange(item.id, item.value)}
                      className={cn(
                        "py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all active:scale-95",
                        storeType === item.id 
                          ? "border-pastel-blue bg-pastel-blue/10 text-pastel-blue shadow-sm" 
                          : "border-gray-100 hover:border-pastel-blue/30 text-pastel-text bg-pastel-bg/50"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-pastel-muted uppercase tracking-wider">
                    CA Rayon Frais Mensuel
                  </label>
                  <span className="text-sm font-extrabold text-pastel-blue bg-pastel-blue/5 px-2.5 py-0.5 rounded-lg border border-pastel-blue/10">
                    {monthlyRevenue.toLocaleString()} €
                  </span>
                </div>
                <input 
                  type="range"
                  min="2000"
                  max="400000"
                  step="2000"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(parseInt(e.target.value))}
                  className="w-full accent-pastel-blue h-2 bg-pastel-bg rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-pastel-muted mt-1 font-mono">
                  <span>2 000€</span>
                  <span>400 000€+</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Output Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Earning Card */}
              <div className="bg-pastel-bg/30 border border-pastel-blue/10 p-5 rounded-2xl flex flex-col justify-between items-center text-center">
                <div className="w-10 h-10 bg-pastel-blue/10 rounded-full flex items-center justify-center text-pastel-blue mb-3">
                  <Wallet size={18} />
                </div>
                <div>
                  <div className="text-[10px] text-pastel-muted uppercase font-bold tracking-wider mb-1">Espérer Gagner</div>
                  <motion.div 
                    key={expectedEarnings}
                    initial={{ scale: 0.95, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-black text-pastel-text"
                  >
                    +{expectedEarnings.toLocaleString()} €
                  </motion.div>
                  <p className="text-[10px] text-pastel-muted mt-1 leading-tight">par mois de revenus sauvegardés</p>
                </div>
              </div>

              {/* Saved Food Card */}
              <div className="bg-pastel-bg/30 border border-pastel-blue/10 p-5 rounded-2xl flex flex-col justify-between items-center text-center">
                <div className="w-10 h-10 bg-pastel-success/30 rounded-full flex items-center justify-center text-pastel-text mb-3">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div className="text-[10px] text-pastel-muted uppercase font-bold tracking-wider mb-1">Espérer Sauver</div>
                  <motion.div 
                    key={expectedFoodSaved}
                    initial={{ scale: 0.95, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-black text-pastel-text"
                  >
                    {expectedFoodSaved.toLocaleString()} kg
                  </motion.div>
                  <p className="text-[10px] text-pastel-muted mt-1 leading-tight">de nourriture sauvée du rebut</p>
                </div>
              </div>

              {/* CO2 Impact Card */}
              <div className="bg-pastel-bg/30 border border-pastel-blue/10 p-5 rounded-2xl flex flex-col justify-between items-center text-center font-sans">
                <div className="w-10 h-10 bg-green-50 rounded-full border border-green-200 flex items-center justify-center text-green-600 mb-3">
                  <Globe size={18} />
                </div>
                <div>
                  <div className="text-[10px] text-pastel-muted uppercase font-bold tracking-wider mb-1">Impact Climat</div>
                  <motion.div 
                    key={expectedCO2Saved}
                    initial={{ scale: 0.95, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-black text-green-600"
                  >
                    -{expectedCO2Saved.toLocaleString()} kg
                  </motion.div>
                  <p className="text-[10px] text-pastel-muted mt-1 leading-tight">d’émissions CO₂eq évitées / mois</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits / Services section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Zap, title: "Zéro Matériel Additionnel", desc: "La plateforme s'intègre directement et de manière invisible aux logiciels de caisse déjà installés." },
          { icon: BarChart3, title: "Algorithme Dynamique", desc: "Ajuste automatiquement les réductions heure par heure en fonction de la DLC et du flux magasin." },
          { icon: Users, title: "Diffusion Locale Instantanée", desc: "Pousse automatiquement vos offres d'invendus aux clients à proximité via l'appli Frigo." },
          { icon: ShieldCheck, title: "Rapports RSE & Normes", desc: "Générez d'un simple clic des rapports d'impact certifiés pour valoriser votre démarche écologique." }
        ].map((benefit, i) => (
          <div key={i} className="p-6 bg-white border-2 border-pastel-blue/10 rounded-2xl hover:border-pastel-blue/35 transition-all shadow-sm">
            <div className="p-3 bg-pastel-blue/5 inline-block rounded-xl text-pastel-blue mb-4">
              <benefit.icon size={22} className="fill-current" />
            </div>
            <h3 className="text-pastel-text font-bold mb-2 text-sm sm:text-base">{benefit.title}</h3>
            <p className="text-pastel-muted text-xs sm:text-sm leading-relaxed">{benefit.desc}</p>
          </div>
        ))}
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <HelpCircle className="text-pastel-blue" size={24} />
          <h2 className="text-2xl font-bold text-pastel-text">Questions Fréquentes</h2>
        </div>
        <div className="bg-white border-2 border-pastel-blue/10 rounded-2xl px-2 py-2 shadow-xl shadow-pastel-blue/5">
          <FAQItem 
            question="Quels sont les prérequis pour démarrer avec Rifrutti ?" 
            answer="Aucun matériel spécialisé ou frigo connecté n'est nécessaire. Notre solution est entièrement logicielle et se synchronise avec vos outils de gestion ou par simple intégration API."
          />
          <FAQItem 
            question="Comment les consommateurs du quartier reçoivent-ils nos offres ?" 
            answer="Dès qu'un invendu ou un produit à DLC courte est identifié dans votre console partenaire, il est instantanément poussé sur l'application mobile 'Mon Frigo' des consommateurs résidant à moins de 2 kilomètres."
          />
          <FAQItem 
            question="Quels sont les logiciels de caisse compatibles ?" 
            answer="Nous supportons nativement plus de 45 logiciels de caisses modernes, notamment Clyo Systems, L'Addition, Point d'Ancre, Zelty, Polaris, et l'exportation Excel simplifiée."
          />
          <FAQItem 
            question="Combien coûte le service pour notre commerce ?" 
            answer="Notre tarification est basée sur la commission des transactions réussies. C'est un modèle 100% gagnant-gagnant : pas de ventes supplémentaires, pas de frais !"
          />
        </div>
      </section>

      {/* CTA / Promotion Section */}
      <section className="bg-pastel-blue rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-pastel-blue/20 border-4 border-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-10 text-white pointer-events-none">
          <Sparkles size={160} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
          Prêt à numériser votre rayon frais ?
        </h2>
        <p className="text-white/90 mb-8 max-w-xl mx-auto text-xs sm:text-sm md:text-base font-medium">
          Rejoignez des centaines de primeurs et supermarchés qui améliorent leur rentabilité tout en réduisant de 40% leur gaspillage alimentaire de frais.
        </p>
        {demoRequested ? (
          <div className="bg-white/20 backdrop-blur-md border-2 border-dashed border-white/40 p-5 rounded-2xl max-w-md mx-auto text-white text-xs sm:text-sm font-bold flex flex-col items-center gap-2 animate-fade-in shadow-lg">
            <span className="text-xl">🙌 Demande reçue avec succès !</span>
            <p className="font-medium text-white/90 leading-relaxed text-center">
              Merci pour votre intérêt. Nos experts prendront contact avec vous pour fixer une démonstration personnalisée sous 24h.
            </p>
          </div>
        ) : (
          <button 
            onClick={() => setDemoRequested(true)}
            className="bg-white hover:bg-pastel-bg text-pastel-blue font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all shadow-lg active:scale-95 border-2 border-white cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm"
          >
            <CheckCircle2 size={16} /> Demander une Démonstration Gratuite
          </button>
        )}
      </section>
    </div>
  );
}
