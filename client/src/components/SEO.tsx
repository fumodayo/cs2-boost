import { Helmet } from "react-helmet-async";
export default function SEO({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {href && <link ref="canonical" href={href} />}
    </Helmet>
  );
}
