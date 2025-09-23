import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { errorHandler } from '../utils/error';
import User from '../models/user.model';
import { generateAccessToken } from '../utils/generate';

/**
 * Logic cốt lõi để làm mới token, có khả năng nhận diện ngữ cảnh.
 * @param req - Đối tượng Request
 * @param res - Đối tượng Response
 * @param isAdminContext - `true` nếu đây là ngữ cảnh của admin
 */
async function handleTokenRefreshLogic(req: Request, res: Response, isAdminContext: boolean) {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
        throw errorHandler(401, 'Refresh token not provided. Please log in again.');
    }

    const decodedToken = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET as string,
    ) as JwtPayload;

    if (!decodedToken) {
        throw errorHandler(401, 'Invalid refresh token.');
    }

    const existUser = await User.findById(decodedToken.id);
    if (!existUser) {
        throw errorHandler(401, 'User associated with token not found.');
    }

    if (isAdminContext && !existUser.role.includes('admin')) {
        throw errorHandler(403, 'Forbidden: User is not an admin.');
    }

    generateAccessToken(res, existUser.toObject() as any);

    res.status(200).json({ message: 'Access token refreshed successfully.' });
}

export default handleTokenRefreshLogic;
