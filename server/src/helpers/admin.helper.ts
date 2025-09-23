import { FilterQuery, isValidObjectId } from 'mongoose';
import { IUser } from '../models/user.model';
import escapeRegex from '../utils/escapeRegex';

/**
 * Mảng cấu hình chuẩn để populate cho các truy vấn đơn hàng (Order) từ trang Admin.
 */
const orderPopulates = [
    { path: 'user' },
    { path: 'partner' },
    { path: 'assign_partner' },
    { path: 'account', select: 'username' },
    { path: 'conversation' },
    { path: 'review' },
];

/**
 * Xây dựng các tùy chọn truy vấn (filter, sort, pagination) cho model User
 * từ các query params của request trong trang Admin.
 *
 * @param queryParams - Đối tượng query từ request (req.query).
 * @param searchFields - Mảng các trường dùng để tìm kiếm bằng từ khóa `search`.
 * @returns Một đối tượng chứa `filters`, `sort`, `page`, và `perPage`.
 */
const buildQueryUserOptions = (queryParams: any, searchFields: string[]) => {
    const page = queryParams['page'] || queryParams.page || 1;
    const perPage = queryParams['per-page'] || queryParams.perPage || 5;
    const sort = queryParams.sort || '-createdAt';

    const filters: FilterQuery<IUser> = {};

    if (queryParams.role) {
        filters.role = {
            $in: Array.isArray(queryParams.role) ? queryParams.role : [queryParams.role],
        };
    }

    if (queryParams['filter-status']) {
        const statuses = Array.isArray(queryParams['filter-status'])
            ? queryParams['filter-status']
            : [queryParams['filter-status']];
        filters.status = { $in: statuses };
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

    return {
        filters,
        sort,
        page: parseInt(page as string, 10),
        perPage: parseInt(perPage as string, 10),
    };
};

const buildQueryOrderOptions = (queryParams: any, searchFields: string[] = []) => {
    const page = queryParams['page'] || queryParams.page || 1;
    const perPage = queryParams['per-page'] || queryParams.perPage || 5;
    const sort = queryParams.sort || '-createdAt';

    const allConditions: any[] = [];

    if (queryParams['filter-status']) {
        const statuses = Array.isArray(queryParams['filter-status'])
            ? queryParams['filter-status']
            : [queryParams['filter-status']];
        if (statuses.length > 0) {
            allConditions.push({ status: { $in: statuses } });
        }
    }

    if (queryParams['filter-type']) {
        const types = Array.isArray(queryParams['filter-type'])
            ? queryParams['filter-type']
            : [queryParams['filter-type']];
        if (types.length > 0) {
            allConditions.push({ type: { $in: types } });
        }
    }

    if (queryParams['filter-partner'] && isValidObjectId(queryParams['filter-partner'])) {
        allConditions.push({ assign_partner: queryParams['filter-partner'] });
    }

    if (queryParams.search && typeof queryParams.search === 'string' && searchFields.length > 0) {
        const sanitizedSearch = escapeRegex(queryParams.search);

        const searchRegex = new RegExp(sanitizedSearch, 'i');

        const orConditions = searchFields.map((field) => ({ [field]: searchRegex }));
        if (orConditions.length > 0) {
            allConditions.push({ $or: orConditions });
        }
    }

    const filters = allConditions.length > 0 ? { $and: allConditions } : {};
    return { filters, sort, page, perPage };
};

export { orderPopulates, buildQueryUserOptions, buildQueryOrderOptions };
