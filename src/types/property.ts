export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  icon: string;
  category: 'utilities' | 'lifestyle' | 'facilities';
}

export interface PropertyHost {
  id: string;
  name: string;
  avatar: string;
  verified?: boolean;
  joinedDate?: string;
  responseRate?: number;
  responseDays?: number;
  bio?: string;
  totalListings?: number;
  reviews?: number;
  rating?: number;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  nearbyUniversities: string[];
}

export interface PropertyDetail {
  id: string;
  title: string;
  price: number;
  images: PropertyImage[];
  description: string;
  fullDescription: string;
  furnished: 'furnished' | 'unfurnished' | 'partially-furnished' | 'not specified';
  roommatePreference: string;
  amenities: PropertyAmenity[];
  host: PropertyHost;
  location: PropertyLocation;
  neighborhood: {
    highlights: string[];
    commute: { destination: string; duration: string }[];
  };
  rules: string[];
  cancellationPolicy: string;
  reviews: PropertyReview[];
  isFavorite?: boolean;
  duration?: string;
  availability?: string;
  dateRange?: { start: Date; end: Date };
  beds?: number;
  baths?: number;
}

export interface PropertyReview {
  id: string;
  studentName: string;
  rating: number;
  review: string;
  date: string;
  avatar: string;
}
