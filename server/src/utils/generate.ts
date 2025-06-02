import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IUserProps } from '../types';

const MAX_VALUE = 1000000;
const TIME_EXPIRED_ACCESS_TOKEN = 30 * 60 * 1000; // 30 minutes
const TIME_EXPIRED_REFRESH_TOKEN = 7 * 24 * 60 * 60 * 1000; // 7 days

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

    // Lấy 1 ký tự từ mỗi loại
    const passwordArray = [
        getRandomChar(uppercase),
        getRandomChar(lowercase),
        getRandomChar(numbers),
        getRandomChar(specialCharacters),
    ];

    // Điền vào ngẫu nhiên các ký tự còn lại
    const remainingLength = Math.floor(Math.random() * (20 - 8 + 1)) + 8 - passwordArray.length;
    for (let i = 0; i < remainingLength; i++) {
        passwordArray.push(getRandomChar(allCharacters));
    }

    // Xáo trộn vị trí các ký tự (tránh việc 4 ký tự đầu tiên luôn là đại diện của từng nhóm)
    const shuffledPassword = passwordArray.sort(() => Math.random() - 0.5);

    return shuffledPassword.join('');
};

/**
 *
 * @param res
 * @param user
 */
const generateAccessToken = (res: Response, user: IUserProps) => {
    const secret_token = process.env.ACCESS_TOKEN_SECRET;
    if (!secret_token) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    const accessToken = jwt.sign({ id: user._id, role: user.role }, secret_token, {
        expiresIn: '30m',
    });

    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: 'development' === process.env.NODE_ENV,
        sameSite: 'lax',
        maxAge: TIME_EXPIRED_ACCESS_TOKEN,
    });
};

/**
 *
 * @param res
 * @param user
 */
const generateRefreshToken = (res: Response, user: IUserProps) => {
    const secret_token = process.env.REFRESH_TOKEN_SECRET;
    if (!secret_token) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    const refreshToken = jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        secret_token,
        { expiresIn: '7d' },
    );

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: 'development' === process.env.NODE_ENV,
        sameSite: 'lax',
        maxAge: TIME_EXPIRED_REFRESH_TOKEN,
    });
};

export {
    generateUsername,
    generateUserId,
    generatePassword,
    generateAccessToken,
    generateRefreshToken,
};
