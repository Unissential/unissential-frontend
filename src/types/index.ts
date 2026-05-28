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

// Re-export marketplace types for convenience
export type {
  ProductCategory,
  ProductCondition,
  DeliveryOption,
  SellerProfile,
  MarketplaceProduct,
  MarketplaceFilterState,
  CreateProductFormData,
  MarketplaceContextType,
  UserLocation,
} from './marketplace';
