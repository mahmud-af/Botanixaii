import React, { useState, useRef } from 'react';
import { Icons } from './Icons';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  labels: any; // Pass translations
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, labels }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Optimization: Increased to 1920px for High Definition analysis and display
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        // JPEG 0.9 (90% quality) - High Fidelity for Premium feel
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.9);
        onImageSelected(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  return (
    <div className="w-full group perspective-1000">
      <div
        className={`
          relative w-full overflow-hidden rounded-[2rem] transition-all duration-700 ease-out
          border border-stone-900/5
          ${isDragging 
            ? 'bg-stone-50 scale-[1.01] shadow-2xl shadow-stone-900/10' 
            : 'bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-stone-900/5 hover:-translate-y-1'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Decorative noise texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply pointer-events-none"></div>

        <div className="flex flex-col items-center justify-center py-20 px-6 text-center relative z-10">
          
          {/* Icon Container */}
          <div className={`
            mb-10 p-8 rounded-full transition-all duration-700 relative
            ${isDragging ? 'bg-white shadow-inner' : 'bg-stone-50 shadow-sm'}
          `}>
            <div className="absolute inset-0 rounded-full border border-stone-900/5 animate-pulse-slow"></div>
            <Icons.Scan size={48} className="text-stone-800 stroke-[1] relative z-10" />
          </div>

          <h3 className="text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-6 tracking-tight">
            {labels.scanTitle}
          </h3>
          <p className="text-stone-500 mb-12 max-w-sm mx-auto leading-relaxed font-light text-lg tracking-wide">
            {labels.scanSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row w-full max-w-md gap-5">
            
            {/* Primary Camera Action - Premium Button */}
            <button
              onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
              className="group flex-1 relative overflow-hidden rounded-2xl bg-stone-900 text-white p-5 shadow-xl shadow-stone-900/20 hover:shadow-2xl hover:shadow-stone-900/30 hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
              <Icons.Camera size={22} className="stroke-[1.5]" />
              <span className="font-medium tracking-widest text-sm uppercase">{labels.cameraBtn}</span>
            </button>

            {/* Secondary Upload Action - Minimalist Button */}
            <button
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="flex-1 p-5 rounded-2xl border border-stone-200 bg-white/50 text-stone-600 font-medium hover:bg-white hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/5 hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3"
            >
              <Icons.Upload size={22} className="stroke-[1.5]" />
              <span className="font-medium tracking-widest text-sm uppercase">{labels.uploadBtn}</span>
            </button>
          </div>
        </div>
        
        {/* Premium Corner Accents (Gold/Bronze style) */}
        <div className="absolute top-8 left-8 w-6 h-6 border-l border-t border-stone-300/50" />
        <div className="absolute top-8 right-8 w-6 h-6 border-r border-t border-stone-300/50" />
        <div className="absolute bottom-8 left-8 w-6 h-6 border-l border-b border-stone-300/50" />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-r border-b border-stone-300/50" />

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
      </div>
    </div>
  );
};