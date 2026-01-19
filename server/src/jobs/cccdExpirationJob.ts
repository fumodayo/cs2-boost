import cron from 'node-cron';
import User from '../models/user.model';
import NotificationModel from '../models/notification.model';
import { ROLE, NOTIFY_TYPE } from '../constants/index';
import { io, getReceiverSocketID } from '../socket/socket';

const CCCD_VALIDITY_YEARS = 5;

const WARNING_DAYS_BEFORE = 30;

/**
 * Calculate CCCD expiration date
 */
const getCCCDExpirationDate = (issueDate: Date): Date => {
    const expirationDate = new Date(issueDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + CCCD_VALIDITY_YEARS);
    return expirationDate;
};

/**
 * Check if CCCD is within warning period (1 month before expiration)
 */
const isWithinWarningPeriod = (issueDate: Date): boolean => {
    const expirationDate = getCCCDExpirationDate(issueDate);
    const warningDate = new Date(expirationDate);
    warningDate.setDate(warningDate.getDate() - WARNING_DAYS_BEFORE);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today >= warningDate && today < expirationDate;
};

/**
 * Check if CCCD has expired
 */
const isExpired = (issueDate: Date): boolean => {
    const expirationDate = getCCCDExpirationDate(issueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today >= expirationDate;
};

/**
 * Send warning notification to partner
 */
const sendWarningNotification = async (user: any) => {
    const expirationDate = getCCCDExpirationDate(user.cccd_issue_date);
    const formattedDate = expirationDate.toLocaleDateString('vi-VN');

    const messages = {
        vietnamese: {
            title: '⚠️ CCCD sắp hết hạn',
            content: `CCCD của bạn sẽ hết hạn vào ngày ${formattedDate}. Vui lòng cập nhật CCCD mới để tiếp tục làm Partner.`,
        },
        english: {
            title: '⚠️ CCCD Expiring Soon',
            content: `Your CCCD will expire on ${formattedDate}. Please update your CCCD to continue as a Partner.`,
        },
    };

    const userLanguage = user.language || 'vietnamese';
    const msg = messages[userLanguage as keyof typeof messages] || messages.vietnamese;

    const notification = await NotificationModel.create({
        receiver: user._id,
        title: msg.title,
        content: msg.content,
        type: NOTIFY_TYPE.CCCD_EXPIRING,
        isRead: false,
        link: '/settings',
    });

    await User.findByIdAndUpdate(user._id, {
        $set: { cccd_warning_sent: true },
    });

    const userSocketId = getReceiverSocketID(user._id.toString());
    if (userSocketId) {
        io.to(userSocketId).emit('cccdExpiringWarning', { notification });
    }

    console.log(`[CCCD Job] Warning sent to user: ${user.username}`);
};

/**
 * Demote partner to client when CCCD expires
 */
const demotePartner = async (user: any) => {
    const messages = {
        vietnamese: {
            title: '❌ CCCD đã hết hạn - Tài khoản Partner bị hủy',
            content:
                'CCCD của bạn đã hết hạn. Tài khoản Partner đã bị chuyển thành Client. Vui lòng cập nhật CCCD mới để đăng ký lại làm Partner.',
        },
        english: {
            title: '❌ CCCD Expired - Partner Account Revoked',
            content:
                'Your CCCD has expired. Your Partner account has been demoted to Client. Please update your CCCD to re-register as a Partner.',
        },
    };

    const userLanguage = user.language || 'vietnamese';
    const msg = messages[userLanguage as keyof typeof messages] || messages.vietnamese;

    await User.findByIdAndUpdate(user._id, {
        $pull: { role: ROLE.PARTNER },
        $set: {
            is_verified: false,
            partner_request_status: 'none',
            cccd_warning_sent: false,

        },
    });

    const notification = await NotificationModel.create({
        receiver: user._id,
        title: msg.title,
        content: msg.content,
        type: NOTIFY_TYPE.PARTNER_DEMOTED,
        isRead: false,
        link: '/settings',
    });

    const userSocketId = getReceiverSocketID(user._id.toString());
    if (userSocketId) {
        io.to(userSocketId).emit('partnerDemoted', {
            notification,
            user: await User.findById(user._id).select('-password'),
        });
    }

    console.log(`[CCCD Job] Partner demoted: ${user.username}`);
};

/**
 * Main job function to check CCCD expiration
 */
export const checkCCCDExpiration = async () => {
    console.log('[CCCD Job] Starting CCCD expiration check...');

    try {

        const partners = await User.find({
            role: ROLE.PARTNER,
            cccd_issue_date: { $exists: true, $ne: null },
        }).select('_id username language cccd_issue_date cccd_warning_sent');

        let warningsSent = 0;
        let partnersDemoted = 0;

        for (const partner of partners) {
            if (!partner.cccd_issue_date) continue;

            if (isExpired(partner.cccd_issue_date)) {
                await demotePartner(partner);
                partnersDemoted++;
            }

            else if (isWithinWarningPeriod(partner.cccd_issue_date) && !partner.cccd_warning_sent) {
                await sendWarningNotification(partner);
                warningsSent++;
            }
        }

        console.log(
            `[CCCD Job] Completed. Warnings sent: ${warningsSent}, Partners demoted: ${partnersDemoted}`,
        );
    } catch (error) {
        console.error('[CCCD Job] Error:', error);
    }
};

/**
 * Initialize the cron job
 * Runs daily at 00:00 (midnight)
 */
export const initCCCDExpirationJob = () => {

    cron.schedule('0 0 * * *', () => {
        checkCCCDExpiration();
    });

    console.log('[CCCD Job] Cron job initialized - runs daily at midnight');
};