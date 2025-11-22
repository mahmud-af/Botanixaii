import React, { useEffect, useState } from 'react';
import { PlantIdentification, Language } from '../types';
import { Icons } from './Icons';

interface AnalysisResultProps {
  data: PlantIdentification;
  onReset: () => void;
  language: Language;
}

// Simple Dictionary
const DICT = {
  en: {
    back: "Back",
    careGuide: "Care Rituals",
    sunlight: "Light",
    water: "Hydration",
    soil: "Soil Composition",
    safety: "Safety Profile",
    poisonous: "Toxic",
    medicinal: "Medicinal Properties",
    safe: "Non-Toxic",
    health: "Health Status",
    native: "Origin",
    family: "Botanical Family",
    story: "The Specimen",
    treatment: "Remedy",
    healthy: "Excellent Condition",
    confidence: "Match Accuracy",
    benefitsTitle: "Therapeutic Benefits",
    morphology: "Morphology",
    leaves: "Foliage",
    flowers: "Bloom",
    fruits: "Fruit/Seed",
    stems: "Stem Structure",
    roots: "Root System",
    nectar: "Nectar",
    similar: "Related Species",
    difference: "Key Distinction",
  },
  bn: {
    back: "ফিরে যান",
    careGuide: "যত্নের নিয়ম",
    sunlight: "আলো",
    water: "পানি",
    soil: "মাটি",
    safety: "নিরাপত্তা সতর্কতা",
    poisonous: "বিষাক্ত",
    medicinal: "ঔষধি গুণাগুণ",
    safe: "নিরাপদ",
    health: "স্বাস্থ্যের অবস্থা",
    native: "আদি নিবাস",
    family: "পরিবার",
    story: "পরিচিতি",
    treatment: "চিকিৎসা",
    healthy: "সুস্থ গাছ",
    confidence: "সঠিকতা",
    benefitsTitle: "শারীরিক উপকারিতা",
    morphology: "গঠন",
    leaves: "পাতা",
    flowers: "ফুল",
    fruits: "ফল",
    stems: "কান্ড",
    roots: "শিকড়",
    nectar: "মকরন্দ",
    similar: "অনুরূপ প্রজাতি",
    difference: "পার্থক্য",
  }
};

// Premium Card Wrapper
const SectionCard = ({ children, className = "", delay = 0 }: React.PropsWithChildren<{ className?: string, delay?: number }>) => (
  <div 
    className={`bg-white p-8 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-stone-100 mb-8 transition-all duration-700 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] animate-slide-up opacity-0 ${className}`}
    style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
  >
    {children}
  </div>
);

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset, language }) => {
  const t = DICT[language];
  const isBengali = language === 'bn';
  const fontClass = isBengali ? 'font-bangla' : 'font-sans';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    window.scrollTo(0, 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data) return null;

  return (
    <div className={`w-full min-h-screen bg-[#fafaf9] pb-32 ${fontClass} selection:bg-stone-900 selection:text-white`}>
      
      {/* Floating Navigation Header */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 px-6 py-4 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-stone-200/50' : 'bg-transparent'}`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button 
            onClick={onReset}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${scrolled ? 'bg-stone-100 text-stone-900' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'}`}
          >
            <Icons.ChevronLeft size={20} />
          </button>
          {scrolled && (
            <span className="font-serif font-bold text-stone-900 animate-fade-in tracking-tight">
              {data.commonNames?.[0]}
            </span>
          )}
          <div className="w-10" /> {/* Spacer for balance */}
        </div>
      </div>

      {/* 1. Immersive Hero Section (Parallax feel) */}
      <div className="relative w-full h-[60vh] min-h-[500px] bg-stone-900 overflow-hidden">
        <img 
          src={data.imageUrl} 
          alt={data.scientificName} 
          className="w-full h-full object-cover opacity-95 animate-scale-in"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#fafaf9]"></div>
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 z-10 max-w-4xl mx-auto">
           <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-stone-900 mb-6 opacity-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
             <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md shadow-sm rounded-md border border-stone-200/50">{data.taxonomy?.family || "Unknown Family"}</span>
             <span className="px-3 py-1.5 bg-botanical-950 text-white shadow-sm rounded-md flex items-center gap-2">
                <Icons.Sparkles size={10} className="text-yellow-400" />
                {Math.round(data.confidence)}% {t.confidence}
             </span>
           </div>
           
           <h1 className="text-5xl md:text-7xl font-serif font-medium leading-[0.9] mb-4 text-stone-900 drop-shadow-sm opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
             {data.commonNames?.[0] || data.scientificName}
           </h1>
           
           <p className="text-stone-600 italic text-2xl font-light font-serif opacity-0 animate-slide-up" style={{ animationDelay: '0.3s' }}>
             {data.scientificName}
           </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4 relative z-10">
        
        {/* 2. Health Status Indicator (Minimalist) */}
        {data.diagnostics?.status && data.diagnostics.status !== "Healthy" ? (
           <SectionCard className="!border-l-4 !border-l-red-500 !py-6" delay={0.4}>
             <div className="flex flex-col sm:flex-row gap-5">
               <div className="p-3 bg-red-50 rounded-full text-red-600 shrink-0 self-start border border-red-100">
                 <Icons.AlertTriangle size={24} strokeWidth={1.5} />
               </div>
               <div>
                 <h3 className="font-serif font-bold text-red-900 text-xl mb-2">{data.diagnostics.status}</h3>
                 <p className="text-stone-600 leading-relaxed mb-4 font-light">{data.diagnostics.details}</p>
                 <div className="pl-4 border-l border-red-200">
                   <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-1">{t.treatment}</p>
                   <p className="text-red-900/80 font-medium">{data.diagnostics.treatment}</p>
                 </div>
               </div>
             </div>
           </SectionCard>
        ) : (
          <div className="flex items-center gap-3 mb-10 animate-fade-in opacity-70" style={{ animationDelay: '0.5s' }}>
             <Icons.CheckCircle size={18} className="text-emerald-600" />
             <span className="text-stone-500 font-medium text-sm tracking-wide uppercase">{t.healthy}</span>
          </div>
        )}

        {/* 3. The Story (Editorial Layout) */}
        <SectionCard delay={0.5}>
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400">
                <Icons.Quote size={20} />
             </div>
             <h2 className="font-serif text-3xl text-stone-900">{t.story}</h2>
          </div>
          <p className="text-stone-700 leading-[1.8] text-lg font-light text-justify">
            {data.description}
          </p>
        </SectionCard>

        {/* 4. Morphology Grid (Clean Lines) */}
        {data.morphology && (
          <SectionCard delay={0.6}>
            <h2 className="font-serif text-2xl text-stone-900 mb-8 pb-4 border-b border-stone-100">{t.morphology}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { icon: Icons.Leaf, label: t.leaves, val: data.morphology.leaves },
                { icon: Icons.Flower, label: t.flowers, val: data.morphology.flowers },
                { icon: Icons.Apple, label: t.fruits, val: data.morphology.fruits },
                { icon: Icons.GitBranch, label: t.stems, val: data.morphology.stems },
                { icon: Icons.MoveDown, label: t.roots, val: data.morphology.roots },
                { icon: Icons.Droplet, label: t.nectar, val: data.morphology.nectar },
              ].map((item, idx) => (
                item.val ? (
                  <div key={idx} className="group">
                    <div className="flex items-center gap-2 mb-2 text-stone-400 group-hover:text-stone-900 transition-colors">
                      <item.icon size={16} />
                      <h4 className="font-bold text-xs uppercase tracking-widest">{item.label}</h4>
                    </div>
                    <p className="text-stone-800 leading-relaxed font-light">{item.val}</p>
                  </div>
                ) : null
              ))}
            </div>
          </SectionCard>
        )}

        {/* 5. Benefits (Highlighted) */}
        <div className="relative my-10 overflow-hidden rounded-2xl bg-emerald-900 text-emerald-50 p-8 md:p-12 shadow-2xl animate-slide-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                 <Icons.HeartPulse size={28} className="text-emerald-300" />
                 <h3 className="font-serif text-2xl md:text-3xl text-white">{t.benefitsTitle}</h3>
               </div>
               <p className="text-emerald-100/90 text-lg leading-relaxed font-light border-l-2 border-emerald-500/50 pl-6">
                 {data.benefits || "No specific health benefits listed."}
               </p>
             </div>
        </div>

        {/* 6. Care Guide (Visual Cards) */}
        {data.care && (
          <SectionCard delay={0.8}>
             <h2 className="font-serif text-3xl text-stone-900 mb-8 text-center">{t.careGuide}</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { icon: Icons.Sun, title: t.sunlight, val: data.care.light, color: 'text-amber-600', bg: 'bg-amber-50' },
                 { icon: Icons.Droplets, title: t.water, val: data.care.water, color: 'text-blue-600', bg: 'bg-blue-50' },
                 { icon: Icons.Shovel, title: t.soil, val: data.care.soil, color: 'text-stone-600', bg: 'bg-stone-100' }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl bg-stone-50/50 border border-stone-100 hover:bg-white hover:shadow-lg transition-all duration-500">
                   <div className={`w-14 h-14 rounded-full ${item.bg} ${item.color} flex items-center justify-center mb-4 shadow-inner`}>
                     <item.icon size={24} strokeWidth={1.5} />
                   </div>
                   <h4 className="font-bold text-stone-900 text-sm uppercase tracking-widest mb-3">{item.title}</h4>
                   <p className="text-stone-600 text-sm leading-relaxed font-light">{item.val}</p>
                 </div>
               ))}
             </div>
          </SectionCard>
        )}

        {/* 7. Split Sections: Safety & Similar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
            
            {/* Safety */}
            {data.safety && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                <h2 className="font-serif text-xl text-stone-900 mb-6 flex items-center gap-2">
                    <Icons.Shield size={20} className="text-stone-400"/>
                    {t.safety}
                </h2>
                <div className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                         {data.safety.isPoisonous && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-widest border border-red-100">
                                <Icons.AlertTriangle size={12} />
                                {t.poisonous}
                            </span>
                         )}
                         {data.safety.isInvasive && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-widest border border-orange-100">
                                <Icons.Activity size={12} />
                                Invasive
                            </span>
                         )}
                         {data.safety.isEndangered && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-widest border border-rose-100">
                                <Icons.AlertTriangle size={12} />
                                Endangered
                            </span>
                         )}
                         {!data.safety.isPoisonous && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                                <Icons.CheckCircle size={12} />
                                {t.safe}
                            </span>
                         )}
                    </div>

                    {data.safety.isPoisonous && (
                        <p className="text-red-900/70 text-sm leading-relaxed">{data.safety.poisonDetails}</p>
                    )}
                    
                    {data.safety.isMedicinal && (
                    <div className="p-5 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="flex gap-2 items-center mb-2">
                            <Icons.Sparkles className="text-purple-600" size={18}/>
                            <span className="font-bold text-stone-800 text-sm tracking-wide uppercase">{t.medicinal}</span>
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed">{data.safety.medicinalUses}</p>
                    </div>
                    )}
                </div>
            </div>
            )}

            {/* Similar Species (Dark Mode Card) */}
            {data.similarSpecies && data.similarSpecies.length > 0 && (
            <div className="bg-stone-900 p-8 rounded-2xl shadow-2xl text-stone-300 flex flex-col relative overflow-hidden">
                {/* Grain Texture Overlay */}
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                
                <h2 className="font-serif text-xl text-white mb-6 flex items-center gap-2 relative z-10">
                    <Icons.GitBranch size={20} className="text-stone-500"/>
                    {t.similar}
                </h2>
                
                <div className="grid grid-cols-1 gap-3 relative z-10">
                    {data.similarSpecies.slice(0, 3).map((sim, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                        <div className="flex items-baseline justify-between mb-2">
                             <h3 className="font-serif text-white text-lg tracking-wide group-hover:text-emerald-300 transition-colors">{sim.name}</h3>
                             <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">0{idx + 1}</span>
                        </div>
                        <p className="text-stone-400 text-xs leading-relaxed font-light border-l-2 border-stone-700 pl-3">
                            {sim.difference}
                        </p>
                    </div>
                    ))}
                </div>
            </div>
            )}

        </div>

      </div>

      {/* Bottom Fixed Action (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-stone-200 z-30 md:hidden">
         <button 
           onClick={onReset} 
           className="w-full bg-stone-900 text-white font-medium py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]"
         >
           <Icons.Scan size={16} />
           {t.back}
         </button>
      </div>

    </div>
  );
};