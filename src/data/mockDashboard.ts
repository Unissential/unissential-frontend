// Mock data for dashboard pages

export const mockConversations = [
  {
    id: '1',
    participants: [
      {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
      {
        id: 'user2',
        name: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      },
    ],
    participantName: 'John Doe',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    online: true,
    unread: true,
    lastMessage: 'Hey, are you still interested in the apartment?',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    participants: [
      {
        id: 'user1',
        name: 'Mike Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      },
      {
        id: 'user3',
        name: 'Sarah Lee',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
    ],
    participantName: 'Mike Johnson',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    online: false,
    unread: false,
    lastMessage: 'Thanks for selling me the textbook!',
    timestamp: '5 hours ago',
  },
];

export const mockNotifications = [
  {
    id: 'n1',
    type: 'message',
    title: 'New message from John Doe',
    message: 'Are you still interested in viewing the property?',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'n2',
    type: 'listing',
    title: 'Your listing is expiring soon',
    message: 'Your apartment listing will expire in 3 days. Renew it now!',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'n3',
    type: 'roommate',
    title: 'New compatible roommate found',
    message: 'Sarah Lee might be a great match for your roommate profile.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'n4',
    type: 'product',
    title: 'Someone is interested in your textbook',
    message: 'Mike wants to know if your calculus textbook is still available.',
    isRead: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

export const mockSavedListings = [
  {
    id: 'l1',
    title: 'Modern 2BR Apartment Near Campus',
    price: 1200,
    location: 'Near State University',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    bedrooms: 2,
    bathrooms: 1,
    featured: true,
    type: 'lease' as const,
    savedAt: new Date().toISOString(),
  },
  {
    id: 'l2',
    title: 'Cozy Studio Apartment',
    price: 850,
    location: 'Downtown',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    bedrooms: 0,
    bathrooms: 1,
    featured: false,
    type: 'lease' as const,
    savedAt: new Date().toISOString(),
  },
];

export const mockSavedProducts = [
  {
    id: 'p1',
    title: 'Calculus Textbook - Like New',
    price: 45,
    condition: 'like_new',
    image: 'https://images.unsplash.com/photo-1507842217343-583b8bfc8c0f',
    category: 'textbooks',
  },
  {
    id: 'p2',
    title: 'Desk Lamp - Good Condition',
    price: 25,
    condition: 'good',
    image: 'https://images.unsplash.com/photo-1565636192335-14ae0a74e4d6',
    category: 'furniture',
  },
];

export const mockSavedRoommates = [
  {
    id: 'r1',
    name: 'Sarah Johnson',
    age: 20,
    major: 'Computer Science',
    budget: 950,
    sleepSchedule: 'night_owl',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    compatibility: 85,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    title: 'CS Student Looking for Roommate',
    location: 'State University',
    detail: 'Looking for a quiet roommate who respects personal space',
    university: 'State University',
  },
  {
    id: 'r2',
    name: 'Mike Chen',
    age: 21,
    major: 'Engineering',
    budget: 1100,
    sleepSchedule: 'flexible',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    compatibility: 72,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    title: 'Engineering Student',
    location: 'City Center',
    detail: 'Social and friendly, enjoys game nights',
    university: 'City Tech University',
  },
];

export const mockDashboardStats = {
  activeListings: 3,
  totalViews: 1240,
  savedItems: 8,
  unreadMessages: 5,
};

export const mockUserListings = [
  {
    id: 'ul1',
    title: 'Spacious 3BR House',
    price: 1800,
    location: 'Residential Area',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    bedrooms: 3,
    bathrooms: 2,
    isActive: true,
    views: 342,
  },
  {
    id: 'ul2',
    title: 'Downtown Loft',
    price: 1500,
    location: 'City Center',
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9',
    bedrooms: 1,
    bathrooms: 1,
    isActive: true,
    views: 456,
  },
  {
    id: 'ul3',
    title: 'Suburban Apartment',
    price: 950,
    location: 'Suburbs',
    image: 'https://images.unsplash.com/photo-1515396077219-b2d78bfdd485',
    bedrooms: 2,
    bathrooms: 1,
    isActive: false,
    views: 198,
  },
];

export const mockUserProducts = [
  {
    id: 'up1',
    title: 'Physics Textbook',
    price: 55,
    condition: 'excellent',
    image: 'https://images.unsplash.com/photo-1507842217343-583b8bfc8c0f',
    category: 'textbooks',
    isActive: true,
  },
  {
    id: 'up2',
    title: 'Desk Chair - Black',
    price: 120,
    condition: 'good',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    category: 'furniture',
    isActive: true,
  },
];

// Current user mock
export const mockCurrentUser = {
  id: 'current-user',
  name: 'You',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
};

// Messages mock
export const mockMessages = [
  {
    id: 'm1',
    conversationId: '1',
    senderId: 'user1',
    senderName: 'John Doe',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    content: 'Hey, are you still interested in the apartment?',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    timestamp: '2 hours ago',
  },
  {
    id: 'm2',
    conversationId: '1',
    senderId: 'current-user',
    senderName: 'You',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
    content: 'Yes, I am! Can I schedule a viewing?',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    timestamp: '1 hour ago',
  },
];
