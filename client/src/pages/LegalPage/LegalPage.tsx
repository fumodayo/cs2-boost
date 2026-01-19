import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FiChevronRight,
  FiFileText,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";
import { Footer, Header, Helmet } from "~/components/ui";
import cn from "~/libs/utils";
type LegalPageType = "terms" | "privacy" | "refund";
interface LegalPageProps {
  type: LegalPageType;
}
const iconMap = {
  terms: FiFileText,
  privacy: FiShield,
  refund: FiRefreshCw,
};
const LegalPage = ({ type }: LegalPageProps) => {
  const { t } = useTranslation("legal");
  const Icon = iconMap[type];
  const sections = t(`${type}.sections`, { returnObjects: true }) as Record<
    string,
    { title: string; content: string }
  >;
  return (
    <>
      <Helmet title={t(`page_title.${type}`)} />
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("breadcrumb.home")}
            </Link>
            <FiChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {t(`page_title.${type}`)}
            </span>
          </nav>
          {/* Title */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t(`${type}.title`)}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("last_updated")}: January 12, 2026
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
          {/* Introduction */}
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            {t(`${type}.intro`)}
          </p>
          {/* Sections */}
          <div className="space-y-8">
            {Object.entries(sections).map(([key, section]) => (
              <section key={key} className="scroll-mt-20" id={key}>
                <h2 className="mb-3 text-xl font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
          {/* Quick Navigation */}
          <div className="mt-12 border-t border-border pt-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Related Pages
            </h3>
            <div className="flex flex-wrap gap-3">
              {type !== "terms" && (
                <Link
                  to="/terms-of-service"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                    "bg-secondary/50 text-foreground transition-colors hover:bg-secondary",
                  )}
                >
                  <FiFileText className="h-4 w-4" />
                  {t("page_title.terms")}
                </Link>
              )}
              {type !== "privacy" && (
                <Link
                  to="/privacy-policy"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                    "bg-secondary/50 text-foreground transition-colors hover:bg-secondary",
                  )}
                >
                  <FiShield className="h-4 w-4" />
                  {t("page_title.privacy")}
                </Link>
              )}
              {type !== "refund" && (
                <Link
                  to="/refund-policy"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                    "bg-secondary/50 text-foreground transition-colors hover:bg-secondary",
                  )}
                >
                  <FiRefreshCw className="h-4 w-4" />
                  {t("page_title.refund")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
export default LegalPage;