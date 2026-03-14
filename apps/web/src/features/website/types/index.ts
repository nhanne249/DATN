export interface Promotion {
  title: string;
  description?: string;
  discount?: string;
  validUntil?: string;
}

export interface WebsiteConfig {
  id: string;
  propertyId: string;
  slug: string;
  isPublished: boolean;
  hotelName: string;
  tagline?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  amenities?: string[];
  promotions?: Promotion[];
  googleMapsUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateWebsiteConfigDto extends Partial<Omit<WebsiteConfig, 'id' | 'propertyId'>> {}
