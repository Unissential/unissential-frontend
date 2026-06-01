export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  image: string;
  duration: string;
  availability: string;
  dateRange: string;
  amenities: string[];
  isFavorite?: boolean;
  description?: string;
}

export interface FilterOptions {
  duration: 'all' | '1-2' | 'semester' | 'summer';
  priceRange: 'all' | 'under800' | 'under1000' | 'under1500';
  petFriendly: boolean;
}
