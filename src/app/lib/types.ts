
export type PropertyType = 'Buy' | 'Rent';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  category: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  description: string;
  amenities: string[];
  imageUrl: string;
  featured?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}
