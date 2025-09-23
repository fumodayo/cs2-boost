import { FilterQuery } from 'mongoose';
import { IOrder } from '../models/order.model';

const orderPopulates = [
    { path: 'user', select: '-password -otp -otp_expiry' },
    { path: 'partner', select: '-password -otp -otp_expiry' },
    { path: 'assign_partner', select: '-password -otp -otp_expiry' },
    { path: 'conversation' },
    { path: 'account' },
    {
        path: 'review',
        populate: {
            path: 'sender',
            select: 'username profile_picture user_id',
        },
    },
];

const buildQueryOrderOptions = (queryParams: any, searchFields: string[]) => {
    const page = queryParams['page'] || queryParams.page || 1;
    const perPage = queryParams['per-page'] || queryParams.perPage || 5;
    const sort = queryParams.sort || '-createdAt';

    const filters: FilterQuery<IOrder> = {};

    if (queryParams['filter-status']) {
        const statuses = Array.isArray(queryParams['filter-status'])
            ? queryParams['filter-status']
            : [queryParams['filter-status']];
        filters.status = { $in: statuses };
    }

    if (queryParams['filter-type']) {
        const types = Array.isArray(queryParams['filter-type'])
            ? queryParams['filter-type']
            : [queryParams['filter-type']];
        filters.type = { $in: types };
    }

    if (queryParams['filter-payment']) {
        const paymentStatuses = Array.isArray(queryParams['filter-payment'])
            ? queryParams['filter-payment']
            : [queryParams['filter-payment']];
        filters.payment_status = { $in: paymentStatuses };
    }

    if (queryParams['filter-partner']) {
        filters.assign_partner = queryParams['filter-partner'];
    }

    if (queryParams.search && searchFields.length > 0) {
        const searchRegex = new RegExp(queryParams.search as string, 'i');
        filters.$or = searchFields.map((field) => {
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                return { [parent]: { [child]: searchRegex } };
            }
            return { [field]: searchRegex };
        });
    }

    return { filters, sort, page, perPage };
};

export { orderPopulates, buildQueryOrderOptions };
