import { errorHandler } from './error';
import jwt from 'jsonwebtoken';

/**
 *
 * @param req
 * @param next
 * @returns
 * Middleware to verify JWT token
 */

const verifyToken = async (req: any, res: any, next: any) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, 'No token provided'));
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        req.user = decoded;
        next();
    } catch (e) {
        return next(errorHandler(401, 'Token expired'));
    }
};

export { verifyToken };
