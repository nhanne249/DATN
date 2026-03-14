import { ROLE } from '../../user/enum/role';

export interface UserPayload {
  id: string;
  role: ROLE;
  email?: string;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
