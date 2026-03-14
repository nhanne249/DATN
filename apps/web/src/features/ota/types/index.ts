export interface OtaChannel {
  id: string;
  name: string;
  type: string;
  credentials?: any;
  isActive: boolean;
  propertyId: string;
  lastSyncAt?: string;
  status: 'connected' | 'disconnected' | 'error';
  otaMappings?: OtaMapping[];
  createdAt: string;
  updatedAt: string;
}

export interface OtaMapping {
  id: string;
  channelId: string;
  roomTypeId: string;
  externalRoomId?: string;
  externalRateId?: string;
  roomType?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SyncLog {
  id: string;
  channelId: string;
  action: string;
  direction: 'PUSH' | 'PULL';
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  details?: any;
  duration?: number;
  timestamp: string;
}

export interface CreateOtaChannelDto {
  name: string;
  type: string;
  credentials?: any;
  isActive?: boolean;
  propertyId: string;
}

export interface UpdateOtaChannelDto {
  name?: string;
  credentials?: any;
  isActive?: boolean;
}

export interface CreateOtaMappingDto {
  channelId: string;
  roomTypeId: string;
  externalRoomId?: string;
  externalRateId?: string;
}
