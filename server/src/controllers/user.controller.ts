import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user.model';
import { errorHandler } from '../utils/error';
import { ROLE, NOTIFY_TYPE } from '../constants';
import bcryptjs from 'bcryptjs';
import { AuthRequest } from '../interfaces';
import { FilterQuery } from 'mongoose';
import PartnerRequest, { PARTNER_REQUEST_STATUS } from '../models/partnerRequest.model';
import Notification from '../models/notification.model';
import { getAdminSocketIds, io } from '../socket/socket';

/**
 * @desc    Lấy thông tin công khai của một người dùng bằng ID.
 *          Loại bỏ các trường nhạy cảm.
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        res.status(200).json({ success: true, data: user });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    (Admin) Tìm kiếm người dùng trong hệ thống (trừ admin).
 * @route   GET /api/users/search
 * @access  Private (Admin)
 */
const searchUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const query = req.query.q as string;
        const adminId = req.user.id;

        const filter: FilterQuery<IUser> = {
            _id: { $ne: adminId },
            role: { $ne: ROLE.ADMIN },
        };

        if (query) {
            filter.$or = [
                { username: { $regex: query, $options: 'i' } },
                { full_name: { $regex: query, $options: 'i' } },
            ];
        }

        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .select('username full_name profile_picture')
            .limit(10);

        res.status(200).json({ success: true, data: users });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Lấy danh sách các Partner với bộ lọc và phân trang.
 * @route   GET /api/users/partners
 * @access  Public
 */
const getPartners = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.query['partner_id'];
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query['per-page'] as string) || 15;
        const skip = (page - 1) * perPage;

        const search = (req.query.q as string) || '';
        const starMin = parseFloat(req.query['star-min'] as string) || 0;
        const starMax = parseFloat(req.query['star-max'] as string) || 5;
        const rateMin = parseFloat(req.query['rate-min'] as string) || 0;
        const rateMax = parseFloat(req.query['rate-max'] as string) || 100;

        const query: Record<string, any> = { role: ROLE.PARTNER };
        if (userId) query._id = { $ne: userId };
        if (search)
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { full_name: { $regex: search, $options: 'i' } },
            ];
        if (starMin > 0 || starMax < 5) query.total_rating = { $gte: starMin, $lte: starMax };
        if (rateMin > 0 || rateMax < 100)
            query.total_completion_rate = { $gte: rateMin, $lte: rateMax };

        const [partners, total] = await Promise.all([
            User.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(perPage)
                .select(
                    'username full_name profile_picture total_rating total_reviews total_completion_rate is_verified user_id',
                ),
            User.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            data: partners,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy thông tin chi tiết của một Partner bằng username.
 * @route   GET /api/users/partner/:username
 * @access  Public
 */
const getPartnerByUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params;
        const partner = await User.findOne({ username: username, role: ROLE.PARTNER }).select(
            '-password -otp',
        );
        if (!partner) return next(errorHandler(404, 'User not found'));

        res.status(200).json({ success: true, data: partner });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng theo dõi một Partner.
 * @route   POST /api/users/:partnerId/follow
 * @access  Private
 */
const followPartner = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user.id;
        const { partnerId } = req.params;

        await Promise.all([
            User.findByIdAndUpdate(user_id, { $addToSet: { following: partnerId } }),
            User.findByIdAndUpdate(partnerId, { $inc: { followers_count: 1 } }),
        ]);

        const updatedUser = await User.findById(user_id)
            .select('-password')
            .populate('following', '_id username profile_picture')
            .lean();

        res.status(200).json({ success: true, message: 'Follow successfully.', data: updatedUser });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng bỏ theo dõi một Partner.
 * @route   POST /api/users/:partnerId/unfollow
 * @access  Private
 */
const unfollowPartner = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user.id;
        const { partnerId } = req.params;

        await Promise.all([
            User.findByIdAndUpdate(user_id, { $pull: { following: partnerId } }),
            User.findByIdAndUpdate(partnerId, { $inc: { followers_count: -1 } }),
        ]);

        const updatedUser = await User.findById(user_id)
            .select('-password')
            .populate('following', '_id username profile_picture')
            .lean();

        res.status(200).json({
            success: true,
            message: 'Unfollow successfully.',
            data: updatedUser,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng hiện tại cập nhật thông tin cá nhân của mình.
 * @route   PATCH /api/users/me
 * @access  Private
 */
const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { username, profile_picture, banner_picture, social_links, details } = req.body;

        const updateFields: Partial<IUser> = {};

        if (username) {
            const userToUpdate = await User.findById(req.user.id);
            if (userToUpdate && userToUpdate.username !== username) {
                const existUser = await User.findOne({ username });
                if (existUser) {
                    return next(errorHandler(409, 'Username has been taken already'));
                }
                updateFields.username = username;
            }
        }

        if (profile_picture) updateFields.profile_picture = profile_picture;
        if (banner_picture) updateFields.banner_picture = banner_picture;
        if (social_links) updateFields.social_links = social_links;
        if (details) updateFields.details = details;

        if (Object.keys(updateFields).length === 0) {
            return next(errorHandler(400, 'No fields to update'));
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true },
        ).select('-password');

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Information updated successfully.',
            data: updatedUser,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng thay đổi mật khẩu của mình.
 * @route   POST /api/users/me/change-password
 * @access  Private
 */
const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: userid } = req.user;
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password)
            return next(errorHandler(400, 'Password not valid'));

        const user = await User.findById(userid);
        if (!user) return next(errorHandler(404, 'User not found'));

        const isMatch = await bcryptjs.compare(current_password, user.password);
        if (!isMatch) return next(errorHandler(400, 'Wrong current password'));

        const hashed = await bcryptjs.hash(new_password, 10);
        await User.findByIdAndUpdate(userid, { password: hashed });

        res.status(200).json({ success: true, message: 'Password changed successfully.' });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng gửi yêu cầu trở thành Partner (chờ admin duyệt).
 * @route   POST /api/users/me/verify
 * @access  Private
 */
const verifyUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userToVerify = await User.findById(req.user.id);
        if (!userToVerify) {
            return next(errorHandler(404, 'User not found'));
        }

        if (userToVerify.partner_request_status === 'pending') {
            return next(errorHandler(400, 'Partner request is pending approval'));
        }

        if (
            userToVerify.partner_request_status === 'approved' ||
            userToVerify.role.includes(ROLE.PARTNER)
        ) {
            return next(errorHandler(400, 'User is already a partner'));
        }

        const {
            address,
            cccd_number,
            cccd_issue_date,
            date_of_birth,
            gender,
            phone_number,
            full_name,
        } = req.body;

        const existingRequest = await PartnerRequest.findOne({ user: req.user.id });
        if (existingRequest) {
            if (existingRequest.status === PARTNER_REQUEST_STATUS.PENDING) {
                return next(errorHandler(400, 'Partner request is pending approval'));
            }

            existingRequest.status = PARTNER_REQUEST_STATUS.PENDING;
            existingRequest.full_name = full_name;
            existingRequest.cccd_number = cccd_number;
            existingRequest.cccd_issue_date = cccd_issue_date;
            existingRequest.date_of_birth = date_of_birth;
            existingRequest.gender = gender;
            existingRequest.address = address;
            existingRequest.phone_number = phone_number;
            existingRequest.reject_reason = undefined;
            existingRequest.reviewed_by = undefined;
            existingRequest.reviewed_at = undefined;
            await existingRequest.save();
        } else {

            await PartnerRequest.create({
                user: req.user.id,
                full_name,
                cccd_number,
                cccd_issue_date,
                date_of_birth,
                gender,
                address,
                phone_number,
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    partner_request_status: 'pending',
                },
            },
            { new: true },
        ).select('-password');

        if (!updatedUser) {
            return next(errorHandler(500, 'Could not verify user'));
        }

        const latestRequest = await PartnerRequest.findOne({ user: req.user.id }).populate(
            'user',
            'username profile_picture email',
        );

        const adminUsers = await User.find({ role: ROLE.ADMIN }).select('_id');
        const adminNotifications = adminUsers.map((admin) =>
            new Notification({
                receiver: admin._id,
                title: 'New Partner Request',
                content: `${updatedUser.username} has submitted a partner request and is waiting for review.`,
                type: NOTIFY_TYPE.NEW_PARTNER_REQUEST,
            }).save(),
        );
        await Promise.all(adminNotifications);

        const adminSocketIds = getAdminSocketIds();
        if (adminSocketIds.length > 0 && latestRequest) {
            adminSocketIds.forEach((socketId) => {
                io.to(socketId).emit('new_partner_request', latestRequest);
            });
        }

        res.status(200).json({
            success: true,
            message: 'Partner request submitted successfully! Waiting for admin approval.',
            data: updatedUser,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    Người dùng tự xóa tài khoản của mình (Soft Delete).
 * @route   DELETE /api/users/me
 * @access  Private
 */
const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        if (user.is_deleted) {
            return next(errorHandler(400, 'Account has already been deleted'));
        }

        user.is_deleted = true;
        user.deleted_at = new Date();

        user.token_version = (user.token_version || 0) + 1;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully.',
        });
    } catch (e) {
        next(e);
    }
};

export {
    getPartners,
    getPartnerByUsername,
    followPartner,
    unfollowPartner,
    updateUser,
    changePassword,
    verifyUser,
    getUserById,
    searchUsers,
    deleteAccount,
};