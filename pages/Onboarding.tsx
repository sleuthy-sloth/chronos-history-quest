
import React, { useState } from 'react';
import { CivType } from '../types';
import { CIV_THEMES } from '../constants';

interface Props {
  onSelectCiv: (civ: CivType, name?: string) => void;
}

const Onboarding: React.FC<Props> = ({ onSelectCiv }) => {
  const [selectedCiv, setSelectedCiv] = useState<CivType | null>(null);

  const handleSelect = (civ: CivType) => {
      setSelectedCiv(civ);
      // Small delay to show the "pressed" state before transition
      setTimeout(() => onSelectCiv(civ), 300);
  };

  return (
    <div className="min-h-screen bg-white text-slate-700 font-duo flex flex-col items-center justify-center p-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mb-12 animate-fade-in-up">
        {/* Hourglass Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-amber-100 rounded-3xl flex items-center justify-center shadow-3d transform -rotate-6">
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hourglass_modern.svg/512px-Hourglass_modern.svg.png" 
                className="w-16 h-16 object-contain" 
                alt="Chronos"
                referrerPolicy="no-referrer"
            />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
            Where does your story begin?
        </h1>
        <p className="text-lg text-slate-500 font-bold">
            Choose a timeline. The past is waiting.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl px-4">
        {Object.entries(CIV_THEMES).map(([civKey, theme], idx) => {
            const civ = civKey as CivType;
            const isSelected = selectedCiv === civ;

            // Map Civ Theme colors to Tailwind classes manually for the specific "Duo" look
            let bgClass = "bg-gray-100";
            let borderClass = "border-gray-300";
            let textClass = "text-gray-700";
            let hoverClass = "hover:bg-gray-50";

            // STRICTLY Using Civ Colors from Constants logic mapping
            if (civ === CivType.ROME) {
                bgClass = "bg-red-600";
                borderClass = "border-red-800";
                textClass = "text-white";
                hoverClass = "hover:bg-red-500";
            } else if (civ === CivType.EGYPT) {
                bgClass = "bg-yellow-500";
                borderClass = "border-yellow-700";
                textClass = "text-yellow-900";
                hoverClass = "hover:bg-yellow-400";
            } else if (civ === CivType.BYZANTIUM) {
                bgClass = "bg-purple-600";
                borderClass = "border-purple-800";
                textClass = "text-white";
                hoverClass = "hover:bg-purple-500";
            } else if (civ === CivType.PERSIA) {
                bgClass = "bg-teal-600";
                borderClass = "border-teal-800";
                textClass = "text-white";
                hoverClass = "hover:bg-teal-500";
            }

            return (
                <button
                    key={civ}
                    onClick={() => handleSelect(civ)}
                    className={`
                        relative group flex flex-col items-center p-6 rounded-3xl transition-all duration-200
                        border-b-[8px] active:border-b-0 active:translate-y-2
                        ${bgClass} ${borderClass} ${hoverClass}
                        ${isSelected ? 'scale-95 border-b-0 translate-y-2 ring-4 ring-offset-4 ring-amber-500' : ''}
                    `}
                >
                    {/* Icon Container */}
                    <div className="bg-white/20 rounded-3xl p-6 mb-6 backdrop-blur-sm shadow-inner w-full flex items-center justify-center aspect-square">
                        <img 
                            src={theme.symbolUrl} 
                            className="w-24 h-24 object-contain drop-shadow-md" 
                            alt={civ} 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png';
                            }}
                        />
                    </div>

                    <h3 className={`text-2xl font-extrabold tracking-wide mb-2 ${textClass}`}>
                        {civ}
                    </h3>
                    
                    <span className={`text-sm font-bold opacity-90 uppercase tracking-widest ${textClass}`}>
                        {theme.leagueTitle.split(' ')[0]}
                    </span>

                    {/* "New" Badge */}
                    <div className="absolute -top-3 -right-3 bg-white text-slate-800 text-xs font-extrabold px-3 py-1 rounded-full border-2 border-slate-200 shadow-sm transform rotate-12">
                        START
                    </div>
                </button>
            )
        })}
      </div>

      <div className="mt-16 text-slate-400 font-bold text-sm uppercase tracking-widest">
        Chronos Initiative
      </div>
    </div>
  );
};

export default Onboarding;
