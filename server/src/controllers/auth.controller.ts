import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { IP_STATUS, ROLE } from '../constants';
import User, { IUser } from '../models/user.model';
import {
    generateAccessToken,
    generatePassword,
    generateRefreshToken,
    generateUserId,
    generateUsername,
} from '../utils/generate';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { errorHandler } from '../utils/error';
import handleTokenRefreshLogic from '../helpers/token.helper';
import { getReceiverSocketID, io } from '../socket/socket';
import { sendEmail } from '../utils/sendEmail';
import EmailTemplate from '../models/emailTemplate.model';

/**
 * Emit session:updated event to all connected devices of a user
 * This allows real-time updates of login session status across devices
 */
const emitSessionUpdate = (userId: string, ipAddresses: any[]) => {
    const socketId = getReceiverSocketID(userId);
    if (socketId) {
        io.to(socketId).emit('session:updated', { ip_addresses: ipAddresses });
    }
};

/**
 * @desc    Làm mới access token bằng refresh token.
 *          Nếu không có refresh token, hệ thống sẽ cập nhật trạng thái offline cho IP tương ứng.
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refresh_token } = req.cookies;
        const { id, ip_location } = req.body;

        if (!refresh_token) {
            const user = await User.findById(id);
            if (user) {
                const ipLog = user.ip_addresses.find((log) => log.ip_location === ip_location);
                if (ipLog) {
                    ipLog.status = IP_STATUS.OFFLINE;
                    await user.save();
                }
            }
            return next(errorHandler(401, 'Unauthorized'));
        }

        await handleTokenRefreshLogic(req, res, false);
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Đăng ký một tài khoản người dùng mới bằng email và mật khẩu.
 *          Hệ thống sẽ tự động tạo username và user_id.
 * @route   POST /api/auth/register
 * @access  Public
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

        const savedUser = await newUser.save();

        const { password: _, ...safeUser } = savedUser.toObject();

        generateAccessToken(res, savedUser);
        generateRefreshToken(res, savedUser);

        res.status(201).json({ success: true, message: 'Register is completed', data: safeUser });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Đăng nhập vào hệ thống bằng username/email và mật khẩu.
 *          Cập nhật trạng thái online cho IP của người dùng.
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { identifier, password, ip_location, country, device } = req.body;

        if (!ip_location || !country || !device)
            return next(errorHandler(400, 'Please turn off your VPN'));

        const existUser = await User.findOne({
            $or: [{ email_address: identifier }, { username: identifier }],
        });

        if (!existUser || !bcryptjs.compareSync(password, existUser.password))
            return next(errorHandler(400, 'Wrong email address or password'));

        if (existUser.is_deleted) {
            return next(errorHandler(403, 'This account has been deleted.'));
        }

        if (existUser.role.includes(ROLE.ADMIN)) {
            return next(errorHandler(403, 'Admin accounts cannot log in here.'));
        }

        const ipLog = existUser.ip_addresses.find((log) => log.ip_location === ip_location);
        if (ipLog) {
            ipLog.status = IP_STATUS.ONLINE;
        } else {
            existUser.ip_addresses.push({ ip_location, country, device, status: IP_STATUS.ONLINE });
        }
        const savedUser = await existUser.save();

        emitSessionUpdate(savedUser._id.toString(), savedUser.ip_addresses);

        const { password: _, ...safeUser } = savedUser.toObject();

        generateAccessToken(res, savedUser);
        generateRefreshToken(res, savedUser);

        res.status(200).json({ success: true, message: 'Login is successfully.', data: safeUser });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Đăng nhập hoặc đăng ký thông qua tài khoản Google.
 *          Nếu người dùng chưa tồn tại, hệ thống sẽ tạo tài khoản mới và gửi mật khẩu ngẫu nhiên qua email.
 * @route   POST /api/auth/google
 * @access  Public
 */
const authWithGmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email_address, profile_picture, ip_location, country, device } = req.body;

        if (!ip_location || !country || !device)
            return next(errorHandler(400, 'Please turn off your VPN'));

        let uploadedProfilePicture = profile_picture;
        if (profile_picture) {
            uploadedProfilePicture = await uploadToCloudinary(profile_picture);
        }

        let user = await User.findOne({ email_address });
        let isExistingUser = !!user;

        if (user) {

            if (user.is_deleted) {
                return next(errorHandler(403, 'This account has been deleted.'));
            }

            const exists = user.ip_addresses.some((log) => log.ip_location === ip_location);
            if (!exists) {
                user.ip_addresses.push({ ip_location, country, device, status: IP_STATUS.ONLINE });
            } else {
                user.ip_addresses.forEach((log) => {
                    if (log.ip_location === ip_location) log.status = IP_STATUS.ONLINE;
                });
            }

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

            await user.save();

            try {
                const template = await EmailTemplate.findOne({ name: 'welcome' });
                if (template) {
                    let htmlContent = template.html_content;
                    let subject = template.subject;
                    htmlContent = htmlContent.replace(/\{\{username\}\}/g, username);
                    htmlContent = htmlContent.replace(/\{\{password\}\}/g, newPassword);
                    subject = subject.replace(/\{\{username\}\}/g, username);
                    await sendEmail({ to: email_address, subject, html: htmlContent });
                }
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
            }
        }

        if (isExistingUser) {
            emitSessionUpdate(user._id.toString(), user.ip_addresses);
        }

        const userObj = user.toObject();
        const { password, ...safeUser } = userObj;
        generateAccessToken(res, userObj);
        generateRefreshToken(res, userObj);

        res.status(200).json({ success: true, message: 'Login is successfully.', data: safeUser });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Gửi mã OTP để đặt lại mật khẩu về email của người dùng.
 *          OTP có hiệu lực trong 1 giờ.
 * @route   POST /api/auth/forgot-password
 * @access  Public
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

        try {
            const template = await EmailTemplate.findOne({ name: 'forgot_password' });
            if (template) {
                let htmlContent = template.html_content;
                let subject = template.subject;
                htmlContent = htmlContent.replace(/\{\{username\}\}/g, existUser.username);
                htmlContent = htmlContent.replace(/\{\{otp\}\}/g, otp);
                subject = subject.replace(/\{\{username\}\}/g, existUser.username);
                await sendEmail({ to: email_address, subject, html: htmlContent });
            }
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'An OTP code has been sent to your email.',
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Xác thực mã OTP mà người dùng cung cấp.
 *          Sau khi xác thực thành công, mã OTP sẽ bị vô hiệu hóa.
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
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
 * @desc    Đặt lại mật khẩu cho người dùng bằng mật khẩu mới.
 *          Thường được gọi sau khi đã xác thực OTP thành công.
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email_address, new_password, ip_location, country, device } = req.body;

        if (!ip_location || !country || !device)
            return next(errorHandler(400, 'Please turn off your VPN'));

        const existUser = await User.findOne({
            email_address,
        });

        if (!existUser) return next(errorHandler(400, 'Invalid or expired OTP'));

        const existingIP = existUser.ip_addresses.find((log) => log.ip_location === ip_location);
        if (existingIP) {
            existingIP.status = IP_STATUS.ONLINE;
        } else {
            existUser.ip_addresses.push({
                ip_location,
                country,
                device,
                status: IP_STATUS.ONLINE,
            });
        }

        existUser.password = new_password;
        existUser.otp = null;
        existUser.otp_expiry = null;

        const updatedUserDocument = await existUser.save();

        const userForToken = updatedUserDocument.toObject({ versionKey: false });

        generateAccessToken(res, userForToken);
        generateRefreshToken(res, userForToken);

        const { password, ...safeUser } = userForToken;

        res.status(200).json({
            success: true,
            message: 'Password was reset successfully.',
            data: safeUser,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Đăng xuất tài khoản người dùng.
 *          Cập nhật trạng thái IP thành offline và xóa cookies.
 * @route   POST /api/auth/signout
 * @access  Private
 */
const signout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ip_location, id } = req.body;

        const existUser = await User.findById(id);
        if (!existUser) return next(errorHandler(404, 'User not found'));

        existUser.ip_addresses.forEach((log) => {
            if (log.ip_location === ip_location) {
                log.status = IP_STATUS.OFFLINE;
            }
        });

        await existUser.save();

        emitSessionUpdate(existUser._id.toString(), existUser.ip_addresses);

        res.clearCookie('access_token')
            .clearCookie('refresh_token')
            .status(200)
            .json({ success: true, message: 'Signout success' });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Admin đăng ký một tài khoản mới.
 *          Có thể chỉ định vai trò cho tài khoản này.
 * @route   POST /api/auth/admin/register
 * @access  Private (Admin)
 */
const registerWithAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email_address, password, role } = req.body;

        const newUser = new User({
            username: username,
            user_id: generateUserId(),
            email_address: email_address,
            password,
            role,
        });

        await newUser.save();
        const savedUser = await newUser.save();
        const { password: _, ...safeUser } = savedUser.toObject();

        res.status(201).json({
            success: true,
            message: 'Account created successfully.',
            data: safeUser,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @description Đăng nhập với tài khoản Admin.
 * @route POST /api/auth/admin/login
 * @access Private
 */
const loginWithAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        const existUser = await User.findOne({
            username,
            role: ROLE.ADMIN,
        });

        if (!existUser) {
            return next(errorHandler(400, 'Wrong email address or password'));
        }

        const validPassword = bcryptjs.compareSync(password, existUser.password);

        if (!validPassword) {
            return next(errorHandler(400, 'Wrong email address or password'));
        }

        const userObj = (await existUser.save()).toObject() as IUser;
        const { password: hashPassword, ...safeUser } = userObj;
        generateAccessToken(res, userObj);
        generateRefreshToken(res, userObj);

        return res
            .status(200)
            .json({ success: true, message: 'Admin login successful.', data: safeUser });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Đăng xuất tất cả thiết bị.
 *          Tăng token version để vô hiệu hóa tất cả refresh token cũ.
 * @route   POST /api/auth/signout-all
 * @access  Private
 */
const signoutAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;

        const existUser = await User.findById(id);
        if (!existUser) return next(errorHandler(404, 'User not found'));

        existUser.token_version = (existUser.token_version || 0) + 1;

        existUser.ip_addresses.forEach((log) => {
            log.status = IP_STATUS.OFFLINE;
        });

        await existUser.save();

        emitSessionUpdate(existUser._id.toString(), existUser.ip_addresses);

        res.clearCookie('access_token')
            .clearCookie('refresh_token')
            .status(200)
            .json({ success: true, message: 'Signout all devices success' });
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
    verifyOtp,
    resetPassword,
    signout,
    signoutAll,
    registerWithAdmin,
    loginWithAdmin,
};