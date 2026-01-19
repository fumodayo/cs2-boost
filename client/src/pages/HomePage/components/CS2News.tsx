import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiExternalLink, FiClock, FiUser } from "react-icons/fi";
import { BsNewspaper } from "react-icons/bs";
import cn from "~/libs/utils";
interface NewsItem {
  gid: string;
  title: string;
  url: string;
  author: string;
  contents: string;
  date: number;
}
interface SteamNewsResponse {
  appnews: {
    newsitems: NewsItem[];
  };
}
const extractImage = (content: string): string | null => {
  const imgMatch = content.match(/\[img\](.*?)\[\/img\]/i);
  return imgMatch ? imgMatch[1] : null;
};
const getExcerpt = (content: string, maxLength: number = 120): string => {
  const text = content
    .replace(/\[img\].*?\[\/img\]/gi, "")
    .replace(/\[url=.*?\](.*?)\[\/url\]/gi, "$1")
    .replace(/\[\/?\w+\]/gi, "")
    .replace(/\[list\]|\[\/list\]|\[\*\]/gi, "")
    .replace(/\[p\]|\[\/p\]/gi, "")
    .replace(/\\n/g, " ")
    .replace(/\n/g, " ")
    .trim();
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
const DEFAULT_IMAGE = "/assets/games/counter-strike-2/banner.png";
const CS2News = () => {
  const { t } = useTranslation("landing");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "http://localhost:5040/api/v1/utils/cs2-news",
        );
        if (!response.ok) throw new Error("Failed to fetch news");
        const data: SteamNewsResponse = await response.json();
        setNews(data.appnews.newsitems.slice(0, 3));
      } catch (err) {
        setError("Unable to load news");
        console.error("Failed to fetch CS2 news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);
  if (error) return null; 
  return (
    <div
      className={cn(
        "relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4",
        "sm:px-6 xl:px-8",
      )}
    >
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
          <BsNewspaper className="h-4 w-4" />
          {t("news.badge")}
        </div>
        <h2
          className={cn(
            "font-display text-2xl font-bold tracking-tight text-foreground",
            "sm:text-3xl lg:text-4xl",
          )}
        >
          {t("news.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {t("news.subtitle")}
        </p>
      </div>
      {/* News Grid */}
      {loading ? (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl bg-card" />
          ))}
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => {
            const thumbnail = extractImage(item.contents) || DEFAULT_IMAGE;
            const excerpt = getExcerpt(item.contents);
            return (
              <a
                key={item.gid}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300",
                  "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
                )}
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-secondary/50">
                  <img
                    src={thumbnail}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                </div>
                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {excerpt}
                  </p>
                  {/* Meta */}
                  <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FiUser className="h-3.5 w-3.5" />
                        {item.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="h-3.5 w-3.5" />
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <FiExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
      {/* View All Link */}
      <a
        href="https://store.steampowered.com/news/app/730"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-8 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium",
          "bg-secondary/50 text-foreground transition-colors hover:bg-secondary",
        )}
      >
        {t("news.view_all")}
        <FiExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
};
export default CS2News;
