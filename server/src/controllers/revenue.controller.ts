import { Request, Response, NextFunction } from 'express';
import Transaction from '../models/transaction.model';
import Payout from '../models/payout.model';
import User from '../models/user.model';
import { PAYOUT_STATUS, TRANSACTION_TYPE } from '../constants/index';
import mongoose, { FilterQuery } from 'mongoose';

/**
 * @desc    (Admin) Cung cấp dữ liệu doanh thu bán hàng theo từng ngày cho biểu đồ.
 *          Dữ liệu được tổng hợp cho một khoảng thời gian nhất định (mặc định 30 ngày).
 * @route   GET /api/revenue/chart-data
 * @access  Private (Admin)
 */
const getRevenueChartData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const days = parseInt(req.query.days as string, 10) || 30;
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        const startDate = new Date();
        startDate.setDate(endDate.getDate() - (days - 1));
        startDate.setHours(0, 0, 0, 0);

        const dailyFinancials = await Transaction.aggregate([
            {
                $match: {
                    type: { $in: [TRANSACTION_TYPE.SALE, TRANSACTION_TYPE.PARTNER_COMMISSION] },
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    grossRevenue: {
                        $sum: {
                            $cond: [{ $eq: ['$type', TRANSACTION_TYPE.SALE] }, '$amount', 0],
                        },
                    },
                    partnerCommission: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', TRANSACTION_TYPE.PARTNER_COMMISSION] },
                                '$amount',
                                0,
                            ],
                        },
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const financialsMap = new Map(
            dailyFinancials.map((item) => [
                item._id,
                { grossRevenue: item.grossRevenue, partnerCommission: item.partnerCommission },
            ]),
        );

        const chartData = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const dateString = date.toISOString().split('T')[0];

            const dailyData = financialsMap.get(dateString) || {
                grossRevenue: 0,
                partnerCommission: 0,
            };

            const netProfit = dailyData.grossRevenue - dailyData.partnerCommission;

            chartData.push({
                date: dateString,
                grossRevenue: dailyData.grossRevenue,
                netProfit: netProfit,
            });
        }
        res.status(200).json({ success: true, data: chartData });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    (Admin) Cung cấp các chỉ số thống kê tài chính quan trọng cho dashboard.
 *          Thống kê trong khoảng thời gian được chỉ định (mặc định 30 ngày, 0 = tất cả).
 * @route   GET /api/revenue/statistics
 * @access  Private (Admin)
 */
const getDashboardStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const days = parseInt(req.query.days as string, 10) || 30;
        const isAllTime = days > 1000;

        const dateFilter: { $gte?: Date } = {};
        if (!isAllTime) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            startDate.setHours(0, 0, 0, 0);
            dateFilter.$gte = startDate;
        }

        const revenueAggregation = await Transaction.aggregate([
            { $match: isAllTime ? {} : { createdAt: dateFilter } },
            { $group: { _id: '$type', totalAmount: { $sum: '$amount' } } },
        ]);

        const stats: { [key: string]: number } = revenueAggregation.reduce((acc, item) => {
            acc[item._id] = item.totalAmount;
            return acc;
        }, {});

        const grossRevenue = stats[TRANSACTION_TYPE.SALE] || 0;
        const totalPayouts = Math.abs(stats[TRANSACTION_TYPE.PAYOUT] || 0);
        const partnerCommission = stats[TRANSACTION_TYPE.PARTNER_COMMISSION] || 0;
        const netProfit = grossRevenue - partnerCommission;

        const pendingPayoutsAggregation = await Payout.aggregate([
            { $match: { status: PAYOUT_STATUS.PENDING } },
            { $group: { _id: null, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]);
        const pendingData = pendingPayoutsAggregation[0] || { totalAmount: 0, count: 0 };

        const timeDescription = isAllTime ? 'All time' : `In the last ${days} days`;
        const payoutDescription = isAllTime
            ? 'Paid to partners (all time)'
            : `Paid to partners in ${days} days`;

        res.status(200).json({
            success: true,
            data: {
                kpi: {
                    grossRevenue,
                    netProfit,
                    totalPayouts,
                    pendingPayouts: pendingData.totalAmount,
                    pendingPayoutsCount: pendingData.count,
                },
                descriptions: {
                    grossRevenue: timeDescription,
                    netProfit:
                        grossRevenue > 0
                            ? `${((netProfit / grossRevenue) * 100).toFixed(1)}% profit margin`
                            : 'No revenue to calculate margin',
                    totalPayouts: payoutDescription,
                    pendingPayouts: `${pendingData.count} pending requests`,
                },
            },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @desc    (Admin) Lấy danh sách tất cả giao dịch trong hệ thống.
 *          Hỗ trợ phân trang, sắp xếp, lọc theo loại, và tìm kiếm theo người dùng.
 * @route   GET /api/revenue/transactions
 * @access  Private (Admin)
 */
const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query['per-page'] as string) || 10;
        const skip = (page - 1) * perPage;
        const sort = (req.query.sort as string) || '-createdAt';

        const { search, userId, startDate, endDate } = req.query;
        const typeFilter = req.query.type;

        const filters: FilterQuery<any> = {};

        if (typeFilter) {
            filters.type = { $in: Array.isArray(typeFilter) ? typeFilter : [typeFilter] };
        }

        if (startDate || endDate) {
            const dateFilter: { $gte?: Date; $lte?: Date } = {};

            if (startDate) {
                const start = new Date(startDate as string);
                start.setHours(0, 0, 0, 0);
                dateFilter.$gte = start;
            }

            if (endDate) {
                const end = new Date(endDate as string);
                end.setHours(23, 59, 59, 999);
                dateFilter.$lte = end;
            }

            if (Object.keys(dateFilter).length > 0) {
                filters.createdAt = dateFilter;
            }
        }

        if (userId) {
            filters.user = userId;
        } else if (search) {
            const searchRegex = new RegExp(search as string, 'i');
            const matchingUsers = await User.find({
                $or: [
                    { username: searchRegex },
                    { email_address: searchRegex },
                    { full_name: searchRegex },
                ],
            }).select('_id');

            const userIds = matchingUsers.map((user) => user._id);

            if (userIds.length > 0) {
                filters.user = { $in: userIds };
            } else {
                filters.user = new mongoose.Types.ObjectId();
            }
        }

        const [transactions, total] = await Promise.all([
            Transaction.find(filters)
                .populate('user')
                .populate('related_order', '_id boost_id title type status game')
                .sort(sort)
                .skip(skip)
                .limit(perPage),
            Transaction.countDocuments(filters),
        ]);

        res.status(200).json({
            success: true,
            data: transactions,
            pagination: {
                total,
                page,
                limit: perPage,
                totalPages: Math.ceil(total / perPage),
            },
        });
    } catch (e) {
        next(e);
    }
};

export { getRevenueChartData, getDashboardStatistics, getTransactions };