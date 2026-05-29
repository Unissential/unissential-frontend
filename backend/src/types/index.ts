// User DTOs and types
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  university: string;
  isVerified: boolean;
  profilePicture?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  university: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Listing DTOs
export interface ListingDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  leaseStart?: Date;
  leaseEnd?: Date;
  petFriendly: boolean;
  owner: UserDTO;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateListingPayload {
  title: string;
  description: string;
  price: number;
  location: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  furnished?: boolean;
  leaseStart?: Date;
  leaseEnd?: Date;
  petFriendly?: boolean;
}

// Marketplace Product DTOs
export interface MarketplaceProductDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  images: string[];
  seller: UserDTO;
  views: number;
  interested: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMarketplaceProductPayload {
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  images: string[];
}

// Roommate Profile DTOs
export interface RoommateProfileDTO {
  id: string;
  age: number;
  university: string;
  major?: string;
  budget: number;
  interests: string[];
  sleepSchedule: string;
  cleanliness: string;
  smoking: boolean;
  partying: boolean;
  bio?: string;
  user: UserDTO;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoommateProfilePayload {
  age: number;
  major?: string;
  budget: number;
  interests: string[];
  sleepSchedule: string;
  cleanliness: string;
  smoking?: boolean;
  partying?: boolean;
  bio?: string;
}

// Conversation & Message DTOs
export interface MessageDTO {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  conversationId: string;
  createdAt: Date;
}

export interface ConversationDTO {
  id: string;
  participants: UserDTO[];
  lastMessage?: MessageDTO;
  updatedAt: Date;
}

// Notification DTOs
export interface NotificationDTO {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

// SavedItem DTOs
export interface SavedItemDTO {
  id: string;
  userId: string;
  itemType: string;
  itemId: string;
  createdAt: Date;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
