export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  MOMO = 'MOMO',
  VN_PAY = 'VN_PAY',
  OTHER = 'OTHER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface Expense {
  id: string;
  code?: string;
  title?: string;
  category: string;
  description?: string;
  amount: number;
  date: string;
  isRecurring: boolean;
  recurringInterval?: string;
  recurringEndDate?: string;
  isActive: boolean;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  notes?: string;
  bookingId: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  booking?: {
    code: string;
    guest?: {
      name: string;
    };
  };
}

export interface CreateExpenseDto {
  title?: string;
  category: string;
  description?: string;
  amount: number;
  date?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
  recurringEndDate?: string;
  propertyId: string;
}

export interface UpdateExpenseDto extends Partial<CreateExpenseDto> {}
