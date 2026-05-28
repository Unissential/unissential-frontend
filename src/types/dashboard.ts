/**
 * Dashboard Types and Interfaces
 * Complete type definitions for the user dashboard system
 */

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  university: string;
  bio?: string;
  phone?: string;
  location?: string;
}

export interface DashboardStats {
  totalListings: number;
  savedListings: number;
  activeMessages: number;
  unreadNotifications: number;
  upcomingTours: number;
  savedRoommates: number;
}

export interface SavedListing {
  id: string;
  type: 'lease' | 'roommate' | 'product';
  title: string;
  image: string;
  price?: number;
  location: string;
  savedAt: string;
  detail?: string;
}

export interface MyListing {
  id: string;
  type: 'lease' | 'product';
  title: string;
  image: string;
  price: number;
  location: string;
  status: 'active' | 'inactive' | 'sold';
  createdAt: string;
  views: number;
  interested: number;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantType: 'landlord' | 'student' | 'seller';
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  online?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Notification {
  id: string;
  type: 'message' | 'tour' | 'listing' | 'roommate' | 'product';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  icon?: string;
}

export interface UserPreferences {
  notificationsEmail: boolean;
  notificationsPush: boolean;
  privacyProfile: 'public' | 'private';
  emailFrequency: 'instant' | 'daily' | 'weekly';
  marketingEmails: boolean;
}

export interface HousingPreferences {
  budgetMin: number;
  budgetMax: number;
  bedrooms: number[];
  amenities: string[];
  moveInDate: string;
  leaseTerm: string;
}

export interface RoommatePreferences {
  minAge?: number;
  maxAge?: number;
  genders: string[];
  interests: string[];
  studyHabit: string;
  sleepSchedule: string;
  cleanliness: string;
}

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
