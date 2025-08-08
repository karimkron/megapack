import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FixedCTAProps {
  onClick: () => void;
  isVisible: boolean;
}

const FixedCTA: React.FC<FixedCTAProps> = ({ onClick, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-black via-gray-900 to-black border-t border-yellow-500/30 p-3 md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-yellow-400 font-bold text-base">18,95€</div>
          <div className="text-gray-400 line-through text-xs">97,00€</div>
        </div>
        <div className="flex-shrink-0">
          <button 
            onClick={onClick}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-sm px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 flex items-center gap-1"
          >
            <ShoppingCart className="w-3 h-3" />
            COMPRAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default FixedCTA;