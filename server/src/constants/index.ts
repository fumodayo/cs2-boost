const ROLE = {
    ADMIN: 'admin',
    CLIENT: 'client',
    PARTNER: 'partner',
} as const;

const ORDER_TYPES = {
    PREMIER: 'premier',
    WINGMAN: 'wingman',
    LEVEL_FARMING: 'level_farming',
} as const;

const ORDER_STATUS = {
    PENDING: 'PENDING',
    WAITING: 'WAITING',
    IN_ACTIVE: 'IN_ACTIVE',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCEL: 'CANCEL',
} as const;

const RECEIPT_STATUS = {
    COMPLETED: 'COMPLETED',
    CANCEL: 'CANCEL',
    REFUND: 'REFUND',
} as const;

const IP_STATUS = {
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
} as const;

const NOTIFY_TYPE = {
    NEW_ORDER: 'NEW_ORDER',
    MESSAGE: 'MESSAGE',
    BOOST: 'BOOST',
    SYSTEM: 'SYSTEM',
} as const;

const VALID_REASONS = [
    'NOT_RESPONDING', // Không phản hồi yêu cầu
    'OVERCHARGING', // Thu phí cao hơn thoả thuận
    'SLOW_DELIVERY', // Giao hàng/chạy dịch vụ chậm
    'LOW_QUALITY', // Dịch vụ kém chất lượng
    'FRAUD', // Gian lận, lừa đảo
    'TERMS_VIOLATION', // Vi phạm điều khoản
] as const;

const REPORT_STATUS = {
    PENDING: 'PENDING',
    RESOLVED: 'RESOLVED',
    REJECT: 'REJECT',
    IN_PROGRESS: 'IN_PROGRESS',
} as const;

const TRANSACTION_TYPE = {
    SALE: 'SALE',
    PAYOUT: 'PAYOUT',
    REFUND: 'REFUND',
    FEE: 'FEE',
    PARTNER_COMMISSION: 'PARTNER_COMMISSION', // Hoa hồng trả cho partner
    PENALTY: 'PENALTY', // Phạt vi phạm điều khoản
} as const;

const TRANSACTION_STATUS = {
    COMPLETED: 'COMPLETED',
    PENDING: 'PENDING',
    FAILED: 'FAILED',
} as const;

const PAYOUT_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    DECLINED: 'DECLINED',
} as const;

const CONVERSATION_STATUS = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
} as const;

const PAGINATION = {
    DEFAULT_PER_PAGE: 15,
};

export type ObjectValues<T> = T[keyof T];

export {
    ROLE,
    ORDER_TYPES,
    ORDER_STATUS,
    RECEIPT_STATUS,
    IP_STATUS,
    NOTIFY_TYPE,
    VALID_REASONS,
    REPORT_STATUS,
    TRANSACTION_TYPE,
    TRANSACTION_STATUS,
    PAYOUT_STATUS,
    CONVERSATION_STATUS,
    PAGINATION,
};
