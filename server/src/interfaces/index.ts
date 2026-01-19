import { Request } from 'express';

export interface UserPayload {
    id: string;
    role: string[];
    token_version?: number;
}

export interface AuthRequest extends Request {
    user: UserPayload;
}