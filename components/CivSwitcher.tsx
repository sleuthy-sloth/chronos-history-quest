
import React from 'react';
import { CivType } from '../types';
import { CIV_THEMES } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentCiv: CivType;
  onSelect: (civ: CivType) => void;
}

const CivSwitcher: React.FC<Props> = ({ isOpen, onClose, currentCiv, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white uppercase tracking-wide">Select Timeline</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl font-bold">✕</button>
        </div>
        
        <div className="p-4 grid gap-3 max-h-[70vh] overflow-y-auto">
            {Object.entries(CIV_THEMES).map(([civKey, theme]) => {
                const civ = civKey as CivType;
                const isSelected = currentCiv === civ;
                
                // Determine styling based on civ type
                let activeStyle = "";
                if (civ === CivType.ROME) activeStyle = "bg-red-50 border-red-500 ring-2 ring-red-200";
                if (civ === CivType.EGYPT) activeStyle = "bg-yellow-50 border-yellow-500 ring-2 ring-yellow-200";
                if (civ === CivType.BYZANTIUM) activeStyle = "bg-purple-50 border-purple-500 ring-2 ring-purple-200";
                if (civ === CivType.PERSIA) activeStyle = "bg-teal-50 border-teal-500 ring-2 ring-teal-200";

                return (
                    <button
                        key={civ}
                        onClick={() => {
                            onSelect(civ);
                            onClose();
                        }}
                        className={`
                            flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
                            ${isSelected 
                                ? activeStyle 
                                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'}
                        `}
                    >
                        <img 
                            src={theme.symbolUrl} 
                            alt={civ} 
                            className="w-12 h-12 object-contain"
                            referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 text-left">
                            <h3 className={`font-extrabold text-lg ${isSelected ? 'text-slate-900' : 'text-slate-600 dark:text-slate-300'}`}>
                                {civ}
                            </h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{theme.description}</p>
                        </div>
                        {isSelected && <div className="text-2xl text-green-500">✓</div>}
                    </button>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default CivSwitcher;
