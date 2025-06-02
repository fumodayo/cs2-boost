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
        search = '',
        page = '1',
        ['per-page']: perPage = '15',
    } = query;

    const filters: Record<string, any> = {};
    if (Array.isArray(filterStatus) && filterStatus.length) {
        filters.status = { $in: filterStatus };
    }

    if (Array.isArray(filterType) && filterType.length) {
        filters.type = { $in: filterType };
    }

    if (search && searchFields.length) {
        filters.$or = searchFields.map((field) => ({
            [field]: { $regex: search, $options: 'i' },
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
