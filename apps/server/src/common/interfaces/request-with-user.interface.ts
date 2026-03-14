import { ROLE } from '../../user/enum/role';
import { Request } from 'express';

export interface UserPayload {
  id: string;
  role: ROLE;
  propertyId?: string;
  email?: string;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
