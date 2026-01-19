import { useTranslation } from "react-i18next";
import { FaChevronLeft } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconSlash } from "~/icons";
import cn from "~/libs/utils";
const Navigation = () => {
  const { t } = useTranslation("common");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [_, secondQuery, lastQuery] = pathname.split("/");
  return (
    <div className="max-w-screen-lg pb-2">
      <nav className="sm:hidden">
        <Link
          className="flex items-baseline text-sm font-medium text-muted-foreground hover:text-foreground"
          to={".."}
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          <FaChevronLeft className="mr-1" />
          {t("go_back")}
        </Link>
      </nav>
      <nav className="hidden sm:flex">
        <ol className="flex items-center gap-x-2">
          <li className="flex items-center">
            <Link
              to="/"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {t("home")}
            </Link>
          </li>
          <li className="flex items-center">
            <IconSlash />
            <Link
              to={`/${secondQuery}`}
              className={cn(
                "ml-2 cursor-default text-xs font-medium capitalize text-muted-foreground",
                secondQuery &&
                  lastQuery &&
                  "cursor-pointer hover:text-foreground",
              )}
            >
              {secondQuery.split("-").join(" ")}
            </Link>
          </li>
          {lastQuery && (
            <li className="flex items-center">
              <IconSlash />
              <Link
                to={`/${lastQuery}`}
                className="ml-2 cursor-default text-xs font-medium capitalize text-muted-foreground"
              >
                {lastQuery.split("-").join(" ")}
              </Link>
            </li>
          )}
        </ol>
      </nav>
    </div>
  );
};
export default Navigation;