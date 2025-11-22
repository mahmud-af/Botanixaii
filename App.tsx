import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { identifyPlant } from './services/geminiService';
import { PlantIdentification, Language } from './types';
import { Icons } from './components/Icons';

const STORAGE_KEY = 'botanix_history_v3';

// UI Dictionaries
const UI_TEXT = {
  en: {
    title: "Botanix",
    subtitle: "AI",
    history: "Collection",
    scanTitle: "Identify Plant",
    scanSubtitle: "Capture a specimen to unlock high-definition botanical diagnostics.",
    cameraBtn: "Capture Specimen",
    uploadBtn: "Load Image",
    analyzing: "Analyzing Specimen...",
    consulting: "Consulting botanical database",
    error: "Analysis inconclusive. Please ensure the subject is in focus.",
    emptyHistory: "Your collection is awaiting its first discovery.",
    startScan: "Begin Identification",
    heroTitle: "Botanical Intelligence",
    heroSub: "Professional-grade flora identification and diagnostics powered by next-generation AI.",
    features: [
      { title: "Taxonomy", desc: "Scientific Classification" },
      { title: "Diagnostics", desc: "Pathology Detection" },
      { title: "Care Guide", desc: "Cultivation Protocols" }
    ],
    switchTo: "বাংলা"
  },
  bn: {
    title: "বোটানিক্স",
    subtitle: "এআই",
    history: "সংগ্রহ",
    scanTitle: "গাছ চিনুন",
    scanSubtitle: "গাছের নাম এবং যত্ন সম্পর্কে জানতে একটি পরিষ্কার ছবি তুলুন।",
    cameraBtn: "ছবি তুলুন",
    uploadBtn: "গ্যালারি",
    analyzing: "বিশ্লেষণ করা হচ্ছে...",
    consulting: "বোটানিক্যাল ডেটাবেস দেখা হচ্ছে",
    error: "চিনতে পারিনি। দয়া করে আরো পরিষ্কার ছবি দিন।",
    emptyHistory: "কোনো গাছ সেভ করা নেই",
    startScan: "স্ক্যান শুরু করুন",
    heroTitle: "বোটানিক্যাল ইন্টেলিজেন্স",
    heroSub: "উন্নত এআই দ্বারা চালিত পেশাদার উদ্ভিদ সনাক্তকরণ এবং রোগ নির্ণয়।",
    features: [
      { title: "শ্রেণীবিন্যাস", desc: "বৈজ্ঞানিক নাম ও পরিবার" },
      { title: "রোগ নির্ণয়", desc: "স্বাস্থ্য পরীক্ষা ও সমাধান" },
      { title: "যত্ন নির্দেশিকা", desc: "পানি ও আলোর সঠিক নিয়ম" },
    ],
    switchTo: "English"
  }
};

const App: React.FC = () => {
  const [history, setHistory] = useState<PlantIdentification[]>([]);
  const [currentScan, setCurrentScan] = useState<PlantIdentification | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'history'>('home');
  const [language, setLanguage] = useState<Language>('en');

  const text = UI_TEXT[language];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  const saveToHistory = (scan: PlantIdentification) => {
    // Deduplicate by ID
    const filtered = history.filter(h => h.id !== scan.id);
    const updated = [scan, ...filtered].slice(0, 50);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleImageSelected = async (base64: string) => {
    setIsAnalyzing(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await identifyPlant(base64, language);
      setCurrentScan(result);
      saveToHistory(result);
    } catch (err) {
      setError(text.error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCurrentScan(null);
    setError(null);
    setView('home');
  };

  const LoadingOverlay = () => {
    const [progress, setProgress] = useState(0);
    
    // Multi-stage definitions with Icons
    const stages = language === 'bn'
      ? [
          { text: "নমুনা স্ক্যান করা হচ্ছে...", icon: Icons.Scan },
          { text: "বৈশিষ্ট্য বিশ্লেষণ...", icon: Icons.Search },
          { text: "ডেটাবেস অনুসন্ধান...", icon: Icons.Globe },
          { text: "রিপোর্ট তৈরি...", icon: Icons.BookOpen }
        ]
      : [
          { text: "Scanning Specimen...", icon: Icons.Scan },
          { text: "Analyzing Morphology...", icon: Icons.Search },
          { text: "Consulting Database...", icon: Icons.Globe },
          { text: "Finalizing Report...", icon: Icons.BookOpen }
        ];

    // Determine current stage based on progress quartiles
    const stageIndex = Math.min(Math.floor(progress / 25), 3);
    const currentStage = stages[stageIndex];
    const CurrentIcon = currentStage.icon;

    useEffect(() => {
      const duration = 4000;
      const interval = 30;
      const step = 100 / (duration / interval);

      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 99) return 99; 
          return prev + step;
        });
      }, interval);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fafaf9]/95 backdrop-blur-xl transition-all animate-fade-in cursor-wait">
         
         <div className="relative mb-16">
            {/* Animated Glow */}
            <div className="absolute inset-0 bg-botanical-500/10 blur-3xl rounded-full animate-pulse-slow"></div>

            {/* Orbiting Particles/Rings */}
            <div className="absolute inset-0 rounded-full border border-stone-200/60 scale-[1.8]"></div>
            <div className="absolute inset-0 rounded-full border border-stone-300/40 scale-[1.4] border-dashed animate-[spin_12s_linear_infinite]"></div>
            <div className="absolute inset-0 rounded-full border border-botanical-900/10 scale-[1.2] animate-[spin_8s_linear_infinite_reverse]"></div>
            
            {/* Orbiting Satellite Dot */}
            <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite]">
                 <div className="w-2.5 h-2.5 bg-stone-800 rounded-full absolute -top-12 left-1/2 shadow-lg ring-4 ring-white"></div>
            </div>

            {/* Central Hexagon/Circle Container */}
            <div className="w-28 h-28 bg-white rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center relative z-10 overflow-hidden border border-stone-100 transition-all duration-500">
                {/* Scanning Beam Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/5 to-transparent animate-scan h-full w-full"></div>
                
                {/* Dynamic Icon */}
                <div key={stageIndex} className="animate-scale-in">
                    <CurrentIcon size={36} className="text-stone-800 stroke-[1.5]" />
                </div>
            </div>
         </div>

         {/* Typography & Progress */}
         <div className="flex flex-col items-center w-72 gap-5 relative z-10">
            <h3 className={`text-xl font-medium text-stone-900 text-center tracking-wide h-8 animate-fade-in ${language === 'bn' ? 'font-bangla' : 'font-serif'}`}>
               {currentStage.text}
            </h3>
            
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-stone-900 transition-all duration-300 ease-out relative" 
                 style={{ width: `${progress}%` }}
               >
                 <div className="absolute inset-0 bg-white/20"></div>
                 <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[1px]"></div>
               </div>
            </div>
            
            {/* Stats */}
            <div className="flex justify-between w-full text-[10px] text-stone-400 font-bold uppercase tracking-widest font-mono">
                <span className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   AI Processing
                </span>
                <span>{progress.toFixed(0)}%</span>
            </div>
         </div>
      </div>
    );
  };

  if (currentScan) {
    return (
      <>
        {isAnalyzing && <LoadingOverlay />}
        <AnalysisResult data={currentScan} onReset={handleReset} language={language} />
      </>
    );
  }

  return (
    <div className={`min-h-screen bg-[#fafaf9] text-stone-800 selection:bg-stone-900 selection:text-white ${language === 'bn' ? 'font-bangla' : 'font-sans'}`}>
      
      {isAnalyzing && <LoadingOverlay />}

      {/* Premium Glass Navbar */}
      <nav className="fixed top-0 z-30 w-full px-6 py-6 transition-all duration-300 bg-white/70 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Brand */}
          <div 
            onClick={() => setView('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-stone-900/20 group-hover:scale-105 transition-transform duration-500">
               <Icons.Leaf size={20} />
            </div>
            <div className="flex flex-col leading-none">
                <span className={`font-bold text-xl text-stone-900 tracking-tight ${language === 'bn' ? 'font-bangla' : 'font-serif'}`}>
                    {text.title}<span className="text-stone-400 font-serif italic ml-1 font-light">{text.subtitle}</span>
                </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest group"
              aria-label="Switch Language"
            >
              <Icons.Globe size={14} className="group-hover:text-stone-900 transition-colors" />
              <span className={`${language === 'en' ? 'font-bangla' : 'font-sans'} group-hover:text-stone-900 transition-colors`}>
                {text.switchTo}
              </span>
            </button>

            {/* History Button */}
            <button 
              onClick={() => setView('history')}
              className={`p-2.5 rounded-full transition-all active:scale-95 flex items-center gap-2
                  ${view === 'history' 
                  ? 'bg-stone-900 text-white shadow-xl shadow-stone-900/20' 
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}
              aria-label={text.history}
            >
              <Icons.Grid size={20} className="stroke-[1.5]" />
            </button>
          </div>

        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-16 max-w-4xl mx-auto px-6 min-h-[calc(100vh-80px)]">
        
        {view === 'home' ? (
          <div className="animate-fade-in">
            
            {/* Editorial Hero */}
            <div className="text-center mb-16 pt-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 animate-slide-up opacity-0 shadow-sm" style={{ animationDelay: '0.1s' }}>
                <Icons.Sparkles size={10} />
                <span>{text.heroTitle}</span>
              </div>
              <h1 className={`text-5xl md:text-7xl font-serif font-medium text-stone-900 mb-8 leading-[0.9] tracking-tight ${language === 'bn' ? 'leading-snug' : ''} animate-slide-up opacity-0`} style={{ animationDelay: '0.2s' }}>
                {text.scanTitle}
              </h1>
              <p className="text-stone-500 text-lg max-w-lg mx-auto font-light leading-relaxed animate-slide-up opacity-0 tracking-wide" style={{ animationDelay: '0.3s' }}>
                {text.heroSub}
              </p>
            </div>

            {/* Premium Scanner */}
            <div className="animate-slide-up opacity-0 max-w-2xl mx-auto" style={{ animationDelay: '0.4s' }}>
               <ImageUploader onImageSelected={handleImageSelected} labels={text} />
               {error && (
                 <div className="mt-6 p-5 bg-red-50/50 border border-red-100 text-red-800 rounded-2xl flex items-center justify-center gap-3 animate-pop backdrop-blur-sm">
                   <Icons.AlertTriangle size={20} className="text-red-600" />
                   <span className="font-medium tracking-wide text-sm">{error}</span>
                 </div>
               )}
            </div>

            {/* Feature Footer (Minimalist) */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-200/50 pt-12 animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
              {text.features.map((f, i) => (
                <div key={i} className="text-center group cursor-default">
                  <div className="w-12 h-12 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                    {i === 0 ? <Icons.Layers size={20} /> : i === 1 ? <Icons.Activity size={20} /> : <Icons.Sprout size={20} />}
                  </div>
                  <h4 className={`font-bold text-stone-900 mb-2 text-sm uppercase tracking-widest ${language === 'bn' ? 'font-bangla' : 'font-sans'}`}>{f.title}</h4>
                  <p className="text-stone-400 text-xs font-serif italic">{f.desc}</p>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="animate-fade-in">
             <div className="flex justify-between items-end mb-12 border-b border-stone-200 pb-6">
               <div>
                 <h2 className={`text-4xl font-serif text-stone-900 mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>{text.history}</h2>
                 <p className="text-stone-400 font-light">Your personal herbarium</p>
               </div>
               <span className="px-3 py-1 bg-stone-100 rounded-full text-stone-500 text-xs font-bold uppercase tracking-widest">{history.length} Specs</span>
             </div>

             {history.length === 0 ? (
               <div className="text-center py-32 rounded-[2rem] border border-stone-200/50 bg-white shadow-sm">
                 <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300 border border-stone-100">
                   <Icons.BookOpen size={32} strokeWidth={1} />
                 </div>
                 <p className="text-stone-400 font-light text-lg mb-6">{text.emptyHistory}</p>
                 <button onClick={() => setView('home')} className="px-6 py-3 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-stone-900/20 transition-all">
                   {text.startScan}
                 </button>
               </div>
             ) : (
               <div className="columns-1 sm:columns-2 gap-6 space-y-6">
                 {history.map((item) => (
                   <div 
                     key={item.id}
                     onClick={() => setCurrentScan(item)}
                     className="break-inside-avoid group bg-white rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_10px_40px_-3px_rgba(0,0,0,0.1)] transition-all duration-500 border border-stone-100 cursor-pointer"
                   >
                     <div className="relative aspect-[3/4] mb-5 overflow-hidden rounded-xl bg-stone-100">
                       <img 
                         src={item.imageUrl} 
                         alt={item.scientificName} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                         loading="lazy"
                       />
                       <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold uppercase tracking-widest text-stone-900 shadow-sm">
                            {Math.round(item.confidence)}%
                          </span>
                       </div>
                     </div>
                     <div className="px-1">
                       <h3 className={`font-bold text-stone-900 text-xl leading-tight mb-2 group-hover:underline decoration-1 underline-offset-4 transition-all ${language === 'bn' ? 'font-bangla' : 'font-serif'}`}>
                         {item.commonNames?.[0] || item.scientificName}
                       </h3>
                       <p className="text-stone-500 text-sm font-serif italic mb-4">
                         {item.scientificName}
                       </p>
                       <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                          <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                            <Icons.Calendar size={12} />
                            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 group-hover:bg-stone-900 group-hover:text-white transition-all">
                            <Icons.ArrowRight size={12} />
                          </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </main>

    </div>
  );
};

export default App;