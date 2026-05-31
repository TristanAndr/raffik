import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Wallet,
  ChevronDown,
  HelpCircle,
  Zap,
  Sparkles,
  Calculator,
  ShieldCheck,
  BarChart3,
  Users,
  CheckCircle2,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

/* ─── Fade-up container for stagger ────────────────────────── */
const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' as const },
  }),
};

/* ─── FAQ Item ─────────────────────────────────────────────── */
const FAQItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      className="border-b border-pastel-blue/10 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-4 flex justify-between items-center text-left group focus:outline-none"
      >
        <span className="font-bold text-pastel-text text-sm sm:text-base group-hover:text-pastel-blue transition-colors pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className={cn(
            'shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors',
            isOpen ? 'bg-pastel-blue text-white' : 'bg-pastel-bg text-pastel-muted group-hover:bg-pastel-blue/10 group-hover:text-pastel-blue'
          )}
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-5 px-4 text-pastel-muted text-xs sm:text-sm leading-relaxed border-l-2 border-pastel-blue/30 ml-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Benefit Card ─────────────────────────────────────────── */
const BenefitCard = ({ icon: Icon, title, desc, index }: any) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="visible"
    variants={fadeUpVariants}
    whileHover={{ y: -6, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    className="p-6 bg-white/80 backdrop-blur-sm border-2 border-pastel-blue/10 hover:border-pastel-blue/35 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-pastel-blue/10 transition-shadow cursor-default relative overflow-hidden group"
  >
    {/* Shimmer on hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-pastel-blue/5 to-transparent" />
    </div>
    <motion.div
      className="p-3 bg-gradient-to-br from-pastel-blue/10 to-pastel-blue/5 inline-block rounded-xl text-pastel-blue mb-4 relative z-10"
      whileHover={{ rotate: [0, -8, 8, 0] }}
      transition={{ duration: 0.4 }}
    >
      <Icon size={22} />
    </motion.div>
    <h3 className="text-pastel-text font-bold mb-2 text-sm sm:text-base relative z-10">{title}</h3>
    <p className="text-pastel-muted text-xs sm:text-sm leading-relaxed relative z-10">{desc}</p>
  </motion.div>
);

/* ─── Stat Result Card ─────────────────────────────────────── */
const StatResultCard = ({
  icon: Icon,
  bg,
  iconColor,
  label,
  value,
  sub,
  valueClass = 'text-pastel-text',
  delay = 0,
}: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: 'spring', stiffness: 300, damping: 22 }}
    className="bg-white/70 backdrop-blur-sm border border-pastel-blue/15 p-5 rounded-2xl flex flex-col justify-between items-center text-center shadow-sm hover:shadow-md transition-shadow"
  >
    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mb-3', bg)}>
      <Icon size={18} className={iconColor} />
    </div>
    <div>
      <div className="text-[10px] text-pastel-muted uppercase font-bold tracking-wider mb-1">{label}</div>
      <motion.div
        key={value}
        initial={{ opacity: 0, y: -8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={cn('text-2xl font-black whitespace-nowrap', valueClass)}
      >
        {value}
      </motion.div>
      <p className="text-[10px] text-pastel-muted mt-1 leading-tight">{sub}</p>
    </div>
  </motion.div>
);

/* ─── Main Component ───────────────────────────────────────── */
export default function B2BPresentation() {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(35000);
  const [storeType, setStoreType] = useState<string>('supermarket');
  const [demoRequested, setDemoRequested] = useState(false);

  const getMultipliers = () => {
    switch (storeType) {
      case 'grocery':     return { earnings: 0.12, foodSaved: 5.5,  co2: 13.8 };
      case 'hypermarket': return { earnings: 0.16, foodSaved: 7.2,  co2: 18.0 };
      default:            return { earnings: 0.14, foodSaved: 6.3,  co2: 15.8 };
    }
  };

  const m = getMultipliers();
  const expectedEarnings  = Math.round(monthlyRevenue * m.earnings);
  const expectedFoodSaved = Math.round(monthlyRevenue * m.foodSaved / 100);
  const expectedCO2Saved  = Math.round(expectedFoodSaved * m.co2);

  const rangePercent = ((monthlyRevenue - 2000) / (400000 - 2000)) * 100;

  return (
    <div className="space-y-16">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative text-center max-w-3xl mx-auto space-y-5 pt-4">
        {/* Background blob */}
        <div className="absolute -inset-20 bg-gradient-radial from-pastel-blue/8 to-transparent rounded-full blur-3xl pointer-events-none" />

        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-pastel-blue/15 to-pastel-blue/5 text-pastel-blue border border-pastel-blue/20 shadow-sm"
        >
          <Zap size={11} className="fill-current animate-float" />
          PARTENAIRES RIFRUTTI B2B
        </motion.span>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
        >
          Prêt à{' '}
          <span className="gradient-text-main">numériser</span>{' '}
          votre rayon frais ?
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="text-pastel-muted text-sm sm:text-base lg:text-lg max-w-xl mx-auto"
        >
          Rejoignez le mouvement anti-gaspillage en optimisant vos invendus grâce à notre plateforme intelligente de tarification dynamique.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-pastel-muted font-medium"
        >
          {['Zéro matériel requis', '100% commission performance', 'Déploiement en 24h'].map((f) => (
            <span key={f} className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#5a8f70]" />
              {f}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ── Simulator ─────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative bg-white/80 backdrop-blur-sm border-2 border-pastel-blue/20 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-pastel-blue/8 overflow-hidden"
      >
        {/* Corner decoration */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-pastel-blue/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-pastel-pink/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-3 justify-center lg:justify-start">
            <div className="p-2.5 bg-gradient-to-br from-pastel-blue to-pastel-blue-hover rounded-xl text-white shadow-md shadow-pastel-blue/30">
              <Calculator size={19} />
            </div>
            <h2 className="text-xl font-bold text-pastel-text">Simulateur d'Impact et de Performance</h2>
          </div>
          <p className="text-pastel-muted text-xs sm:text-sm text-center lg:text-left mb-8">
            Estimez dès aujourd'hui ce que vous pouvez gagner, sauver et réduire en émissions de CO₂.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <label className="block text-xs font-bold text-pastel-muted uppercase tracking-wider mb-3">
                  Type de commerce
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'grocery',     label: 'Épicerie',     value: 12000  },
                    { id: 'supermarket', label: 'Supermarché',  value: 45000  },
                    { id: 'hypermarket', label: 'Hypermarché',  value: 180000 },
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => { setStoreType(item.id); setMonthlyRevenue(item.value); }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'w-full py-2 px-4 rounded-xl text-xs font-bold border-2 transition-all text-left',
                        storeType === item.id
                          ? 'border-pastel-blue bg-gradient-to-br from-pastel-blue/15 to-pastel-blue/5 text-pastel-blue shadow-md shadow-pastel-blue/15'
                          : 'border-gray-100 hover:border-pastel-blue/30 text-pastel-text bg-pastel-bg/50'
                      )}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-pastel-muted uppercase tracking-wider">
                    CA Rayon Frais Mensuel
                  </label>
                  <motion.span
                    key={monthlyRevenue}
                    initial={{ scale: 0.85, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-sm font-extrabold text-pastel-blue bg-pastel-blue/8 px-2.5 py-0.5 rounded-lg border border-pastel-blue/15 whitespace-nowrap shrink-0"
                  >
                    {monthlyRevenue.toLocaleString()} €
                  </motion.span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="400000"
                  step="2000"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(parseInt(e.target.value))}
                  style={{ '--range-progress': `${rangePercent}%` } as React.CSSProperties}
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-pastel-muted mt-2 font-mono">
                  <span>2 000 €</span>
                  <span>400 000 €+</span>
                </div>
              </div>
            </div>

            {/* Result Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatResultCard
                icon={Wallet}
                bg="bg-pastel-blue/12"
                iconColor="text-pastel-blue"
                label="Gains Estimés"
                value={`+${expectedEarnings.toLocaleString()} €`}
                sub="de revenus additionnels par mois"
                delay={0}
              />
              <StatResultCard
                icon={TrendingUp}
                bg="bg-pastel-success/30"
                iconColor="text-[#4a7860]"
                label="Denrées Préservées"
                value={`${expectedFoodSaved.toLocaleString()} kg`}
                sub="de denrées valorisées par mois"
                delay={0.06}
              />
              <StatResultCard
                icon={Globe}
                bg="bg-[#f2f8f4]"
                iconColor="text-[#4a7860]"
                label="Empreinte Carbone"
                value={`-${expectedCO2Saved.toLocaleString()} kg`}
                sub="d'émissions CO₂eq évitées / mois"
                valueClass="text-[#4a7860]"
                delay={0.12}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Benefits ──────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Zap,        title: 'Zéro Matériel Additionnel', desc: 'La plateforme s\'intègre directement et de manière invisible aux logiciels de caisse déjà installés.' },
          { icon: BarChart3,  title: 'Algorithme Dynamique',       desc: 'Ajuste automatiquement les réductions heure par heure en fonction de la DLC et du flux magasin.' },
          { icon: Users,      title: 'Diffusion Locale Instantanée', desc: 'Pousse automatiquement vos offres d\'invendus aux clients à proximité via l\'appli Frigo.' },
          { icon: ShieldCheck,title: 'Rapports RSE & Normes',      desc: 'Générez d\'un simple clic des rapports d\'impact certifiés pour valoriser votre démarche écologique.' },
        ].map((b, i) => (
          <BenefitCard key={i} index={i} {...b} />
        ))}
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8 justify-center"
        >
          <div className="p-2 bg-pastel-blue/10 rounded-xl text-pastel-blue">
            <HelpCircle size={20} />
          </div>
          <h2 className="text-2xl font-bold text-pastel-text">Questions Fréquentes</h2>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-sm border-2 border-pastel-blue/10 rounded-2xl px-2 py-2 shadow-xl shadow-pastel-blue/5">
          {[
            { q: 'Quels sont les prérequis pour démarrer avec Rifrutti ?', a: 'Aucun matériel spécialisé ou frigo connecté n\'est nécessaire. Notre solution est entièrement logicielle et se synchronise avec vos outils de gestion ou par simple intégration API.' },
            { q: 'Comment les consommateurs du quartier reçoivent-ils nos offres ?', a: 'Dès qu\'un invendu ou un produit à DLC courte est identifié dans votre console partenaire, il est instantanément poussé sur l\'application mobile \'Mon Frigo\' des consommateurs résidant à moins de 2 kilomètres.' },
            { q: 'Quels sont les logiciels de caisse compatibles ?', a: 'Nous supportons nativement plus de 45 logiciels de caisses modernes, notamment Clyo Systems, L\'Addition, Point d\'Ancre, Zelty, Polaris, et l\'exportation Excel simplifiée.' },
            { q: 'Combien coûte le service pour notre commerce ?', a: 'Notre tarification est basée sur la commission des transactions réussies. C\'est un modèle 100% gagnant-gagnant : pas de ventes supplémentaires, pas de frais !' },
          ].map((item, i) => (
            <FAQItem key={i} index={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative rounded-3xl p-8 sm:p-14 text-center overflow-hidden border-4 border-white shadow-2xl shadow-pastel-blue/20"
        style={{
          background: 'linear-gradient(135deg, #4a7860 0%, #3d6b54 40%, #6ba58a 70%, #4a7860 100%)',
        }}
      >
        {/* Floating decorations */}
        {[
          { size: 120, top: '-5%',  right: '-3%',  opacity: 0.12, delay: 0 },
          { size: 60,  top: '60%',  right: '8%',   opacity: 0.10, delay: 1 },
          { size: 80,  top: '10%',  left: '5%',    opacity: 0.08, delay: 2 },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none text-white"
            style={{ top: s.top, right: (s as any).right, left: (s as any).left, opacity: s.opacity }}
            animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          >
            <Sparkles size={s.size} />
          </motion.div>
        ))}

        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 drop-shadow-sm">
            Prêt à numériser votre rayon frais ?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto text-sm md:text-base font-medium">
            Rejoignez des centaines de primeurs et supermarchés qui améliorent leur rentabilité tout en réduisant de 40% leur gaspillage alimentaire.
          </p>

          <AnimatePresence mode="wait">
            {demoRequested ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1,   y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/20 backdrop-blur-md border-2 border-dashed border-white/40 p-6 rounded-2xl max-w-md mx-auto text-white shadow-lg"
              >
                <div className="text-2xl mb-2">🙌</div>
                <p className="font-bold text-lg mb-1">Demande reçue avec succès !</p>
                <p className="font-medium text-white/85 text-sm leading-relaxed">
                  Nos experts prendront contact avec vous pour fixer une démonstration personnalisée sous 24h.
                </p>
              </motion.div>
            ) : (
              <motion.button
                key="cta"
                onClick={() => setDemoRequested(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="bg-white text-pastel-blue font-bold px-8 sm:px-10 py-3.5 sm:py-4 rounded-full shadow-xl shadow-blue-400/20 border-2 border-white/80 inline-flex items-center gap-2.5 text-sm btn-shine"
              >
                <CheckCircle2 size={16} className="text-[#5a8f70]" />
                Demander une Démonstration Gratuite
                <ArrowRight size={15} className="opacity-60" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
}
