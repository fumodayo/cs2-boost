import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IUser } from '../models/user.model';

const MAX_VALUE = 1000000;
const EXPIRED_ACCESS_TOKEN = '30m'; 
const EXPIRED_REFRESH_TOKEN = '7d'; 
const TIME_EXPIRED_ACCESS_TOKEN = 30 * 60 * 1000; 
const TIME_EXPIRED_REFRESH_TOKEN = 7 * 24 * 60 * 60 * 1000; 
const COOKIE_PATH = '/';

/**
 * Tạo mới username từ email
 * Example: fumodayo1701@gmail.com -> fumodayo-1701-2788
 * @param email
 */
const generateUsername = (email: string) => {
    return email.split('@')[0] + '-' + Math.floor(Math.random() * MAX_VALUE);
};

/**
 * Tạo mới user id
 */
const generateUserId = () => {
    return Math.floor(Math.random() * MAX_VALUE).toString();
};

/**
 * Tạo mới mật khẩu thảo mãn các điều kiện:
 * 1. Đồ dài từ 8 đến 20 ký tự
 * 2. Có ít nhất 1 ký tự viết hoa, viết thường, số và ký tự đặc biệt
 * 3. Vị trí được xáo trộn ngẫu nhiên
 */
const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = "!@#$%^&*()_+[]{}|;:',.<>?/";
    const allCharacters = uppercase + lowercase + numbers + specialCharacters;

    const getRandomChar = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

    const passwordArray = [
        getRandomChar(uppercase),
        getRandomChar(lowercase),
        getRandomChar(numbers),
        getRandomChar(specialCharacters),
    ];

    const remainingLength = Math.floor(Math.random() * (20 - 8 + 1)) + 8 - passwordArray.length;
    for (let i = 0; i < remainingLength; i++) {
        passwordArray.push(getRandomChar(allCharacters));
    }

    const shuffledPassword = passwordArray.sort(() => Math.random() - 0.5);

    return shuffledPassword.join('');
};

/**
 * Tạo Access Token và đặt cookie với path phù hợp.
 * @param res - Đối tượng Response của Express.
 * @param user - Đối tượng người dùng.
 */
const generateAccessToken = (res: Response, user: IUser) => {
    const secret_token = process.env.ACCESS_TOKEN_SECRET;
    if (!secret_token) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    const accessToken = jwt.sign(
        { id: user._id, role: user.role, token_version: user.token_version },
        secret_token,
        {
            expiresIn: EXPIRED_ACCESS_TOKEN,
        },
    );

    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: TIME_EXPIRED_ACCESS_TOKEN,
        path: COOKIE_PATH,
    });
};

/**
 * Tạo Refresh Token và đặt cookie với path phù hợp.
 * @param res - Đối tượng Response của Express.
 * @param user - Đối tượng người dùng.
 * @param isAdminLogin - `true` nếu đây là luồng đăng nhập của admin.
 */
const generateRefreshToken = (res: Response, user: IUser) => {
    const secret_token = process.env.REFRESH_TOKEN_SECRET;
    if (!secret_token) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }
    const refreshToken = jwt.sign(
        { id: user._id, role: user.role, token_version: user.token_version },
        secret_token,
        {
            expiresIn: EXPIRED_REFRESH_TOKEN,
        },
    );

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: TIME_EXPIRED_REFRESH_TOKEN,
        path: COOKIE_PATH,
    });
};

export {
    generateUsername,
    generateUserId,
    generatePassword,
    generateAccessToken,
    generateRefreshToken,
};