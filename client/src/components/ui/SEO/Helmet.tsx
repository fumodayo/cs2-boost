import { Helmet as HelmetComp, HelmetData } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
interface IHelmetProps {
  title?: string;
  description?: string;
  isTranslate?: boolean;
  image?: string;
  keywords?: string;
  type?: "website" | "article" | "product";
}
const helmetData = new HelmetData({});
const SITE_NAME = "CS2 Boost";
const BASE_URL = "https://cs2boost.vn";
const DEFAULT_IMAGE = "/android-chrome-512x512.png";
const Helmet = ({
  title = "",
  description = "Dịch vụ boost rank CS2 uy tín, nhanh chóng. Premier, Wingman, Level Farming với đội ngũ booster chuyên nghiệp.",
  isTranslate = true,
  image = DEFAULT_IMAGE,
  keywords = "cs2 boost, counter strike 2, boost rank, premier boost, wingman boost, level farming, rank boost vietnam",
  type = "website",
}: IHelmetProps = {}) => {
  const { t } = useTranslation("common");
  const location = useLocation();
  const renderedTitle = isTranslate && title ? t(`helmet.${title}`) : title;
  const fullTitle = renderedTitle
    ? `${renderedTitle} | ${SITE_NAME}`
    : SITE_NAME;
  const canonicalUrl = `${BASE_URL}${location.pathname}`;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;
  return (
    <HelmetComp
      helmetData={helmetData}
      title={fullTitle}
      defaultTitle={SITE_NAME}
    >
      {/* Basic Meta Tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_NAME} />
      <link rel="canonical" href={canonicalUrl} />
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="vi_VN" />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </HelmetComp>
  );
};
export default Helmet;