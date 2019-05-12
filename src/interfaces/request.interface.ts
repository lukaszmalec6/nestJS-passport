import {Request as ExpressRequest} from 'express';
import {User} from '../user/user.model';

export interface Request extends ExpressRequest {
  user: User;
  refreshTokenUserId: string;
}