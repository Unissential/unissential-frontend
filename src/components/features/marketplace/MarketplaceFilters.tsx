'use client';

import { Search, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { categoryConfig, conditionOptions, priceRanges } from '@/data/mockMarketplace';
import { MarketplaceFilterState } from '@/types/marketplace';

interface MarketplaceFiltersProps {
  onFilterChange: (filters: MarketplaceFilterState) => void;
  filters: MarketplaceFilterState;
  onReset: () => void;
}

export function MarketplaceFilters({ onFilterChange, filters, onReset }: MarketplaceFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? '' : category,
    });
  };

  const handleConditionChange = (condition: string) => {
    onFilterChange({
      ...filters,
      condition: filters.condition === condition ? '' : condition,
    });
  };

  const handlePriceRange = (min: number, max: number) => {
    onFilterChange({
      ...filters,
      priceRange: [min, max],
    });
  };

  const handleSortChange = (sortBy: MarketplaceFilterState['sortBy']) => {
    onFilterChange({
      ...filters,
      sortBy,
    });
  };

  const activeFilterCount = [
    filters.category,
    filters.condition,
    filters.university,
    filters.delivery,
    filters.distance,
  ].filter(Boolean).length;

  const sortOptions = [
    { value: 'newest' as const, label: 'Newest First' },
    { value: 'price-low' as const, label: 'Price: Low to High' },
    { value: 'price-high' as const, label: 'Price: High to Low' },
    { value: 'most-relevant' as const, label: 'Most Relevant' },
  ];

  return (
    <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
      {/* Search Bar */}
      <div className="relative flex-1 md:flex-initial md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.searchQuery}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              searchQuery: e.target.value,
            })
          }
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as MarketplaceFilterState['sortBy'])}
          className="px-4 py-2.5 border border-neutral-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white pr-10"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={20} />
      </div>

      {/* Filters Button */}
      <div className="relative">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'px-4 py-2.5 border rounded-lg font-medium transition-all flex items-center gap-2',
            showFilters
              ? 'bg-primary-50 border-primary-300 text-primary-700'
              : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          )}
        >
          🔧 Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Filters Dropdown */}
        {showFilters && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 p-4 space-y-4">
            {/* Category Filter */}
            <div>
              <button
                onClick={() =>
                  setExpandedCategory(expandedCategory === 'category' ? null : 'category')
                }
                className="w-full flex items-center justify-between text-left font-semibold text-neutral-900 py-2 px-2 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                Category
                <ChevronDown
                  size={20}
                  className={cn(
                    'transition-transform',
                    expandedCategory === 'category' && 'rotate-180'
                  )}
                />
              </button>
              {expandedCategory === 'category' && (
                <div className="mt-2 space-y-1 pl-2">
                  {categoryConfig.map((cat) => (
                    <label
                      key={cat.name}
                      className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.category === cat.name}
                        onChange={() => handleCategoryChange(cat.name)}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-sm text-neutral-700">
                        {cat.icon} {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Condition Filter */}
            <div>
              <button
                onClick={() =>
                  setExpandedCategory(expandedCategory === 'condition' ? null : 'condition')
                }
                className="w-full flex items-center justify-between text-left font-semibold text-neutral-900 py-2 px-2 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                Condition
                <ChevronDown
                  size={20}
                  className={cn(
                    'transition-transform',
                    expandedCategory === 'condition' && 'rotate-180'
                  )}
                />
              </button>
              {expandedCategory === 'condition' && (
                <div className="mt-2 space-y-1 pl-2">
                  {conditionOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.condition === option.value}
                        onChange={() => handleConditionChange(option.value)}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-sm text-neutral-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div>
              <button
                onClick={() =>
                  setExpandedCategory(expandedCategory === 'price' ? null : 'price')
                }
                className="w-full flex items-center justify-between text-left font-semibold text-neutral-900 py-2 px-2 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                Price Range
                <ChevronDown
                  size={20}
                  className={cn(
                    'transition-transform',
                    expandedCategory === 'price' && 'rotate-180'
                  )}
                />
              </button>
              {expandedCategory === 'price' && (
                <div className="mt-2 space-y-1 pl-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handlePriceRange(range.min, range.max)}
                      className={cn(
                        'w-full text-left p-2 rounded-lg transition-colors text-sm',
                        filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                          ? 'bg-primary-100 text-primary-700 font-semibold'
                          : 'hover:bg-neutral-50 text-neutral-700'
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  onReset();
                  setShowFilters(false);
                }}
                className="w-full py-2 px-3 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <X size={16} />
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
