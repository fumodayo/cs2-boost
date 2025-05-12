const ROLE_USER = {
  ADMIN: "admin",
  CLIENT: "client",
  PARTNER: "partner",
};

const SOCIAL_MEDIA = [
  {
    value: "facebook",
    label: "Facebook",
    regex: /^https?:\/\/(www\.)?facebook\.com\/.+/,
  },
  {
    value: "instagram",
    label: "Instagram",
    regex: /^https?:\/\/(www\.)?instagram\.com\/.+/,
  },
  {
    value: "x",
    label: "Twitter",
    regex: /^https?:\/\/(www\.)?x\.com\/.+/,
  },
  {
    value: "youtube",
    label: "YouTube",
    regex: /^https?:\/\/(www\.)?youtube\.com\/.+/,
  },
  {
    value: "tiktok",
    label: "Tiktok",
    regex: /^https?:\/\/(www\.)?tiktok\.com\/.+/,
  },
];

export { ROLE_USER, SOCIAL_MEDIA };
