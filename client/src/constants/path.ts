const PATH = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
  DEFAULT: {
    HOME: "/",
    PARTNERS: "/partners",
    PARTNER: "/partner/:username",
    GAME_MODE: "/counter-strike-2/*",
    PREMIER: "premier",
    WINGMAN: "wingman",
    LEVEL_FARMING: "level-farming",
  },
  USER: {
    ORDERS: "/orders",
    WALLET: "/wallet",
    CHECKOUT: "/checkout/:id",
    PROFILE: "/profile/:id",
    BOOSTS_ID: "/orders/boosts/:id",
    PENDING_BOOSTS: "/pending-boosts",
    PROGRESS_BOOSTS: "/progress-boosts",
    FOLLOW_PARTNERS: "/follow-partners",
    INCOME: "/income",
    SUPPORTS: "/supports",
    SETTINGS: "/settings/*",
    NOTIFICATIONS: "notifications",
    INFORMATION: "information",
  },
  ADMIN: {
    DEFAULT: "/admin/*",
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    MANAGE_USERS: "/admin/manage-users",
    MANAGE_ORDERS: "/admin/manage-orders",
    MANAGE_BOOST: "/admin/manage-boost",
    SETTINGS: "/admin/settings",
  },
  NOTFOUND: "*",
} as const;

export default PATH;
