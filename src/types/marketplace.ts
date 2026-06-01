/**
 * Marketplace Types and Interfaces
 * Complete type definitions for the student marketplace system
 */

export type ProductCategory =
  | 'beds'
  | 'chairs'
  | 'tables'
  | 'electronics'
  | 'kitchen'
  | 'books'
  | 'bikes'
  | 'appliances';
export type ProductCondition = 'new' | 'like-new' | 'good' | 'fair';
export type DeliveryOption = 'pickup' | 'delivery' | 'both';

export interface SellerProfile {
  id: string;
  name: string;
  university: string;
  avatar: string;
  rating: number;
  responseTime: string;
  soldCount: number;
  joinedDate: string;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: ProductCategory;
  condition: ProductCondition;
  seller: SellerProfile;
  university: string;
  location: string;
  latitude: number;
  longitude: number;
  postedDate: string;
  delivery: DeliveryOption;
  distance?: number;
  views?: number;
  isFavorite?: boolean;
  tags?: string[];
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
