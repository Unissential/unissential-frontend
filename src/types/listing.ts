export interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  university?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  availableFrom?: Date;
  availableTo?: Date;
  leaseDuration?: string;
  isAvailable: boolean;
  petFriendly: boolean;
  images: string[];
  amenities: string[];
  views: number;
  owner?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterOptions {
  search?: string;
  location?: string;
  university?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  petFriendly?: boolean;
  furnished?: boolean;
  leaseDuration?: 'flexible' | '3-months' | '6-months' | '12-months';
  isAvailable?: boolean;
  sort?: 'newest' | 'price-asc' | 'price-desc';
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc';
