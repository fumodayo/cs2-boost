import { Helmet } from "react-helmet-async";
interface SEOStructuredDataProps {
  type?: "organization" | "service" | "website";
  serviceName?: string;
  serviceDescription?: string;
}
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CS2 Boost",
  url: "https://cs2boost.vn",
  logo: "https://cs2boost.vn/android-chrome-512x512.png",
  description:
    "Dịch vụ boost rank Counter Strike 2 uy tín, nhanh chóng với đội ngũ booster chuyên nghiệp.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Vietnamese", "English"],
  },
  sameAs: [],
};
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CS2 Boost",
  url: "https://cs2boost.vn",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://cs2boost.vn/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};
const getServiceSchema = (name: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  provider: {
    "@type": "Organization",
    name: "CS2 Boost",
    url: "https://cs2boost.vn",
  },
  areaServed: {
    "@type": "Country",
    name: "Vietnam",
  },
  serviceType: "Game Boosting Service",
});
const SEOStructuredData = ({
  type = "organization",
  serviceName = "",
  serviceDescription = "",
}: SEOStructuredDataProps) => {
  let schema;
  switch (type) {
    case "service":
      schema = getServiceSchema(serviceName, serviceDescription);
      break;
    case "website":
      schema = websiteSchema;
      break;
    case "organization":
    default:
      schema = organizationSchema;
      break;
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
export default SEOStructuredData;