import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { errorHandler } from '../utils/error';
import { ROLE } from '../constants';
import { AuthRequest, IUserProps } from '../types';
import bcryptjs from 'bcryptjs';

/**
 * @route GET /api/user/get-user/:id
 * @access Private (User)
 * @description Lấy thông tin chi tiết của người dùng theo ID.
 */
const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        res.status(200).json(user);
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/user/get-partners
 * @access Public
 * @description Lấy danh sách partners theo các tiêu chí:
 *  - search: tìm theo username hoặc user_id
 *  - star-min, star-max: lọc theo đánh giá
 *  - rate-min, rate-max: lọc theo tỉ lệ hoàn thành
 *  - user_id: loại trừ bản thân khỏi danh sách
 *  - role: chỉ lọc người dùng có vai trò là partner
 */
const getPartners = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id } = req.body;
        const search = req.query['search'] || '';
        const starMin = Number(req.query['star-min']) || 0;
        const starMax = Number(req.query['star-max']) || 5;
        const rateMin = Number(req.query['rate-min']) || 0;
        const rateMax = Number(req.query['rate-max']) || 100;

        const filters: Record<string, any> = {
            role: ROLE.PARTNER,
            _id: { $ne: user_id },
        };

        if (search) {
            filters.$or = [
                { username: { $regex: search, $options: 'i' } },
                ...(user_id ? [{ user_id: { $regex: search, $options: 'i' } }] : []),
            ];
        }

        if (starMin > 0 || starMax < 5) {
            filters.total_rating = {
                ...(starMin > 0 && { $gte: starMin }),
                ...(starMax < 5 && { $lte: starMax }),
            };
        }

        if (rateMin > 0 || rateMax < 100) {
            filters.total_completion_rate = {
                ...(rateMin > 0 && { $gte: rateMin }),
                ...(rateMax < 100 && { $lte: rateMax }),
            };
        }

        const partners = await User.find(filters);
        if (!partners?.length) return next(errorHandler(404, 'No partners found'));

        res.status(200).json(partners);
    } catch (e) {
        next(e);
    }
};

/**
 * @route GET /api/user/get-partner/:username
 * @access Public
 * @description Lấy thông tin chi tiết của partner theo username.
 */
const getPartnerByUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) return next(errorHandler(404, 'User not found'));

        res.status(200).json(user);
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/user/follow/:partner_id
 * @access Private (User)
 * @description Theo dõi một partner theo ID. Tăng số lượng người theo dõi của partner.
 */
const followPartnerById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user.id;
        const { partner_id } = req.params;

        await Promise.all([
            User.findByIdAndUpdate(user_id, { $addToSet: { following: partner_id } }),
            User.findByIdAndUpdate(partner_id, { $inc: { followers_count: 1 } }),
        ]);

        const updatedUser = await User.findById(user_id)
            .select('-password')
            .populate('following', '_id username profile_picture')
            .lean();

        res.status(201).json(updatedUser);
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/user/unfollow/:partner_id
 * @access Private (User)
 * @description Bỏ theo dõi một partner theo ID. Giảm số lượng người theo dõi của partner.
 */
const unFollowPartnerById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user.id;
        const { partner_id } = req.params;

        await Promise.all([
            User.findByIdAndUpdate(user_id, { $pull: { following: partner_id } }),
            User.findByIdAndUpdate(partner_id, { $inc: { followers_count: -1 } }),
        ]);

        const updatedUser = await User.findById(user_id)
            .select('-password')
            .populate('following', '_id username profile_picture')
            .lean();

        res.status(201).json(updatedUser);
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/user/update/:id
 * @access Private (User)
 * @description Cập nhật thông tin cá nhân của người dùng (chỉ cho phép chính chủ).
 *              Kiểm tra username đã tồn tại hay chưa nếu có thay đổi.
 */
const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id: userid } = req.user;
    const { username, profile_picture, social_links, details } = req.body;

    try {
        if (userid !== req.params.id) {
            return next(errorHandler(403, 'You can update only your account'));
        }

        const updateFields: Partial<IUserProps> = {};

        if (username) {
            const existUser = await User.findOne({ username });
            if (existUser) {
                return next(errorHandler(409, 'Username has been taken already'));
            }
            updateFields.username = username;
        }

        if (profile_picture) {
            updateFields.profile_picture = profile_picture;
        }

        if (social_links) {
            updateFields.social_links = social_links;
        }

        if (details) {
            updateFields.details = details;
        }

        if (Object.keys(updateFields).length === 0) {
            return next(errorHandler(400, 'Nothing to update'));
        }

        const updatedUser = await User.findByIdAndUpdate(
            userid,
            { $set: updateFields },
            { new: true },
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password, ...rest } = updatedUser.toObject();
        res.status(200).json(rest);
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/user/change-password/:id
 * @access Private (User)
 * @description Đổi mật khẩu tài khoản. Yêu cầu nhập đúng mật khẩu hiện tại.
 */
const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: userid } = req.user;
        const { id: param_id } = req.params;
        const { current_password, new_password } = req.body;

        if (userid !== param_id) return next(errorHandler(403, 'You can update only your account'));

        if (!current_password || !new_password)
            return next(errorHandler(400, 'Password not valid'));

        const user = await User.findById(userid);
        if (!user) return next(errorHandler(404, 'User not found'));

        const isMatch = await bcryptjs.compare(current_password, user.password);
        if (!isMatch) return next(errorHandler(400, 'Wrong current password'));

        const hashed = await bcryptjs.hash(new_password, 10);
        await User.findByIdAndUpdate(userid, { password: hashed });

        res.status(200).send('Password updated successfully');
    } catch (e) {
        next(e);
    }
};

/**
 * @route POST /api/user/verify-user/:id
 * @access Private (User)
 * @description Xác minh tài khoản người dùng. Sau khi xác minh sẽ gán thêm vai trò partner.
 */
const verifyUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: userid } = req.user;
        const { id: param_id } = req.params;

        if (userid !== param_id) return next(errorHandler(401, 'You can verify only your account'));

        const {
            address,
            cccd_number,
            cccd_issue_date,
            date_of_birth,
            gender,
            language,
            phone_number,
            full_name,
        } = req.body;

        const updateFields = {
            is_verified: true,
            address,
            cccd_number,
            cccd_issue_date,
            date_of_birth,
            gender,
            language,
            phone_number,
            full_name,
        };

        const updatedUser = await User.findByIdAndUpdate(
            userid,
            {
                $addToSet: { role: ROLE.PARTNER },
                $set: { ...updateFields },
            },
            { new: true },
        );

        if (!updatedUser) return next(errorHandler(400, 'Can not verify user'));

        if (updatedUser.is_verified) return next(errorHandler(400, 'User already verified'));

        const { password, ...safeUser } = updatedUser.toObject();
        res.status(201).json(safeUser);
    } catch (e) {
        next(e);
    }
};

export {
    getPartners,
    getPartnerByUsername,
    followPartnerById,
    unFollowPartnerById,
    updateUser,
    changePassword,
    verifyUser,
    getUser,
};
