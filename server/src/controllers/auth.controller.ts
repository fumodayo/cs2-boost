import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUserProps } from '../types';
import { IP_STATUS } from '../constants';
import User from '../models/user.model';
import {
    generateAccessToken,
    generatePassword,
    generateRefreshToken,
    generateUserId,
    generateUsername,
} from '../utils/generate';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { errorHandler } from '../utils/error';
import { sendEmail } from '../utils/sendEmail';

/**
 * @route POST /api/auth/refresh-token
 * @access Public
 * @description Mỗi lần thực hiện một request có sử dụng đến quyền access của client thì sẽ gọi hàm này
 * Dùng để tạo mới token và xác thực lại (ip location, user id)
 */
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token } = req.cookies;
    const { id, ip } = req.body;

    if (!refresh_token) {
        const existUser = await User.findById(id);
        if (!existUser) return next(errorHandler(404, 'User not found'));

        existUser.ip_addresses.forEach((log) => {
            if (log.ip_location === ip) {
                log.status = IP_STATUS.OFFLINE;
            }
        });

        await existUser.save();
        return next(errorHandler(401, 'Unauthorized'));
    }

    try {
        const decodedToken = jwt.verify(
            refresh_token,
            process.env.REFRESH_TOKEN_SECRET as string,
        ) as JwtPayload;

        if (!decodedToken) {
            return next(errorHandler(400, 'Access token is not valid'));
        }

        const existUser = await User.findById(decodedToken.id);

        if (!existUser) {
            return next(errorHandler(401, 'Unauthorized'));
        }

        generateAccessToken(res, existUser.toObject() as IUserProps);

        res.status(201).json('Created Access Token Successfully');
    } catch (e) {
        console.log(e);
        next(e);
    }
};

/**
 * @route POST /api/auth/register
 * @access Public
 * @description Tạo mới tài khoản
 */
const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email_address, password, ip_location, country, device } = req.body;

        if (!ip_location || !country || !device)
            return next(errorHandler(400, 'Please turn off your VPN'));

        const existUser = await User.findOne({ email_address });

        if (existUser) return next(errorHandler(400, 'Email address has taken'));

        const newUser = new User({
            username: generateUsername(email_address),
            user_id: generateUserId(),
            email_address: email_address,
            password,
            ip_addresses: [{ ip_location, country, device }],
        });

        const userObj = (await newUser.save()).toObject() as IUserProps;

        const { password: _, ...safeUser } = userObj;

        generateAccessToken(res, userObj);
        generateRefreshToken(res, userObj);

        res.status(200).json(safeUser);
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/auth/login
 * @access Public
 * @description Đăng nhập
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email_address, password, ip_location, country, device } = req.body;

        if (!ip_location || !country || !device)
            return next(errorHandler(400, 'Please turn off your VPN'));

        const existUser = await User.findOne({
            email_address,
        });

        if (!existUser || !bcryptjs.compareSync(password, existUser.password))
            return next(errorHandler(400, 'Wrong email address or password'));

        let isNewIP = true;

        existUser.ip_addresses.forEach((log) => {
            if (log.ip_location === ip_location) {
                isNewIP = false;
                log.status = IP_STATUS.ONLINE;
            }
        });

        if (isNewIP) existUser.ip_addresses.push({ ip_location, country, device });

        const userObj = (await existUser.save()).toObject() as IUserProps;

        const { password: _, ...safeUser } = userObj;

        generateAccessToken(res, userObj);
        generateRefreshToken(res, userObj);

        res.status(200).json(safeUser);
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/auth/auth-with-gmail
 * @access Public
 * @description Tạo tài khoản và đăng nhập bằng tài khoản gmail
 */
const authWithGmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email_address, profile_picture, ip_location, country, device } = req.body;

        if (!ip_location || !country || !device)
            return next(errorHandler(400, 'Please turn off your VPN'));

        let uploadedProfilePicture = profile_picture;
        if (profile_picture) {
            uploadedProfilePicture = await uploadToCloudinary(profile_picture);
            console.log('up_image', uploadedProfilePicture);
        }

        let user = await User.findOne({ email_address });

        const updateIP = (user: IUserProps) => {
            const exists = user.ip_addresses.some((log) => log.ip_location === ip_location);
            if (!exists) {
                user.ip_addresses.push({ ip_location, country, device, status: IP_STATUS.ONLINE });
            } else {
                user.ip_addresses.forEach((log) => {
                    if (log.ip_location === ip_location) log.status = IP_STATUS.ONLINE;
                });
            }
        };

        if (user) {
            updateIP(user.toObject() as IUserProps);
            if (uploadedProfilePicture) user.profile_picture = uploadedProfilePicture;

            await user.save();
        } else {
            const newPassword = generatePassword();
            user = new User({
                username,
                email_address,
                password: newPassword,
                user_id: generateUserId(),
                profile_picture:
                    uploadedProfilePicture ||
                    'https://res.cloudinary.com/du93troxt/image/upload/v1714744499/avatar_qyersf.jpg',
                ip_addresses: [{ ip_location, country, device }],
            });

            await sendEmail({
                to: email_address,
                subject: 'Your New Password',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">New Password Created Successfully</h2>
                    <p>Dear ${username || 'User'},</p>
                    <p>Here is your new password:</p>
                    <p style="font-size: 18px; font-weight: bold; color: #555;">${newPassword}</p>
                    <p>Thank you,</p>
                    <p><strong>CS2Boost Support Team</strong></p>
                    </div>
                `,
            });

            await user.save();
        }

        const userObj = user.toObject() as IUserProps;

        const { password, ...safeUser } = userObj;
        generateAccessToken(res, userObj);
        generateRefreshToken(res, userObj);

        return res.status(200).json(safeUser);
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/auth/forgot-password
 * @access Public
 * @description Tạo mới mã OTP có thời hạn gửi về email để xác thực tài khoản
 */
const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email_address } = req.body;
        const existUser = await User.findOne({ email_address });
        if (!existUser) return next(errorHandler(404, 'User not found'));

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        existUser.otp = otp;
        existUser.otp_expiry = Date.now() + 1 * 60 * 60 * 1000;
        await existUser.save();

        await sendEmail({
            to: email_address,
            subject: 'Password Reset Notification',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Password Reset Successful</h2>
                <p>Dear ${existUser.username || 'User'},</p>
                <p>Your password has been successfully reset. Here is your new password:</p>
                <p style="font-size: 18px; font-weight: bold; color: #555;">${otp}</p>
                <p>We recommend you log in and change this password to something more secure.</p>
                <p>Thank you,</p>
                <p><strong>CS2Boost Support Team</strong></p>
                </div>
            `,
        });

        res.status(200).json({ success: true });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/auth/auth-with-otp
 * @access Public
 * @description Xác nhận mã OTP
 */
const authWithOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp } = req.body;
        const existUser = await User.findOne({
            otp: otp,
            otp_expiry: { $gt: Date.now() },
        });

        if (!existUser) {
            return next(errorHandler(400, 'OTP Invalid or has been expired'));
        }

        existUser.otp = null;
        existUser.otp_expiry = null;
        await existUser.save();

        return res.status(200).json({ success: true, message: 'OTP correct' });
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/auth/reset-password
 * @access Public
 * @description Tạo mới mật khẩu cho tài khoản
 */
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email_address, new_password, ip_location, country, device } = req.body;
        if (!ip_location || !country || !device)
            return next(errorHandler(400, 'Please turn off your VPN'));

        const existUser = await User.findOne({ email_address });
        if (!existUser) return next(errorHandler(404, 'User not found'));

        const existingIP = existUser.ip_addresses.find((log) => log.ip_location === ip_location);

        if (existingIP) {
            existingIP.status = IP_STATUS.ONLINE;
        } else {
            existUser.ip_addresses.push({ ip_location, country, device });
        }

        existUser.password = new_password;

        const { password, ...safeUser } = (await existUser.save()).toObject() as IUserProps;

        generateAccessToken(res, safeUser);
        generateRefreshToken(res, safeUser);

        res.status(200).json(safeUser);
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/auth/signout
 * @access Public
 * @description
 * Đăng xuất tài khoản, đồng thời xóa cookie access_token và refresh_token
 */
const signout = async (req: Request, res: Response, next: NextFunction) => {
    const { ip_location, id } = req.body;
    try {
        const existUser = await User.findById(id);
        if (!existUser) return next(errorHandler(404, 'User not found'));

        existUser.ip_addresses.forEach((log) => {
            if (log.ip_location === ip_location) {
                log.status = IP_STATUS.OFFLINE;
            }
        });

        await existUser.save();
        res.clearCookie('access_token')
            .clearCookie('refresh_token')
            .status(200)
            .json('Signout success');
    } catch (e) {
        next(e);
    }
};

export {
    refreshToken,
    register,
    login,
    authWithGmail,
    forgotPassword,
    authWithOtp,
    resetPassword,
    signout,
};
