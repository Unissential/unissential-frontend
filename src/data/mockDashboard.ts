/**
 * Mock Dashboard Data
 * Sample data for development and testing
 */

import {
  DashboardUser,
  DashboardStats,
  SavedListing,
  MyListing,
  Conversation,
  Message,
  Notification,
  DashboardNavItem,
} from '@/types/dashboard';

export const mockCurrentUser: DashboardUser = {
  id: 'user_1',
  name: 'Alex Johnson',
  email: 'alex.johnson@utexas.edu',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  university: 'UT Austin',
  bio: 'Junior studying Computer Science. Looking for cozy housing near campus!',
  phone: '+1 (555) 123-4567',
  location: 'Austin, TX',
};

export const mockDashboardStats: DashboardStats = {
  totalListings: 2,
  savedListings: 12,
  activeMessages: 5,
  unreadNotifications: 3,
  upcomingTours: 2,
  savedRoommates: 8,
};

export const mockSavedListings: SavedListing[] = [
  {
    id: '1',
    type: 'lease',
    title: '2BR Luxury Apartment - Downtown Austin',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    price: 2500,
    location: 'Downtown, Austin',
    savedAt: '2026-05-20',
    detail: 'Modern 2-bedroom with rooftop access',
  },
  {
    id: '2',
    type: 'roommate',
    title: 'Emma Davis - Computer Science Student',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
    location: 'UT Austin',
    savedAt: '2026-05-18',
    detail: 'Junior, looking for roommate',
  },
  {
    id: '3',
    type: 'product',
    title: 'MacBook Air M1 - Excellent Condition',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    price: 800,
    location: 'West Campus',
    savedAt: '2026-05-15',
    detail: 'Like-new, with AppleCare+',
  },
  {
    id: '4',
    type: 'lease',
    title: 'Cozy Studio - West Campus',
    image: 'https://images.unsplash.com/photo-1515019873991-92bde85e9ce8?w=400&h=300&fit=crop',
    price: 1200,
    location: 'West Campus, Austin',
    savedAt: '2026-05-12',
    detail: 'Perfect for single occupancy',
  },
];

export const mockMyListings: MyListing[] = [
  {
    id: 'list_1',
    type: 'lease',
    title: '3BR House - Zilker Neighborhood',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    price: 3200,
    location: 'Zilker, Austin',
    status: 'active',
    createdAt: '2026-04-15',
    views: 124,
    interested: 8,
  },
  {
    id: 'list_2',
    type: 'product',
    title: 'Office Chair - Gaming Style',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop',
    price: 120,
    location: 'Central Austin',
    status: 'active',
    createdAt: '2026-05-01',
    views: 47,
    interested: 2,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    participantName: 'Sarah Martinez',
    participantAvatar: 'https://images.unsplash.com/photo-1534751516642-a1efb6aca56d?w=100&h=100&fit=crop',
    participantType: 'landlord',
    lastMessage: 'The apartment is still available for viewing this weekend!',
    timestamp: '2 hours ago',
    unread: true,
    online: true,
  },
  {
    id: 'conv_2',
    participantName: 'James Chen',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    participantType: 'student',
    lastMessage: 'Thanks for the interest in my Mac! Let me know if you want to...',
    timestamp: '5 hours ago',
    unread: false,
    online: false,
  },
  {
    id: 'conv_3',
    participantName: 'Lisa Wong',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    participantType: 'student',
    lastMessage: 'Would love to grab coffee and discuss rooming together!',
    timestamp: '1 day ago',
    unread: true,
    online: true,
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg_1',
    senderId: 'user_sarah',
    senderName: 'Sarah Martinez',
    senderAvatar: 'https://images.unsplash.com/photo-1534751516642-a1efb6aca56d?w=100&h=100&fit=crop',
    content: 'Hi! I saw your interest in the apartment. Would you like to schedule a tour?',
    timestamp: '2 hours ago',
    isOwn: false,
  },
  {
    id: 'msg_2',
    senderId: 'user_1',
    senderName: 'Alex Johnson',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: 'Yes, that would be great! I\'m available this Saturday afternoon.',
    timestamp: '1 hour ago',
    isOwn: true,
  },
  {
    id: 'msg_3',
    senderId: 'user_sarah',
    senderName: 'Sarah Martinez',
    senderAvatar: 'https://images.unsplash.com/photo-1534751516642-a1efb6aca56d?w=100&h=100&fit=crop',
    content: 'Perfect! Let\'s meet at 2 PM. The address is 1234 Austin Street. Looking forward to meeting you!',
    timestamp: '1 hour ago',
    isOwn: false,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'message',
    title: 'New message from Sarah Martinez',
    description: 'Sarah sent you a message about your tour request',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/dashboard/messages',
    icon: '💬',
  },
  {
    id: 'notif_2',
    type: 'tour',
    title: 'Tour confirmed - Saturday 2 PM',
    description: 'Your apartment tour at Zilker Neighborhood is confirmed',
    timestamp: '4 hours ago',
    read: false,
    actionUrl: '/dashboard',
    icon: '🏠',
  },
  {
    id: 'notif_3',
    type: 'roommate',
    title: 'New roommate match - Emma Davis',
    description: 'Emma Davis matches your preferences! Check her profile',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/dashboard/saved-roommates',
    icon: '👥',
  },
  {
    id: 'notif_4',
    type: 'listing',
    title: 'Your listing has 5 new views',
    description: 'Your house listing is getting attention!',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/dashboard/my-listings',
    icon: '📈',
  },
];

export const dashboardNavItems: DashboardNavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: '🏠' },
  { label: 'My Listings', href: '/dashboard/my-listings', icon: '📋' },
  { label: 'Saved Listings', href: '/dashboard/saved-listings', icon: '❤️' },
  { label: 'Saved Roommates', href: '/dashboard/saved-roommates', icon: '👥' },
  { label: 'Saved Products', href: '/dashboard/saved-products', icon: '🛍️' },
  { label: 'Messages', href: '/dashboard/messages', icon: '💬' },
  { label: 'Notifications', href: '/dashboard/notifications', icon: '🔔' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];
