export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface APIResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface SavedListing {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  featured: boolean;
  type: 'lease' | 'roommate' | 'product';
  savedAt: string;
}

export interface SavedRoommate {
  id: string;
  name: string;
  image?: string;
  age: number;
  major: string;
  budget: number;
  sleepSchedule: string;
  avatar: string;
  compatibility: number;
  title?: string;
  location?: string;
  detail?: string;
  university?: string;
}

// Re-export types from api and other modules
export type {
  UserDTO,
  ListingDTO,
  MarketplaceProductDTO,
  RoommateProfileDTO,
  MessageDTO,
  ConversationDTO,
  NotificationDTO,
  SavedItemDTO,
} from './api';

export type {
  ProductCategory,
  ProductCondition,
  DeliveryType,
  DeliveryOption,
  UserProfile,
  SellerProfile,
  MarketplaceProduct,
  MarketplaceFilterState,
  CreateProductFormData,
  MarketplaceContextType,
  UserLocation,
} from './marketplace';
