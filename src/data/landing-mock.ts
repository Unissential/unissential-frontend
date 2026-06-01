/**
 * Mock Data for Landing Page
 * Realistic student-focused dummy data
 */

import {
  Room,
  Roommate,
  MarketplaceItem,
  Testimonial,
  HowItWorksStep,
  Feature,
} from '@/types/landing';

export const featuredRooms: Room[] = [
  {
    id: '1',
    title: 'Cozy Studio Near Campus',
    location: 'Downtown University District',
    price: 850,
    beds: 1,
    baths: 1,
    area: 400,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 24,
    amenities: ['WiFi', 'Furnished', 'In-unit Laundry', 'Pet Friendly'],
    featured: true,
  },
  {
    id: '2',
    title: 'Modern Apartment with Rooftop',
    location: 'Midtown Tech Hub',
    price: 1200,
    beds: 2,
    baths: 1,
    area: 650,
    image: 'https://images.unsplash.com/photo-1488654715566-71058b7efa39?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 42,
    amenities: ['Gym', 'Rooftop Access', 'Gaming Room', 'Study Lounge'],
    featured: true,
  },
  {
    id: '3',
    title: 'Vibrant Shared Living Space',
    location: 'Arts & Culture District',
    price: 950,
    beds: 1,
    baths: 1,
    area: 500,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 18,
    amenities: ['Common Kitchen', 'Events', 'Bike Storage', 'Parking'],
    featured: true,
  },
  {
    id: '4',
    title: 'Luxury 2BR with City Views',
    location: 'Riverside Downtown',
    price: 1450,
    beds: 2,
    baths: 2,
    area: 800,
    image: 'https://images.unsplash.com/photo-1554995207-c18ed1b72d5b?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 56,
    amenities: ['Concierge', 'Smart Home', 'Gym', 'Pool'],
    featured: true,
  },
];

export const roommateMatches: Roommate[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    major: 'Computer Science',
    year: 'Junior',
    interests: ['Gaming', 'Coding', 'Coffee', 'Hiking'],
    about: 'Quiet, clean, and loves collaborative projects',
    budget: 950,
    rating: 4.9,
    compatibility: 92,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    major: 'Business Administration',
    year: 'Senior',
    interests: ['Networking', 'Sports', 'Travel', 'Food'],
    about: 'Outgoing and organized, perfect for shared living',
    budget: 1100,
    rating: 4.7,
    compatibility: 87,
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    major: 'Psychology',
    year: 'Sophomore',
    interests: ['Music', 'Art', 'Yoga', 'Sustainability'],
    about: 'Creative and thoughtful, loves community vibes',
    budget: 850,
    rating: 4.8,
    compatibility: 89,
  },
];

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    title: 'IKEA MALM Desk - Like New',
    category: 'Furniture',
    price: 45,
    image: 'https://images.unsplash.com/photo-1611269193546-8d35d32f0c3b?w=400&h=400&fit=crop',
    seller: 'Alex T.',
    condition: 'Like New',
    rating: 4.9,
  },
  {
    id: '2',
    title: 'Gaming Laptop - Used 6 months',
    category: 'Electronics',
    price: 650,
    image: 'https://images.unsplash.com/photo-1588872657840-790ff3bde08c?w=400&h=400&fit=crop',
    seller: 'Jordan M.',
    condition: 'Good',
    rating: 4.6,
  },
  {
    id: '3',
    title: 'Organic Chemistry Textbook',
    category: 'Books',
    price: 35,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
    seller: 'Sam P.',
    condition: 'Good',
    rating: 4.8,
  },
  {
    id: '4',
    title: 'Portable Phone Charger (5-pack)',
    category: 'Electronics',
    price: 20,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
    seller: 'Casey L.',
    condition: 'Like New',
    rating: 4.7,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    author: 'Jessica Lee',
    role: 'Computer Science Student',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    content:
      'Found my perfect apartment and roommate through Unissential! The matching algorithm is spot-on. Saved me hours of searching.',
    rating: 5,
    school: 'Stanford University',
  },
  {
    id: '2',
    author: 'Michael Chen',
    role: 'Business Student',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    content:
      'The marketplace is incredible for selling textbooks and furniture. I made back $200 in just two weeks!',
    rating: 5,
    school: 'MIT',
  },
  {
    id: '3',
    author: 'Sophie Martinez',
    role: 'Psychology Major',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    content:
      'Unissential made the transition to college housing so smooth. The chat feature helped me connect with my roommate before moving in!',
    rating: 5,
    school: 'UC Berkeley',
  },
  {
    id: '4',
    author: 'David Park',
    role: 'Engineering Student',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    content:
      'Best platform for finding student housing. The vetting process makes you feel secure. Highly recommend to all incoming students!',
    rating: 5,
    school: 'Harvard University',
  },
];

export const howItWorks: HowItWorksStep[] = [
  {
    id: '1',
    number: 1,
    title: 'Create Your Profile',
    description: 'Tell us about yourself, your budget, and what you\'re looking for in housing.',
    icon: 'UserPlus',
  },
  {
    id: '2',
    number: 2,
    title: 'Get Matched',
    description: 'Our AI matches you with compatible roommates and properties based on your preferences.',
    icon: 'Zap',
  },
  {
    id: '3',
    number: 3,
    title: 'Connect & Chat',
    description: 'Message potential roommates and landlords directly through our secure chat system.',
    icon: 'MessageSquare',
  },
  {
    id: '4',
    number: 4,
    title: 'Move In',
    description: 'Complete the lease, move in, and enjoy your new living situation!',
    icon: 'Home',
  },
];

export const features: Feature[] = [
  {
    id: '1',
    title: 'Smart Matching',
    description: 'AI-powered algorithm matches you with compatible roommates based on lifestyle and preferences.',
    icon: 'Brain',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '2',
    title: 'Verified Listings',
    description: 'All rooms and roommates are verified for safety and authenticity.',
    icon: 'Shield',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: '3',
    title: 'Built-in Chat',
    description: 'Connect with potential roommates before committing through our secure messaging system.',
    icon: 'MessageCircle',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: '4',
    title: 'Student Marketplace',
    description: 'Buy and sell textbooks, furniture, and essentials within the student community.',
    icon: 'ShoppingCart',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: '5',
    title: 'Flexible Terms',
    description: 'Find semester leases, yearly contracts, or short-term housing options.',
    icon: 'Calendar',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: '6',
    title: '24/7 Support',
    description: 'Our support team is always here to help with any questions or concerns.',
    icon: 'Headphones',
    color: 'from-rose-500 to-pink-500',
  },
];
