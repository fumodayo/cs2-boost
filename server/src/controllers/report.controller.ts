import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { errorHandler } from '../utils/error';
import Report from '../models/report.model';

/**
 * @route DELETE /api/report/send
 * @access Private
 * @description Gửi report lên cho admin
 */
const sendReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: user_id } = req.user;
        const { customer_id, partner_id, title, description } = req.body;

        if (user_id !== customer_id) return next(errorHandler(401, 'Unauthorized'));

        await new Report({ sender: customer_id, receiver: partner_id, title, description }).save();

        res.status(201).json({ success: true, message: 'Report submitted successfully' });
    } catch (e) {
        next(e);
    }
};

export { sendReport };
