/**
 * Landing Page Type Definitions
 * TypeScript interfaces for all landing page data
 */

export interface Room {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number; // in sqft
  image: string;
  rating: number;
  reviews: number;
  amenities: string[];
  featured?: boolean;
}

export interface Roommate {
  id: string;
  name: string;
  image: string;
  major: string;
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  interests: string[];
  about: string;
  budget: number;
  rating: number;
  compatibility?: number; // percentage
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: 'Furniture' | 'Electronics' | 'Books' | 'Other';
  price: number;
  image: string;
  seller: string;
  condition: 'Like New' | 'Good' | 'Fair';
  rating: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  school: string;
}

export interface HowItWorksStep {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
}
