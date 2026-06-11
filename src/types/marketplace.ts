/**
 * Marketplace Types and Interfaces
 * Complete type definitions for the student marketplace system
 */

export type ProductCategory =
  | 'electronics'
  | 'textbooks'
  | 'furniture'
  | 'appliances'
  | 'bikes'
  | 'clothing'
  | 'other';

export type ProductCondition = 'like_new' | 'excellent' | 'good' | 'fair';
export type DeliveryType = 'pickup' | 'delivery' | 'both';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  university?: string;
  isVerified: boolean;
  profilePicture?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  university?: string;
  condition: ProductCondition;
  category: ProductCategory;
  deliveryType?: DeliveryType;
  images: string[];
  isAvailable: boolean;
  seller: UserProfile;
  views: number;
  interested: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMarketplaceProductPayload {
  title: string;
  description: string;
  price: number;
  location: string;
  university?: string;
  condition: ProductCondition;
  category: ProductCategory;
  deliveryType?: DeliveryType;
  images: string[];
  isAvailable?: boolean;
}

export interface MarketplaceFilters {
  search?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  location?: string;
  university?: string;
  deliveryType?: DeliveryType;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'views';
}

export interface UserLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface MarketplaceFilterState {
  searchQuery: string;
  category: string;
  priceRange: [number, number];
  condition: string;
  university: string;
  delivery: string;
  distance: string;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'most-relevant';
}

export interface CreateProductFormData {
  title: string;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  price: number;
  images: string[];
  delivery: DeliveryOption;
  location: string;
  university: string;
}

export interface MarketplaceContextType {
  products: MarketplaceProduct[];
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}
