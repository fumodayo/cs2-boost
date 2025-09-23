export interface QueryOrderOptions {
    filters: Record<string, any>;
    sort: string;
    page: number;
    perPage: number;
}

export const buildQueryOrderOptions = (
    query: Record<string, any>,
    searchFields: string[] = [],
): QueryOrderOptions => {
    const {
        ['filter-status']: filterStatus,
        ['filter-type']: filterType,
        sort = '-createdAt',
        q = '',
        page = '1',
        ['per-page']: perPage = '5',
    } = query;

    const filters: Record<string, any> = {};
    if (filterStatus) {
        filters.status = { $in: Array.isArray(filterStatus) ? filterStatus : [filterStatus] };
    }

    if (filterType) {
        filters.type = { $in: Array.isArray(filterType) ? filterType : [filterType] };
    }

    if (q && searchFields.length) {
        filters.$or = searchFields.map((field) => ({
            [field]: { $regex: q, $options: 'i' },
        }));
    }

    return {
        filters,
        sort,
        page: parseInt(page as string, 10) || 1,
        perPage: parseInt(perPage as string, 10) || 15,
    };
};

export const orderPopulates = [
    { path: 'user', select: '-password' },
    { path: 'partner', select: '-password' },
    { path: 'assign_partner', select: '-password' },
    { path: 'account' },
];
