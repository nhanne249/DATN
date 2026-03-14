export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  provider?: string;
  type: string;
  pricePerDay: number;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
  propertyId: string;
}

export interface Rental {
  id: string;
  vehicleId?: string;
  vehicleName?: string;
  plateNumber?: string;
  type?: string;
  provider?: string;
  guestName?: string;
  guestPhone?: string;
  startTime: string;
  endTime: string;
  actualPickupTime?: string;
  actualReturnTime?: string;
  pricePerDay: number;
  totalAmount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  bookingId?: string;
  notes?: string;
  vehicle?: Vehicle;
  booking?: any;
}

export interface CreateVehicleDto {
  name: string;
  plateNumber: string;
  provider?: string;
  type: string;
  pricePerDay: number;
  propertyId: string;
}

export interface CreateRentalDto {
  vehicleId: string;
  bookingId?: string;
  guestName?: string;
  guestPhone?: string;
  startTime: string;
  endTime: string;
  pricePerDay: number;
  totalAmount: number;
  propertyId: string;
}
