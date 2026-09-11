import React from 'react';
import { CategoryId, NeighborhoodId } from '../../types';
import { CATEGORIES, NEIGHBORHOODS } from '../../data/mockProviders';
import { Search, MapPin, SlidersHorizontal, Stethoscope, Wrench, Laptop, GraduationCap, Car, Compass, Home, Dumbbell, MoreHorizontal, ChefHat, Dog, Check } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: CategoryId | 'all';
  selectedNeighborhoods: NeighborhoodId[];
  searchQuery: string;
  onCategoryChange: (cat: CategoryId | 'all') => void;
  onToggleNeighborhood: (neigh: NeighborhoodId) => void;
  onSearchChange: (query: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  sante: Stethoscope,
  fundis: Wrench,
  it_tech: Laptop,
  education: GraduationCap,
  transports: Car,
  restaurant: ChefHat,
  loisirs: Compass,
  sport: Dumbbell,
  animaux: Dog,
  domestique: Home,
  autres: MoreHorizontal
};

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  selectedNeighborhoods,
  searchQuery,
  onCategoryChange,
  onToggleNeighborhood,
  onSearchChange
}) => {
  const isAllActive = selectedNeighborhoods.length === 0 || selectedNeighborhoods.includes('all');
  const activeNeighborhoodCount = isAllActive ? 0 : selectedNeighborhoods.length;

  return (
    <div className="space-y-3.5 mb-6">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par nom, métier, pédiatre, fundi, quartier..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Neighborhood Multi-Select Pills (Horizontal Scroll) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <div className="flex items-center space-x-1.5 text-slate-400 font-medium shrink-0 mr-1">
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <span>Quartiers {activeNeighborhoodCount > 1 ? `(${activeNeighborhoodCount})` : ''} :</span>
        </div>
        {NEIGHBORHOODS.map((neigh) => {
          const isSelected = neigh.id === 'all' ? isAllActive : selectedNeighborhoods.includes(neigh.id);
          return (
            <button
              key={neigh.id}
              onClick={() => onToggleNeighborhood(neigh.id)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {isSelected && neigh.id !== 'all' && (
                <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
              )}
              <span>{neigh.name}</span>
            </button>
          );
        })}
      </div>

      {/* Category Pills with Amber Highlights */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 border border-white/10'
          }`}
        >
          Toutes catégories
        </button>
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || SlidersHorizontal;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 border border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
