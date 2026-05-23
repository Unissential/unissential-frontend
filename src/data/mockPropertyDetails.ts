import { PropertyDetail, PropertyAmenity, PropertyHost } from '@/types/property';

export const mockPropertyAmenities: PropertyAmenity[] = [
  { id: '1', name: 'WiFi', icon: 'Wifi', category: 'utilities' },
  { id: '2', name: 'Kitchen', icon: 'UtensilsCrossed', category: 'utilities' },
  { id: '3', name: 'Parking', icon: 'Car', category: 'utilities' },
  { id: '4', name: 'Laundry', icon: 'Shirt', category: 'utilities' },
  { id: '5', name: 'Gym', icon: 'Dumbbell', category: 'lifestyle' },
  { id: '6', name: 'Pet Friendly', icon: 'PawPrint', category: 'lifestyle' },
  { id: '7', name: 'Study Area', icon: 'BookOpen', category: 'facilities' },
  { id: '8', name: 'Air Conditioning', icon: 'Wind', category: 'utilities' },
];

export const mockPropertyHosts: Record<string, PropertyHost> = {
  host1: {
    id: 'host1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    verified: true,
    joinedDate: 'Joined in 2023',
    responseRate: 95,
    responseDays: 2,
    bio: 'Experienced property manager dedicated to providing comfortable student housing with exceptional service.',
    totalListings: 8,
    reviews: 47,
    rating: 4.9,
  },
};

export const mockPropertyDetail: PropertyDetail = {
  id: '1',
  title: 'Luxury Modern 2BR Near Campus',
  price: 1250,
  beds: 2,
  baths: 1.5,
  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop',
  duration: '3-6 months',
  availability: 'Jul 2026',
  dateRange: 'Jul 1 - Dec 31',
  amenities: mockPropertyAmenities,
  isFavorite: false,
  description: 'Beautiful modern 2-bedroom apartment perfect for students',
  fullDescription: `This stunning 2-bedroom, 1.5-bathroom apartment offers the perfect blend of comfort, style, and convenience for students. Located just 0.5 miles from campus with excellent walkability and public transit access.

The spacious living area features floor-to-ceiling windows, natural lighting throughout, and modern minimalist design. The updated kitchen includes stainless steel appliances, quartz countertops, and ample storage. Both bedrooms are generously sized with built-in closets and premium bedding.

Amenities include high-speed WiFi, in-unit laundry, air conditioning, and a dedicated study area. The building offers 24/7 security, controlled entry, and a professional management team available for maintenance requests.

Perfect for serious students looking for a premium living experience close to campus.`,
  furnished: 'partially-furnished',
  roommatePreference: 'Open to sharing or living solo',
  host: mockPropertyHosts.host1,
  location: {
    address: '1234 Campus View Ave',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    latitude: 30.2672,
    longitude: -97.7431,
    nearbyUniversities: ['University of Texas at Austin', 'St. Edward\'s University', 'Austin Community College'],
  },
  neighborhood: {
    highlights: [
      '5-minute walk to campus',
      'Trendy restaurants and cafes nearby',
      'Safe, vibrant student neighborhood',
      'Close to downtown entertainment',
      'Excellent public transportation',
    ],
    commute: [
      { destination: 'UT Austin Main Campus', duration: '8 minutes walk' },
      { destination: 'Downtown Austin', duration: '10 minutes by bus' },
      { destination: 'Zilker Park', duration: '5 minutes by car' },
    ],
  },
  images: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&h=600&fit=crop',
      alt: 'Living room view',
      order: 1,
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&h=600&fit=crop',
      alt: 'Bedroom',
      order: 2,
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1556746753-b2904692573f?w=1000&h=600&fit=crop',
      alt: 'Kitchen',
      order: 3,
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1000&h=600&fit=crop',
      alt: 'Bathroom',
      order: 4,
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1538312881886-aa6b32e63f83?w=1000&h=600&fit=crop',
      alt: 'Study area',
      order: 5,
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1565065143441-e797a5a842ca?w=1000&h=600&fit=crop',
      alt: 'Building entrance',
      order: 6,
    },
  ],
  rules: [
    'No smoking inside the apartment',
    'No loud noise after 10 PM',
    'No unauthorized guests overnight',
    'Responsible for utility payments',
    'Keep common areas clean',
  ],
  cancellationPolicy:
    'Cancel free of charge by July 1st. After this date, you will be liable for the full lease period.',
  reviews: [
    {
      id: '1',
      studentName: 'Emily Chen',
      rating: 5,
      review: 'Amazing apartment! Perfect location for campus and the host is super responsive.',
      date: 'April 2026',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
    {
      id: '2',
      studentName: 'Marcus Thompson',
      rating: 5,
      review: 'Great value for money. The apartment is clean, modern, and exactly as described.',
      date: 'March 2026',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    },
    {
      id: '3',
      studentName: 'Sophia Martinez',
      rating: 4,
      review: 'Really nice place. Minor: water pressure could be better, but overall very satisfied.',
      date: 'February 2026',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
  ],
};

// Helper function to get property by ID
export function getPropertyById(id: string): PropertyDetail {
  // In a real app, this would fetch from API/database
  // For now, return mock data
  return mockPropertyDetail;
}

// Helper function to get similar properties
export function getSimilarProperties(id: string, count: number = 4): PropertyDetail[] {
  // In a real app, this would filter by location, price range, etc.
  // For now, return the mock property repeated
  return Array(count).fill(null).map((_, idx) => ({
    ...mockPropertyDetail,
    id: `similar-${idx}`,
  }));
}
