import { Request } from 'express';

export interface UserPayload {
    id: string;
    role: string[];
}

export interface AuthRequest extends Request {
    user: UserPayload;
}
