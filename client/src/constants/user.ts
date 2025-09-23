import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const ROLE_USER = {
  ADMIN: "admin",
  CLIENT: "client",
  PARTNER: "partner",
} as const;

const SOCIAL_MEDIA = [
  {
    value: "facebook",
    label: "Facebook",
    icon: FaFacebook,
    color: "bg-[#1877F2] hover:bg-[#166fe5]",
    regex: /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9().?]+/,
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    color:
      "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white hover:opacity-90 transition-opacity",
    regex: /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+/,
  },
  {
    value: "x",
    label: "X (Twitter)",
    icon: FaXTwitter,
    color: "bg-black text-white hover:bg-gray-800",
    regex: /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+/,
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: FaYoutube,
    color: "bg-[#FF0000] text-white hover:bg-[#E60000]",
    regex:
      /^(https?:\/\/)?(www\.)?youtube\.com\/(c\/|channel\/|user\/|@)?[a-zA-Z0-9_-]+/,
  },
  {
    value: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
    color: "bg-black text-white hover:bg-gray-800",
    regex: /^(https?:\/\/)?(www\.)?tiktok\.com\/@?[a-zA-Z0-9_.]+/,
  },
];

export { ROLE_USER, SOCIAL_MEDIA };
