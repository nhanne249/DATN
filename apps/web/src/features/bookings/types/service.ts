export type PricingMode = 'FIXED' | 'PER_NIGHT' | 'PER_PERSON' | 'PER_PERSON_NIGHT';
export type ServiceType = 'SERVICE' | 'SURCHARGE';

export interface Service {
  id: string;
  name: string;
  code?: string;
  group: string;
  price: number;
  pricingMode: PricingMode;
  description?: string;
  type: ServiceType;
  isActive: boolean;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  name: string;
  code?: string;
  group: string;
  price: number;
  pricingMode?: PricingMode;
  description?: string;
  type?: ServiceType;
  isActive?: boolean;
  propertyId: string;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {}
