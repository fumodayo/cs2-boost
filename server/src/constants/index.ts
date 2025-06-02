const ROLE = {
    ADMIN: 'admin',
    CLIENT: 'client',
    PARTNER: 'partner',
};

const ORDER_TYPES = {
    PREMIER: 'premier',
    WINGMAN: 'wingman',
    LEVEL_FARMING: 'level_farming',
};

const ORDER_STATUS = {
    PENDING: 'pending',
    WAITING: 'waiting',
    IN_ACTIVE: 'in_active',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCEL: 'cancel',
};

const RECEIPT_STATUS = {
    COMPLETED: 'completed',
    CANCEL: 'canceled',
    REFUND: 'refund',
};

const IP_STATUS = {
    ONLINE: 'online',
    OFFLINE: 'offline',
};

const NOTIFY_TYPE = {
    NEW_ORDER: 'new_order',
    MESSAGE: 'message',
    BOOST: 'boost',
} as const;

const VALID_REASONS = [
    'NOT_RESPONDING', // Không phản hồi yêu cầu
    'OVERCHARGING', // Thu phí cao hơn thoả thuận
    'SLOW_DELIVERY', // Giao hàng/chạy dịch vụ chậm
    'LOW_QUALITY', // Dịch vụ kém chất lượng
    'FRAUD', // Gian lận, lừa đảo
    'TERMS_VIOLATION', // Vi phạm điều khoản
];

const REPORT_STATUS = {
    PENDING: 'pending',
    RESOLVED: 'resolved',
    REJECT: 'reject',
};

export {
    ROLE,
    ORDER_TYPES,
    ORDER_STATUS,
    RECEIPT_STATUS,
    IP_STATUS,
    NOTIFY_TYPE,
    VALID_REASONS,
    REPORT_STATUS,
};
