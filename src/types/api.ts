/**
 * Frontend type definitions
 * Re-exports from backend API types for consistency
 */

// User Types
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

// Listing Types
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

// Marketplace Product Types
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

// Roommate Profile Types
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

// Message Types
export interface MessageDTO {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  conversationId: string;
  createdAt: Date;
}

// Conversation Types
export interface ConversationDTO {
  id: string;
  participants: UserDTO[];
  lastMessage?: MessageDTO;
  updatedAt: Date;
}

// Notification Types
export interface NotificationDTO {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'tour' | 'listing' | 'roommate' | 'product';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Saved Item Types
export interface SavedItemDTO {
  id: string;
  userId: string;
  itemType: 'listing' | 'roommate' | 'product';
  itemId: string;
  listing?: ListingDTO;
  roommateProfile?: RoommateProfileDTO;
  product?: MarketplaceProductDTO;
  createdAt: Date;
}
