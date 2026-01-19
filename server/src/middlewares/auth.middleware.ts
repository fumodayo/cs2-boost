import { Response, NextFunction } from 'express';
import { errorHandler } from '../utils/error';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserPayload } from '../interfaces';

import User from '../models/user.model';

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, 'Unauthorized: No token provided'));
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as UserPayload;

        const user = await User.findById(decoded.id).select('token_version');

        if (!user) {
            return next(errorHandler(401, 'Unauthorized: User not found'));
        }

        if (
            decoded.token_version !== undefined &&
            user.token_version !== undefined &&
            decoded.token_version !== user.token_version
        ) {
            return next(errorHandler(401, 'Unauthorized: Token invalid (Logged out)'));
        }

        if (decoded.token_version === undefined && (user.token_version || 0) > 0) {
            return next(errorHandler(401, 'Unauthorized: Token invalid (Legacy token)'));
        }

        req.user = decoded;
        next();
    } catch (e) {
        return next(errorHandler(401, 'Unauthorized: Invalid token'));
    }
};

const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role) {
            return next(errorHandler(403, 'Forbidden: User role not available'));
        }

        const hasRequiredRole = req.user.role.some((userRole: string) => roles.includes(userRole));
        if (!hasRequiredRole) {
            return next(errorHandler(403, 'Forbidden: You do not have permission'));
        }
        next();
    };
};

export { protect, authorize };